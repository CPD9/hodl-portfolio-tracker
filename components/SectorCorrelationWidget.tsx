'use client';

import { Link as LinkIcon, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

interface SectorCorrelationWidgetProps {
  sector: string | null;
  sectorDescription: string;
  cryptos: CorrelatedCrypto[];
  stockSymbol: string;
  selectedCrypto: string | null;
  onCryptoSelect: (symbol: string) => void;
}

const SectorCorrelationWidget: React.FC<SectorCorrelationWidgetProps> = ({
  sector,
  sectorDescription,
  cryptos,
  stockSymbol,
  selectedCrypto,
  onCryptoSelect,
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
        {cryptos.map((crypto) => {
          const cryptoSlug = crypto.symbol.replace('BINANCE:', '').replace('USD', '');
          
          return (
            <div
              key={crypto.symbol}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                selectedCrypto === crypto.symbol
                  ? 'bg-gray-600 ring-2 ring-blue-500'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center flex-1 space-x-3">
                {/* Correlation meter (pretty, crypto-style) */}
                {(() => {
                  const corr = typeof crypto.correlation === 'number'
                    ? Math.max(0, Math.min(1, crypto.correlation))
                    : null;
                  const perc = corr != null ? Math.round(corr * 100) : null;
                  const strengthClass = corr == null
                    ? 'bg-slate-500/40'
                    : corr >= 0.75
                      ? 'bg-green-500/60'
                      : corr >= 0.5
                        ? 'bg-yellow-500/60'
                        : 'bg-slate-500/50';
                  return (
                    <div className="relative h-5 min-w-[54px] rounded-full border border-gray-600/60 overflow-hidden bg-gray-900">
                      <div
                        className={`absolute left-0 top-0 bottom-0 ${strengthClass}`}
                        style={{ width: perc != null ? `${perc}%` : '0%' }}
                      />
                      <div className="relative z-10 flex h-full items-center justify-center text-[11px] font-medium text-gray-100">
                        {perc != null ? `${perc}%` : '—'}
                      </div>
                    </div>
                  );
                })()}
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedCrypto === crypto.symbol}
                  onChange={() => onCryptoSelect(crypto.symbol)}
                  className="h-5 w-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <Link 
                  href={`/crypto/${crypto.symbol}`}
                  className="flex-1 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-gray-100">
                      {cryptoSlug}
                    </h4>
                    <span className="text-xs text-gray-400">{crypto.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    MCap: {formatMarketCap(crypto.marketCap)}
                  </p>
                </Link>
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
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-gray-300">
          <strong className="text-blue-400">Sector Correlation:</strong> These cryptocurrencies operate in the same {sectorDescription.toLowerCase()} sector as {stockSymbol}, potentially showing correlated price movements.
        </p>
      </div>
    </div>
  );
};

export default SectorCorrelationWidget;

