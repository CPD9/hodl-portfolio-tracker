'use server';

import { connectToDatabase } from '@/database/mongoose';
import Portfolio from '@/database/models/portfolio.model';
import Transaction from '@/database/models/transaction.model';
import UserBalance from '@/database/models/user-balance.model';
import { Watchlist } from '@/database/models/watchlist.model';
import UserContext from '@/database/models/user-context.model';
import OpenAI from 'openai';
import crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UserData {
  portfolio: any[];
  transactions: any[];
  watchlist: any[];
  balance: any;
}

/**
 * Generates a hash from user data to detect changes
 */
function generateDataHash(userData: UserData): string {
  const dataString = JSON.stringify(userData);
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

/**
 * Fetches all user data from the database
 */
async function fetchUserData(userId: string): Promise<UserData> {
  await connectToDatabase();

  const [portfolio, transactions, watchlist, balance] = await Promise.all([
    Portfolio.find({ userId }).lean(),
    Transaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50) // Get last 50 transactions
      .lean(),
    Watchlist.find({ userId }).lean(),
    UserBalance.findOne({ userId }).lean(),
  ]);

  return {
    portfolio: portfolio || [],
    transactions: transactions || [],
    watchlist: watchlist || [],
    balance: balance || null,
  };
}

/**
 * Generates a context summary using OpenAI
 */
async function generateContextSummary(userData: UserData): Promise<string> {
  const portfolioSummary = userData.portfolio.map(p => 
    `${p.symbol} (${p.type}): ${p.quantity} units @ $${p.avgPrice}, PnL: ${p.pnlPercentage.toFixed(2)}%`
  ).join(', ') || 'No positions';

  const recentTrades = userData.transactions.slice(0, 10).map(t => 
    `${t.action} ${t.quantity} ${t.symbol} @ $${t.price}`
  ).join(', ') || 'No trades';

  const watchlistSymbols = userData.watchlist.map(w => w.symbol).join(', ') || 'Empty watchlist';

  const balanceInfo = userData.balance 
    ? `Paper balance: $${userData.balance.paperBalance.toFixed(2)}, Total P&L: $${userData.balance.totalPnL.toFixed(2)}, Win rate: ${userData.balance.winRate.toFixed(1)}%`
    : 'No balance data';

  const prompt = `Analyze the following user's investment data and create a concise context summary (max 250 words) that captures their investment profile, preferences, risk tolerance, and trading behavior. This will be used as context for an AI trading assistant.

Portfolio: ${portfolioSummary}
Recent Trades (last 10): ${recentTrades}
Watchlist: ${watchlistSymbols}
Performance: ${balanceInfo}

Provide a summary that includes:
- Investment preferences (stocks vs crypto, sectors)
- Trading style (active trader vs passive investor)
- Risk profile (based on holdings and trades)
- Areas of interest
- Current performance and position status

Keep it factual, concise, and useful for personalized recommendations.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an investment analyst creating concise user profiles for personalized financial advice.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.5,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate context summary.';
  } catch (error) {
    console.error('Error generating context summary:', error);
    return 'User context unavailable due to generation error.';
  }
}

/**
 * Gets or generates user context for the AI chatbot
 * Only regenerates if data has changed since last generation
 */
export async function getUserContext(userId: string): Promise<string> {
  try {
    await connectToDatabase();

    // Fetch current user data
    const userData = await fetchUserData(userId);
    const currentDataHash = generateDataHash(userData);

    // Check if we have an existing context
    const existingContext = await UserContext.findOne({ userId });

    // If context exists and data hasn't changed, return cached context
    if (existingContext && existingContext.dataHash === currentDataHash) {
      console.log(`Using cached context for user ${userId}`);
      return existingContext.contextSummary;
    }

    // Generate new context
    console.log(`Generating new context for user ${userId}`);
    const contextSummary = await generateContextSummary(userData);

    // Save or update the context
    if (existingContext) {
      existingContext.contextSummary = contextSummary;
      existingContext.dataHash = currentDataHash;
      existingContext.lastUpdated = new Date();
      await existingContext.save();
    } else {
      await UserContext.create({
        userId,
        contextSummary,
        dataHash: currentDataHash,
        lastUpdated: new Date(),
      });
    }

    return contextSummary;
  } catch (error) {
    console.error('Error getting user context:', error);
    return 'User context unavailable.';
  }
}

/**
 * Forces a refresh of user context (useful for manual triggers)
 */
export async function refreshUserContext(userId: string): Promise<string> {
  try {
    await connectToDatabase();

    const userData = await fetchUserData(userId);
    const currentDataHash = generateDataHash(userData);
    const contextSummary = await generateContextSummary(userData);

    await UserContext.findOneAndUpdate(
      { userId },
      {
        userId,
        contextSummary,
        dataHash: currentDataHash,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    return contextSummary;
  } catch (error) {
    console.error('Error refreshing user context:', error);
    return 'User context unavailable.';
  }
}
