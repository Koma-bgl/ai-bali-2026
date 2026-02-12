import type { StatsOverviewProps } from "./schema";

export function formatCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatOdds(value: number): string {
  return value.toFixed(2);
}

export function formatStreak(type: "win" | "loss", count: number): string {
  return type === "win" ? `W${count}` : `L${count}`;
}

export default function StatsOverview({ props }: { props: StatsOverviewProps }) {
  const { totalBets, winRate, netPnL, roi, currentStreak, averageOdds } = props;

  const pnlColorClass = netPnL >= 0 ? "text-green-600" : "text-red-600";
  const roiColorClass = roi >= 0 ? "text-green-600" : "text-red-600";
  const streakColorClass = currentStreak.type === "win" ? "text-green-600" : "text-red-600";

  return (
    <div
      className="grid grid-cols-3 gap-4 lg:grid-cols-6"
      data-testid="stats-overview"
    >
      {/* Total Bets */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Total Bets
        </p>
        <p className="mt-1 text-xl font-semibold text-gray-900">
          {totalBets}
        </p>
      </div>

      {/* Win Rate */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Win Rate
        </p>
        <p className="mt-1 text-xl font-semibold text-gray-900">
          {formatPercentage(winRate)}
        </p>
      </div>

      {/* Net P&L */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Net P&L
        </p>
        <p className={`mt-1 text-xl font-semibold ${pnlColorClass}`}>
          {formatCurrency(netPnL)}
        </p>
      </div>

      {/* ROI */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          ROI
        </p>
        <p className={`mt-1 text-xl font-semibold ${roiColorClass}`}>
          {formatPercentage(roi)}
        </p>
      </div>

      {/* Current Streak */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Current Streak
        </p>
        <p className={`mt-1 text-xl font-semibold ${streakColorClass}`}>
          {formatStreak(currentStreak.type, currentStreak.count)}
        </p>
      </div>

      {/* Average Odds */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Average Odds
        </p>
        <p className="mt-1 text-xl font-semibold text-gray-900">
          {formatOdds(averageOdds)}
        </p>
      </div>
    </div>
  );
}
