import type { Bet, RecentBetsProps } from "./schema";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function sortBetsByDateDesc(bets: Bet[]): Bet[] {
  return [...bets].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getResultColorClass(result: Bet["result"]): string {
  switch (result) {
    case "won":
      return "text-green-600";
    case "lost":
      return "text-red-600";
    case "pending":
      return "text-yellow-500";
  }
}

export default function RecentBets({ props }: { props: RecentBetsProps }) {
  const { bets, maxRows = 10 } = props;

  const sorted = sortBetsByDateDesc(bets).slice(0, maxRows);

  return (
    <div
      className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm"
      data-testid="recent-bets"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Date", "Event", "Type", "Amount", "Odds", "Result", "Payout"].map(
              (header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((bet) => (
            <tr key={bet.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {formatDate(bet.date)}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {bet.event}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-gray-700">
                {bet.type}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {formatCurrency(bet.amount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {bet.odds.toFixed(2)}
              </td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-sm font-semibold capitalize ${getResultColorClass(bet.result)}`}
              >
                {bet.result}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {formatCurrency(bet.payout)}
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-6 text-center text-sm text-gray-400"
              >
                No bets to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
