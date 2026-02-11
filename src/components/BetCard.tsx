// src/components/BetCard.tsx
"use client";

import React from "react";

interface BetCardProps {
  id: string;
  sport: string;
  event: string;
  league: string;
  selection: string;
  odds: number;
  stake: number;
  payout: number | null;
  result: "won" | "lost" | "pending";
  type: "single" | "parlay" | "system";
  placedAt: string;
  settledAt: string | null;
}

const BetCard: React.FC<BetCardProps> = ({ id, sport, event, league, selection, odds, stake, payout, result, type, placedAt, settledAt }) => {
  const profit = payout !== null ? payout - stake : null;
  let profitDisplay = "Pending";
  let profitColor = "text-gray-500";

  if (profit !== null) {
    if (profit > 0) {
      profitDisplay = `+$${profit.toFixed(2)}`;
      profitColor = "text-green-500";
    } else if (profit < 0) {
      profitDisplay = `-$${Math.abs(profit).toFixed(2)}`;
      profitColor = "text-red-500";
    } else {
      profitDisplay = "+$0.00";
      profitColor = "text-gray-500";
    }
  }

  let resultColor = "text-gray-500";
  switch (result) {
    case "won":
      resultColor = "text-green-500";
      break;
    case "lost":
      resultColor = "text-red-500";
      break;
    case "pending":
      resultColor = "text-amber-500";
      break;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-gray-800">{event}</div>
        <div className="text-xs text-gray-500">{sport}</div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-600">{league}</div>
        <div className="text-gray-600">{type}</div>
      </div>
      <div className="mb-2">
        <span className="font-medium text-gray-700">Selection:</span> {selection}
      </div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-medium text-gray-700">Odds:</span> {odds}
        </div>
        <div>
          <span className="font-medium text-gray-700">Stake:</span> ${stake.toFixed(2)}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium text-gray-700">Payout:</span> {payout !== null ? `$${payout.toFixed(2)}` : "N/A"}
        </div>
        <div>
          <span className="font-medium text-gray-700">Result:</span> <span className={resultColor}>{result}</span>
        </div>
      </div>
      <div>
          <span className="font-medium text-gray-700">Profit:</span> <span className={profitColor}>{profitDisplay}</span>
        </div>
    </div>
  );
};

export default BetCard;
