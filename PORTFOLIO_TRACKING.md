# Portfolio Tracking System

## Overview
The dashboard now displays **real-time portfolio data**, including holdings, total value, P&L, and cash balance. When users buy or sell stocks/crypto, these values are automatically reflected on the dashboard.

## Architecture

### Database Models
- **`Portfolio`** (`database/models/portfolio.model.ts`): Stores each holding (symbol, quantity, avgPrice, totalInvested, currentValue, pnl, pnlPercentage)
- **`Transaction`** (`database/models/transaction.model.ts`): Records every buy/sell transaction
- **`UserBalance`** (`database/models/user-balance.model.ts`): Tracks user's cash balance, total trades, win rate, total P&L

### Trading Actions
- **`lib/actions/stock-trading.actions.ts`**:
  - `buyStock(userId, symbol, quantity)`: Deducts cash, creates/updates portfolio position, records transaction
  - `sellStock(userId, symbol, quantity)`: Adds proceeds, updates/removes portfolio position, records transaction
  
- **`lib/actions/crypto-trading.actions.ts`**:
  - `buyCrypto(userId, symbol, quantity)`: Same as stock but for crypto assets
  - `sellCrypto(userId, symbol, quantity)`: Same as stock sell but for crypto

- **`lib/actions/portfolio.actions.ts`**:
  - `getPortfolioSummary(userId)`: Aggregates all holdings, fetches live prices, calculates totals and P&L

### API Endpoint
- **`app/api/portfolio/summary/route.ts`**: 
  - `GET /api/portfolio/summary` - Authenticated endpoint that returns user's complete portfolio data

### Dashboard Integration
- **`app/dashboard/page.tsx`**:
  - Fetches portfolio data via `/api/portfolio/summary` on mount
  - Listens for `portfolioUpdated` custom events to auto-refresh after trades
  - Displays holdings, total value, cash balance, P&L in stat cards

### Trading UI Components
- **`components/TradingInterface.tsx`**: Stock trading UI (buy/sell buttons, shows position)
- **`components/CryptoTradingInterface.tsx`**: Crypto trading UI (buy/sell buttons, shows position)
  
Both components:
1. Execute trades via server actions
2. Update local position display
3. Emit `portfolioUpdated` event to trigger dashboard refresh

### AI Trading Integration
- **`components/AIChatOverlay.tsx`** and **`lib/actions/ai-trade-agent.actions.ts`**:
  - AI-powered chat can propose and execute trades via natural language
  - Uses the same `buyStock`, `sellStock`, `buyCrypto`, `sellCrypto` actions
  - Automatically refreshes user context after trades

## Data Flow

### On Buy/Sell:
1. User clicks "Buy" or "Sell" in trading interface
2. Component calls server action (`buyStock`, `buyCrypto`, etc.)
3. Server action:
   - Validates user balance / holdings
   - Updates `UserBalance` (deducts/adds cash)
   - Creates/updates `Portfolio` record (quantity, avgPrice)
   - Creates `Transaction` record
4. Trading component refreshes its local position
5. Trading component emits `window.dispatchEvent(new CustomEvent('portfolioUpdated'))`
6. Dashboard listens for this event and re-fetches `/api/portfolio/summary`
7. Dashboard UI updates with new holdings, cash balance, portfolio value

### On Dashboard Load:
1. Dashboard calls `fetch('/api/portfolio/summary')`
2. API route authenticates user, calls `getPortfolioSummary(userId)`
3. `getPortfolioSummary`:
   - Fetches all holdings from `Portfolio` collection
   - Fetches live prices for each asset (Finnhub for stocks, CoinGecko for crypto)
   - Recalculates current values and P&L
   - Returns aggregated summary with cash balance from `UserBalance`
4. Dashboard renders stat cards and holdings table

## Key Features
- **Live Price Updates**: Portfolio values use latest market prices, not just stored avgPrice
- **Accurate P&L**: Calculates profit/loss as (currentValue - totalInvested)
- **Cash Tracking**: Paper balance starts at $100k, adjusts on every buy/sell
- **Transaction History**: Every trade is recorded for audit and performance metrics
- **Event-Driven Refresh**: Dashboard auto-updates when trades occur anywhere in the app

## Future Enhancements
- Polling or WebSocket for real-time price updates
- Historical performance charts
- Tax-loss harvesting suggestions
- Rebalancing recommendations
