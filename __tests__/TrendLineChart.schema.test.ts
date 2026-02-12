import { describe, it, expect } from "vitest";
import { TrendLineChartSchema } from "@/components/TrendLineChart/schema";

describe("TrendLineChartSchema", () => {
  const validData = [
    { date: "2024-01-15", cumulativePnL: 150.5, betCount: 5 },
    { date: "2024-01-16", cumulativePnL: -30.0, betCount: 3 },
  ];

  it("should accept valid data with explicit height", () => {
    const result = TrendLineChartSchema.safeParse({
      data: validData,
      height: 400,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.data).toHaveLength(2);
      expect(result.data.height).toBe(400);
    }
  });

  it("should default height to 300 when omitted", () => {
    const result = TrendLineChartSchema.safeParse({ data: validData });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.height).toBe(300);
    }
  });

  it("should accept an empty data array", () => {
    const result = TrendLineChartSchema.safeParse({ data: [] });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.data).toEqual([]);
      expect(result.data.height).toBe(300);
    }
  });

  it("should accept a single data point", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ date: "2024-06-01", cumulativePnL: 0, betCount: 0 }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.data).toHaveLength(1);
      expect(result.data.data[0].cumulativePnL).toBe(0);
    }
  });

  it("should accept negative cumulativePnL values", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ date: "2024-01-01", cumulativePnL: -1234.56, betCount: 10 }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.data[0].cumulativePnL).toBe(-1234.56);
    }
  });

  it("should accept zero betCount", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ date: "2024-01-01", cumulativePnL: 100, betCount: 0 }],
    });
    expect(result.success).toBe(true);
  });

  it("should reject when data is missing entirely", () => {
    const result = TrendLineChartSchema.safeParse({ height: 300 });
    expect(result.success).toBe(false);
  });

  it("should reject when data is not an array", () => {
    const result = TrendLineChartSchema.safeParse({ data: "not-an-array" });
    expect(result.success).toBe(false);
  });

  it("should reject a data item missing the date field", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ cumulativePnL: 100, betCount: 5 }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject a data item missing cumulativePnL", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ date: "2024-01-01", betCount: 5 }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject a data item missing betCount", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ date: "2024-01-01", cumulativePnL: 100 }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject when cumulativePnL is a string", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ date: "2024-01-01", cumulativePnL: "100", betCount: 5 }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject when betCount is a string", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ date: "2024-01-01", cumulativePnL: 100, betCount: "five" }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject when date is a number", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [{ date: 20240101, cumulativePnL: 100, betCount: 5 }],
    });
    expect(result.success).toBe(false);
  });

  it("should reject when height is a string", () => {
    const result = TrendLineChartSchema.safeParse({
      data: validData,
      height: "tall",
    });
    expect(result.success).toBe(false);
  });

  it("should reject null as data", () => {
    const result = TrendLineChartSchema.safeParse({ data: null });
    expect(result.success).toBe(false);
  });

  it("should reject completely empty input", () => {
    const result = TrendLineChartSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should ignore extra fields in data items", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [
        {
          date: "2024-01-01",
          cumulativePnL: 100,
          betCount: 5,
          extraField: "ignored",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should handle large numbers", () => {
    const result = TrendLineChartSchema.safeParse({
      data: [
        {
          date: "2024-12-31",
          cumulativePnL: 999999999.99,
          betCount: 100000,
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
