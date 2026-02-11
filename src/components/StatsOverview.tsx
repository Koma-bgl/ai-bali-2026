import React from 'react';

interface StatsOverviewProps {
  totalBets: number;
  winRate: number;
  netPnL: number;
  roi: number;
  currentStreak: { type: 'win' | 'loss'; count: number };
  averageOdds: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ totalBets, winRate, netPnL, roi, currentStreak, averageOdds }) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const streakText = `${currentStreak.type === 'win' ? 'W' : 'L'}${currentStreak.count}`;
  const streakColor = currentStreak.type === 'win' ? 'text-green-500' : 'text-red-500';

  const roiColor = roi >= 0 ? 'text-green-500' : 'text-red-500';
  const pnlColor = netPnL >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-gray-600">Total Bets</div>
        <div className="text-2xl font-bold">{totalBets}</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-gray-600">Win Rate</div>
        <div className="text-2xl font-bold">{formatPercentage(winRate)}</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-gray-600">Net P&L</div>
        <div className={`text-2xl font-bold ${pnlColor}`}>{formatCurrency(netPnL)}</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-gray-600">ROI</div>
        <div className={`text-2xl font-bold ${roiColor}`}>{formatPercentage(roi)}</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-gray-600">Current Streak</div>
        <div className={`text-2xl font-bold ${streakColor}`}>{streakText}</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-gray-600">Average Odds</div>
        <div className="text-2xl font-bold">{averageOdds.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default StatsOverview;
