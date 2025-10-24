'use server';

import OpenAI from 'openai';
import Portfolio from '@/database/models/portfolio.model';
import Transaction from '@/database/models/transaction.model';
import UserBalance from '@/database/models/user-balance.model';
import UserContext from '@/database/models/user-context.model';
import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';
import crypto from 'crypto';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface UserData {
  portfolio: any[];
  transactions: any[];
  watchlist: any[];
  balance: any;
}

// Strict, lossless context object shape appended to the summary for agents to parse reliably
type StructuredContext = {
  userId?: string;
  asOf: string; // ISO timestamp
  balance: {
    paperBalance?: number | null;
    totalPnL?: number | null;
    winRate?: number | null;
  } | null;
  portfolio: Array<{
    symbol: string;
    type: 'STOCK' | 'CRYPTO';
    quantity: number; // exact units
    avgPrice: number;
    totalInvested: number;
    currentValue?: number;
    pnl?: number;
    pnlPercentage?: number;
    lastUpdated?: string; // ISO
  }>;
  totals: {
    holdingsCount: number;
    totalInvested: number;
    totalCurrentValue: number;
    totalPnL: number;
  };
  watchlist: string[];
  recentTransactions: Array<{
    action: string;
    symbol: string;
    quantity: number;
    price?: number;
    timestamp?: string; // ISO
    type?: string;
  }>;
};

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
function buildStructuredContext(userId: string | undefined, userData: UserData): StructuredContext {
  const holdings = (userData.portfolio || [])
    .filter((p: any) => Number(p?.quantity) > 0)
    .map((p: any) => ({
    symbol: String(p.symbol || '').toUpperCase(),
    type: (p.type === 'CRYPTO' ? 'CRYPTO' : 'STOCK') as 'STOCK' | 'CRYPTO',
    quantity: Number(p.quantity || 0),
    avgPrice: Number(p.avgPrice || 0),
    totalInvested: Number(p.totalInvested || 0),
    currentValue: typeof p.currentValue === 'number' ? p.currentValue : undefined,
    pnl: typeof p.pnl === 'number' ? p.pnl : undefined,
    pnlPercentage: typeof p.pnlPercentage === 'number' ? p.pnlPercentage : undefined,
    lastUpdated: p.lastUpdated ? new Date(p.lastUpdated).toISOString() : undefined,
  }));

  const totals = holdings.reduce(
    (acc, h) => {
      acc.holdingsCount += 1;
      acc.totalInvested += h.totalInvested || 0;
      acc.totalCurrentValue += h.currentValue || 0;
      acc.totalPnL += typeof h.pnl === 'number' ? h.pnl : 0;
      return acc;
    },
    { holdingsCount: 0, totalInvested: 0, totalCurrentValue: 0, totalPnL: 0 }
  );

  const recentTransactions = (userData.transactions || []).map((t: any) => ({
    action: String(t.action || ''),
    symbol: String(t.symbol || '').toUpperCase(),
    quantity: Number(t.quantity || 0),
    price: typeof t.price === 'number' ? t.price : undefined,
    timestamp: t.timestamp ? new Date(t.timestamp).toISOString() : undefined,
    type: t.type ? String(t.type) : undefined,
  }));

  const watchlist = (userData.watchlist || []).map((w: any) => String(w.symbol || '').toUpperCase());

  const balance = userData.balance
    ? {
        paperBalance: typeof userData.balance.paperBalance === 'number' ? userData.balance.paperBalance : null,
        totalPnL: typeof userData.balance.totalPnL === 'number' ? userData.balance.totalPnL : null,
        winRate: typeof userData.balance.winRate === 'number' ? userData.balance.winRate : null,
      }
    : null;

  return {
    userId,
    asOf: new Date().toISOString(),
    balance,
    portfolio: holdings,
    totals,
    watchlist,
    recentTransactions,
  };
}

/**
 * Generates a context summary using OpenAI and appends a strict JSON block for agents.
 */
async function generateContextSummary(userId: string | undefined, userData: UserData): Promise<string> {
  const portfolioSummary = (userData.portfolio || [])
    .filter((p: any) => Number(p?.quantity) > 0)
    .map((p: any) => `${p.symbol} (${p.type}): ${p.quantity} units @ $${p.avgPrice}, PnL: ${Number(p.pnlPercentage ?? 0).toFixed(2)}%`)
    .join(', ') || 'No positions';

  const recentTrades = userData.transactions.slice(0, 10).map(t => 
    `${t.action} ${t.quantity} ${t.symbol} @ $${t.price}`
  ).join(', ') || 'No trades';

  const watchlistSymbols = userData.watchlist.map(w => w.symbol).join(', ') || 'Empty watchlist';

  const balanceInfo = userData.balance 
    ? `Paper balance: $${userData.balance.paperBalance.toFixed(2)}, Total P&L: $${userData.balance.totalPnL.toFixed(2)}, Win rate: ${userData.balance.winRate.toFixed(1)}%`
    : 'No balance data';

  // If OpenAI is not available, return a simple summary
  if (!openai) {
    return `Investment Profile: ${portfolioSummary}. Recent activity: ${recentTrades}. Watching: ${watchlistSymbols}. ${balanceInfo}`;
  }

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
      model: 'gpt-3.5-turbo',
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

    const summary = completion.choices[0]?.message?.content || 'Unable to generate context summary.';
    const structured = buildStructuredContext(userId, userData);
    const jsonBlock = JSON.stringify(structured);
    // Append a strict JSON block that agents can reliably parse without information loss
    return `${summary}\n\nBEGIN_USER_CONTEXT_JSON\n${jsonBlock}\nEND_USER_CONTEXT_JSON`;
  } catch (error) {
    console.error('Error generating context summary:', error);
    // Even on error, provide a minimal structured context for lossless data access
    const structured = buildStructuredContext(userId, userData);
    const jsonBlock = JSON.stringify(structured);
    return `User context unavailable due to generation error.\n\nBEGIN_USER_CONTEXT_JSON\n${jsonBlock}\nEND_USER_CONTEXT_JSON`;
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
      // Migration: ensure cached context contains structured JSON block
      const hasStructured = existingContext.contextSummary?.includes('BEGIN_USER_CONTEXT_JSON');
      if (hasStructured) {
        console.log(`Using cached context for user ${userId}`);
        return existingContext.contextSummary;
      }
      // Regenerate once to add structured JSON without requiring data change
      console.log(`Upgrading cached context format for user ${userId}`);
      const upgraded = await generateContextSummary(userId, userData);
      existingContext.contextSummary = upgraded;
      existingContext.lastUpdated = new Date();
      await existingContext.save();
      return upgraded;
    }

    // Generate new context
  console.log(`Generating new context for user ${userId}`);
  const contextSummary = await generateContextSummary(userId, userData);

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
  const contextSummary = await generateContextSummary(userId, userData);

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

/**
 * Optional helper: return the structured context object directly without LLM.
 */
export async function getUserContextJSON(userId: string): Promise<StructuredContext> {
  await connectToDatabase();
  const userData = await fetchUserData(userId);
  return buildStructuredContext(userId, userData);
}
