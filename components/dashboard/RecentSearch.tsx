'use client';

import { useEffect, useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface SearchItem {
  id: string;
  query: string;
  type: 'stock' | 'crypto';
  timestamp: number;
  symbol?: string;
}

export default function RecentSearch() {
  const [searches, setSearches] = useState<SearchItem[]>([]);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('recent_searches');
    if (stored) {
      try {
        setSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    } else {
      // Mock data for demo
      const mockSearches: SearchItem[] = [
        { id: '1', query: 'AAPL', type: 'stock', timestamp: Date.now() - 3600000, symbol: 'AAPL' },
        { id: '2', query: 'Bitcoin', type: 'crypto', timestamp: Date.now() - 7200000, symbol: 'BTC' },
        { id: '3', query: 'NVDA', type: 'stock', timestamp: Date.now() - 10800000, symbol: 'NVDA' },
        { id: '4', query: 'Ethereum', type: 'crypto', timestamp: Date.now() - 14400000, symbol: 'ETH' },
        { id: '5', query: 'TSLA', type: 'stock', timestamp: Date.now() - 18000000, symbol: 'TSLA' },
      ];
      setSearches(mockSearches);
      localStorage.setItem('recent_searches', JSON.stringify(mockSearches));
    }
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleClearAll = () => {
    setSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const handleSearch = (item: SearchItem) => {
    // Redirect to appropriate page
    const path = item.type === 'stock' ? '/dashboard/stocks' : '/dashboard/crypto';
    window.location.href = `${path}?symbol=${item.symbol || item.query}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <SectionHeader 
          title="Recent Searches" 
          subtitle="Quick access to your recent lookups"
          gradient="purple"
          className="mb-0 flex-1"
        />
        {searches.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {searches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <i className='bx bx-search-alt text-3xl text-gray-500'></i>
          </div>
          <p className="text-gray-400 text-sm">No recent searches</p>
          <p className="text-gray-500 text-xs mt-1">Search for stocks or crypto to see them here</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {searches.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSearch(item)}
                className="w-full bg-gray-900 rounded-lg p-3 hover:bg-gray-700/50 transition-colors border border-gray-700 hover:border-purple-500/50 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${item.type === 'stock' 
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'}
                    `}>
                      <i className={`bx ${
                        item.type === 'stock' ? 'bx-line-chart' : 'bx-bitcoin'
                      } text-white text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-100 group-hover:text-purple-400 transition-colors">
                        {item.query}
                      </h4>
                      <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</span>
                    <i className='bx bx-right-arrow-alt text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity'></i>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Link */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <a 
          href="/dashboard/stocks" 
          className="text-purple-500 hover:text-purple-400 text-sm font-medium flex items-center justify-center group"
        >
          Go to Search
          <i className='bx bx-search-alt ml-1 group-hover:scale-110 transition-transform'></i>
        </a>
      </div>
    </div>
  );
}

