import { describe, it, expect } from "vitest";
import { StatsOverviewSchema } from "@/components/StatsOverview/schema";

const validProps = {
  totalBets: 150,
  winRate: 67.3,
  netPnL: 1234.56,
  roi: 12.5,
  currentStreak: { type: "win" as const, count: 5 },
  averageOdds: 2.45,
};

describe("StatsOverviewSchema", () => {
  it("accepts valid props with win streak", () => {
    const result = StatsOverviewSchema.safeParse(validProps);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validProps);
    }
  });

  it("accepts valid props with loss streak", () => {
    const result = StatsOverviewSchema.safeParse({
      ...validProps,
      currentStreak: { type: "loss", count: 3 },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currentStreak).toEqual({ type: "loss", count: 3 });
    }
  });

  it("accepts zero values", () => {
    const result = StatsOverviewSchema.safeParse({
      totalBets: 0,
      winRate: 0,
      netPnL: 0,
      roi: 0,
      currentStreak: { type: "win", count: 0 },
      averageOdds: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts negative netPnL and roi", () => {
    const result = StatsOverviewSchema.safeParse({
      ...validProps,
      netPnL: -500.25,
      roi: -8.3,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.netPnL).toBe(-500.25);
      expect(result.data.roi).toBe(-8.3);
    }
  });

  it("rejects missing totalBets", () => {
    const { totalBets, ...rest } = validProps;
    const result = StatsOverviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing winRate", () => {
    const { winRate, ...rest } = validProps;
    const result = StatsOverviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing netPnL", () => {
    const { netPnL, ...rest } = validProps;
    const result = StatsOverviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing roi", () => {
    const { roi, ...rest } = validProps;
    const result = StatsOverviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing currentStreak", () => {
    const { currentStreak, ...rest } = validProps;
    const result = StatsOverviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing averageOdds", () => {
    const { averageOdds, ...rest } = validProps;
    const result = StatsOverviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects string values for numeric fields", () => {
    const result = StatsOverviewSchema.safeParse({
      ...validProps,
      totalBets: "150",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid streak type", () => {
    const result = StatsOverviewSchema.safeParse({
      ...validProps,
      currentStreak: { type: "draw", count: 2 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects streak with missing count", () => {
    const result = StatsOverviewSchema.safeParse({
      ...validProps,
      currentStreak: { type: "win" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects streak with missing type", () => {
    const result = StatsOverviewSchema.safeParse({
      ...validProps,
      currentStreak: { count: 5 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects null input", () => {
    const result = StatsOverviewSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it("rejects empty object", () => {
    const result = StatsOverviewSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts large numbers", () => {
    const result = StatsOverviewSchema.safeParse({
      ...validProps,
      totalBets: 999999,
      netPnL: 1000000.99,
      winRate: 100,
      roi: 999.9,
    });
    expect(result.success).toBe(true);
  });

  it("accepts fractional numbers for all numeric fields", () => {
    const result = StatsOverviewSchema.safeParse({
      totalBets: 0.5,
      winRate: 33.333,
      netPnL: 0.01,
      roi: 0.001,
      currentStreak: { type: "loss", count: 1.5 },
      averageOdds: 1.01,
    });
    expect(result.success).toBe(true);
  });
});
