'use client';

import { Activity, BarChart3, DollarSign, Target, TrendingDown, TrendingUp } from 'lucide-react';

import Link from 'next/link';
import React from 'react';

interface PortfolioDashboardProps {
  holdings: PortfolioHolding[];
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercentage: number;
  cashBalance: number;
  stats: any;
}

const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  holdings,
  totalValue,
  totalInvested,
  totalPnL,
  totalPnLPercentage,
  cashBalance,
  stats,
}) => {
  const portfolioValue = totalValue + cashBalance;
  const totalAssets = holdings.length;
  
  const stockHoldings = holdings.filter(h => h.type === 'STOCK');
  const cryptoHoldings = holdings.filter(h => h.type === 'CRYPTO');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-400">Portfolio Value</h3>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-100">{formatCurrency(portfolioValue)}</p>
          <p className="text-sm text-gray-400 mt-2">
            Cash: {formatCurrency(cashBalance)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-semibold text-gray-400">Total P&L</h3>
            </div>
          </div>
          <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(totalPnL)}
          </p>
          <p className={`text-sm mt-2 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercent(totalPnLPercentage)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-gray-400">Total Assets</h3>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-100">{totalAssets}</p>
          <p className="text-sm text-gray-400 mt-2">
            {stockHoldings.length} Stocks, {cryptoHoldings.length} Crypto
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm font-semibold text-gray-400">Win Rate</h3>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-100">{stats.winRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-400 mt-2">
            {stats.successfulTrades}/{stats.totalTrades} Trades
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-100">Your Holdings</h3>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {holdings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No holdings yet</p>
            <Link href="/">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Start Trading
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-400">Symbol</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-400">Type</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-400">Quantity</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-400">Avg Price</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-400">Current Price</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-400">Value</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-400">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {holdings.map((holding) => (
                  <tr key={`${holding.symbol}-${holding.type}`} className="hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-4">
                      <Link href={`/stocks/${holding.symbol}`} className="font-semibold text-blue-400 hover:text-blue-300">
                        {holding.symbol}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        holding.type === 'STOCK' 
                          ? 'bg-blue-900/30 text-blue-400' 
                          : 'bg-purple-900/30 text-purple-400'
                      }`}>
                        {holding.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-100">{holding.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-100 font-mono">
                      {formatCurrency(holding.avgPrice)}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-100 font-mono">
                      {formatCurrency(holding.currentPrice)}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-100 font-semibold">
                      {formatCurrency(holding.currentValue)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className={`font-semibold ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(holding.pnl)}
                      </div>
                      <div className={`text-sm ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(holding.pnlPercentage)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Asset Allocation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Stocks</span>
                <span className="text-sm text-gray-100 font-semibold">
                  {stockHoldings.length > 0
                    ? ((stockHoldings.reduce((sum, h) => sum + h.currentValue, 0) / totalValue) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${stockHoldings.length > 0
                      ? (stockHoldings.reduce((sum, h) => sum + h.currentValue, 0) / totalValue) * 100
                      : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Crypto</span>
                <span className="text-sm text-gray-100 font-semibold">
                  {cryptoHoldings.length > 0
                    ? ((cryptoHoldings.reduce((sum, h) => sum + h.currentValue, 0) / totalValue) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{
                    width: `${cryptoHoldings.length > 0
                      ? (cryptoHoldings.reduce((sum, h) => sum + h.currentValue, 0) / totalValue) * 100
                      : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Cash</span>
                <span className="text-sm text-gray-100 font-semibold">
                  {((cashBalance / portfolioValue) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(cashBalance / portfolioValue) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {holdings
              .sort((a, b) => b.pnlPercentage - a.pnlPercentage)
              .slice(0, 5)
              .map((holding) => (
                <div key={`${holding.symbol}-${holding.type}`} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {holding.pnl >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm font-semibold text-gray-100">{holding.symbol}</span>
                  </div>
                  <span className={`text-sm font-medium ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercent(holding.pnlPercentage)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;

