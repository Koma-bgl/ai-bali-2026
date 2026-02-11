import { describe, it, expect } from 'vitest'
import { TrendLineChartProps } from '@/src/components/TrendLineChart'
import TrendLineChart from '@/src/components/TrendLineChart'

describe('TrendLineChart', () => {
  const mockData: TrendLineChartProps['data'] = [
    { date: '2024-01-01', cumulativePnL: 100, betCount: 5 },
    { date: '2024-01-02', cumulativePnL: 150, betCount: 3 },
    { date: '2024-01-03', cumulativePnL: 50, betCount: 7 },
    { date: '2024-01-04', cumulativePnL: -50, betCount: 2 },
  ]

  it('should render without errors', () => {
    const wrapper = TrendLineChart({ data: mockData })
    expect(wrapper).toBeDefined()
  })

  it('should handle empty data', () => {
    const wrapper = TrendLineChart({ data: [] })
    expect(wrapper).toBeDefined()
  })

  it('should render with a specified height', () => {
    const wrapper = TrendLineChart({ data: mockData, height: 500 })
    expect(wrapper).toBeDefined()
  })

  
})
