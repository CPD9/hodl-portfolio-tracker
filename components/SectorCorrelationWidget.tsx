'use client';

import { Link as LinkIcon, TrendingDown, TrendingUp } from 'lucide-react';

import Link from 'next/link';
import React from 'react';

interface SectorCorrelationWidgetProps {
  sector: string | null;
  sectorDescription: string;
  cryptos: CorrelatedCrypto[];
  stockSymbol: string;
}

const SectorCorrelationWidget: React.FC<SectorCorrelationWidgetProps> = ({
  sector,
  sectorDescription,
  cryptos,
  stockSymbol,
}) => {
  if (!sector || cryptos.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Sector Correlation
        </h3>
        <p className="text-gray-400 text-sm">
          No sector correlation data available for {stockSymbol}
        </p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'N/A';
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (!marketCap || marketCap === 0) return 'N/A';
    if (marketCap >= 1_000_000_000) {
      return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
    }
    if (marketCap >= 1_000_000) {
      return `$${(marketCap / 1_000_000).toFixed(2)}M`;
    }
    return `$${(marketCap / 1_000).toFixed(2)}K`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Sector Correlation</h3>
          <p className="text-sm text-gray-400 mt-1">{sectorDescription}</p>
        </div>
        <div className="flex items-center space-x-2">
          <LinkIcon className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-gray-400">Related Crypto</span>
        </div>
      </div>

      {/* Crypto List */}
      <div className="space-y-3">
        {cryptos.map((crypto) => (
          <div
            key={crypto.symbol}
            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-gray-100">
                  {crypto.symbol}
                </h4>
                <span className="text-xs text-gray-400">{crypto.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                MCap: {formatMarketCap(crypto.marketCap)}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-mono text-gray-100">
                  {formatPrice(crypto.price)}
                </p>
                <div
                  className={`flex items-center space-x-1 text-xs ${
                    crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {crypto.change24h >= 0 ? '+' : ''}
                    {crypto.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-gray-300">
          <strong className="text-blue-400">Sector Correlation:</strong> These cryptocurrencies operate in the same {sectorDescription.toLowerCase()} sector as {stockSymbol}, potentially showing correlated price movements.
        </p>
      </div>

      {/* Compare Button */}
      <Link 
        href={`/stocks/${stockSymbol}#comparison`}
        className="mt-4 block w-full"
      >
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Compare {stockSymbol} with Crypto
        </button>
      </Link>
    </div>
  );
};

export default SectorCorrelationWidget;

