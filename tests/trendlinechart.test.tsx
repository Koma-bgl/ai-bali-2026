import { describe, it, expect } from 'vitest'
import TrendLineChart from '@/components/TrendLineChart/index'
import { TrendLineChartSchema } from '@/components/TrendLineChart/schema'

describe('TrendLineChart Schema', () => {
  it('should validate correct data', () => {
    const data = {
      data: [
        { date: '2024-01-01', cumulativePnL: 100, betCount: 10 },
        { date: '2024-01-02', cumulativePnL: 200, betCount: 20 },
      ],
    }
    const result = TrendLineChartSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should invalidate incorrect data types', () => {
    const data = {
      data: [
        { date: 123, cumulativePnL: 'abc', betCount: true },
      ],
    }
    const result = TrendLineChartSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should handle optional height', () => {
    const data = {
      data: [
        { date: '2024-01-01', cumulativePnL: 100, betCount: 10 },
      ],
    }
    const result = TrendLineChartSchema.safeParse(data)
    expect(result.success).toBe(true)
  })
})

describe('TrendLineChart Component', () => {
  it('should render without errors with valid props', () => {
    const props = {
      data: [
        { date: '2024-01-01', cumulativePnL: 100, betCount: 10 },
        { date: '2024-01-02', cumulativePnL: -50, betCount: 5 },
      ],
      height: 400,
    }
    
    // The component itself uses Recharts, which is difficult to test without a full browser environment.
    // This test focuses on whether the component can receive and handle the props correctly without throwing errors.
    
    const component = TrendLineChart({ props: props });
    
    // Since we are not rendering, we can't really assert anything about the rendered output.
    // Instead, we just check if the component execution completes without throwing errors.
    expect(component).toBeDefined(); // Check that the component doesn't return undefined
  });

  it('should handle an empty data array without errors', () => {
    const props = {
      data: [],
      height: 400,
    };

    const component = TrendLineChart({ props: props });

    expect(component).toBeDefined();
  });

  it('should handle a default height when no height prop is provided', () => {
    const props = {
      data: [
        { date: '2024-01-01', cumulativePnL: 100, betCount: 10 },
      ],
    };

    const component = TrendLineChart({ props: props });

    expect(component).toBeDefined();
  });
});