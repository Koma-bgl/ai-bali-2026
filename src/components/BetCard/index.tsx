import type { BetCardProps } from "./schema";

const SPORT_EMOJI_MAP: Record<string, string> = {
  football: "⚽",
  soccer: "⚽",
  basketball: "🏀",
  tennis: "🎾",
  horse_racing: "🏇",
  baseball: "⚾",
};

export function getSportEmoji(sport: string): string {
  return SPORT_EMOJI_MAP[sport.toLowerCase()] ?? "🎯";
}

export function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/**
 * Returns the appropriate profit display string.
 * Positive profits are prefixed with "+", negatives with "-".
 * Returns null for unsettled bets.
 */
export function formatProfit(profit: number | null): string | null {
  if (profit === null) {
    return null;
  }
  if (profit >= 0) {
    return `+${formatCurrency(profit)}`;
  }
  return `-${formatCurrency(profit)}`;
}

export default function BetCard({ props }: { props: BetCardProps }) {
  const {
    sport,
    event,
    league,
    selection,
    odds,
    stake,
    payout,
    result,
    type,
    placedAt,
    settledAt,
  } = props;

  const isSettled = result !== "pending" && payout !== null;
  const profit = isSettled ? payout - stake : null;

  const resultColorClass =
    result === "won"
      ? "text-green-600 bg-green-100"
      : result === "lost"
        ? "text-red-600 bg-red-100"
        : "text-amber-600 bg-amber-100";

  const resultBorderClass =
    result === "won"
      ? "border-green-200"
      : result === "lost"
        ? "border-red-200"
        : "border-amber-200";

  const profitDisplay = formatProfit(profit);

  return (
    <div
      /* w-full ensures the card stretches to fill its parent container,
         preventing excess whitespace on the right in flex/grid layouts */
      className={`w-full rounded-lg border ${resultBorderClass} bg-white p-4 shadow-sm`}
      data-testid="bet-card"
    >
      {/* Header: Sport emoji + Event + League */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={sport}>
            {getSportEmoji(sport)}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{event}</h3>
            <p className="text-xs text-gray-500">{league}</p>
          </div>
        </div>
        <span className="inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-gray-700">
          {type}
        </span>
      </div>

      {/* Selection + Odds + Stake — compact info row */}
      <div className="mb-3 flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
        <div>
          <p className="text-sm font-medium text-gray-800">{selection}</p>
          <p className="text-xs text-gray-500">
            Odds:{" "}
            <span className="font-semibold text-gray-700">
              {odds.toFixed(2)}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Stake</p>
          <p className="text-sm font-semibold text-gray-800">
            {formatCurrency(stake)}
          </p>
        </div>
      </div>

      {/*
       * Footer: Result badge + timestamps on the left, payout & profit as
       * compact right-aligned group. This avoids the old full-width 3-col
       * grid that stretched state/payout/profit across the entire card.
       */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${resultColorClass}`}
          >
            {result}
          </span>
          <div className="text-xs text-gray-400">
            <p>Placed: {formatDate(placedAt)}</p>
            {isSettled && settledAt && <p>Settled: {formatDate(settledAt)}</p>}
          </div>
        </div>

        {/* Payout & Profit — right-aligned compact group */}
        <div className="flex items-center gap-3 text-sm">
          <div className="text-right">
            <p className="text-xs text-gray-500">Payout</p>
            <p className="font-semibold text-gray-800">
              {isSettled ? formatCurrency(payout) : "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Profit</p>
            {profitDisplay !== null ? (
              <p
                className={`font-semibold ${profit !== null && profit >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {profitDisplay}
              </p>
            ) : (
              <p className="font-semibold text-gray-400">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
