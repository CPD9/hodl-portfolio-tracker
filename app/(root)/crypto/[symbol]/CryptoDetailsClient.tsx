'use client';

import { useState, useEffect } from 'react';
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/constants";

import TradingViewWidget from "@/components/TradingViewWidget";
import CryptoTradingInterface from "@/components/CryptoTradingInterface";
import { getCryptoPrice } from "@/lib/actions/coingecko.actions";

interface CryptoDetailsClientProps {
  symbol: string;
  session: any;
}

export default function CryptoDetailsClient({
  symbol,
  session,
}: CryptoDetailsClientProps) {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
  const [currentPrice, setCurrentPrice] = useState(0);
  const [cryptoData, setCryptoData] = useState<any>(null);
  
  // Convert symbol format to clean symbol (BTC, ETH, etc.)
  // Handle both formats: "BTC" and "BINANCE:BTCUSD"
  const cleanSymbol = symbol.includes(':') 
    ? symbol.replace('BINANCE:', '').replace('USD', '').replace('USDT', '')
    : symbol;
  
  // For TradingView, always use the full format
  const tradingViewSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol}USD`;

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        // Use cleanSymbol (e.g., "BTC") for CoinGecko API
        // getCryptoPrice will handle the conversion to CoinGecko ID
        const price = await getCryptoPrice(cleanSymbol.toLowerCase());
        setCurrentPrice(price || 0);
        setCryptoData({ symbol: cleanSymbol, price });
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
  }, [symbol, cleanSymbol]);

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column - Charts */}
        <div className="flex flex-col gap-6">
          <TradingViewWidget
            key={`crypto-symbol-info-${tradingViewSymbol}`}
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(tradingViewSymbol)}
            height={170}
          />

          <TradingViewWidget
            key={`crypto-candle-chart-${tradingViewSymbol}`}
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(tradingViewSymbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            key={`crypto-baseline-chart-${tradingViewSymbol}`}
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(tradingViewSymbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column - Trading & Info */}
        <div className="flex flex-col gap-6">
          {/* Crypto Info Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">{cleanSymbol}</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Price:</span>
                <span className="text-xl font-semibold text-gray-100">
                  ${currentPrice ? currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : 'Loading...'}
                </span>
              </div>
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-gray-300">
                  <strong className="text-blue-400">Note:</strong> Trade this cryptocurrency on the Base blockchain through your connected wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Base Trading Integration - Direct Trading Interface */}
          <CryptoTradingInterface 
            symbol={cleanSymbol}
            currentPrice={currentPrice}
            userId={session?.user?.id}
            session={session}
          />

          <TradingViewWidget
            key={`crypto-technical-analysis-${tradingViewSymbol}`}
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(tradingViewSymbol)}
            height={400}
          />

          {/* Crypto Market Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">About {cleanSymbol}</h3>
            <p className="text-gray-400 text-sm">
              {cleanSymbol} is a cryptocurrency that can be traded on various exchanges. 
              Use the charts above to analyze price movements and trends.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
