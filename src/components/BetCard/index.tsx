import type { BetCardProps } from "./schema";

const sportEmojiMap: Record<string, string> = {
  football: "⚽",
  soccer: "⚽",
  basketball: "🏀",
  tennis: "🎾",
  horse_racing: "🏇",
  baseball: "⚾",
};

function getSportEmoji(sport: string): string {
  return sportEmojiMap[sport.toLowerCase()] ?? "🎯";
}

function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
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

  const typeBadgeClass =
    "inline-block rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide bg-gray-200 text-gray-700";

  return (
    <div
      className={`rounded-lg border ${resultBorderClass} bg-white p-4 shadow-sm`}
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
        <span className={typeBadgeClass}>{type}</span>
      </div>

      {/* Selection + Odds */}
      <div className="mb-3 rounded-md bg-gray-50 px-3 py-2">
        <p className="text-sm font-medium text-gray-800">{selection}</p>
        <p className="text-xs text-gray-500">
          Odds: <span className="font-semibold text-gray-700">{odds.toFixed(2)}</span>
        </p>
      </div>

      {/* Stake / Payout / Profit */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Stake</p>
          <p className="font-semibold text-gray-800">{formatCurrency(stake)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Payout</p>
          <p className="font-semibold text-gray-800">
            {isSettled ? formatCurrency(payout) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Profit</p>
          {profit !== null ? (
            <p
              className={`font-semibold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {profit >= 0 ? `+${formatCurrency(profit)}` : `-${formatCurrency(profit)}`}
            </p>
          ) : (
            <p className="font-semibold text-gray-400">Pending</p>
          )}
        </div>
      </div>

      {/* Result badge + timestamps */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${resultColorClass}`}
        >
          {result}
        </span>
        <div className="text-right text-xs text-gray-400">
          <p>Placed: {new Date(placedAt).toLocaleDateString()}</p>
          {isSettled && settledAt && (
            <p>Settled: {new Date(settledAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
