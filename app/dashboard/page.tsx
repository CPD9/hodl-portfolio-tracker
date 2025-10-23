import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

import AITradingCompanion from "@/components/AITradingCompanion";
import BaseIntegration from "@/components/BaseIntegration";
import FearGreedIndex from "@/components/FearGreedIndex";
import TradingViewWidget from "@/components/TradingViewWidget";
import ServiceGrid from "@/components/dashboard/ServiceGrid";
import TopStocks from "@/components/dashboard/TopStocks";
import RecentSearch from "@/components/dashboard/RecentSearch";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {sendDailyNewsSummary} from "@/lib/inngest/functions";

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex min-h-screen home-wrapper">
          {/* Service Grid - All 8 Services */}
          <ServiceGrid />

          {/* Base Integration Section */}
          <section className="w-full mb-8">
            <SectionHeader 
              title="Base Chain Integration" 
              subtitle="Leverage Base L2 for low-cost, high-speed transactions"
              gradient="yellow"
            />
            <BaseIntegration />
          </section>

          {/* AI Trading Companion Section */}
          <section className="w-full mb-8">
            <SectionHeader 
              title="AI Trading Companion" 
              subtitle="Get AI-powered insights and personalized trading signals"
              gradient="purple"
            />
            <AITradingCompanion />
          </section>

          {/* Market Technical Analysis / Fear & Greed */}
          <section className="w-full mb-8">
            <SectionHeader 
              title="Market Sentiment & Technical Analysis" 
              subtitle="Real-time market indicators and sentiment metrics"
              gradient="yellow"
            />
            <div className="max-h-[400px] overflow-hidden">
              <FearGreedIndex />
            </div>
          </section>

          {/* Top Stocks + Recent Search */}
          <section className="w-full mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopStocks />
              <RecentSearch />
            </div>
          </section>

          {/* First Row: Market Overview + Stock Heatmap */}
          <section className="grid w-full gap-8 home-section">
              <div className="md:col-span-1 xl:col-span-1">
                  <TradingViewWidget
                    title="Market Overview"
                    scriptUrl={`${scriptUrl}market-overview.js`}
                    config={MARKET_OVERVIEW_WIDGET_CONFIG}
                    className="custom-chart"
                    height={400}
                  />
              </div>
              <div className="md:col-span-1 xl:col-span-2">
                  <TradingViewWidget
                      scriptUrl={`${scriptUrl}stock-heatmap.js`}
                      config={HEATMAP_WIDGET_CONFIG}
                      height={400}
                  />
              </div>
          </section>

          {/* Second Row: Top Stories + Market Data */}
          <section className="grid w-full gap-8 home-section">
              <div className="h-full md:col-span-1 xl:col-span-1">
                  <TradingViewWidget
                      scriptUrl={`${scriptUrl}timeline.js`}
                      config={TOP_STORIES_WIDGET_CONFIG}
                      height={400}
                  />
              </div>
              <div className="h-full md:col-span-1 xl:col-span-2">
                  <TradingViewWidget
                      scriptUrl={`${scriptUrl}market-quotes.js`}
                      config={MARKET_DATA_WIDGET_CONFIG}
                      height={400}
                  />
              </div>
          </section>
        </div>
    )
}

export default Home;
