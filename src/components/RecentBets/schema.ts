import { z } from "zod";

const BetSchema = z.object({
  id: z.string(),
  date: z.string(),
  event: z.string(),
  type: z.enum(["single", "parlay", "system"]),
  amount: z.number(),
  odds: z.number(),
  result: z.enum(["won", "lost", "pending"]),
  payout: z.number(),
});

export const RecentBetsSchema = z.object({
  bets: z.array(BetSchema),
  maxRows: z.number().optional().default(10),
});

export type Bet = z.infer<typeof BetSchema>;
export type RecentBetsProps = z.infer<typeof RecentBetsSchema>;
