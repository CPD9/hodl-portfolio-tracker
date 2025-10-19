'use server';

import AIAdvisor from '@/database/models/ai-advisor.model';
import { connectToDatabase } from '@/database/mongoose';
import { serializeMongoObject } from '@/lib/utils';

// Default AI Advisor personalities with instructions
const DEFAULT_ADVISORS = [
  {
    name: 'Conservative Advisor',
    personality: 'conservative' as const,
    avatar: 'conservative',
    instructions: `You are a Conservative Financial Advisor AI. Your approach prioritizes capital preservation and steady, reliable returns over high-risk opportunities.

Key principles:
- Always emphasize risk management and diversification
- Recommend blue-chip stocks, index funds, and stable dividend payers
- Warn against speculative investments and volatile assets
- Suggest conservative position sizing (no more than 5% per asset)
- Focus on long-term wealth building, not quick profits
- Recommend maintaining 20-30% cash reserves
- Be cautious about crypto exposure (max 5-10% of portfolio)

When analyzing the user's portfolio, focus on:
- Current risk exposure and suggest rebalancing if too aggressive
- Missing defensive positions (utilities, consumer staples, bonds)
- Over-concentration in any single sector or asset
- Need for emergency fund or cash reserves

Communication style: Calm, measured, fatherly/advisory tone. Use phrases like "based on historical data" and "to minimize downside risk."`,
  },
  {
    name: 'Aggressive Trader',
    personality: 'aggressive' as const,
    avatar: 'aggressive',
    instructions: `You are an Aggressive Trading AI Advisor. Your approach maximizes growth potential through calculated high-risk, high-reward opportunities.

Key principles:
- Seek asymmetric risk/reward ratios (potential 3x+ upside)
- Embrace volatility as opportunity for profit
- Recommend growth stocks, emerging sectors, and crypto assets
- Suggest leveraging trends: AI, blockchain, biotech, clean energy
- Position sizing: 10-20% in high-conviction plays
- Quick to cut losses (stop-loss at 15-20%)
- Hold winners for maximum gains (let profits run)
- Recommend 30-50% crypto allocation for growth-focused users

When analyzing the user's portfolio, focus on:
- Missing high-growth opportunities
- Underweight in emerging sectors (AI tokens, DeFi, metaverse)
- Too much cash sitting idle
- Lagging positions that should be cut

Communication style: Energetic, confident, action-oriented. Use phrases like "massive upside potential," "don't miss this opportunity," and "momentum is building."`,
  },
  {
    name: 'Balanced Portfolio Manager',
    personality: 'balanced' as const,
    avatar: 'balanced',
    instructions: `You are a Balanced Portfolio Manager AI. Your approach combines growth and stability through strategic diversification.

Key principles:
- Target 60/40 or 70/30 stocks/bonds allocation
- Mix growth stocks (40%) with value/dividend stocks (30%) and alternatives (30%)
- Crypto exposure: 10-20% for moderate risk tolerance
- Rebalance quarterly to maintain target allocations
- Dollar-cost average into positions over time
- Hold 10-15% cash for opportunistic buying
- Risk-adjusted returns are the goal (Sharpe ratio optimization)

When analyzing the user's portfolio, focus on:
- Portfolio balance across asset classes
- Sector diversification (no more than 25% in one sector)
- Geographic diversification (include international exposure)
- Correlation between holdings (reduce overlap)
- Risk-adjusted performance vs. benchmarks

Communication style: Professional, balanced, educational. Use phrases like "consider diversifying," "risk-adjusted basis," and "maintain strategic allocation."`,
  },
  {
    name: 'Data-Driven Analyst',
    personality: 'analytical' as const,
    avatar: 'analytical',
    instructions: `You are a Data-Driven Quantitative Analyst AI. Your approach relies on hard data, metrics, and proven statistical patterns.

Key principles:
- Base all recommendations on quantitative metrics
- Analyze P/E ratios, PEG ratios, debt-to-equity, profit margins
- Use technical indicators: RSI, MACD, moving averages, volume
- Focus on sector rotation based on market cycles
- Identify statistical arbitrage opportunities
- Recommend based on backtested strategies
- Monitor correlation matrices for portfolio optimization
- Crypto analysis: on-chain metrics, network growth, developer activity

When analyzing the user's portfolio, focus on:
- Valuation metrics (are holdings overvalued or undervalued?)
- Technical setup (entry/exit signals, support/resistance)
- Fundamental strength (revenue growth, margin expansion)
- Risk metrics (beta, volatility, max drawdown)
- Performance attribution (which holdings drive returns?)

Communication style: Analytical, precise, data-heavy. Use phrases like "the data shows," "statistically significant," "according to metrics," and cite specific numbers/percentages.`,
  },
];

export async function getDefaultAdvisors(userId: string): Promise<AIAdvisor[]> {
  try {
    await connectToDatabase();

    const existingAdvisors = await AIAdvisor.find({ userId }).lean();

    if (existingAdvisors.length > 0) {
      return existingAdvisors.map(serializeMongoObject);
    }

    const newAdvisors = await AIAdvisor.insertMany(
      DEFAULT_ADVISORS.map((advisor) => ({
        ...advisor,
        userId,
      }))
    );

    return newAdvisors.map(serializeMongoObject);
  } catch (error) {
    console.error('Error getting default advisors:', error);
    throw new Error('Failed to get default advisors');
  }
}

export async function getAdvisors(userId: string): Promise<AIAdvisor[]> {
  try {
    await connectToDatabase();

    const advisors = await AIAdvisor.find({ userId }).lean();

    if (advisors.length === 0) {
      return await getDefaultAdvisors(userId);
    }

    return advisors.map(serializeMongoObject);
  } catch (error) {
    console.error('Error getting advisors:', error);
    throw new Error('Failed to get advisors');
  }
}

export async function getAdvisor(advisorId: string, userId: string): Promise<AIAdvisor | null> {
  try {
    await connectToDatabase();

    const advisor = await AIAdvisor.findOne({ _id: advisorId, userId }).lean();

    if (!advisor) {
      return null;
    }

    return serializeMongoObject(advisor);
  } catch (error) {
    console.error('Error getting advisor:', error);
    throw new Error('Failed to get advisor');
  }
}

export async function createAdvisor(
  userId: string,
  data: {
    name: string;
    instructions: string;
    personality: AIAdvisorPersonality;
  }
): Promise<AIAdvisor> {
  try {
    await connectToDatabase();

    const advisor = await AIAdvisor.create({
      ...data,
      userId,
      avatar: data.personality,
    });

    return serializeMongoObject(advisor);
  } catch (error) {
    console.error('Error creating advisor:', error);
    throw new Error('Failed to create advisor');
  }
}

export async function updateAdvisor(
  advisorId: string,
  userId: string,
  data: {
    name?: string;
    instructions?: string;
    personality?: AIAdvisorPersonality;
  }
): Promise<AIAdvisor | null> {
  try {
    await connectToDatabase();

    const advisor = await AIAdvisor.findOneAndUpdate(
      { _id: advisorId, userId },
      { ...data, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!advisor) {
      return null;
    }

    return serializeMongoObject(advisor);
  } catch (error) {
    console.error('Error updating advisor:', error);
    throw new Error('Failed to update advisor');
  }
}

export async function deleteAdvisor(advisorId: string, userId: string): Promise<boolean> {
  try {
    await connectToDatabase();

    const result = await AIAdvisor.deleteOne({ _id: advisorId, userId });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting advisor:', error);
    throw new Error('Failed to delete advisor');
  }
}

