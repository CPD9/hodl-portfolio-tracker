import { Award, BarChart3, Star, Target, TrendingUp, Trophy, Users, Zap } from 'lucide-react';
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

import AITradingCompanion from "@/components/AITradingCompanion";
import BaseIntegration from "@/components/BaseIntegration";
import CryptoHeatmap from "@/components/CryptoHeatmap";
import TradingViewWidget from "@/components/TradingViewWidget";

const GamificationPage = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex min-h-screen home-wrapper">
            {/* Header Section */}
            <section className="w-full mb-8">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-yellow-500 mb-4 flex items-center justify-center">
                            <Trophy className="w-10 h-10 mr-3" />
                            Trading Gamification Hub
                        </h1>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                            Compete with traders worldwide, earn achievements, and level up your trading skills. 
                            Track your performance across traditional stocks and crypto markets.
                        </p>
                    </div>

                    {/* User Stats Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-100">Trading Level</h3>
                                        <p className="text-sm text-gray-400">Expert Trader</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-yellow-400">47</p>
                                    <p className="text-xs text-gray-400">Level</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">2,340 XP to next level</p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-100">Portfolio Value</h3>
                                        <p className="text-sm text-gray-400">Total Assets</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-400">$127,450</p>
                                    <p className="text-xs text-green-400">+12.5% this month</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <Target className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-100">Win Rate</h3>
                                        <p className="text-sm text-gray-400">Last 30 Days</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-400">73.2%</p>
                                    <p className="text-xs text-gray-400">47/64 trades</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                                        <Award className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-100">Achievements</h3>
                                        <p className="text-sm text-gray-400">Unlocked</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-purple-400">23</p>
                                    <p className="text-xs text-gray-400">of 50 total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leaderboard Section */}
            <section className="w-full mb-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
                        <Users className="w-6 h-6 mr-3 text-blue-400" />
                        Global Leaderboard
                    </h2>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Top 3 Podium */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-100 mb-4">Top Performers</h3>
                                
                                {/* 1st Place */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-gray-900">1</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-100">CryptoKing_2024</p>
                                            <p className="text-sm text-gray-400">+47.2% this month</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-yellow-400">$2.1M</p>
                                        <p className="text-xs text-gray-400">Portfolio</p>
                                    </div>
                                </div>

                                {/* 2nd Place */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/30 border border-gray-500/30 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-gray-900">2</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-100">StockMaster_Pro</p>
                                            <p className="text-sm text-gray-400">+38.7% this month</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-300">$1.8M</p>
                                        <p className="text-xs text-gray-400">Portfolio</p>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-900/30 to-orange-800/20 border border-orange-500/30 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-gray-900">3</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-100">DeFi_Wizard</p>
                                            <p className="text-sm text-gray-400">+35.1% this month</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-orange-400">$1.5M</p>
                                        <p className="text-xs text-gray-400">Portfolio</p>
                                    </div>
                                </div>
                            </div>

                            {/* Your Ranking */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-100 mb-4">Your Ranking</h3>
                                
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-white">47</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-100">You</p>
                                                <p className="text-sm text-gray-400">+12.5% this month</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-blue-400">$127K</p>
                                            <p className="text-xs text-gray-400">Portfolio</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Moving up 3 positions this week</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Ranking Progress</span>
                                        <span className="text-blue-400">+3 this week</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Best Streak</span>
                                        <span className="text-green-400">8 wins</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Trading Days</span>
                                        <span className="text-gray-300">23/30</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Achievements */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Achievements</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-100">First Profit</p>
                                            <p className="text-xs text-gray-400">Earned your first $100</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-100">Streak Master</p>
                                            <p className="text-xs text-gray-400">5 consecutive wins</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                            <Star className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-100">Crypto Explorer</p>
                                            <p className="text-xs text-gray-400">Traded 10+ crypto assets</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Market Analysis Section */}
            <section className="grid w-full gap-8 home-section">
                <div className="md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title="Traditional Stock Heatmap"
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
                <div className="md-col-span xl:col-span-2">
                    <CryptoHeatmap />
                </div>
            </section>

            {/* AI Trading Companion Section */}
            <section className="w-full mb-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-purple-500 mb-6 text-center flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 mr-3" />
                        AI Trading Companion
                    </h2>
                    <AITradingCompanion />
                </div>
            </section>

            {/* Base Integration Section */}
            <section className="w-full mb-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center flex items-center justify-center">
                        <Zap className="w-6 h-6 mr-3" />
                        Base Chain Integration
                    </h2>
                    <BaseIntegration />
                </div>
            </section>

            {/* Additional TradingView Widgets */}
            <section className="grid w-full gap-8 home-section">
                <div className="h-full md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
                <div className="h-full md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>
        </div>
    );
};

export default GamificationPage;
