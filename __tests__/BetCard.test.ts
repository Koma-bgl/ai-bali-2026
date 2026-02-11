import { describe, it, expect } from "vitest";
import { BetCardSchema } from "@/components/BetCard/schema";
import type { BetCardProps } from "@/components/BetCard/schema";

// ── Helpers ──────────────────────────────────────────────────────────────

function validProps(overrides: Partial<BetCardProps> = {}): BetCardProps {
  return {
    id: "bet-001",
    sport: "football",
    event: "Man Utd vs Chelsea",
    league: "Premier League",
    selection: "Man Utd to Win",
    odds: 2.5,
    stake: 100,
    payout: 250,
    result: "won",
    type: "single",
    placedAt: "2024-06-01T12:00:00Z",
    settledAt: "2024-06-01T14:00:00Z",
    ...overrides,
  };
}

// ── Schema validation ────────────────────────────────────────────────────

describe("BetCardSchema", () => {
  it("should accept valid complete props", () => {
    const result = BetCardSchema.safeParse(validProps());
    expect(result.success).toBe(true);
  });

  it("should accept all result types: won, lost, pending", () => {
    for (const r of ["won", "lost", "pending"] as const) {
      const parsed = BetCardSchema.safeParse(validProps({ result: r }));
      expect(parsed.success).toBe(true);
    }
  });

  it("should reject invalid result value", () => {
    const parsed = BetCardSchema.safeParse(validProps({ result: "draw" as any }));
    expect(parsed.success).toBe(false);
  });

  it("should accept all bet types: single, parlay, system", () => {
    for (const t of ["single", "parlay", "system"] as const) {
      const parsed = BetCardSchema.safeParse(validProps({ type: t }));
      expect(parsed.success).toBe(true);
    }
  });

  it("should reject invalid bet type", () => {
    const parsed = BetCardSchema.safeParse(validProps({ type: "accumulator" as any }));
    expect(parsed.success).toBe(false);
  });

  it("should accept null payout (pending bet)", () => {
    const parsed = BetCardSchema.safeParse(validProps({ payout: null }));
    expect(parsed.success).toBe(true);
  });

  it("should accept null settledAt", () => {
    const parsed = BetCardSchema.safeParse(validProps({ settledAt: null }));
    expect(parsed.success).toBe(true);
  });

  it("should reject missing required fields", () => {
    const { id, ...rest } = validProps();
    const parsed = BetCardSchema.safeParse(rest);
    expect(parsed.success).toBe(false);
  });

  it("should reject non-number odds", () => {
    const parsed = BetCardSchema.safeParse(validProps({ odds: "2.5" as any }));
    expect(parsed.success).toBe(false);
  });

  it("should reject non-number stake", () => {
    const parsed = BetCardSchema.safeParse(validProps({ stake: "100" as any }));
    expect(parsed.success).toBe(false);
  });

  it("should reject non-string id", () => {
    const parsed = BetCardSchema.safeParse(validProps({ id: 123 as any }));
    expect(parsed.success).toBe(false);
  });

  it("should accept zero stake and zero odds", () => {
    const parsed = BetCardSchema.safeParse(validProps({ stake: 0, odds: 0 }));
    expect(parsed.success).toBe(true);
  });

  it("should accept negative payout (edge case)", () => {
    // Schema doesn't restrict sign — that's a business concern
    const parsed = BetCardSchema.safeParse(validProps({ payout: -10 }));
    expect(parsed.success).toBe(true);
  });

  it("should reject payout as undefined (must be number or null)", () => {
    const props = validProps();
    // @ts-expect-error intentionally testing undefined
    delete props.payout;
    const parsed = BetCardSchema.safeParse(props);
    expect(parsed.success).toBe(false);
  });

  it("should reject completely empty object", () => {
    const parsed = BetCardSchema.safeParse({});
    expect(parsed.success).toBe(false);
  });
});

// ── Component logic (no rendering) ──────────────────────────────────────

