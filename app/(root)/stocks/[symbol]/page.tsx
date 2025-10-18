import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPARISON_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/constants";
import { getCorrelatedCrypto, getStockCryptoComparison } from "@/lib/actions/correlation.actions";

import SectorCorrelationWidget from "@/components/SectorCorrelationWidget";
import TradingInterface from "@/components/TradingInterface";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { auth } from "@/lib/better-auth/auth";
import { getStockQuote } from "@/lib/actions/finnhub.actions";
import { getUserPosition } from "@/lib/actions/stock-trading.actions";
import { headers } from "next/headers";
import { isInWatchlist } from "@/lib/actions/watchlist.actions";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  // Get user session and check if stock is in watchlist
  const session = await auth.api.getSession({ headers: await headers() });
  let isInUserWatchlist = false;
  let userPosition = null;
  let currentPrice = 0;
  let correlatedCrypto = null;

  // Fetch stock quote for current price
  const quote = await getStockQuote(symbol);
  currentPrice = quote?.c || 0;

  if (session?.user?.id) {
    isInUserWatchlist = await isInWatchlist(session.user.id, symbol);
    userPosition = await getUserPosition(session.user.id, symbol);
  }

  // Get correlated crypto for this stock
  correlatedCrypto = await getCorrelatedCrypto(symbol);
  
  // Get comparison symbols for TradingView
  const comparisonData = await getStockCryptoComparison(symbol);

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          {/* Stock vs Crypto Comparison */}
          {comparisonData.sector && comparisonData.comparisonSymbols.length > 0 && (
            <div id="comparison">
              <h3 className="text-xl font-bold text-gray-100 mb-4">
                Compare {symbol.toUpperCase()} with Sector Crypto
              </h3>
              <TradingViewWidget
                scriptUrl={`${scriptUrl}advanced-chart.js`}
                config={COMPARISON_WIDGET_CONFIG(symbol, comparisonData.comparisonSymbols)}
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
            />
          )}

          <TradingViewWidget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}
