import * as z from 'zod'

const trendLineChartDataSchema = z.object({
  date: z.string(),
  cumulativePnL: z.number(),
  betCount: z.number(),
})

export const TrendLineChartSchema = z.object({
  type: z.literal('TrendLineChart'),
  props: z.object({
    data: z.array(trendLineChartDataSchema),
    height: z.number().optional().default(300),
  }),
})

const catalog = {
    TrendLineChart: TrendLineChartSchema
}

export default catalog