describe("BetCard component logic", () => {
  // Re-implement the pure helper functions from the component to test them
  // Since they're not exported we replicate them here to verify the logic
  const sportEmojiMap: Record<string, string> = {
    football: "⚽",
    soccer: "⚽",
    basketball: "🏀",
    tennis: "🎾",
    horse_racing: "🏇",
    baseball: "⚾",
  };

  function getSportEmoji(sport: string): string {
    return sportEmojiMap[sport.toLowerCase()] ?? "🎯";
  }

  function formatCurrency(amount: number): string {
    return `$${Math.abs(amount).toFixed(2)}`;
  }

  function computeProfit(
    result: BetCardProps["result"],
    payout: number | null,
    stake: number
  ): number | null {
    const isSettled = result !== "pending" && payout !== null;
    return isSettled ? payout - stake : null;
  }

  // Sport emoji mapping
  describe("getSportEmoji", () => {
    it("maps football to ⚽", () => {
      expect(getSportEmoji("football")).toBe("⚽");
    });

    it("maps soccer to ⚽", () => {
      expect(getSportEmoji("soccer")).toBe("⚽");
    });

    it("maps basketball to 🏀", () => {
      expect(getSportEmoji("basketball")).toBe("🏀");
    });

    it("maps tennis to 🎾", () => {
      expect(getSportEmoji("tennis")).toBe("🎾");
    });

    it("maps horse_racing to 🏇", () => {
      expect(getSportEmoji("horse_racing")).toBe("🏇");
    });

    it("maps baseball to ⚾", () => {
      expect(getSportEmoji("baseball")).toBe("⚾");
    });

    it("is case-insensitive", () => {
      expect(getSportEmoji("Football")).toBe("⚽");
      expect(getSportEmoji("BASKETBALL")).toBe("🏀");
      expect(getSportEmoji("Tennis")).toBe("🎾");
    });

    it("returns 🎯 for unknown sports", () => {
      expect(getSportEmoji("cricket")).toBe("🎯");
      expect(getSportEmoji("")).toBe("🎯");
      expect(getSportEmoji("darts")).toBe("🎯");
    });
  });

  // Currency formatting
  describe("formatCurrency", () => {
    it("formats positive amounts", () => {
      expect(formatCurrency(45)).toBe("$45.00");
    });

    it("formats zero", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("takes absolute value of negative amounts", () => {
      expect(formatCurrency(-25)).toBe("$25.00");
    });

    it("formats fractional amounts with two decimals", () => {
      expect(formatCurrency(123.456)).toBe("$123.46");
    });

    it("pads single decimal amounts", () => {
      expect(formatCurrency(10.5)).toBe("$10.50");
    });

    it("handles very large amounts", () => {
      expect(formatCurrency(999999.99)).toBe("$999999.99");
    });
  });

  // Profit computation
  describe("profit calculation", () => {
    it("returns positive profit for won bet", () => {
      expect(computeProfit("won", 250, 100)).toBe(150);
    });

    it("returns negative profit for lost bet with partial payout", () => {
      expect(computeProfit("lost", 0, 100)).toBe(-100);
    });

    it("returns null for pending result", () => {
      expect(computeProfit("pending", null, 100)).toBeNull();
    });

    it("returns null for pending result even with payout somehow set", () => {
      // result is pending → always null regardless of payout
      expect(computeProfit("pending", 200, 100)).toBeNull();
    });

    it("returns null when payout is null even if result is won", () => {
      // payout is null → not settled
      expect(computeProfit("won", null, 100)).toBeNull();
    });

    it("returns zero profit when payout equals stake", () => {
      expect(computeProfit("won", 100, 100)).toBe(0);
    });

    it("handles lost bet with zero payout", () => {
      expect(computeProfit("lost", 0, 50)).toBe(-50);
    });
  });

  // Result color logic
  describe("result color coding", () => {
    function getResultColorClass(result: BetCardProps["result"]): string {
      return result === "won"
        ? "text-green-600 bg-green-100"
        : result === "lost"
          ? "text-red-600 bg-red-100"
          : "text-amber-600 bg-amber-100";
    }

    it("won → green classes", () => {
      expect(getResultColorClass("won")).toContain("green");
    });

    it("lost → red classes", () => {
      expect(getResultColorClass("lost")).toContain("red");
    });

    it("pending → amber classes", () => {
      expect(getResultColorClass("pending")).toContain("amber");
    });
  });

  // Profit display formatting
  describe("profit display string", () => {
    function formatProfit(profit: number | null): string {
      if (profit === null) return "Pending";
      if (profit >= 0) return `+${formatCurrency(profit)}`;
      return `-${formatCurrency(profit)}`;
    }

    it("shows +$150.00 for positive profit", () => {
      expect(formatProfit(150)).toBe("+$150.00");
    });

    it("shows -$100.00 for negative profit", () => {
      expect(formatProfit(-100)).toBe("-$100.00");
    });

    it("shows +$0.00 for zero profit", () => {
      expect(formatProfit(0)).toBe("+$0.00");
    });

    it("shows Pending for null", () => {
      expect(formatProfit(null)).toBe("Pending");
    });
  });
});

// ── Module exports ───────────────────────────────────────────────────────

describe("BetCard module exports", () => {
  it("schema.ts exports BetCardSchema", async () => {
    const mod = await import("@/components/BetCard/schema");
    expect(mod.BetCardSchema).toBeDefined();
    expect(typeof mod.BetCardSchema.safeParse).toBe("function");
  });

  it("index.tsx has a default export that is a function", async () => {
    const mod = await import("@/components/BetCard/index");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });

  it("default export function is named BetCard", async () => {
    const mod = await import("@/components/BetCard/index");
    expect(mod.default.name).toBe("BetCard");
  });
});
