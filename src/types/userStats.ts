import type { BetCardProps } from '@/components/BetCard/schema'
import type { StatsOverviewProps } from '@/components/StatsOverview/schema'

export interface TrendDataPoint {
  date: string
  cumulativePnL: number
  betCount: number
}

export function calculateStats(bets: BetCardProps[]): StatsOverviewProps {
  const settledBets = bets.filter((b) => b.result !== 'pending')
  const totalBets = settledBets.length
  const wins = settledBets.filter((b) => b.result === 'won').length
  const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0

  const totalStake = settledBets.reduce((sum, b) => sum + b.stake, 0)
  const totalPayout = settledBets.reduce((sum, b) => sum + (b.payout ?? 0), 0)
  const netPnL = totalPayout - totalStake
  const roi = totalStake > 0 ? (netPnL / totalStake) * 100 : 0

  const totalOdds = settledBets.reduce((sum, b) => sum + b.odds, 0)
  const averageOdds = totalBets > 0 ? totalOdds / totalBets : 0

  // Calculate current streak from most recent settled bets
  let streakType: 'win' | 'loss' = 'win'
  let streakCount = 0
  const sortedSettled = [...settledBets].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  )

  if (sortedSettled.length > 0) {
    streakType = sortedSettled[0].result === 'won' ? 'win' : 'loss'
    for (const bet of sortedSettled) {
      const betType = bet.result === 'won' ? 'win' : 'loss'
      if (betType === streakType) {
        streakCount++
      } else {
        break
      }
    }
  }

  return {
    totalBets,
    winRate,
    netPnL,
    roi,
    currentStreak: { type: streakType, count: streakCount },
    averageOdds,
  }
}

export function aggregateTrendData(bets: BetCardProps[]): TrendDataPoint[] {
  const settledBets = bets
    .filter((b) => b.result !== 'pending')
    .sort(
      (a, b) => new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime()
    )

  // Group by date using a plain object to avoid Map iteration issues with es5 target
  const byDate: Record<string, { pnl: number; count: number }> = {}
  const dateOrder: string[] = []

  for (const bet of settledBets) {
    const date = bet.placedAt.slice(0, 10) // YYYY-MM-DD
    const profit = (bet.payout ?? 0) - bet.stake
    if (byDate[date]) {
      byDate[date].pnl += profit
      byDate[date].count += 1
    } else {
      byDate[date] = { pnl: profit, count: 1 }
      dateOrder.push(date)
    }
  }

  // Build cumulative series
  const result: TrendDataPoint[] = []
  let cumulative = 0

  for (const date of dateOrder) {
    const { pnl, count } = byDate[date]
    cumulative += pnl
    result.push({
      date,
      cumulativePnL: Math.round(cumulative * 100) / 100,
      betCount: count,
    })
  }

  return result
}
