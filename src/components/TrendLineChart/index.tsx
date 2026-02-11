import type { TrendLineChartProps } from "./schema";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

// IMPORTANT: Use default export, NOT named export
// IMPORTANT: Do NOT use React.FC<> — use a plain function component
// IMPORTANT: Props are wrapped in a { props } object by json-render
export default function TrendLineChart({ props }: { props: TrendLineChartProps }) {
  const { data, height = 300 } = props;

  const positiveColor = "#22c55e";
  const negativeColor = "#ef4444";

  interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string | number;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.date).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      );
      const cumulativePnL = payload[0].payload.cumulativePnL.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      const betCount = payload[0].payload.betCount;

      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-md p-2">
          <p className="text-sm font-semibold">{`${date}`}</p>
          <p className="text-xs">Cumulative P&L: {cumulativePnL}</p>
          <p className="text-xs">Bet Count: {betCount}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tickFormatter={(date: string) =>
            new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />
        <YAxis tickFormatter={(value: number) =>
          value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
        }/>
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
        <Line
          type="monotone"
          dataKey="cumulativePnL"
          stroke={data.some((item) => item.cumulativePnL < 0) ? (data[data.length - 1].cumulativePnL >= 0 ? positiveColor : negativeColor) : positiveColor}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}