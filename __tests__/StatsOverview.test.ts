import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatPercentage,
  formatOdds,
  formatStreak,
} from "@/components/StatsOverview/index";

describe("formatCurrency", () => {
  it("formats positive amounts with dollar sign", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats negative amounts with minus and dollar sign", () => {
    expect(formatCurrency(-500.25)).toBe("-$500.25");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("pads to two decimal places", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatCurrency(99.999)).toBe("$100.00");
  });

  it("formats small amounts", () => {
    expect(formatCurrency(0.01)).toBe("$0.01");
  });

  it("formats large amounts with comma separators", () => {
    expect(formatCurrency(1000000.99)).toBe("$1,000,000.99");
  });

  it("formats negative large amounts", () => {
    expect(formatCurrency(-12345.67)).toBe("-$12,345.67");
  });

  it("formats small negative amounts", () => {
    expect(formatCurrency(-0.5)).toBe("-$0.50");
  });
});

describe("formatPercentage", () => {
  it("formats a normal percentage", () => {
    expect(formatPercentage(67.3)).toBe("67.3%");
  });

  it("formats zero", () => {
    expect(formatPercentage(0)).toBe("0.0%");
  });

  it("formats 100%", () => {
    expect(formatPercentage(100)).toBe("100.0%");
  });

  it("formats negative percentage", () => {
    expect(formatPercentage(-8.3)).toBe("-8.3%");
  });

  it("rounds to one decimal place", () => {
    expect(formatPercentage(33.333)).toBe("33.3%");
  });

  it("rounds up correctly", () => {
    expect(formatPercentage(33.35)).toBe("33.4%");
  });

  it("formats small percentage", () => {
    expect(formatPercentage(0.1)).toBe("0.1%");
  });

  it("formats large percentage values", () => {
    expect(formatPercentage(999.9)).toBe("999.9%");
  });
});

describe("formatOdds", () => {
  it("formats normal odds", () => {
    expect(formatOdds(2.45)).toBe("2.45");
  });

  it("formats even odds", () => {
    expect(formatOdds(2)).toBe("2.00");
  });

  it("formats odds with one decimal", () => {
    expect(formatOdds(1.5)).toBe("1.50");
  });

  it("formats zero", () => {
    expect(formatOdds(0)).toBe("0.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatOdds(3.456)).toBe("3.46");
  });

  it("formats high odds", () => {
    expect(formatOdds(100.0)).toBe("100.00");
  });

  it("formats very precise odds", () => {
    expect(formatOdds(1.001)).toBe("1.00");
  });
});

describe("formatStreak", () => {
  it("formats a win streak", () => {
    expect(formatStreak("win", 5)).toBe("W5");
  });

  it("formats a loss streak", () => {
    expect(formatStreak("loss", 3)).toBe("L3");
  });

  it("formats zero streak count", () => {
    expect(formatStreak("win", 0)).toBe("W0");
    expect(formatStreak("loss", 0)).toBe("L0");
  });

  it("formats single win", () => {
    expect(formatStreak("win", 1)).toBe("W1");
  });

  it("formats single loss", () => {
    expect(formatStreak("loss", 1)).toBe("L1");
  });

  it("formats large streak count", () => {
    expect(formatStreak("win", 99)).toBe("W99");
  });
});
