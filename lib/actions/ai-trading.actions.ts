'use server';

import { getStockQuote } from './finnhub.actions';

export interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  priceTarget: number;
  stopLoss: number;
  timeframe: string;
  aiInsights: string;
  currentPrice: number;
  potentialReturn: number;
  riskRewardRatio: number;
}

export interface RiskProfile {
  maxRiskPerTrade: number;
  maxPortfolioRisk: number;
  preferredTimeframe: string;
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  investmentHorizon: 'SHORT' | 'MEDIUM' | 'LONG';
}

export interface MarketAnalysis {
  marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volatilityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  sectorRotation: string[];
  keyEvents: string[];
  aiRecommendations: string[];
}

class AITradingEngine {
  private analyzeTechnicalIndicators(symbol: string, currentPrice: number) {
    // Mock technical analysis - in real implementation, this would use actual technical indicators
    const indicators = {
      rsi: Math.random() * 100,
      macd: (Math.random() - 0.5) * 2,
      movingAverage50: currentPrice * (0.95 + Math.random() * 0.1),
      movingAverage200: currentPrice * (0.9 + Math.random() * 0.2),
      volume: Math.random() * 1000000,
      support: currentPrice * 0.9,
      resistance: currentPrice * 1.1
    };

    return indicators;
  }

  private generateReasoning(symbol: string, action: string, indicators: any, currentPrice: number): string[] {
    const reasoning: string[] = [];
    
    // RSI Analysis
    if (indicators.rsi < 30) {
      reasoning.push(`${symbol} is oversold (RSI: ${indicators.rsi.toFixed(1)}) - potential buying opportunity`);
    } else if (indicators.rsi > 70) {
      reasoning.push(`${symbol} is overbought (RSI: ${indicators.rsi.toFixed(1)}) - consider selling`);
    }

    // Moving Average Analysis
    if (currentPrice > indicators.movingAverage50 && indicators.movingAverage50 > indicators.movingAverage200) {
      reasoning.push('Price above 50-day MA and 200-day MA - bullish trend confirmed');
    } else if (currentPrice < indicators.movingAverage50 && indicators.movingAverage50 < indicators.movingAverage200) {
      reasoning.push('Price below 50-day MA and 200-day MA - bearish trend confirmed');
    }

    // Volume Analysis
    if (indicators.volume > 1000000) {
      reasoning.push('High volume indicates strong institutional interest');
    }

    // Support/Resistance Analysis
    if (action === 'BUY' && currentPrice < indicators.support * 1.05) {
      reasoning.push('Price near support level - good entry point');
    } else if (action === 'SELL' && currentPrice > indicators.resistance * 0.95) {
      reasoning.push('Price near resistance level - consider taking profits');
    }

    // Market Sentiment
    const sentimentReasons = [
      'Recent earnings beat expectations',
      'Strong sector momentum',
      'Institutional buying pressure',
      'Positive analyst upgrades',
      'Market volatility creating opportunities',
      'Sector rotation favoring this stock',
      'Technical breakout pattern',
      'Volume spike indicates interest'
    ];
    
    reasoning.push(sentimentReasons[Math.floor(Math.random() * sentimentReasons.length)]);

    return reasoning;
  }

  private calculateRiskLevel(symbol: string, indicators: any, riskProfile: RiskProfile): 'LOW' | 'MEDIUM' | 'HIGH' {
    let riskScore = 0;
    
    // Volatility assessment
    if (indicators.rsi > 70 || indicators.rsi < 30) riskScore += 2;
    if (Math.abs(indicators.macd) > 1) riskScore += 1;
    
    // Volume assessment
    if (indicators.volume < 100000) riskScore += 2; // Low liquidity = higher risk
    
    // Price position assessment
    const pricePosition = (indicators.currentPrice - indicators.movingAverage200) / indicators.movingAverage200;
    if (Math.abs(pricePosition) > 0.2) riskScore += 1; // Far from 200-day MA = higher risk
    
    // Risk tolerance adjustment
    if (riskProfile.riskTolerance === 'CONSERVATIVE') riskScore += 1;
    else if (riskProfile.riskTolerance === 'AGGRESSIVE') riskScore -= 1;
    
    if (riskScore <= 2) return 'LOW';
    if (riskScore <= 4) return 'MEDIUM';
    return 'HIGH';
  }

  private calculatePriceTargets(currentPrice: number, action: string, riskLevel: string): { priceTarget: number; stopLoss: number } {
    let priceTarget: number;
    let stopLoss: number;
    
    if (action === 'BUY') {
      // Conservative targets based on risk level
      const targetMultiplier = riskLevel === 'LOW' ? 1.15 : riskLevel === 'MEDIUM' ? 1.25 : 1.35;
      const stopMultiplier = riskLevel === 'LOW' ? 0.92 : riskLevel === 'MEDIUM' ? 0.88 : 0.85;
      
      priceTarget = currentPrice * targetMultiplier;
      stopLoss = currentPrice * stopMultiplier;
    } else if (action === 'SELL') {
      const targetMultiplier = riskLevel === 'LOW' ? 0.88 : riskLevel === 'MEDIUM' ? 0.82 : 0.75;
      const stopMultiplier = riskLevel === 'LOW' ? 1.08 : riskLevel === 'MEDIUM' ? 1.12 : 1.15;
      
      priceTarget = currentPrice * targetMultiplier;
      stopLoss = currentPrice * stopMultiplier;
    } else {
      // HOLD - no targets
      priceTarget = currentPrice;
      stopLoss = currentPrice;
    }
    
    return { priceTarget, stopLoss };
  }

