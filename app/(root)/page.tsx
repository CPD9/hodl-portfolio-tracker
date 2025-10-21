import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

import AITradingCompanion from "@/components/AITradingCompanion";
import BaseIntegration from "@/components/BaseIntegration";
import TradingViewWidget from "@/components/TradingViewWidget";
import {sendDailyNewsSummary} from "@/lib/inngest/functions";

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="home-wrapper">
          {/* Base Integration Section */}
          <section className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-6">
              Base Chain Integration
            </h2>
            <BaseIntegration />
          </section>

          {/* AI Trading Companion Section */}
          <section className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-500 mb-6">
              AI Trading Companion
            </h2>
            <AITradingCompanion />
          </section>

          {/* Market Widgets Section */}
          <section className="home-section">
              <div className="md:col-span-1 xl:col-span-1">
                  <TradingViewWidget
                    title="Market Overview"
                    scriptUrl={`${scriptUrl}market-overview.js`}
                    config={MARKET_OVERVIEW_WIDGET_CONFIG}
                    className="custom-chart"
                    height={600}
                  />
              </div>
              <div className="md:col-span-1 xl:col-span-2">
                  <TradingViewWidget
                      title="Stock Heatmap"
                      scriptUrl={`${scriptUrl}stock-heatmap.js`}
                      config={HEATMAP_WIDGET_CONFIG}
                      height={600}
                  />
              </div>
          </section>

          {/* News and Market Data Section */}
          <section className="home-section">
              <div className="md:col-span-1 xl:col-span-1">
                  <TradingViewWidget
                      title="Top Stories"
                      scriptUrl={`${scriptUrl}timeline.js`}
                      config={TOP_STORIES_WIDGET_CONFIG}
                      height={600}
                  />
              </div>
              <div className="md:col-span-1 xl:col-span-2">
                  <TradingViewWidget
                      title="Market Data"
                      scriptUrl={`${scriptUrl}market-quotes.js`}
                      config={MARKET_DATA_WIDGET_CONFIG}
                      height={600}
                  />
              </div>
          </section>
        </div>
    )
}

export default Home;
