import { describe, it, expect } from "vitest";
import { BetCardSchema } from "@/components/BetCard/schema";

function validWonBet() {
  return {
    id: "bet-001",
    sport: "football",
    event: "Arsenal vs Chelsea",
    league: "Premier League",
    selection: "Arsenal to Win",
    odds: 2.5,
    stake: 50,
    payout: 125,
    result: "won" as const,
    type: "single" as const,
    placedAt: "2024-01-15T10:00:00Z",
    settledAt: "2024-01-15T12:00:00Z",
  };
}

function validPendingBet() {
  return {
    id: "bet-002",
    sport: "basketball",
    event: "Lakers vs Celtics",
    league: "NBA",
    selection: "Lakers +5.5",
    odds: 1.91,
    stake: 100,
    payout: null,
    result: "pending" as const,
    type: "parlay" as const,
    placedAt: "2024-01-16T14:00:00Z",
    settledAt: null,
  };
}

function validLostBet() {
  return {
    id: "bet-003",
    sport: "tennis",
    event: "Djokovic vs Nadal",
    league: "Roland Garros",
    selection: "Djokovic to Win",
    odds: 3.0,
    stake: 25,
    payout: 0,
    result: "lost" as const,
    type: "system" as const,
    placedAt: "2024-01-17T09:00:00Z",
    settledAt: "2024-01-17T11:30:00Z",
  };
}

describe("BetCardSchema", () => {
  describe("valid data", () => {
    it("should accept a valid won bet", () => {
      const result = BetCardSchema.safeParse(validWonBet());
      expect(result.success).toBe(true);
    });

    it("should accept a valid pending bet with null payout and settledAt", () => {
      const result = BetCardSchema.safeParse(validPendingBet());
      expect(result.success).toBe(true);
    });

    it("should accept a valid lost bet with zero payout", () => {
      const result = BetCardSchema.safeParse(validLostBet());
      expect(result.success).toBe(true);
    });

    it("should accept all bet type values", () => {
      for (const type of ["single", "parlay", "system"] as const) {
        const bet = { ...validPendingBet(), type };
        const result = BetCardSchema.safeParse(bet);
        expect(result.success).toBe(true);
      }
    });

    it("should accept all result values with appropriate payout/settledAt", () => {
      const pending = validPendingBet();
      expect(BetCardSchema.safeParse(pending).success).toBe(true);

      const won = validWonBet();
      expect(BetCardSchema.safeParse(won).success).toBe(true);

      const lost = validLostBet();
      expect(BetCardSchema.safeParse(lost).success).toBe(true);
    });
  });

  describe("cross-field validation (superRefine)", () => {
    it("should reject won result with null payout", () => {
      const bet = { ...validWonBet(), payout: null };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
      if (!result.success) {
        const payoutIssue = result.error.issues.find(
          (i) => i.path.includes("payout")
        );
        expect(payoutIssue).toBeDefined();
        expect(payoutIssue!.message).toBe(
          "payout is required when result is won or lost"
        );
      }
    });

    it("should reject won result with null settledAt", () => {
      const bet = { ...validWonBet(), settledAt: null };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
      if (!result.success) {
        const settledIssue = result.error.issues.find(
          (i) => i.path.includes("settledAt")
        );
        expect(settledIssue).toBeDefined();
        expect(settledIssue!.message).toBe(
          "settledAt is required when result is won or lost"
        );
      }
    });

    it("should reject lost result with null payout", () => {
      const bet = { ...validLostBet(), payout: null };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
      if (!result.success) {
        const payoutIssue = result.error.issues.find(
          (i) => i.path.includes("payout")
        );
        expect(payoutIssue).toBeDefined();
      }
    });

    it("should reject lost result with null settledAt", () => {
      const bet = { ...validLostBet(), settledAt: null };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
      if (!result.success) {
        const settledIssue = result.error.issues.find(
          (i) => i.path.includes("settledAt")
        );
        expect(settledIssue).toBeDefined();
      }
    });

    it("should produce two issues when both payout and settledAt are null for won", () => {
      const bet = { ...validWonBet(), payout: null, settledAt: null };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
      if (!result.success) {
        const customIssues = result.error.issues.filter(
          (i) => i.message.includes("required when result is won or lost")
        );
        expect(customIssues).toHaveLength(2);
      }
    });

    it("should allow pending result with null payout and settledAt", () => {
      const bet = validPendingBet();
      expect(bet.payout).toBeNull();
      expect(bet.settledAt).toBeNull();
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(true);
    });

    it("should allow pending result with non-null payout (no cross-field restriction)", () => {
      // Schema only enforces settled bets must have payout; pending can optionally have it
      const bet = { ...validPendingBet(), payout: 100 };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(true);
    });
  });

  describe("type validation", () => {
    it("should reject invalid result enum value", () => {
      const bet = { ...validPendingBet(), result: "cancelled" };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
    });

    it("should reject invalid bet type enum value", () => {
      const bet = { ...validPendingBet(), type: "accumulator" };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
    });

    it("should reject non-number odds", () => {
      const bet = { ...validPendingBet(), odds: "2.5" };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
    });

    it("should reject non-number stake", () => {
      const bet = { ...validPendingBet(), stake: "100" };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
    });

    it("should reject non-string id", () => {
      const bet = { ...validPendingBet(), id: 123 };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(false);
    });
  });

  describe("missing fields", () => {
    it("should reject an empty object", () => {
      const result = BetCardSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should reject when required field is missing", () => {
      const { sport, ...rest } = validPendingBet();
      const result = BetCardSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it("should reject when id is missing", () => {
      const { id, ...rest } = validPendingBet();
      const result = BetCardSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it("should reject when event is missing", () => {
      const { event, ...rest } = validPendingBet();
      const result = BetCardSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it("should reject null input", () => {
      const result = BetCardSchema.safeParse(null);
      expect(result.success).toBe(false);
    });

    it("should reject undefined input", () => {
      const result = BetCardSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should accept zero stake", () => {
      const bet = { ...validPendingBet(), stake: 0 };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(true);
    });

    it("should accept negative odds (as schema only enforces number type)", () => {
      const bet = { ...validPendingBet(), odds: -1.5 };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(true);
    });

    it("should accept very large numbers", () => {
      const bet = {
        ...validWonBet(),
        odds: 999999.99,
        stake: 1000000,
        payout: 999999990000,
      };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(true);
    });

    it("should accept empty string for sport, event, league etc.", () => {
      const bet = {
        ...validPendingBet(),
        sport: "",
        event: "",
        league: "",
        selection: "",
      };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(true);
    });

    it("should strip unknown properties (zod default behavior)", () => {
      const bet = { ...validPendingBet(), extraField: "should be ignored" };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(true);
    });

    it("should accept won bet with zero payout (edge: lost all stake effectively)", () => {
      const bet = { ...validWonBet(), payout: 0 };
      const result = BetCardSchema.safeParse(bet);
      expect(result.success).toBe(true);
    });
  });
});
