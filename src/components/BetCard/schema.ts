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
    placedAt: z.string(),
    settledAt: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.result !== "pending") {
      if (data.payout === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payout"],
          message: "payout is required when result is won or lost",
        });
      }
      if (data.settledAt === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["settledAt"],
          message: "settledAt is required when result is won or lost",
        });
      }
    }
  });

export type BetCardProps = z.infer<typeof BetCardSchema>;
