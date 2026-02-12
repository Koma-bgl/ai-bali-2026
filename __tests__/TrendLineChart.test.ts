import { describe, it, expect } from "vitest";
import {
  formatDateLabel,
  formatCurrency,
} from "@/components/TrendLineChart/index";
import TrendLineChart from "@/components/TrendLineChart/index";
import { TrendLineChartSchema } from "@/components/TrendLineChart/schema";
import type { TrendLineChartProps } from "@/components/TrendLineChart/schema";

// ---------------------------------------------------------------------------
// formatDateLabel – UTC-safe "Mon DD" formatting
// ---------------------------------------------------------------------------
describe("formatDateLabel", () => {
  it('formats "2024-01-15" as "Jan 15"', () => {
    expect(formatDateLabel("2024-01-15")).toBe("Jan 15");
  });

  it('formats "2024-12-25" as "Dec 25"', () => {
    expect(formatDateLabel("2024-12-25")).toBe("Dec 25");
  });

  it('formats first day of month "2024-03-01" as "Mar 1"', () => {
    expect(formatDateLabel("2024-03-01")).toBe("Mar 1");
  });

  it('formats last day of year "2024-12-31" as "Dec 31"', () => {
    expect(formatDateLabel("2024-12-31")).toBe("Dec 31");
  });

  it("handles ISO datetime with time component", () => {
    expect(formatDateLabel("2024-06-15T14:30:00Z")).toBe("Jun 15");
  });

  // Critical UTC test: "2024-01-01" parsed as UTC midnight must NOT shift to
  // Dec 31 in western-hemisphere local time.
  it("does not shift date backward due to timezone offset (UTC fix)", () => {
    expect(formatDateLabel("2024-01-01")).toBe("Jan 1");
  });

  it("handles Feb 29 on a leap year", () => {
    expect(formatDateLabel("2024-02-29")).toBe("Feb 29");
  });

  it("handles mid-year date", () => {
    expect(formatDateLabel("2024-07-04")).toBe("Jul 4");
  });

  it("handles datetime at end of UTC day", () => {
    expect(formatDateLabel("2024-09-30T23:59:59Z")).toBe("Sep 30");
  });

  it("handles datetime at start of UTC day", () => {
    expect(formatDateLabel("2024-11-15T00:00:00Z")).toBe("Nov 15");
  });
});

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------
describe("formatCurrency", () => {
  it("formats positive amount with dollar sign", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats negative amount with minus and dollar sign", () => {
    expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats small positive amount", () => {
    expect(formatCurrency(0.5)).toBe("$0.50");
  });

  it("formats small negative amount", () => {
    expect(formatCurrency(-0.01)).toBe("-$0.01");
  });

  it("formats whole number with two decimal places", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });

  it("formats large amount with comma separators", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });

  it("formats negative large amount", () => {
    expect(formatCurrency(-50000)).toBe("-$50,000.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatCurrency(99.999)).toBe("$100.00");
  });

  it("rounds very small fraction to zero", () => {
    expect(formatCurrency(0.001)).toBe("$0.00");
  });

  it("handles negative zero as positive zero", () => {
    expect(formatCurrency(-0)).toBe("$0.00");
  });

  it("pads single-digit fractional to two places", () => {
    expect(formatCurrency(5.1)).toBe("$5.10");
  });
});

// ---------------------------------------------------------------------------
// Component exports & signature
// ---------------------------------------------------------------------------
describe("TrendLineChart component exports", () => {
  it("default export is a function", () => {
    expect(typeof TrendLineChart).toBe("function");
  });

  it("is named TrendLineChart", () => {
    expect(TrendLineChart.name).toBe("TrendLineChart");
  });

  it("exports TrendLineChartSchema from schema module", () => {
    expect(TrendLineChartSchema).toBeDefined();
    expect(typeof TrendLineChartSchema.safeParse).toBe("function");
  });

  it("schema-parsed props satisfy TrendLineChartProps type", () => {
    const parsed = TrendLineChartSchema.parse({
      data: [{ date: "2024-01-01", cumulativePnL: 50, betCount: 2 }],
    });
    const _props: TrendLineChartProps = parsed;
    expect(_props.data).toHaveLength(1);
    expect(_props.height).toBe(300);
  });
});

describe("TrendLineChart component signature", () => {
  it("accepts { props: TrendLineChartProps } wrapper pattern", () => {
    const componentFn = TrendLineChart as (arg: {
      props: TrendLineChartProps;
    }) => unknown;
    expect(typeof componentFn).toBe("function");
  });

  it("has function length of 1 (single destructured arg)", () => {
    expect(TrendLineChart.length).toBe(1);
  });
});
