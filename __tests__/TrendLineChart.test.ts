import { describe, it, expect } from "vitest";
import {
  formatDateLabel,
  formatCurrency,
} from "@/components/TrendLineChart/index";
import TrendLineChart from "@/components/TrendLineChart/index";
import { TrendLineChartSchema } from "@/components/TrendLineChart/schema";
import type { TrendLineChartProps } from "@/components/TrendLineChart/schema";

describe("formatDateLabel", () => {
  it('should format ISO date string to "Mon DD" format', () => {
    const result = formatDateLabel("2024-01-15");
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/15/);
  });

  it('should format another date correctly', () => {
    const result = formatDateLabel("2024-12-25");
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/25/);
  });

  it('should format a date at start of month', () => {
    const result = formatDateLabel("2024-03-01");
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/1/);
  });

  it('should handle end of year date', () => {
    const result = formatDateLabel("2024-12-31");
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/31/);
  });

  it("should handle date with time component (ISO datetime)", () => {
    const result = formatDateLabel("2024-06-15T14:30:00Z");
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/15/);
  });
});

describe("formatCurrency", () => {
  it("should format positive amount with dollar sign", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("should format negative amount with minus and dollar sign", () => {
    expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
  });

  it("should format zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("should format small positive amount", () => {
    expect(formatCurrency(0.5)).toBe("$0.50");
  });

  it("should format small negative amount", () => {
    expect(formatCurrency(-0.01)).toBe("-$0.01");
  });

  it("should format whole number with two decimal places", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });

  it("should format large amount with comma separators", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });

  it("should format negative large amount", () => {
    expect(formatCurrency(-50000)).toBe("-$50,000.00");
  });

  it("should round to two decimal places", () => {
    const result = formatCurrency(99.999);
    expect(result).toBe("$100.00");
  });

  it("should handle very small fraction", () => {
    expect(formatCurrency(0.001)).toBe("$0.00");
  });
});

describe("TrendLineChart component exports", () => {
  it("should have a default export that is a function", () => {
    expect(typeof TrendLineChart).toBe("function");
  });

  it("should be named TrendLineChart", () => {
    expect(TrendLineChart.name).toBe("TrendLineChart");
  });

  it("should export TrendLineChartSchema from schema module", () => {
    expect(TrendLineChartSchema).toBeDefined();
    expect(typeof TrendLineChartSchema.safeParse).toBe("function");
  });

  it("should export TrendLineChartProps type (compile-time check)", () => {
    // This is a compile-time type check — if TrendLineChartProps doesn't exist,
    // TypeScript will fail. At runtime we just verify the schema produces the right shape.
    const parsed = TrendLineChartSchema.parse({
      data: [{ date: "2024-01-01", cumulativePnL: 50, betCount: 2 }],
    });
    const _props: TrendLineChartProps = parsed;
    expect(_props.data).toHaveLength(1);
    expect(_props.height).toBe(300);
  });
});

describe("TrendLineChart component signature", () => {
  it("should accept { props: TrendLineChartProps } pattern (type check)", () => {
    // Verify the function signature matches json-render's ComponentFn pattern.
    // We can't render without DOM, but we can verify the function accepts the shape.
    const componentFn = TrendLineChart as (arg: {
      props: TrendLineChartProps;
    }) => unknown;
    expect(typeof componentFn).toBe("function");
  });
});
