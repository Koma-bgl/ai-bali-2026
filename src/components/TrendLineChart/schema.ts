import { z } from "zod";

export const TrendLineChartSchema = z.object({
  data: z.array(
    z.object({
      date: z.string(),
      cumulativePnL: z.number(),
      betCount: z.number(),
    })
  ),
  height: z.number().optional().default(300),
});

export type TrendLineChartProps = z.infer<typeof TrendLineChartSchema>;