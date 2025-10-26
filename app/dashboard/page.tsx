'use client';

import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

import AITradingCompanion from "@/components/AITradingCompanion";
import BaseIntegration from "@/components/BaseIntegration";
import FearGreedIndex from "@/components/FearGreedIndex";
import { StockCryptoSwap } from "@/components/StockCryptoSwap";
import TradingViewWidget from "@/components/TradingViewWidget";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import 'boxicons/css/boxicons.min.css';
import { Activity, BarChart3, DollarSign, RefreshCw, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
    const [mounted, setMounted] = useState(false);
    const [portfolioData, setPortfolioData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial fetch
        fetchPortfolioData();
        
        // Listen for portfolio updates from trading components
        const handlePortfolioUpdate = () => {
            toast.success('Portfolio updated! Refreshing data...');
            fetchPortfolioData(true);
        };
        
        window.addEventListener('portfolioUpdated', handlePortfolioUpdate);
        
        // Auto-refresh every 60 seconds for price updates
        const refreshInterval = setInterval(() => {
            fetchPortfolioData(true);
        }, 60000); // 60 seconds
        
        return () => {
            window.removeEventListener('portfolioUpdated', handlePortfolioUpdate);
            clearInterval(refreshInterval);
        };
    }, []);

    const fetchPortfolioData = async (isBackgroundRefresh = false) => {
        try {
            if (isBackgroundRefresh) {
                setIsRefreshing(true);
            }
            const res = await fetch('/api/portfolio/summary', { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (json?.success && json.data) {
                setPortfolioData(json.data);
            } else {
                throw new Error(json?.message || 'Failed to load portfolio');
            }
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            // Fallback to sensible defaults
            setPortfolioData({
                totalValue: 0,
                cashBalance: 100000,
                totalPnL: 0,
                totalPnLPercentage: 0,
                holdings: [],
            });
        } finally {
            setLoading(false);
            if (isBackgroundRefresh) {
                setIsRefreshing(false);
            }
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const formatPercent = (value: number) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Gradient Background Effects - Similar to Landing Page */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-yellow-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
            
            {/* Blur glow effect */}
            <div className="fixed h-0 w-[40rem] top-[30%] -left-[5%] shadow-[0_0_900px_20px_#e99b63] rotate-[-30deg] -z-10 pointer-events-none" />

            <div className="relative max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-8">
                {/* Hero Header Section - Text only, centered */}
                <div className="flex items-center justify-center mb-12 min-h-[220px]">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto z-10 text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                                Your Trading Command Center
                            </h1>
                            <button
                                onClick={() => fetchPortfolioData(true)}
                                disabled={isRefreshing}
                                className="p-2 rounded-lg hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
                                title="Refresh portfolio data"
                            >
                                <RefreshCw className={`w-6 h-6 text-yellow-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                            Real-time market data, AI insights, and blockchain integration at your fingertips
                        </p>
                    </motion.div>
                </div>

                {/* Quick Stats Bar - Enhanced with Real Portfolio Data */}
                <motion.div 
                    {...fadeInUp}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0 * 0.1 }}
                        className="relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
                        onClick={() => window.location.href = '/dashboard/portfolio'}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <DollarSign className="w-8 h-8 text-yellow-500" />
                                {loading ? (
                                    <div className="w-16 h-5 bg-gray-700 rounded animate-pulse"></div>
                                ) : (
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        portfolioData?.totalPnL >= 0 
                                            ? 'bg-green-500/10 text-green-400' 
                                            : 'bg-red-500/10 text-red-400'
                                    }`}>
                                        {portfolioData ? formatPercent(portfolioData.totalPnLPercentage) : '+0%'}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mb-1">Portfolio Value</p>
                            {loading ? (
                                <div className="w-32 h-8 bg-gray-700 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-xl md:text-2xl font-bold text-white">
                                    {portfolioData ? formatCurrency(portfolioData.totalValue + portfolioData.cashBalance) : '$100,000'}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 * 0.1 }}
                        className="relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <i className="bx bx-bitcoin text-3xl text-purple-500"></i>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
                                    Crypto
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">Crypto Holdings</p>
                            {loading ? (
                                <div className="w-28 h-8 bg-gray-700 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-xl md:text-2xl font-bold text-white">
                                    {portfolioData ? formatCurrency(portfolioData.holdings?.filter((h: any) => h.type === 'CRYPTO').reduce((sum: number, h: any) => sum + h.currentValue, 0) || 0) : '$0.00'}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2 * 0.1 }}
                        className="relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <i className="bx bx-line-chart text-3xl text-cyan-500"></i>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400">
                                    Stocks
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">Stock Holdings</p>
                            {loading ? (
                                <div className="w-28 h-8 bg-gray-700 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-xl md:text-2xl font-bold text-white">
                                    {portfolioData ? formatCurrency(portfolioData.holdings?.filter((h: any) => h.type === 'STOCK').reduce((sum: number, h: any) => sum + h.currentValue, 0) || 0) : '$0.00'}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 3 * 0.1 }}
                        className="relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-green-500/20 hover:border-green-500/50 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <i className="bx bx-wallet text-3xl text-green-500"></i>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                                    Paper
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">Cash Balance</p>
                            {loading ? (
                                <div className="w-28 h-8 bg-gray-700 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-xl md:text-2xl font-bold text-white">
                                    {portfolioData ? formatCurrency(portfolioData.cashBalance) : '$100,000'}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Portfolio Quick View Section */}
                {portfolioData && portfolioData.holdings && portfolioData.holdings.length > 0 && (
                    <motion.section 
                        {...fadeInUp}
                        className="mb-12 relative"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/30">
                                    <BarChart3 className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                        Portfolio Overview
                                    </h2>
                                    <p className="text-gray-400 text-sm">Your current holdings and performance</p>
                                </div>
                            </div>
                            <a 
                                href="/dashboard/portfolio" 
                                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-yellow-500/30"
                            >
                                View Full Portfolio
                            </a>
                        </div>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
                            {/* Portfolio Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <h3 className="text-xs font-semibold text-gray-400">Total P&L</h3>
                                    </div>
                                    <p className={`text-xl font-bold ${portfolioData.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {formatCurrency(portfolioData.totalPnL)}
                                    </p>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Activity className="w-4 h-4 text-blue-400" />
                                        <h3 className="text-xs font-semibold text-gray-400">Total Assets</h3>
                                    </div>
                                    <p className="text-xl font-bold text-gray-100">{portfolioData.holdings.length}</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Target className="w-4 h-4 text-purple-400" />
                                        <h3 className="text-xs font-semibold text-gray-400">Stocks</h3>
                                    </div>
                                    <p className="text-xl font-bold text-gray-100">
                                        {portfolioData.holdings.filter((h: any) => h.type === 'STOCK').length}
                                    </p>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <i className="bx bx-bitcoin text-base text-cyan-400"></i>
                                        <h3 className="text-xs font-semibold text-gray-400">Crypto</h3>
                                    </div>
                                    <p className="text-xl font-bold text-gray-100">
                                        {portfolioData.holdings.filter((h: any) => h.type === 'CRYPTO').length}
                                    </p>
                                </div>
                            </div>

                            {/* Top Holdings Preview */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400">Symbol</th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400">Type</th>
                                            <th className="py-3 px-4 text-right text-xs font-semibold text-gray-400">Value</th>
                                            <th className="py-3 px-4 text-right text-xs font-semibold text-gray-400">P&L</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {portfolioData.holdings.slice(0, 5).map((holding: any) => (
                                            <tr key={`${holding.symbol}-${holding.type}`} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    <span className="font-semibold text-blue-400">{holding.symbol}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        holding.type === 'STOCK' 
                                                            ? 'bg-blue-900/30 text-blue-400' 
                                                            : 'bg-purple-900/30 text-purple-400'
                                                    }`}>
                                                        {holding.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right font-semibold text-gray-100">
                                                    {formatCurrency(holding.currentValue)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className={`font-semibold ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {formatCurrency(holding.pnl)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Base Integration Section - Featured */}
                <motion.section 
                    {...fadeInUp}
                    className="mb-12 relative"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                            <i className='bx bx-dollar text-2xl text-white'></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                                Base Chain Integration
                            </h2>
                            <p className="text-gray-400 text-sm">Connect your wallet and trade on Base L2</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
                        <BaseIntegration />
                    </div>
                </motion.section>

                {/* AI Trading Companion Section */}
                <motion.section
                    {...fadeInUp}
                    className="mb-12 relative"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/30">
                            <i className='bx bx-brain text-2xl text-black'></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                AI Trading Companion
                            </h2>
                            <p className="text-gray-400 text-sm">Get intelligent market insights powered by AI</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
                        <AITradingCompanion />
                    </div>
                </motion.section>

                {/* Stock-Crypto Swap Section */}
                <motion.section
                    {...fadeInUp}
                    className="mb-12 relative"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                            <i className='bx bx-transfer-alt text-2xl text-white'></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                                Stock ↔ Crypto Swap
                            </h2>
                            <p className="text-gray-400 text-sm">Revolutionary cross-asset trading on Base blockchain</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-orange-500/20 shadow-2xl shadow-orange-500/10">
                        <StockCryptoSwap />
                    </div>
                </motion.section>

                {/* Market Sentiment Section */}
                <motion.section 
                    {...fadeInUp}
                    className="mb-12 relative"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/30">
                            <i className='bx bx-bar-chart-alt-2 text-2xl text-white'></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                                Market Sentiment & Analysis
                            </h2>
                            <p className="text-gray-400 text-sm">Real-time fear & greed index and market trends</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                        <FearGreedIndex />
                    </div>
                </motion.section>

                {/* Market Overview Grid */}
                <motion.section 
                    {...fadeInUp}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                            <i className='bx bx-line-chart text-2xl text-white'></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                                Live Market Data
                            </h2>
                            <p className="text-gray-400 text-sm">Track global markets in real-time</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-green-500/20 shadow-2xl shadow-green-500/10"
                        >
                            <TradingViewWidget
                                title="Market Overview"
                                scriptUrl={`${scriptUrl}market-overview.js`}
                                config={MARKET_OVERVIEW_WIDGET_CONFIG}
                                className="custom-chart"
                                height={600}
                            />
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="xl:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-green-500/20 shadow-2xl shadow-green-500/10"
                        >
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}stock-heatmap.js`}
                                config={HEATMAP_WIDGET_CONFIG}
                                height={600}
                            />
                        </motion.div>
                    </div>
                </motion.section>

                {/* News & Market Quotes */}
                <motion.section 
                    {...fadeInUp}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                            <i className='bx bx-news text-2xl text-white'></i>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                                Market News & Quotes
                            </h2>
                            <p className="text-gray-400 text-sm">Stay updated with latest market movements</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-orange-500/20 shadow-2xl shadow-orange-500/10"
                        >
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}timeline.js`}
                                config={TOP_STORIES_WIDGET_CONFIG}
                                height={600}
                            />
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="xl:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-orange-500/20 shadow-2xl shadow-orange-500/10"
                        >
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}market-quotes.js`}
                                config={MARKET_DATA_WIDGET_CONFIG}
                                height={600}
                            />
                        </motion.div>
                    </div>
                </motion.section>

                {/* Footer CTA */}
                <motion.div 
                    {...fadeInUp}
                    className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10"
                >
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        Ready to start trading?
                    </h3>
                    <p className="text-gray-400 mb-6">Explore your portfolio, set alerts, or connect to Base DeFi</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="/dashboard/portfolio" className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-yellow-500/30">
                            View Portfolio
                        </a>
                        <a href="/dashboard/watchlist" className="px-8 py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-full hover:bg-yellow-500/10 transition-all duration-300">
                            Set Alerts
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Home;
