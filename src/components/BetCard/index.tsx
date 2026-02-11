import type { BetCardProps } from "./schema";

// IMPORTANT: Use default export, NOT named export
// IMPORTANT: Do NOT use React.FC<> — use a plain function component
export default function BetCard({ props }: { props: BetCardProps }) {
  const { sport, event, league, selection, odds, stake, payout, result, type } = props;

  const sportEmoji = {
    football: "⚽",
    basketball: "🏀",
    tennis: "🎾",
    horse_racing: "🏇",
    baseball: "⚾",
    soccer: "⚽",
  }[sport] || "❓";

  let profit;
  let profitColor = "text-gray-500";

  if (result === "won" && payout !== null) {
    profit = `+$${(payout - stake).toFixed(2)}`;
    profitColor = "text-green-500";
  } else if (result === "lost" && payout !== null) {
    profit = `-$${(stake).toFixed(2)}`;
    profitColor = "text-red-500";
  } else {
    profit = "Pending";
  }

  let resultColor = "text-gray-500";
  if (result === "won") {
    resultColor = "text-green-500";
  } else if (result === "lost") {
    resultColor = "text-red-500";
  } else {
    resultColor = "text-amber-500";
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center mb-2">
        <span className="text-xl mr-2">{sportEmoji}</span>
        <span className="font-semibold">{event}</span>
      </div>
      <div className="text-sm text-gray-500 mb-2">{league}</div>
      <div className="mb-2">
        <span className="font-semibold">Selection:</span> {selection}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Odds:</span> {odds} | <span className="font-semibold">Stake:</span> ${stake} | <span className="font-semibold">Payout:</span> {payout !== null ? `$${payout}` : 'N/A'}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold">Result:</span> <span className={resultColor}>{result}</span>
        </div>
        <div>
          <span className="font-semibold">Profit:</span> <span className={profitColor}>{profit}</span>
        </div>
         <div className=" rounded-full text-xs px-2 py-1 font-bold uppercase tracking-wider">{type}</div>
      </div>
    </div>
  );
}