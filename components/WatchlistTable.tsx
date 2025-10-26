"use client";

import React, { useState } from "react";

import Link from "next/link";
import SetAlertDialog from "./SetAlertDialog";
import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import WatchlistButton from "./WatchlistButton";

interface WatchlistTableProps {
  watchlist: StockWithData[];
  userId?: string;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ watchlist, userId }) => {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; company: string; currentPrice: number } | undefined>();

  const handleSetAlert = (stock: StockWithData) => {
    setSelectedStock({
      symbol: stock.symbol,
      company: stock.company,
      currentPrice: stock.currentPrice || 0,
    });
    setAlertDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(0);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const sign = isPositive ? '+' : '';
    return (
      <span className={`${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {sign}{formatCurrency(change)} ({sign}{changePercent.toFixed(2)}%)
      </span>
    );
  };

  return (
    <>
      <SetAlertDialog
        isOpen={alertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
        stock={selectedStock}
      />
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="watchlist-table">
          <thead>
            <tr className="table-header-row">
              {WATCHLIST_TABLE_HEADER.map((header, index) => (
                <th key={index} className="table-header py-2 md:py-3 px-2 md:px-4 text-left text-[10px] md:text-sm">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {watchlist.map((stock, index) => (
              <tr key={`${stock.symbol}-${index}`} className="table-row">
                <td className="py-2 md:py-4 px-2 md:px-4">
                  <Link 
                    href={`/dashboard/stocks/${stock.symbol}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    <div className="font-medium text-gray-100 text-xs md:text-base">{stock.company}</div>
                    <div className="text-[10px] md:text-sm text-gray-400">{stock.symbol}</div>
                  </Link>
                </td>
                <td className="py-2 md:py-4 px-2 md:px-4">
                  <Link 
                    href={`/dashboard/stocks/${stock.symbol}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    <div className="font-mono text-gray-100 text-xs md:text-base">
                      {stock.currentPrice && stock.currentPrice > 0 ? formatCurrency(stock.currentPrice) : 'N/A'}
                    </div>
                  </Link>
                </td>
                <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-base">
                  <Link 
                    href={`/dashboard/stocks/${stock.symbol}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {formatChange(stock.change || 0, stock.changePercent || 0)}
                  </Link>
                </td>
                <td className="py-2 md:py-4 px-2 md:px-4">
                  <Link 
                    href={`/dashboard/stocks/${stock.symbol}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    <div className="text-gray-100 text-xs md:text-base">
                      {stock.marketCap && stock.marketCap > 0 ? `$${formatNumber(stock.marketCap)}` : 'N/A'}
                    </div>
                  </Link>
                </td>
                <td className="py-2 md:py-4 px-2 md:px-4">
                  <Link 
                    href={`/dashboard/stocks/${stock.symbol}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    <div className="text-gray-100 text-xs md:text-base">
                      {stock.pe && stock.pe > 0 ? stock.pe.toFixed(2) : 'N/A'}
                    </div>
                  </Link>
                </td>
                <td className="py-2 md:py-4 px-2 md:px-4">
                  <button
                    onClick={() => handleSetAlert(stock)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-2 md:px-3 py-1 rounded text-[10px] md:text-sm font-medium transition-colors"
                  >
                    Set Alert
                  </button>
                </td>
                <td className="py-2 md:py-4 px-2 md:px-4">
                  <WatchlistButton
                    symbol={stock.symbol}
                    company={stock.company}
                    isInWatchlist={true}
                    showTrashIcon={true}
                    type="icon"
                    userId={userId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
};

export default WatchlistTable;