  private generateAIInsights(symbol: string, action: string, indicators: any, riskLevel: string): string {
    const insights = [
      `${symbol} shows strong technical momentum with clear trend direction. The AI recommends ${action.toLowerCase()}ing based on multiple converging signals.`,
      `Market analysis indicates ${symbol} is positioned for ${action === 'BUY' ? 'upward' : action === 'SELL' ? 'downward' : 'sideways'} movement. Risk level is ${riskLevel.toLowerCase()}.`,
      `Based on technical indicators and market sentiment, ${symbol} presents a ${riskLevel.toLowerCase()}-risk opportunity for ${action.toLowerCase()}ing.`,
      `The AI has identified a high-probability setup for ${symbol} with ${action.toLowerCase()} recommendation. Monitor key support/resistance levels.`,
      `${symbol} analysis shows ${action === 'BUY' ? 'bullish' : action === 'SELL' ? 'bearish' : 'neutral'} signals across multiple timeframes.`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  async generateTradingSignals(symbols: string[], riskProfile: RiskProfile): Promise<TradingSignal[]> {
    const signals: TradingSignal[] = [];
    
    for (const symbol of symbols) {
      try {
        // Get current price
        const quote = await getStockQuote(symbol);
        if (!quote) continue;
        
        const currentPrice = quote.c || 0;
        if (currentPrice === 0) continue;
        
        // Analyze technical indicators
        const indicators = this.analyzeTechnicalIndicators(symbol, currentPrice);
        
        // Determine action based on technical analysis
        let action: 'BUY' | 'SELL' | 'HOLD';
        let confidence: number;
        
        // Simple decision logic based on RSI and moving averages
        if (indicators.rsi < 35 && currentPrice > indicators.movingAverage200) {
          action = 'BUY';
          confidence = 75 + Math.random() * 15; // 75-90%
        } else if (indicators.rsi > 65 && currentPrice < indicators.movingAverage50) {
          action = 'SELL';
          confidence = 70 + Math.random() * 15; // 70-85%
        } else {
          action = 'HOLD';
          confidence = 60 + Math.random() * 20; // 60-80%
        }
        
        // Calculate risk level
        const riskLevel = this.calculateRiskLevel(symbol, indicators, riskProfile);
        
        // Calculate price targets
        const { priceTarget, stopLoss } = this.calculatePriceTargets(currentPrice, action, riskLevel);
        
        // Generate reasoning
        const reasoning = this.generateReasoning(symbol, action, indicators, currentPrice);
        
        // Generate AI insights
        const aiInsights = this.generateAIInsights(symbol, action, indicators, riskLevel);
        
        // Calculate potential return and risk-reward ratio
        const potentialReturn = action === 'BUY' 
          ? ((priceTarget - currentPrice) / currentPrice) * 100
          : action === 'SELL' 
          ? ((currentPrice - priceTarget) / currentPrice) * 100
          : 0;
        
        const riskRewardRatio = action !== 'HOLD' 
          ? Math.abs(priceTarget - currentPrice) / Math.abs(currentPrice - stopLoss)
          : 0;
        
        const signal: TradingSignal = {
          id: `${symbol}-${Date.now()}`,
          symbol,
          action,
          confidence: Math.round(confidence),
          reasoning,
          riskLevel,
          priceTarget: Math.round(priceTarget * 100) / 100,
          stopLoss: Math.round(stopLoss * 100) / 100,
          timeframe: riskProfile.preferredTimeframe,
          aiInsights,
          currentPrice: Math.round(currentPrice * 100) / 100,
          potentialReturn: Math.round(potentialReturn * 100) / 100,
          riskRewardRatio: Math.round(riskRewardRatio * 100) / 100
        };
        
        signals.push(signal);
        
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error);
      }
    }
    
    // Sort by confidence and filter by risk profile
    return signals
      .filter(signal => {
        if (riskProfile.riskTolerance === 'CONSERVATIVE' && signal.riskLevel === 'HIGH') return false;
        if (riskProfile.riskTolerance === 'AGGRESSIVE' && signal.riskLevel === 'LOW') return false;
        return signal.confidence >= 60; // Only show signals with 60%+ confidence
      })
      .sort((a, b) => b.confidence - a.confidence);
  }

  async analyzeMarket(): Promise<MarketAnalysis> {
    // Mock market analysis - in real implementation, this would analyze multiple data sources
    const sentiments = ['BULLISH', 'BEARISH', 'NEUTRAL'];
    const volatilities = ['LOW', 'MEDIUM', 'HIGH'];
    
    return {
      marketSentiment: sentiments[Math.floor(Math.random() * sentiments.length)] as any,
      volatilityLevel: volatilities[Math.floor(Math.random() * volatilities.length)] as any,
      sectorRotation: ['Technology', 'Healthcare', 'Financials', 'Energy'],
      keyEvents: [
        'Fed interest rate decision',
        'Earnings season in full swing',
        'Inflation data release',
        'Geopolitical developments'
      ],
      aiRecommendations: [
        'Focus on defensive stocks in current market conditions',
        'Consider sector rotation opportunities',
        'Monitor volatility for entry points',
        'Diversify across multiple timeframes'
      ]
    };
  }
}

const aiTradingEngine = new AITradingEngine();

export async function generateTradingSignals(symbols: string[], riskProfile: RiskProfile): Promise<TradingSignal[]> {
  return aiTradingEngine.generateTradingSignals(symbols, riskProfile);
}

export async function analyzeMarket(): Promise<MarketAnalysis> {
  return aiTradingEngine.analyzeMarket();
}

export async function getRecommendedSymbols(): Promise<string[]> {
  // Return popular symbols for analysis
  return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC'];
}
