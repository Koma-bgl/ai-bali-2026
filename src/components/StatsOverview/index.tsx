import type { StatsOverviewProps } from "./schema";

// IMPORTANT: Use default export, NOT named export
// IMPORTANT: Do NOT use React.FC<> — use a plain function component
// IMPORTANT: Props are wrapped in a { props } object by json-render
export default function StatsOverview({ props }: { props: StatsOverviewProps }) {
  const { totalBets, winRate, netPnL, roi, currentStreak, averageOdds } = props;

  const netPnLColor = netPnL >= 0 ? "text-green-500" : "text-red-500";
  const roiColor = roi >= 0 ? "text-green-500" : "text-red-500";
  const streakColor = currentStreak.type === "win" ? "text-green-500" : "text-red-500";
  const streakText = `${currentStreak.type === "win" ? "W" : "L"}${currentStreak.count}`;

  const formatCurrency = (value: number) =>
    `$` + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatPercentage = (value: number) =>
    value.toLocaleString(undefined, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const formatOdds = (value: number) => value.toFixed(2);

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-gray-600 text-sm">Total Bets</div>
        <div className="text-2xl font-semibold">{totalBets}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-gray-600 text-sm">Win Rate</div>
        <div className="text-2xl font-semibold">{formatPercentage(winRate)}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-gray-600 text-sm">Net P&L</div>
        <div className={`text-2xl font-semibold ${netPnLColor}`}>{formatCurrency(netPnL)}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-gray-600 text-sm">ROI</div>
        <div className={`text-2xl font-semibold ${roiColor}`}>{formatPercentage(roi)}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-gray-600 text-sm">Current Streak</div>
        <div className={`text-2xl font-semibold ${streakColor}`}>{streakText}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-gray-600 text-sm">Average Odds</div>
        <div className="text-2xl font-semibold">{formatOdds(averageOdds)}</div>
      </div>
    </div>
  );
}