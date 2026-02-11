import { z } from "zod";

export const StatsOverviewSchema = z.object({
  totalBets: z.number(),
  winRate: z.number(),
  netPnL: z.number(),
  roi: z.number(),
  currentStreak: z.object({
    type: z.enum(["win", "loss"]), // Use z.enum for type safety
    count: z.number(),
  }),
  averageOdds: z.number(),
});

export type StatsOverviewProps = z.infer<typeof StatsOverviewSchema>;