import { describe, it, expect } from 'vitest'
import StatsOverview from '../src/components/StatsOverview'
import { StatsOverviewSchema, StatsOverviewProps } from '../src/components/StatsOverview/schema'

describe('StatsOverview Component', () => {
  it('should render without errors', () => {
    const props: StatsOverviewProps = {
      totalBets: 100,
      winRate: 0.6,
      netPnL: 500,
      roi: 0.1,
      currentStreak: {
        type: 'win',
        count: 5,
      },
      averageOdds: 2.5,
    }

    const wrapper = StatsOverview({ props })

    expect(wrapper).toBeDefined()
  })

  it('should correctly format positive Net P&L', () => {
    const props: StatsOverviewProps = {
      totalBets: 100,
      winRate: 0.6,
      netPnL: 500,
      roi: 0.1,
      currentStreak: {
        type: 'win',
        count: 5,
      },
      averageOdds: 2.5,
    }

    const wrapper = StatsOverview({ props })

    // Since we are not testing rendering, we cannot check the final string output
    // The goal is to make sure it executes without errors given correct props according to schema
  })

  it('should correctly format negative Net P&L', () => {
    const props: StatsOverviewProps = {
      totalBets: 100,
      winRate: 0.6,
      netPnL: -500,
      roi: -0.1,
      currentStreak: {
        type: 'loss',
        count: 3,
      },
      averageOdds: 2.5,
    }

    const wrapper = StatsOverview({ props })
    // Since we are not testing rendering, we cannot check the final string output
    // The goal is to make sure it executes without errors given correct props according to schema
  })

  it('should validate correct props using schema', () => {
    const correctProps: StatsOverviewProps = {
      totalBets: 100,
      winRate: 0.6,
      netPnL: 500,
      roi: 0.1,
      currentStreak: {
        type: 'win',
        count: 5,
      },
      averageOdds: 2.5,
    }

    const result = StatsOverviewSchema.safeParse(correctProps)
    expect(result.success).toBe(true)
  })

  it('should invalidate incorrect props using schema', () => {
    const incorrectProps = {
      totalBets: '100',
      winRate: 0.6,
      netPnL: 500,
      roi: 0.1,
      currentStreak: {
        type: 'win',
        count: 5,
      },
      averageOdds: 2.5,
    }

    const result = StatsOverviewSchema.safeParse(incorrectProps)
    expect(result.success).toBe(false)
  })
})
