import type { RecentBetsProps } from "./schema";

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function RecentBets({ props }: { props: RecentBetsProps }) {
  const { bets, maxRows = 10 } = props;

  const sortedBets = [...bets]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxRows);

  const resultClasses: Record<string, string> = {
    won: "text-green-600 font-semibold",
    lost: "text-red-600 font-semibold",
    pending: "text-yellow-500 font-semibold",
  };

  return (
    <div
      className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm"
      data-testid="recent-bets"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Event
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Type
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
              Amount
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
              Odds
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Result
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
              Payout
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedBets.map((bet) => (
            <tr key={bet.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {formatDate(bet.date)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {bet.event}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-gray-700">
                {bet.type}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                {formatCurrency(bet.amount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                {bet.odds.toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <span className={resultClasses[bet.result] ?? ""}>
                  {bet.result.charAt(0).toUpperCase() + bet.result.slice(1)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                {formatCurrency(bet.payout)}
              </td>
            </tr>
          ))}
          {sortedBets.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-6 text-center text-sm text-gray-400"
              >
                No recent bets
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
