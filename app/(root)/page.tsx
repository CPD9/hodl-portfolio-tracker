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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Hero Section */}
          <section className="w-full py-16 mb-8">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                HODL Portfolio Tracker
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Advanced portfolio management with AI-powered insights, real-time market data, and blockchain integration
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <span className="px-3 py-1 bg-gray-800 rounded-full">Real-time Data</span>
                <span className="px-3 py-1 bg-gray-800 rounded-full">AI Analytics</span>
                <span className="px-3 py-1 bg-gray-800 rounded-full">Blockchain Ready</span>
                <span className="px-3 py-1 bg-gray-800 rounded-full">Portfolio Rebalancing</span>
              </div>
            </div>
          </section>

          {/* Base Integration Section */}
          <section className="w-full mb-12">
            <div className="container mx-auto px-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">⚡</span>
                  Base Chain Integration
                </h2>
                <p className="text-gray-300 text-center mb-6 max-w-xl mx-auto">
                  Seamlessly connect with Base blockchain for decentralized trading and portfolio management
                </p>
                <BaseIntegration />
              </div>
            </div>
          </section>

          {/* AI Trading Companion Section */}
          <section className="w-full mb-12">
            <div className="container mx-auto px-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-black font-bold">🤖</span>
                  AI Trading Companion
                </h2>
                <p className="text-gray-300 text-center mb-6 max-w-xl mx-auto">
                  Get intelligent trading insights and portfolio recommendations powered by advanced AI
                </p>
                <AITradingCompanion />
              </div>
            </div>
          </section>

          {/* Market Data Section */}
          <section className="w-full mb-12">
            <div className="container mx-auto px-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-black font-bold">📊</span>
                  Live Market Data
                </h2>
                <p className="text-gray-300 text-center mb-8 max-w-xl mx-auto">
                  Real-time market insights and comprehensive trading analytics
                </p>
                
                <div className="grid w-full gap-8 home-section">
                    <div className="md:col-span-1 xl:col-span-1">
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-4">Market Overview</h3>
                            <TradingViewWidget
                              title="Market Overview"
                              scriptUrl={`${scriptUrl}market-overview.js`}
                              config={MARKET_OVERVIEW_WIDGET_CONFIG}
                              className="custom-chart"
                              height={500}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-1 xl:col-span-2">
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-4">Stock Heatmap</h3>
                            <TradingViewWidget
                                title="Stock Heatmap"
                                scriptUrl={`${scriptUrl}stock-heatmap.js`}
                                config={HEATMAP_WIDGET_CONFIG}
                                height={500}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="grid w-full gap-8 home-section mt-8">
                    <div className="h-full md:col-span-1 xl:col-span-1">
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-4">Market News</h3>
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}timeline.js`}
                                config={TOP_STORIES_WIDGET_CONFIG}
                                height={500}
                            />
                        </div>
                    </div>
                    <div className="h-full md:col-span-1 xl:col-span-2">
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="text-lg font-semibold text-white mb-4">Market Quotes</h3>
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}market-quotes.js`}
                                config={MARKET_DATA_WIDGET_CONFIG}
                                height={500}
                            />
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </section>
        </div>
    )
}

export default Home;
