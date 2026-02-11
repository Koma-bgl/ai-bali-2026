import { describe, it, expect } from "vitest";
import { getSportEmoji, formatCurrency, formatDate } from "@/components/BetCard/index";
import BetCard from "@/components/BetCard/index";

// ── getSportEmoji ────────────────────────────────────────────────────────────

describe("getSportEmoji", () => {
  it("returns ⚽ for football", () => {
    expect(getSportEmoji("football")).toBe("⚽");
  });

  it("returns ⚽ for soccer", () => {
    expect(getSportEmoji("soccer")).toBe("⚽");
  });

  it("returns 🏀 for basketball", () => {
    expect(getSportEmoji("basketball")).toBe("🏀");
  });

  it("returns 🎾 for tennis", () => {
    expect(getSportEmoji("tennis")).toBe("🎾");
  });

  it("returns 🏇 for horse_racing", () => {
    expect(getSportEmoji("horse_racing")).toBe("🏇");
  });

  it("returns ⚾ for baseball", () => {
    expect(getSportEmoji("baseball")).toBe("⚾");
  });

  it("is case-insensitive", () => {
    expect(getSportEmoji("FOOTBALL")).toBe("⚽");
    expect(getSportEmoji("Basketball")).toBe("🏀");
    expect(getSportEmoji("TENNIS")).toBe("🎾");
    expect(getSportEmoji("Horse_Racing")).toBe("🏇");
  });

  it("returns 🎯 for unknown sports", () => {
    expect(getSportEmoji("cricket")).toBe("🎯");
    expect(getSportEmoji("")).toBe("🎯");
    expect(getSportEmoji("curling")).toBe("🎯");
  });
});

// ── formatCurrency ───────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  it("formats a positive number with two decimals", () => {
    expect(formatCurrency(45)).toBe("$45.00");
  });

  it("formats a fractional number", () => {
    expect(formatCurrency(12.5)).toBe("$12.50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("uses absolute value for negative amounts", () => {
    expect(formatCurrency(-25)).toBe("$25.00");
    expect(formatCurrency(-99.99)).toBe("$99.99");
  });

  it("rounds to two decimal places", () => {
    expect(formatCurrency(1.999)).toBe("$2.00");
    expect(formatCurrency(1.001)).toBe("$1.00");
  });

  it("handles large numbers", () => {
    expect(formatCurrency(1000000)).toBe("$1000000.00");
  });

  it("handles very small positive numbers", () => {
    expect(formatCurrency(0.01)).toBe("$0.01");
  });
});

// ── formatDate ───────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("formats an ISO datetime string in UTC en-US", () => {
    const result = formatDate("2024-06-01T12:00:00Z");
    // Should contain Jun 1, 2024 and 12:00 PM
    expect(result).toContain("Jun");
    expect(result).toContain("2024");
    expect(result).toContain("12:00");
  });

  it("uses UTC timezone (no local offset shift)", () => {
    // Midnight UTC should stay on the same date
    const result = formatDate("2024-01-15T00:00:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("handles end-of-year dates", () => {
    const result = formatDate("2024-12-31T23:59:00Z");
    expect(result).toContain("Dec");
    expect(result).toContain("31");
    expect(result).toContain("2024");
  });
});

// ── BetCard default export ───────────────────────────────────────────────────

describe("BetCard – module exports", () => {
  it("has a default export that is a function", () => {
    expect(typeof BetCard).toBe("function");
  });

  it("default export is named BetCard", () => {
    expect(BetCard.name).toBe("BetCard");
  });

  it("getSportEmoji is a named export", () => {
    expect(typeof getSportEmoji).toBe("function");
  });

  it("formatCurrency is a named export", () => {
    expect(typeof formatCurrency).toBe("function");
  });

  it("formatDate is a named export", () => {
    expect(typeof formatDate).toBe("function");
  });
});
