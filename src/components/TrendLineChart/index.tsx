"use client";

import type { TrendLineChartProps } from "./schema";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

export function formatDateLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { date: string; cumulativePnL: number; betCount: number } }>;
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
      <p className="text-sm font-medium text-gray-700">
        {formatDateLabel(data.date)}
      </p>
      <p
        className={`text-sm font-semibold ${
          data.cumulativePnL >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        P&L: {formatCurrency(data.cumulativePnL)}
      </p>
      <p className="text-xs text-gray-500">Bets: {data.betCount}</p>
    </div>
  );
}

export default function TrendLineChart({
  props,
}: {
  props: TrendLineChartProps;
}) {
  const { data, height = 300 } = props;

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-8"
        style={{ height }}
        data-testid="trend-line-chart-empty"
      >
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  const lastPoint = data[data.length - 1];
  const lineColor = lastPoint.cumulativePnL >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div data-testid="trend-line-chart" style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateLabel}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tickFormatter={(value: number) => formatCurrency(value)}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={0}
            stroke="#9ca3af"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="cumulativePnL"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
