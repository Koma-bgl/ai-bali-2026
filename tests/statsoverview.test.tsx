import { describe, it, expect } from 'vitest'
import StatsOverview from '@/components/StatsOverview'
import { StatsOverviewSchema } from '@/components/StatsOverview/schema'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('StatsOverview Component', () => {
  it('should render without errors', () => {
    const props = {
      totalBets: 100,
      winRate: 0.6,
      netPnL: 500,
      roi: 0.1,
      currentStreak: { type: 'win', count: 5 },
      averageOdds: 2.5,
    }

    const { container } = render(<StatsOverview props={props} />)

    expect(container).toBeDefined()
  })

  it('Props should conform to StatsOverviewSchema', () => {
    const props = {
      totalBets: 100,
      winRate: 0.6,
      netPnL: 500,
      roi: 0.1,
      currentStreak: { type: 'win', count: 5 },
      averageOdds: 2.5,
    }

    expect(() => StatsOverviewSchema.parse(props)).not.toThrowError()
  })

  it('should display correct stats based on props', () => {
    const props = {
      totalBets: 50,
      winRate: 0.4,
      netPnL: -200,
      roi: -0.05,
      currentStreak: { type: 'loss', count: 3 },
      averageOdds: 1.8,
    };

    const { getByText } = render(<StatsOverview props={props} />);

    expect(getByText('Total Bets')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
    expect(getByText('Win Rate')).toBeInTheDocument();
    expect(getByText('40.0%')).toBeInTheDocument();
    expect(getByText('Net P&L')).toBeInTheDocument();
    expect(getByText('$−200.00')).toBeInTheDocument();
    expect(getByText('ROI')).toBeInTheDocument();
    expect(getByText('−5.0%')).toBeInTheDocument();
    expect(getByText('Current Streak')).toBeInTheDocument();
    expect(getByText('L3')).toBeInTheDocument();
    expect(getByText('Average Odds')).toBeInTheDocument();
    expect(getByText('1.80')).toBeInTheDocument();

  })
})
