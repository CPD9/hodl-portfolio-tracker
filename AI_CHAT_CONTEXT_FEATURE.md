# AI Chat Context Feature - Implementation Summary

## Overview
This feature enables the AI chatbot (Hodlini) to have personalized conversations with users by automatically loading their investment profile from the database. The context is generated using OpenAI and cached to prevent unnecessary API calls.

## Key Components

### 1. Database Model - `user-context.model.ts`
- Stores generated context summaries for each user
- Includes `dataHash` field to detect when user data changes
- Automatically timestamps updates

### 2. Server Action - `user-context.actions.ts`
Main functions:
- **`getUserContext(userId)`**: Smart function that retrieves cached context or generates new one if data changed
- **`refreshUserContext(userId)`**: Forces context regeneration
- **`fetchUserData(userId)`**: Gathers all user data (portfolio, transactions, watchlist, balance)
- **`generateContextSummary(userData)`**: Uses OpenAI GPT-3.5-turbo to create investment profile summary
- **`generateDataHash(userData)`**: Creates SHA-256 hash to detect data changes

### 3. Updated Components

#### `AIChatOverlay.tsx`
- Fetches user context when chat opens
- Displays loading indicator while context is being generated
- Shows "✓ Personalized context loaded" when ready
- Passes context to all chat messages

#### `chat.actions.ts`
- Updated `sendChatMessage()` to accept optional `userContext` parameter
- Passes context to API route

#### `app/api/chat/route.ts`
- Accepts `userContext` in request body
- Appends user profile to system prompt when available
- OpenAI uses this context for all responses

## How It Works

1. **User opens chat** → AIChatOverlay component mounts
2. **Context fetch triggered** → `getUserContext(user.id)` called
3. **Data collection** → Fetches portfolio, transactions, watchlist, balance from MongoDB
4. **Hash comparison** → Generates hash of current data
5. **Cache check** → Compares with stored hash in UserContext collection
   - If hash matches → Return cached context (no API call)
   - If hash different → Generate new context with OpenAI
6. **Context generation** (if needed) → OpenAI analyzes user data and creates profile summary
7. **Context storage** → Save new context and hash to database
8. **Chat integration** → Context passed with every message to provide personalized responses

## Anti-Spam Protection

The system prevents spam by:
- **Caching**: Only regenerates context when actual data changes
- **Hash comparison**: SHA-256 hash detects even minor portfolio changes
- **Single generation per data state**: Multiple chat opens with same data = one API call

## Benefits

1. **Personalized advice**: AI knows user's holdings, trading style, and preferences
2. **Efficient**: Minimal OpenAI API usage through intelligent caching
3. **Automatic**: No user action required, works transparently
4. **Performance**: Fast cached responses when data unchanged
5. **Scalable**: Hash-based change detection scales to any portfolio size

## Example Context Generation

Input data:
- Portfolio: AAPL (50 shares), BTC (0.5 units)
- Recent trades: Multiple tech stock purchases
- Watchlist: NVDA, GOOGL, ETH
- Performance: +12% overall, 75% win rate

Generated context:
> "User shows strong preference for technology sector with holdings in AAPL and interest in NVDA, GOOGL. Portfolio includes both stocks and crypto (BTC), indicating moderate risk tolerance and openness to digital assets. Active trader with 75% win rate and positive 12% P&L. Primary interest areas: tech stocks, major cryptocurrencies. Good candidate for DeFi and Base blockchain recommendations."

## Configuration

Environment variables used:
- `OPENAI_API_KEY`: For context generation
- `MONGODB_URI`: For storing context cache

Model used: `gpt-3.5-turbo` (cost-effective, fast, widely available)
Max tokens: 400 (keeps context concise)
Temperature: 0.5 (balanced creativity/consistency)

## Future Enhancements

Possible improvements:
- Add user preferences collection for explicit interests
- Include sector correlation insights in context
- Track conversation history for learning
- Add manual refresh button for users who want immediate updates
- Store multiple context versions for A/B testing
