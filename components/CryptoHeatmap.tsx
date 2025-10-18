"use client";

import { Coins, Shield, Star, TrendingDown, TrendingUp, Zap } from 'lucide-react';

import React from 'react';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume: number;
  category: string;
}

const CRYPTO_DATA: CryptoData[] = [
  // Major Cryptocurrencies
  { symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change24h: 1250.30, changePercent24h: 2.98, marketCap: 850000000000, volume: 25000000000, category: 'Major' },
  { symbol: 'ETH', name: 'Ethereum', price: 2650.75, change24h: -45.20, changePercent24h: -1.68, marketCap: 320000000000, volume: 15000000000, category: 'Major' },
  { symbol: 'BNB', name: 'Binance Coin', price: 315.40, change24h: 8.75, changePercent24h: 2.85, marketCap: 48000000000, volume: 1200000000, category: 'Major' },
  { symbol: 'XRP', name: 'XRP', price: 0.62, change24h: 0.03, changePercent24h: 5.08, marketCap: 35000000000, volume: 2800000000, category: 'Major' },
  { symbol: 'ADA', name: 'Cardano', price: 0.48, change24h: -0.02, changePercent24h: -4.00, marketCap: 17000000000, volume: 450000000, category: 'Major' },
  
  // DeFi Tokens
  { symbol: 'UNI', name: 'Uniswap', price: 12.45, change24h: 0.85, changePercent24h: 7.33, marketCap: 7500000000, volume: 320000000, category: 'DeFi' },
  { symbol: 'AAVE', name: 'Aave', price: 95.20, change24h: -3.40, changePercent24h: -3.45, marketCap: 1400000000, volume: 85000000, category: 'DeFi' },
  { symbol: 'COMP', name: 'Compound', price: 45.60, change24h: 2.10, changePercent24h: 4.83, marketCap: 320000000, volume: 25000000, category: 'DeFi' },
  { symbol: 'SUSHI', name: 'SushiSwap', price: 1.85, change24h: 0.15, changePercent24h: 8.82, marketCap: 350000000, volume: 45000000, category: 'DeFi' },
  { symbol: 'YFI', name: 'Yearn Finance', price: 8500.00, change24h: -200.00, changePercent24h: -2.30, marketCap: 280000000, volume: 15000000, category: 'DeFi' },
  
  // Layer 2 Solutions
  { symbol: 'MATIC', name: 'Polygon', price: 0.95, change24h: 0.08, changePercent24h: 9.20, marketCap: 9000000000, volume: 680000000, category: 'Layer 2' },
  { symbol: 'OP', name: 'Optimism', price: 2.15, change24h: 0.25, changePercent24h: 13.16, marketCap: 1800000000, volume: 120000000, category: 'Layer 2' },
  { symbol: 'ARB', name: 'Arbitrum', price: 1.85, change24h: -0.10, changePercent24h: -5.13, marketCap: 2400000000, volume: 180000000, category: 'Layer 2' },
  { symbol: 'IMX', name: 'Immutable X', price: 2.45, change24h: 0.35, changePercent24h: 16.67, marketCap: 3200000000, volume: 95000000, category: 'Layer 2' },
  
  // Meme Coins
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.095, change24h: 0.005, changePercent24h: 5.56, marketCap: 13500000000, volume: 850000000, category: 'Meme' },
  { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000012, change24h: 0.000001, changePercent24h: 9.09, marketCap: 7000000000, volume: 320000000, category: 'Meme' },
  { symbol: 'PEPE', name: 'Pepe', price: 0.0000015, change24h: 0.0000002, changePercent24h: 15.38, marketCap: 650000000, volume: 45000000, category: 'Meme' },
  
  // Gaming & NFT
  { symbol: 'AXS', name: 'Axie Infinity', price: 8.45, change24h: 0.65, changePercent24h: 8.33, marketCap: 1200000000, volume: 85000000, category: 'Gaming' },
  { symbol: 'SAND', name: 'The Sandbox', price: 0.48, change24h: 0.03, changePercent24h: 6.67, marketCap: 1100000000, volume: 65000000, category: 'Gaming' },
  { symbol: 'MANA', name: 'Decentraland', price: 0.42, change24h: -0.02, changePercent24h: -4.55, marketCap: 780000000, volume: 45000000, category: 'Gaming' },
  { symbol: 'ENJ', name: 'Enjin Coin', price: 0.35, change24h: 0.02, changePercent24h: 6.06, marketCap: 350000000, volume: 25000000, category: 'Gaming' },
  
  // AI & Big Data
  { symbol: 'FET', name: 'Fetch.ai', price: 0.85, change24h: 0.12, changePercent24h: 16.44, marketCap: 700000000, volume: 55000000, category: 'AI' },
  { symbol: 'OCEAN', name: 'Ocean Protocol', price: 0.65, change24h: 0.08, changePercent24h: 14.04, marketCap: 450000000, volume: 35000000, category: 'AI' },
  { symbol: 'GRT', name: 'The Graph', price: 0.18, change24h: 0.02, changePercent24h: 12.50, marketCap: 1800000000, volume: 95000000, category: 'AI' },
  
  // Privacy Coins
  { symbol: 'XMR', name: 'Monero', price: 165.50, change24h: 5.20, changePercent24h: 3.24, marketCap: 3000000000, volume: 85000000, category: 'Privacy' },
  { symbol: 'ZEC', name: 'Zcash', price: 28.45, change24h: 1.25, changePercent24h: 4.59, marketCap: 450000000, volume: 25000000, category: 'Privacy' },
  { symbol: 'DASH', name: 'Dash', price: 32.80, change24h: -1.20, changePercent24h: -3.53, marketCap: 380000000, volume: 18000000, category: 'Privacy' }
];

