'use client';

import { useState } from 'react';
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPARISON_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/constants";

import SectorCorrelationWidget from "@/components/SectorCorrelationWidget";
import TradingInterface from "@/components/TradingInterface";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";

interface StockDetailsClientProps {
  symbol: string;
  isInUserWatchlist: boolean;
  userPosition: any;
  currentPrice: number;
  correlatedCrypto: any;
  comparisonData: any;
  session: any;
}

export default function StockDetailsClient({
  symbol,
  isInUserWatchlist,
  userPosition,
  currentPrice,
  correlatedCrypto,
  comparisonData,
  session,
}: StockDetailsClientProps) {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  const handleCryptoSelection = (cryptoSymbol: string) => {
    // Toggle selection: wenn bereits ausgewählt, dann abwählen, sonst auswählen
    setSelectedCrypto(prev => prev === cryptoSymbol ? null : cryptoSymbol);
  };

  // Nur das ausgewählte Crypto für den Vergleich verwenden
  const comparisonSymbols = selectedCrypto ? [selectedCrypto] : [];

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <TradingViewWidget
            key={`symbol-info-${symbol}`}
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <TradingViewWidget
            key={`candle-chart-${symbol}`}
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            key={`baseline-chart-${symbol}`}
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          {/* Stock vs Crypto Comparison - nur anzeigen wenn ein Crypto ausgewählt ist */}
          {comparisonData.sector && selectedCrypto && (
            <div id="comparison">
              <h3 className="text-xl font-bold text-gray-100 mb-4">
                Compare {symbol.toUpperCase()} with {selectedCrypto.replace('BINANCE:', '').replace('USD', '')}
              </h3>
              <TradingViewWidget
                key={`comparison-${selectedCrypto}`}
                scriptUrl={`${scriptUrl}advanced-chart.js`}
                config={COMPARISON_WIDGET_CONFIG(symbol, comparisonSymbols)}
                className="custom-chart"
                height={600}
              />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <WatchlistButton 
              symbol={symbol.toUpperCase()} 
              company={symbol.toUpperCase()} 
              isInWatchlist={isInUserWatchlist}
              userId={session?.user?.id}
            />
          </div>

          {/* Trading Interface */}
          {session?.user?.id && currentPrice > 0 && (
            <TradingInterface
              symbol={symbol.toUpperCase()}
              currentPrice={currentPrice}
              userId={session.user.id}
              userPosition={userPosition}
            />
          )}

          <TradingViewWidget
            key={`technical-analysis-${symbol}`}
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          {/* Sector Correlation Widget */}
          {correlatedCrypto && (
            <SectorCorrelationWidget
              sector={correlatedCrypto.sector}
              sectorDescription={correlatedCrypto.sectorDescription}
              cryptos={correlatedCrypto.cryptos}
              stockSymbol={symbol.toUpperCase()}
              selectedCrypto={selectedCrypto}
              onCryptoSelect={handleCryptoSelection}
            />
          )}

          <TradingViewWidget
            key={`company-profile-${symbol}`}
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            key={`financials-${symbol}`}
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}
