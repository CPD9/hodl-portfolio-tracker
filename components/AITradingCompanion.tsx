"use client";

import { AlertTriangle, BarChart3, Brain, Clock, DollarSign, Settings, Shield, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { RiskProfile, TradingSignal, generateTradingSignals, getRecommendedSymbols } from '@/lib/actions/ai-trading.actions';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Types are now imported from ai-trading.actions

const AITradingCompanion: React.FC = () => {
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
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-100">AI Trading Companion</h3>
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={analyzeMarket}
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Market'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Risk Profile */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-100 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-400" />
            Risk Profile
          </h4>
          <span className="text-sm text-gray-400">AI-Guided</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400">Max Risk/Trade</p>
            <p className="text-sm text-gray-100">{riskProfile.maxRiskPerTrade}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Portfolio Risk</p>
            <p className="text-sm text-gray-100">{riskProfile.maxPortfolioRisk}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Timeframe</p>
            <p className="text-sm text-gray-100">{riskProfile.preferredTimeframe}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Tolerance</p>
            <p className="text-sm text-gray-100 capitalize">{riskProfile.riskTolerance.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Trading Signals */}
      {signals.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-100 mb-4">AI Trading Signals</h4>
          {signals.map((signal) => (
            <div key={signal.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-200">{signal.symbol}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${getActionColor(signal.action)}`}>
                        {signal.action}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getRiskColor(signal.riskLevel)}`}>
                        {signal.riskLevel} RISK
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{signal.timeframe}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getConfidenceColor(signal.confidence)}`}>
                    {signal.confidence}%
                  </p>
                  <p className="text-xs text-gray-400">Confidence</p>
                </div>
              </div>

              {/* AI Insights */}
              <div className="mb-3 p-3 bg-gray-600 rounded-lg">
                <p className="text-sm text-gray-200 italic">"{signal.aiInsights}"</p>
              </div>

              {/* Price Targets */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Current Price</p>
                  <p className="text-sm font-semibold text-gray-200">${signal.currentPrice}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Target Price</p>
                  <p className="text-sm font-semibold text-green-400">${signal.priceTarget}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Stop Loss</p>
                  <p className="text-sm font-semibold text-red-400">${signal.stopLoss}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Potential Return</p>
                  <p className={`text-sm font-semibold ${signal.potentialReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {signal.potentialReturn >= 0 ? '+' : ''}{signal.potentialReturn}%
                  </p>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Risk/Reward Ratio</p>
                  <p className="text-sm font-semibold text-blue-400">{signal.riskRewardRatio.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Timeframe</p>
                  <p className="text-sm font-semibold text-gray-200">{signal.timeframe}</p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">AI Reasoning:</p>
                <ul className="space-y-1">
                  {signal.reasoning.map((reason, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => executeTrade(signal)}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  Execute {signal.action}
                </Button>
                <Button
                  onClick={() => setSelectedSignal(signal)}
                  variant="outline"
                  size="sm"
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
        <div className="text-center py-8">
          <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-100 mb-2">Ready to Analyze</h4>
          <p className="text-gray-400 mb-6">
            Click "Analyze Market" to let AI generate personalized trading signals based on your risk profile
          </p>
          <Button
            onClick={analyzeMarket}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Start AI Analysis
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h4 className="text-lg font-medium text-gray-100 mb-2">AI Analyzing Market...</h4>
          <p className="text-gray-400">
            Processing market data, technical indicators, and risk factors
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-400 font-medium">AI Trading Disclaimer</p>
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
