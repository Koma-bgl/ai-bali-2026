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
// IMPORTANT: Props are wrapped in a { props }: { props: TrendLineChartProps } object by json-render
export default function TrendLineChart({ props }: { props: TrendLineChartProps }) {
  const { data, height = 300 } = props;

  const positiveColor = "#22c55e";
  const negativeColor = "#ef4444";

  const tooltipFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const dateFormatter = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <XAxis dataKey="date" tickFormatter={dateFormatter} />
        <YAxis tickFormatter={tooltipFormatter} />
        <Tooltip
          formatter={tooltipFormatter}
          labelFormatter={dateFormatter}
          contentStyle={{ background: '#24292e', color: '#fff', border: 'none' }}
        />
        <ReferenceLine y={0} stroke="#ccc" strokeDasharray="3 3" />
        <Line
          type="monotone"
          dataKey="cumulativePnL"
          stroke={data.every(item => item.cumulativePnL >= 0) ? positiveColor : data.every(item => item.cumulativePnL <= 0) ? negativeColor : (data[data.length - 1].cumulativePnL >= 0 ? positiveColor : negativeColor)}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}