'use client';

import { Clock, Download, ExternalLink, Filter, TrendingDown, TrendingUp, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

interface TransactionHistoryProps {
  transactions: TradeTransaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'ALL' | 'STOCK' | 'CRYPTO'>('ALL');

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'ALL') return true;
    return tx.type === filter;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Symbol', 'Type', 'Action', 'Quantity', 'Price', 'Total', 'Fee', 'Status'];
    const csvData = filteredTransactions.map(tx => [
      formatDate(tx.timestamp),
      tx.symbol,
      tx.type,
      tx.action,
      tx.quantity,
      tx.price,
      tx.total,
      tx.fee,
      tx.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-100">Transaction History</h3>
        </div>
        <div className="flex items-center space-x-3">
          {/* Filter - mobile dropdown */}
          <div className="md:hidden relative inline-block">
            <label htmlFor="tx-filter" className="sr-only">Filter</label>
            <select
              id="tx-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'ALL' | 'STOCK' | 'CRYPTO')}
              className="bg-gray-700 text-gray-200 text-xs rounded-lg px-2 pr-7 py-1 appearance-none focus:outline-none focus:ring-0 focus:border-gray-600 border border-gray-600"
            >
              <option value="ALL">All</option>
              <option value="STOCK">Stocks</option>
              <option value="CRYPTO">Crypto</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter - desktop buttons */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('STOCK')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === 'STOCK' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Stocks
            </button>
            <button
              onClick={() => setFilter('CRYPTO')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === 'CRYPTO' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Crypto
            </button>
          </div>

          {/* Export Button */}
          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="text-gray-400 hover:text-white hidden md:inline-flex"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">No transactions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-[10px] md:text-sm font-semibold text-gray-400">Date</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-[10px] md:text-sm font-semibold text-gray-400">Symbol</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-[10px] md:text-sm font-semibold text-gray-400">Type</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-[10px] md:text-sm font-semibold text-gray-400">Action</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-right text-[10px] md:text-sm font-semibold text-gray-400">Qty</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-right text-[10px] md:text-sm font-semibold text-gray-400">Price</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-right text-[10px] md:text-sm font-semibold text-gray-400">Total</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-center text-[10px] md:text-sm font-semibold text-gray-400">Status</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-center text-[10px] md:text-sm font-semibold text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-700 transition-colors">
                  <td className="py-2 md:py-4 px-2 md:px-4 text-[10px] md:text-sm text-gray-400 whitespace-nowrap">
                    <div className="hidden md:block">{formatDate(tx.timestamp)}</div>
                    <div className="block md:hidden text-[9px]">{new Date(tx.timestamp).toLocaleDateString()}</div>
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4">
                    <span className="font-semibold text-gray-100 text-xs md:text-base">{tx.symbol}</span>
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4">
                    <span className={`px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium whitespace-nowrap ${
                      tx.type === 'STOCK' 
                        ? 'bg-blue-900/30 text-blue-400' 
                        : 'bg-purple-900/30 text-purple-400'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      {tx.action === 'BUY' ? (
                        <>
                          <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                          <span className="text-[10px] md:text-sm font-medium text-green-400">BUY</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
                          <span className="text-[10px] md:text-sm font-medium text-red-400">SELL</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4 text-right text-gray-100 text-xs md:text-base">{tx.quantity}</td>
                  <td className="py-2 md:py-4 px-2 md:px-4 text-right text-gray-100 font-mono text-[10px] md:text-sm">
                    {formatCurrency(tx.price)}
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4 text-right text-gray-100 font-semibold text-[10px] md:text-sm">
                    {formatCurrency(tx.total)}
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4 text-center">
                    <span className={`px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium whitespace-nowrap ${
                      tx.status === 'COMPLETED'
                        ? 'bg-green-900/30 text-green-400'
                        : tx.status === 'PENDING'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4 text-center">
                    {tx.txHash && (
                      <a
                        href={`https://basescan.org/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Footer */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Transactions</p>
              <p className="text-lg font-semibold text-gray-100">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Buy Orders</p>
              <p className="text-lg font-semibold text-green-400">
                {filteredTransactions.filter(tx => tx.action === 'BUY').length}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Sell Orders</p>
              <p className="text-lg font-semibold text-red-400">
                {filteredTransactions.filter(tx => tx.action === 'SELL').length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Export Button at Bottom */}
      <div className="mt-4 md:hidden">
        <Button
          onClick={exportToCSV}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistory;

