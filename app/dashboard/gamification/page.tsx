import { Award, BarChart3, Star, Target, TrendingUp, Trophy, Users, Video, Zap } from 'lucide-react';
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

import AITradingCompanion from "@/components/AITradingCompanion";
import BaseIntegration from "@/components/BaseIntegration";
import { Button } from "@/components/ui/button";
import ConsultationsTable from "@/components/consultation/ConsultationsTable";
import CryptoHeatmap from "@/components/CryptoHeatmap";
import PixelCharacter from "@/components/PixelCharacter";
import { Suspense } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { auth } from "@/lib/better-auth/auth";
import { getConsultations } from "@/lib/actions/consultation.actions";
import { headers } from "next/headers";

async function ConsultationsQuickView() {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
        return null; // Don't show if not logged in
    }

    const consultationsData = await getConsultations(userId, { pageSize: 3 });

    if (consultationsData.consultations.length === 0) {
        return null; // Don't show if no consultations
    }

    return (
        <section className="w-full mb-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-purple-500 flex items-center">
                        <Video className="w-6 h-6 mr-3" />
                        Recent AI Consultations
                    </h2>
                    <Button asChild className="bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                        <a href="/dashboard/consultation">View All</a>
                    </Button>
                </div>
                <ConsultationsTable consultations={consultationsData.consultations} />
            </div>
        </section>
    );
}

const GamificationPage = async () => {
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
                        <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 rounded-lg p-6 border border-yellow-500/20">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img 
                                            src="/assets/characters/superboy_solo_1(1).gif" 
                                            alt="Trading Level" 
                                            className="w-full h-full object-contain pixelated"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-yellow-400 mb-1">47</p>
                                        <p className="text-xs font-medium text-yellow-400/70 uppercase tracking-wider">Level</p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <h3 className="text-base font-semibold text-gray-100 mb-1">Trading Level</h3>
                                    <p className="text-sm text-gray-400 mb-3">Expert Trader</p>
                                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500">2,340 XP to next level</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-lg p-6 border border-green-500/20">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <PixelCharacter variant="walk" size="md" />
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-green-400 mb-1">$127K</p>
                                        <p className="text-xs font-medium text-green-400/70 uppercase tracking-wider">Total</p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <h3 className="text-base font-semibold text-gray-100 mb-1">Portfolio Value</h3>
                                    <p className="text-sm text-gray-400 mb-1">Total Assets</p>
                                    <p className="text-sm font-semibold text-green-400">+12.5% this month</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-lg p-6 border border-blue-500/20">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <PixelCharacter variant="jump" size="md" />
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-blue-400 mb-1">73.2%</p>
                                        <p className="text-xs font-medium text-blue-400/70 uppercase tracking-wider">Rate</p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <h3 className="text-base font-semibold text-gray-100 mb-1">Win Rate</h3>
                                    <p className="text-sm text-gray-400 mb-1">Last 30 Days</p>
                                    <p className="text-sm text-gray-500">47/64 trades</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-lg p-6 border border-purple-500/20">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img 
                                            src="/assets/characters/superboy_draft(1).gif" 
                                            alt="Achievements" 
                                            className="w-full h-full object-contain pixelated"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-purple-400 mb-1">23</p>
                                        <p className="text-xs font-medium text-purple-400/70 uppercase tracking-wider">Unlocked</p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <h3 className="text-base font-semibold text-gray-100 mb-1">Achievements</h3>
                                    <p className="text-sm text-gray-400 mb-1">Total Progress</p>
                                    <p className="text-sm text-gray-500">23 of 50 total</p>
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
                        <PixelCharacter variant="group" size="lg" className="mr-3" />
                        Global Leaderboard
                    </h2>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Top 3 Podium */}
                            <div className="space-y-4">
                                <h3 className="text-base md:text-lg font-semibold text-gray-100 mb-4">Top Performers</h3>
                                
                                {/* 1st Place */}
                                <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 rounded-lg">
                                    <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                                        <div className="w-7 h-7 md:w-8 md:h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs md:text-sm font-bold text-gray-900">1</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-100 text-xs md:text-base truncate">CryptoKing_2024</p>
                                            <p className="text-xs md:text-sm text-gray-400 truncate">+47.2% this month</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-sm md:text-lg font-bold text-yellow-400">$2.1M</p>
                                        <p className="text-[10px] md:text-xs text-gray-400">Portfolio</p>
                                    </div>
                                </div>

                                {/* 2nd Place */}
                                <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/30 border border-gray-500/30 rounded-lg">
                                    <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                                        <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs md:text-sm font-bold text-gray-900">2</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-100 text-xs md:text-base truncate">StockMaster_Pro</p>
                                            <p className="text-xs md:text-sm text-gray-400 truncate">+38.7% this month</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-sm md:text-lg font-bold text-gray-300">$1.8M</p>
                                        <p className="text-[10px] md:text-xs text-gray-400">Portfolio</p>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-orange-900/30 to-orange-800/20 border border-orange-500/30 rounded-lg">
                                    <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                                        <div className="w-7 h-7 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs md:text-sm font-bold text-gray-900">3</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-100 text-xs md:text-base truncate">DeFi_Wizard</p>
                                            <p className="text-xs md:text-sm text-gray-400 truncate">+35.1% this month</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-sm md:text-lg font-bold text-orange-400">$1.5M</p>
                                        <p className="text-[10px] md:text-xs text-gray-400">Portfolio</p>
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
                                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30 rounded-lg">
                                        <PixelCharacter variant="hero" size="md" />
                                        <div>
                                            <p className="font-semibold text-gray-100 mb-1">First Profit</p>
                                            <p className="text-xs text-gray-400">Earned your first $100</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/10 border border-blue-500/30 rounded-lg">
                                        <PixelCharacter variant="jump" size="md" />
                                        <div>
                                            <p className="font-semibold text-gray-100 mb-1">Streak Master</p>
                                            <p className="text-xs text-gray-400">5 consecutive wins</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-lg">
                                        <PixelCharacter variant="walk" size="md" />
                                        <div>
                                            <p className="font-semibold text-gray-100 mb-1">Crypto Explorer</p>
                                            <p className="text-xs text-gray-400">Traded 10+ crypto assets</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Consultations Section */}
            <Suspense fallback={null}>
                <ConsultationsQuickView />
            </Suspense>

            {/* Market Analysis Section */}
            <section className="grid w-full gap-8 home-section">
                <div className="md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title="Traditional Stock Heatmap"
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={600}
                        className="text-center"
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
