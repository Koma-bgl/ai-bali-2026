import { describe, it, expect } from 'vitest'
import TrendLineChart from '@/components/TrendLineChart/index'
import { TrendLineChartSchema } from '@/components/TrendLineChart/schema'

describe('TrendLineChartSchema', () => {
  it('should validate a valid data object', () => {
    const validData = {
      data: [
        { date: '2024-01-01', cumulativePnL: 100, betCount: 10 },
        { date: '2024-01-02', cumulativePnL: 200, betCount: 20 },
      ],
      height: 400,
    }

    const result = TrendLineChartSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should use default height if height is not provided', () => {
    const validData = {
      data: [
        { date: '2024-01-01', cumulativePnL: 100, betCount: 10 },
        { date: '2024-01-02', cumulativePnL: 200, betCount: 20 },
      ],
    }

    const result = TrendLineChartSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.height).toBe(300)
    }
  })

  it('should fail validation if data is not an array', () => {
    const invalidData = {
      data: 'not an array',
      height: 400,
    }

    const result = TrendLineChartSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should fail validation if data is missing date, cumulativePnL or betCount', () => {
    const invalidData = {
      data: [
        { cumulativePnL: 100, betCount: 10 },
        { date: '2024-01-02', betCount: 20 },
      ],
      height: 400,
    }

    const result = TrendLineChartSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('TrendLineChart Component', () => {
  it('should render without errors with empty data', () => {
    const props = {
      props: {
        data: [],
        height: 300,
      },
    }

    // No actual rendering, just checking for errors during component execution
    expect(() => TrendLineChart(props)).not.toThrowError()
  })

  it('should render without errors with some data', () => {
    const props = {
      props: {
        data: [
          { date: '2024-01-01', cumulativePnL: 100, betCount: 10 },
          { date: '2024-01-02', cumulativePnL: 200, betCount: 20 },
        ],
        height: 300,
      },
    }

    expect(() => TrendLineChart(props)).not.toThrowError()
  })

  it('should handle a zero height value without errors', () => {
    const props = {
      props: {
        data: [
          { date: '2024-01-01', cumulativePnL: 100, betCount: 10 },
          { date: '2024-01-02', cumulativePnL: 200, betCount: 20 },
        ],
        height: 0,
      },
    }

    expect(() => TrendLineChart(props)).not.toThrowError()
  })
})