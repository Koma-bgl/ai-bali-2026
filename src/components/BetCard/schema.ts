import { z } from "zod";

export const BetCardSchema = z
  .object({
    id: z.string(),
    sport: z.string(),
    event: z.string(),
    league: z.string(),
    selection: z.string(),
    odds: z.number(),
    stake: z.number(),
    payout: z.number().nullable(),
    result: z.enum(["won", "lost", "pending"]),
    type: z.enum(["single", "parlay", "system"]),
    placedAt: z.string().datetime(),
    settledAt: z.string().datetime().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.result === "pending") {
      if (data.payout !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payout"],
          message: "Payout must be null for pending bets",
        });
      }
      if (data.settledAt !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["settledAt"],
          message: "settledAt must be null for pending bets",
        });
      }
    } else {
      if (data.payout === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payout"],
          message: "Payout is required for settled bets",
        });
      }
      if (data.settledAt === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["settledAt"],
          message: "settledAt is required for settled bets",
        });
      }
    }
  });

export type BetCardProps = z.infer<typeof BetCardSchema>;
