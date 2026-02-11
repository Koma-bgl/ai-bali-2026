import { describe, it, expect } from 'vitest'
import StatsOverview from '../src/components/StatsOverview'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('StatsOverview Component', () => {
  const mockProps = {
    totalBets: 150,
    winRate: 0.65,
    netPnL: 1250.50,
    roi: 0.12,
    currentStreak: {
      type: 'win',
      count: 3,
    },
    averageOdds: 2.15,
  }

  it('should render all stat cards with correct values and formatting', () => {
    render(<StatsOverview {...mockProps} />)

    expect(screen.getByText('Total Bets')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()

    expect(screen.getByText('Win Rate')).toBeInTheDocument()
    expect(screen.getByText('65.0%')).toBeInTheDocument()

    expect(screen.getByText('Net P&L')).toBeInTheDocument()
    expect(screen.getByText('$1,250.50')).toBeInTheDocument()

    expect(screen.getByText('ROI')).toBeInTheDocument()
    expect(screen.getByText('12.0%')).toBeInTheDocument()

    expect(screen.getByText('Current Streak')).toBeInTheDocument()
    expect(screen.getByText('W3')).toBeInTheDocument()

    expect(screen.getByText('Average Odds')).toBeInTheDocument()
    expect(screen.getByText('2.15')).toBeInTheDocument()
  })

  it('should display win streak in green', () => {
    render(<StatsOverview {...mockProps} />)
    const streakElement = screen.getByText('W3')
    expect(streakElement).toHaveClass('text-green-500')
  })

  it('should display loss streak in red', () => {
    const lossProps = { ...mockProps, currentStreak: { type: 'loss', count: 5 } }
    render(<StatsOverview {...lossProps} />)
    const streakElement = screen.getByText('L5')
    expect(streakElement).toHaveClass('text-red-500')
  })

  it('should display positive P&L in green', () => {
    render(<StatsOverview {...mockProps} />)
    const pnlElement = screen.getByText('$1,250.50')
    expect(pnlElement).toHaveClass('text-green-500')
  })

  it('should display negative P&L in red', () => {
    const negativeProps = { ...mockProps, netPnL: -500.75 }
    render(<StatsOverview {...negativeProps} />)
    const pnlElement = screen.getByText('-$500.75')
    expect(pnlElement).toHaveClass('text-red-500')
  })

    it('should display positive ROI in green', () => {
        render(<StatsOverview {...mockProps} />)
        const roiElement = screen.getByText('12.0%')
        expect(roiElement).toHaveClass('text-green-500')
    })

    it('should display negative ROI in red', () => {
        const negativeProps = { ...mockProps, roi: -0.05 }
        render(<StatsOverview {...negativeProps} />)
        const roiElement = screen.getByText('-5.0%')
        expect(roiElement).toHaveClass('text-red-500')
    })


})
