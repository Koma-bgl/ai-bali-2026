import { describe, it, expect } from 'vitest'
import { RecentBetsSchema } from '@/components/RecentBets/schema'

// ---------------------------------------------------------------------------
// Helper factory for a valid bet object
// ---------------------------------------------------------------------------
function validBet(overrides: Record<string, unknown> = {}) {
  return {
    id: 'bet-1',
    date: '2024-06-15T00:00:00.000Z',
    event: 'Lakers vs Celtics',
    type: 'single' as const,
    amount: 50,
    odds: 2.15,
    result: 'won' as const,
    payout: 107.5,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Valid inputs
// ---------------------------------------------------------------------------
describe('RecentBetsSchema — valid inputs', () => {
  it('accepts a valid props object with bets array', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet()],
    })
    expect(result.success).toBe(true)
  })

  it('defaults maxRows to 10 when not provided', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet()],
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.maxRows).toBe(10)
    }
  })

  it('accepts a custom maxRows value', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet()],
      maxRows: 5,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.maxRows).toBe(5)
    }
  })

  it('accepts an empty bets array', () => {
    const result = RecentBetsSchema.safeParse({ bets: [] })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.bets).toEqual([])
    }
  })

  it('accepts all valid bet type values', () => {
    for (const type of ['single', 'parlay', 'system'] as const) {
      const result = RecentBetsSchema.safeParse({
        bets: [validBet({ type })],
      })
      expect(result.success).toBe(true)
    }
  })

  it('accepts all valid result values', () => {
    for (const r of ['won', 'lost', 'pending'] as const) {
      const result = RecentBetsSchema.safeParse({
        bets: [validBet({ result: r })],
      })
      expect(result.success).toBe(true)
    }
  })

  it('accepts multiple bets', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [
        validBet({ id: 'bet-1' }),
        validBet({ id: 'bet-2', result: 'lost', payout: 0 }),
        validBet({ id: 'bet-3', result: 'pending', payout: 0 }),
      ],
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.bets).toHaveLength(3)
    }
  })
})

// ---------------------------------------------------------------------------
// Invalid inputs
// ---------------------------------------------------------------------------
describe('RecentBetsSchema — invalid inputs', () => {
  it('rejects when bets is missing', () => {
    const result = RecentBetsSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects when bets is not an array', () => {
    const result = RecentBetsSchema.safeParse({ bets: 'not-array' })
    expect(result.success).toBe(false)
  })

  it('rejects a bet with missing id', () => {
    const { id: _, ...noId } = validBet()
    const result = RecentBetsSchema.safeParse({ bets: [noId] })
    expect(result.success).toBe(false)
  })

  it('rejects a bet with missing date', () => {
    const { date: _, ...noDate } = validBet()
    const result = RecentBetsSchema.safeParse({ bets: [noDate] })
    expect(result.success).toBe(false)
  })

  it('rejects a bet with missing event', () => {
    const { event: _, ...noEvent } = validBet()
    const result = RecentBetsSchema.safeParse({ bets: [noEvent] })
    expect(result.success).toBe(false)
  })

  it('rejects a bet with invalid type enum', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet({ type: 'accumulator' })],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a bet with invalid result enum', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet({ result: 'cancelled' })],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a bet with non-number amount', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet({ amount: 'fifty' })],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a bet with non-number odds', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet({ odds: '2.15' })],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a bet with non-number payout', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet({ payout: null })],
    })
    expect(result.success).toBe(false)
  })

  it('rejects when maxRows is a string', () => {
    const result = RecentBetsSchema.safeParse({
      bets: [validBet()],
      maxRows: 'ten',
    })
    expect(result.success).toBe(false)
  })
})
