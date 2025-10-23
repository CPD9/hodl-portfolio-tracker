'use client';

import { useEffect, useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function TopStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - Replace with actual Finnhub API call
    const mockStocks: Stock[] = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 180.25, change: 2.45, changePercent: 1.38 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: 12.80, changePercent: 2.65 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -3.16, changePercent: -1.28 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 5.22, changePercent: 1.40 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 139.58, change: 1.88, changePercent: 1.37 },
    ];

    setTimeout(() => {
      setStocks(mockStocks);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 h-[400px] flex flex-col">
      <SectionHeader 
        title="Top Stocks" 
        subtitle="Trending stocks in the market"
        gradient="yellow"
        className="mb-4"
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {stocks.map((stock, index) => (
              <div
                key={stock.symbol}
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer border border-gray-700 hover:border-yellow-500/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-100">{stock.symbol}</h4>
                      <p className="text-xs text-gray-400">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-100">${stock.price.toFixed(2)}</p>
                    <div className={`flex items-center justify-end text-xs ${
                      stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <i className={`bx ${stock.change >= 0 ? 'bx-trending-up' : 'bx-trending-down'} mr-1`}></i>
                      <span>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                {/* Mini sparkline placeholder */}
                <div className="h-8 flex items-end gap-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${
                        stock.change >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'
                      }`}
                      style={{
                        height: `${Math.random() * 100}%`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <a 
          href="/dashboard/stocks" 
          className="text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center justify-center group"
        >
          View All Stocks
          <i className='bx bx-right-arrow-alt ml-1 group-hover:translate-x-1 transition-transform'></i>
        </a>
      </div>
    </div>
  );
}

