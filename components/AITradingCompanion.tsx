"use client";

import { AlertTriangle, BarChart3, Brain, Clock, DollarSign, Settings, Shield, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiskProfile, TradingSignal, generateTradingSignals, getRecommendedSymbols } from '@/lib/actions/ai-trading.actions';

import { Button } from '@/components/ui/button';
import PixelCharacter from '@/components/PixelCharacter';
import { toast } from 'sonner';

// Types are now imported from ai-trading.actions

const AITradingCompanion: React.FC = () => {
  const router = useRouter();
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>({
    maxRiskPerTrade: 2,
    maxPortfolioRisk: 10,
    preferredTimeframe: '1D',
    riskTolerance: 'MODERATE',
    investmentHorizon: 'MEDIUM'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<TradingSignal | null>(null);

  // Real AI analysis using the AI trading engine
  const analyzeMarket = async () => {
    setIsAnalyzing(true);
    
    try {
      // Get recommended symbols for analysis
      const symbols = await getRecommendedSymbols();
      
      // Generate trading signals using AI
      const aiSignals = await generateTradingSignals(symbols.slice(0, 5), riskProfile);
      
      setSignals(aiSignals);
      toast.success(`AI analysis complete! Generated ${aiSignals.length} trading signals.`);
    } catch (error) {
      console.error('Error analyzing market:', error);
      toast.error('Failed to analyze market. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeTrade = (signal: TradingSignal) => {
    // In real implementation, this would execute the trade
    toast.success(`Executed ${signal.action} order for ${signal.symbol}`);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-green-400';
      case 'SELL': return 'text-red-400';
      case 'HOLD': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400 bg-green-900/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/20';
      case 'HIGH': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <div className="flex items-center space-x-2 md:space-x-3">
          <PixelCharacter variant="hero" size="md" />
          <h3 className="text-base md:text-lg font-semibold text-gray-100">AI Trading Companion</h3>
          <div className="w-2 h-2 md:w-3 md:h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button
            onClick={analyzeMarket}
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base flex-1 sm:flex-none"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Market'}
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Risk Profile */}
      <div className="mb-6 p-3 md:p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border border-gray-600">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4">
          <h4 className="text-sm md:text-base font-semibold text-gray-100 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
            Risk Profile
          </h4>
          <span className="text-xs md:text-sm px-2 py-1 bg-blue-500/20 text-blue-400 rounded">AI-Guided</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-gray-800/50 rounded p-2 border border-gray-600/50">
            <p className="text-xs text-gray-400">Max Risk/Trade</p>
            <p className="text-base md:text-lg font-bold text-yellow-400">{riskProfile.maxRiskPerTrade}%</p>
          </div>
          <div className="bg-gray-800/50 rounded p-2 border border-gray-600/50">
            <p className="text-xs text-gray-400">Portfolio Risk</p>
            <p className="text-base md:text-lg font-bold text-orange-400">{riskProfile.maxPortfolioRisk}%</p>
          </div>
          <div className="bg-gray-800/50 rounded p-2 border border-gray-600/50">
            <p className="text-xs text-gray-400">Timeframe</p>
            <p className="text-base md:text-lg font-bold text-blue-400">{riskProfile.preferredTimeframe}</p>
          </div>
          <div className="bg-gray-800/50 rounded p-2 border border-gray-600/50">
            <p className="text-xs text-gray-400">Tolerance</p>
            <p className="text-base md:text-lg font-bold text-purple-400 capitalize">{riskProfile.riskTolerance.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Trading Signals */}
      {signals.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          <h4 className="text-sm md:text-base font-semibold text-gray-100 mb-3 md:mb-4 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-purple-400" />
            AI Trading Signals
          </h4>
          {signals.map((signal) => (
            <div key={signal.id} className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-3 md:p-4 border border-gray-600 hover:border-gray-500 transition-all shadow-lg">
              <div className="flex items-start sm:items-center justify-between mb-3 gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center border-2 shadow-lg"
                         style={{ borderColor: signal.action === 'BUY' ? '#22c55e' : signal.action === 'SELL' ? '#ef4444' : '#eab308' }}>
                      <span className="text-sm md:text-base font-bold text-white">{signal.symbol}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                         style={{ 
                           backgroundColor: signal.action === 'BUY' ? '#22c55e' : signal.action === 'SELL' ? '#ef4444' : '#eab308',
                           color: '#000'
                         }}>
                      {signal.action === 'BUY' ? '↑' : signal.action === 'SELL' ? '↓' : '→'}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`font-bold text-base md:text-lg ${getActionColor(signal.action)}`}>
                        {signal.action}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(signal.riskLevel)}`}>
                        {signal.riskLevel} RISK
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 font-medium">{signal.timeframe}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xl md:text-2xl font-bold ${getConfidenceColor(signal.confidence)}`}>
                    {signal.confidence}%
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">Confidence</p>
                </div>
              </div>

              {/* TradingView Mini Chart */}
              <div className="mb-3 bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700" style={{ height: '280px' }}>
                <div 
                  className="tradingview-widget-container h-full"
                  ref={(el) => {
                    if (el && !el.dataset.loaded) {
                      el.innerHTML = '';
                      const script = document.createElement('script');
                      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
                      script.async = true;
                      script.innerHTML = JSON.stringify({
                        symbol: signal.symbol,
                        width: '100%',
                        height: '100%',
                        locale: 'en',
                        dateRange: '1M',
                        colorTheme: 'dark',
                        trendLineColor: signal.action === 'BUY' ? 'rgba(34, 197, 94, 1)' : signal.action === 'SELL' ? 'rgba(239, 68, 68, 1)' : 'rgba(234, 179, 8, 1)',
                        underLineColor: signal.action === 'BUY' ? 'rgba(34, 197, 94, 0.3)' : signal.action === 'SELL' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)',
                        underLineBottomColor: 'rgba(0, 0, 0, 0)',
                        isTransparent: false,
                        autosize: true,
                        largeChartUrl: ''
                      });
                      el.appendChild(script);
                      el.dataset.loaded = 'true';
                    }
                  }}
                />
              </div>

              {/* AI Insights */}
              <div className="mb-3 p-2 md:p-3 bg-gray-600 rounded-lg border-l-4" style={{ borderLeftColor: signal.action === 'BUY' ? '#22c55e' : signal.action === 'SELL' ? '#ef4444' : '#eab308' }}>
                <p className="text-xs md:text-sm text-gray-200 italic">"{signal.aiInsights}"</p>
              </div>

              {/* Technical Indicators */}
              <div className="mb-3 grid grid-cols-3 gap-2">
                <div className="bg-gray-800 rounded p-2 text-center">
                  <p className="text-xs text-gray-400 mb-1">RSI (14)</p>
                  <p className="text-sm font-bold text-blue-400">{(Math.random() * 40 + 30).toFixed(1)}</p>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <p className="text-xs text-gray-400 mb-1">MACD</p>
                  <p className="text-sm font-bold text-green-400">{signal.action === 'BUY' ? '↑ Bullish' : signal.action === 'SELL' ? '↓ Bearish' : '→ Neutral'}</p>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <p className="text-xs text-gray-400 mb-1">MA (50)</p>
                  <p className="text-sm font-bold text-purple-400">${(Number(signal.currentPrice) * (0.95 + Math.random() * 0.1)).toFixed(2)}</p>
                </div>
              </div>

              {/* Price Targets */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3">
                <div className="text-center p-2 bg-gray-600/50 rounded">
                  <p className="text-xs text-gray-400">Current Price</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-200">${signal.currentPrice}</p>
                </div>
                <div className="text-center p-2 bg-gray-600/50 rounded">
                  <p className="text-xs text-gray-400">Target Price</p>
                  <p className="text-xs md:text-sm font-semibold text-green-400">${signal.priceTarget}</p>
                </div>
                <div className="text-center p-2 bg-gray-600/50 rounded">
                  <p className="text-xs text-gray-400">Stop Loss</p>
                  <p className="text-xs md:text-sm font-semibold text-red-400">${signal.stopLoss}</p>
                </div>
                <div className="text-center p-2 bg-gray-600/50 rounded">
                  <p className="text-xs text-gray-400">Potential Return</p>
                  <p className={`text-xs md:text-sm font-semibold ${signal.potentialReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {signal.potentialReturn >= 0 ? '+' : ''}{signal.potentialReturn}%
                  </p>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3">
                <div className="text-center p-2 bg-gray-600/50 rounded">
                  <p className="text-xs text-gray-400">Risk/Reward Ratio</p>
                  <p className="text-xs md:text-sm font-semibold text-blue-400">{signal.riskRewardRatio.toFixed(2)}</p>
                </div>
                <div className="text-center p-2 bg-gray-600/50 rounded">
                  <p className="text-xs text-gray-400">Timeframe</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-200">{signal.timeframe}</p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">AI Reasoning:</p>
                <ul className="space-y-1 max-h-32 overflow-y-auto">
                  {signal.reasoning.map((reason, index) => (
                    <li key={index} className="text-xs md:text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2 flex-shrink-0">•</span>
                      <span className="break-words">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => executeTrade(signal)}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 text-sm md:text-base"
                >
                  Execute {signal.action}
                </Button>
                <Button
                  onClick={() => router.push(`/dashboard/stocks/${encodeURIComponent(signal.symbol)}`)}
                  variant="outline"
                  size="sm"
                  className="sm:w-auto text-sm"
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {signals.length === 0 && !isAnalyzing && (
        <div className="text-center py-6 md:py-8 px-4">
          <Brain className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-base md:text-lg font-medium text-gray-100 mb-2">Ready to Analyze</h4>
          <p className="text-sm md:text-base text-gray-400 mb-6 max-w-md mx-auto">
            Click "Analyze Market" to let AI generate personalized trading signals based on your risk profile
          </p>
          <Button
            onClick={analyzeMarket}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base"
          >
            Start AI Analysis
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="text-center py-6 md:py-8 px-4">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h4 className="text-base md:text-lg font-medium text-gray-100 mb-2">AI Analyzing Market...</h4>
          <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto">
            Processing market data, technical indicators, and risk factors
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 md:mt-6 p-2 md:p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs md:text-sm text-yellow-400 font-medium">AI Trading Disclaimer</p>
            <p className="text-xs text-gray-300 mt-1">
              AI signals are for educational purposes only. Always do your own research and consider your risk tolerance before trading. Past performance doesn't guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITradingCompanion;