const CATEGORY_COLORS = {
  'Major': 'bg-blue-900/30 border-blue-500/50',
  'DeFi': 'bg-green-900/30 border-green-500/50',
  'Layer 2': 'bg-purple-900/30 border-purple-500/50',
  'Meme': 'bg-pink-900/30 border-pink-500/50',
  'Gaming': 'bg-orange-900/30 border-orange-500/50',
  'AI': 'bg-cyan-900/30 border-cyan-500/50',
  'Privacy': 'bg-gray-900/30 border-gray-500/50'
};

const CryptoHeatmap: React.FC = () => {
  const getChangeColor = (change: number) => {
    if (change > 5) return 'text-green-400 bg-green-900/20';
    if (change > 0) return 'text-green-300 bg-green-800/20';
    if (change > -5) return 'text-red-300 bg-red-800/20';
    return 'text-red-400 bg-red-900/20';
  };

  const getSizeClass = (marketCap: number) => {
    if (marketCap > 100000000000) return 'w-24 h-24 text-lg'; // > $100B
    if (marketCap > 10000000000) return 'w-20 h-20 text-base'; // > $10B
    if (marketCap > 1000000000) return 'w-16 h-16 text-sm'; // > $1B
    if (marketCap > 100000000) return 'w-12 h-12 text-xs'; // > $100M
    return 'w-10 h-10 text-xs'; // < $100M
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) return `${(marketCap / 1000000000000).toFixed(1)}T`;
    if (marketCap >= 1000000000) return `${(marketCap / 1000000000).toFixed(1)}B`;
    if (marketCap >= 1000000) return `${(marketCap / 1000000).toFixed(1)}M`;
    return `${(marketCap / 1000).toFixed(1)}K`;
  };

  const categories = Array.from(new Set(CRYPTO_DATA.map(crypto => crypto.category)));

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Coins className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-gray-100">Crypto Market Heatmap</h3>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Gainers</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Losers</span>
          </div>
        </div>
      </div>

      {/* Market Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Market Cap</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-xl font-bold text-gray-100">$1.2T</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">24h Volume</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-gray-100">$45.2B</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Bitcoin Dominance</span>
            <Shield className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-xl font-bold text-gray-100">42.5%</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Fear & Greed</span>
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-xl font-bold text-gray-100">68</p>
        </div>
      </div>

      {/* Category Legend */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-100 mb-3">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div key={category} className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}>
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* Crypto Heatmap Grid */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryCryptos = CRYPTO_DATA.filter(crypto => crypto.category === category);
          
          return (
            <div key={category}>
              <h4 className="text-md font-semibold text-gray-100 mb-4 flex items-center">
                <div className={`w-3 h-3 rounded mr-2 ${category === 'Major' ? 'bg-blue-500' : category === 'DeFi' ? 'bg-green-500' : category === 'Layer 2' ? 'bg-purple-500' : category === 'Meme' ? 'bg-pink-500' : category === 'Gaming' ? 'bg-orange-500' : category === 'AI' ? 'bg-cyan-500' : 'bg-gray-500'}`}></div>
                {category} ({categoryCryptos.length})
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {categoryCryptos.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className={`${getSizeClass(crypto.marketCap)} ${getChangeColor(crypto.changePercent24h)} rounded-lg border-2 flex flex-col items-center justify-center p-2 hover:scale-105 transition-transform cursor-pointer group`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-xs mb-1">{crypto.symbol}</div>
                      <div className="text-xs opacity-80">{formatPrice(crypto.price)}</div>
                      <div className="text-xs font-semibold">
                        {crypto.changePercent24h >= 0 ? '+' : ''}{crypto.changePercent24h.toFixed(1)}%
                      </div>
                    </div>
                    
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      <div className="font-semibold">{crypto.name}</div>
                      <div>Price: {formatPrice(crypto.price)}</div>
                      <div>24h: {crypto.changePercent24h >= 0 ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%</div>
                      <div>Market Cap: ${formatMarketCap(crypto.marketCap)}</div>
                      <div>Volume: ${formatMarketCap(crypto.volume)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <div className="mt-8 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-md font-semibold text-gray-100 mb-3">Market Performance Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Top Gainer</p>
            <p className="text-green-400 font-semibold">PEPE +15.38%</p>
          </div>
          <div>
            <p className="text-gray-400">Top Loser</p>
            <p className="text-red-400 font-semibold">ADA -4.00%</p>
          </div>
          <div>
            <p className="text-gray-400">Most Active</p>
            <p className="text-blue-400 font-semibold">BTC $25B</p>
          </div>
          <div>
            <p className="text-gray-400">New Listings</p>
            <p className="text-purple-400 font-semibold">3 Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoHeatmap;
