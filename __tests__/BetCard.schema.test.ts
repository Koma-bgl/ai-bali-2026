import { describe, it, expect } from "vitest";
import { BetCardSchema } from "@/components/BetCard/schema";

// ── Helpers ──────────────────────────────────────────────────────────────────

function validWonBet(overrides: Record<string, unknown> = {}) {
  return {
    id: "bet-001",
    sport: "football",
    event: "Arsenal vs Chelsea",
    league: "Premier League",
    selection: "Arsenal Win",
    odds: 2.5,
    stake: 20,
    payout: 50,
    result: "won",
    type: "single",
    placedAt: "2024-06-01T12:00:00Z",
    settledAt: "2024-06-01T14:00:00Z",
    ...overrides,
  };
}

function validPendingBet(overrides: Record<string, unknown> = {}) {
  return {
    id: "bet-002",
    sport: "basketball",
    event: "Lakers vs Celtics",
    league: "NBA",
    selection: "Lakers +5.5",
    odds: 1.9,
    stake: 50,
    payout: null,
    result: "pending",
    type: "parlay",
    placedAt: "2024-06-10T08:30:00Z",
    settledAt: null,
    ...overrides,
  };
}

function validLostBet(overrides: Record<string, unknown> = {}) {
  return {
    id: "bet-003",
    sport: "tennis",
    event: "Djokovic vs Nadal",
    league: "French Open",
    selection: "Djokovic ML",
    odds: 1.8,
    stake: 25,
    payout: 0,
    result: "lost",
    type: "system",
    placedAt: "2024-06-05T10:00:00Z",
    settledAt: "2024-06-05T13:00:00Z",
    ...overrides,
  };
}

// ── Valid data ───────────────────────────────────────────────────────────────

describe("BetCardSchema – valid data", () => {
  it("accepts a valid won bet", () => {
    const result = BetCardSchema.safeParse(validWonBet());
    expect(result.success).toBe(true);
  });

  it("accepts a valid pending bet", () => {
    const result = BetCardSchema.safeParse(validPendingBet());
    expect(result.success).toBe(true);
  });

  it("accepts a valid lost bet", () => {
    const result = BetCardSchema.safeParse(validLostBet());
    expect(result.success).toBe(true);
  });

  it("accepts payout of 0 for lost bets (zero is not null)", () => {
    const result = BetCardSchema.safeParse(validLostBet({ payout: 0 }));
    expect(result.success).toBe(true);
  });

  it("accepts all three bet types", () => {
    for (const type of ["single", "parlay", "system"] as const) {
      const result = BetCardSchema.safeParse(validWonBet({ type }));
      expect(result.success).toBe(true);
    }
  });

  it("accepts all three result values", () => {
    // won & lost require payout + settledAt; pending requires null
    expect(BetCardSchema.safeParse(validWonBet({ result: "won" })).success).toBe(true);
    expect(BetCardSchema.safeParse(validLostBet({ result: "lost" })).success).toBe(true);
    expect(BetCardSchema.safeParse(validPendingBet({ result: "pending" })).success).toBe(true);
  });
});

// ── Cross-field (superRefine) validation ─────────────────────────────────────

describe("BetCardSchema – superRefine cross-field rules", () => {
  it("rejects pending bet with non-null payout", () => {
    const result = BetCardSchema.safeParse(validPendingBet({ payout: 100 }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const payoutIssue = result.error.issues.find((i) =>
        i.path.includes("payout"),
      );
      expect(payoutIssue).toBeDefined();
      expect(payoutIssue!.message).toMatch(/payout must be null/i);
    }
  });

  it("rejects pending bet with non-null settledAt", () => {
    const result = BetCardSchema.safeParse(
      validPendingBet({ settledAt: "2024-06-10T12:00:00Z" }),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      const settledIssue = result.error.issues.find((i) =>
        i.path.includes("settledAt"),
      );
      expect(settledIssue).toBeDefined();
      expect(settledIssue!.message).toMatch(/settledAt must be null/i);
    }
  });

  it("rejects pending bet with both payout and settledAt set (two issues)", () => {
    const result = BetCardSchema.safeParse(
      validPendingBet({ payout: 50, settledAt: "2024-06-10T12:00:00Z" }),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("rejects won bet with null payout", () => {
    const result = BetCardSchema.safeParse(validWonBet({ payout: null }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const payoutIssue = result.error.issues.find((i) =>
        i.path.includes("payout"),
      );
      expect(payoutIssue).toBeDefined();
      expect(payoutIssue!.message).toMatch(/payout is required/i);
    }
  });

  it("rejects won bet with null settledAt", () => {
    const result = BetCardSchema.safeParse(validWonBet({ settledAt: null }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("settledAt"),
      );
      expect(issue).toBeDefined();
      expect(issue!.message).toMatch(/settledAt is required/i);
    }
  });

  it("rejects lost bet with null payout", () => {
    const result = BetCardSchema.safeParse(validLostBet({ payout: null }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("payout"),
      );
      expect(issue).toBeDefined();
    }
  });

  it("rejects lost bet with null settledAt", () => {
    const result = BetCardSchema.safeParse(validLostBet({ settledAt: null }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("settledAt"),
      );
      expect(issue).toBeDefined();
    }
  });
});

// ── Base field validation ────────────────────────────────────────────────────

describe("BetCardSchema – base field validation", () => {
  it("rejects missing required fields", () => {
    const result = BetCardSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects invalid result enum value", () => {
    const result = BetCardSchema.safeParse(validWonBet({ result: "cancelled" }));
    expect(result.success).toBe(false);
  });

  it("rejects invalid type enum value", () => {
    const result = BetCardSchema.safeParse(validWonBet({ type: "accumulator" }));
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric odds", () => {
    const result = BetCardSchema.safeParse(validWonBet({ odds: "2.5" }));
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric stake", () => {
    const result = BetCardSchema.safeParse(validWonBet({ stake: "twenty" }));
    expect(result.success).toBe(false);
  });

  it("rejects invalid datetime for placedAt", () => {
    const result = BetCardSchema.safeParse(
      validWonBet({ placedAt: "not-a-date" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects invalid datetime for settledAt", () => {
    const result = BetCardSchema.safeParse(
      validWonBet({ settledAt: "yesterday" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects non-string id", () => {
    const result = BetCardSchema.safeParse(validWonBet({ id: 123 }));
    expect(result.success).toBe(false);
  });

  it("accepts payout as null for pending", () => {
    const result = BetCardSchema.safeParse(validPendingBet({ payout: null }));
    expect(result.success).toBe(true);
  });

  it("rejects payout as undefined (not same as null)", () => {
    const data = validPendingBet();
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (data as Record<string, unknown>)["payout"];
    const result = BetCardSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
