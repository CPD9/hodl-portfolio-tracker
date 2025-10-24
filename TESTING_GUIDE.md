# Portfolio Dashboard Testing Guide

## Quick Test Instructions

### 1. Start the Development Server
```powershell
# Make sure MongoDB is running first
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"

# In another terminal, start the Next.js dev server
npm run dev
```

### 2. Sign In
- Navigate to `http://localhost:3000/sign-in`
- Sign in with your test account

### 3. Test Stock Trading
1. Go to `http://localhost:3000/dashboard`
2. Note your current **Cash Balance** (should be $100,000 for new users)
3. Search for a stock (e.g., "AAPL")
4. Navigate to the stock detail page
5. In the trading interface:
   - Click **Buy** tab
   - Enter quantity (e.g., 10 shares)
   - Click **Buy AAPL** button
6. **Watch for changes:**
   - Success toast: "Successfully bought 10 shares of AAPL"
   - Portfolio update toast: "Portfolio updated! Refreshing data..."
   - Refresh icon spins briefly in the dashboard header
7. Return to dashboard (`/dashboard`)
8. **Verify changes:**
   - ✅ Cash Balance decreased by (price × quantity + 0.1% fee)
   - ✅ Portfolio Value increased
   - ✅ Stock Holdings shows the new total
   - ✅ Holdings table shows AAPL with correct quantity and value

### 4. Test Crypto Trading
1. Search for a crypto (e.g., "BTC" or "ETH")
2. Navigate to the crypto detail page
3. In the trading interface:
   - Click **Buy** tab
   - Enter quantity (e.g., 0.01 BTC)
   - Click **Buy BTC on Base** button
4. **Watch for changes:**
   - Success toast appears
   - Portfolio update notification
   - Refresh indicator spins
5. Return to dashboard
6. **Verify changes:**
   - ✅ Cash Balance decreased
   - ✅ Crypto Holdings shows the new value
   - ✅ Portfolio Value reflects crypto purchase
   - ✅ Holdings table shows BTC

### 5. Test AI Trading (Optional)
1. Open the AI Chat overlay (chat icon in bottom right)
2. Type: "Buy 5 shares of TSLA"
3. AI will propose the trade
4. Click **Authorize** on the trade card
5. Watch dashboard auto-update

### 6. Test Auto-Refresh
1. Stay on the dashboard
2. Wait 60 seconds
3. **Observe:**
   - Refresh icon briefly spins
   - Portfolio values update with latest prices
   - No toast notification (background refresh)

## Expected Behavior

### ✅ What Should Happen

**After Buy:**
- Transaction recorded in database
- Portfolio holding created/updated
- Cash balance reduced by (total + fee)
- Dashboard shows new values immediately
- Toast notifications confirm the update

**After Sell:**
- Portfolio holding updated/removed
- Cash balance increased by (proceeds - fee)
- P&L calculated correctly
- Dashboard reflects changes instantly

**Auto-Refresh (every 60s):**
- Prices update in background
- No user interruption
- Refresh icon spins briefly
- Holdings values recalculated with live prices

### ❌ Common Issues

**Portfolio doesn't update after trade:**
- Check browser console for errors
- Verify MongoDB is running
- Check API route `/api/portfolio/summary` returns 200
- Ensure `portfolioUpdated` event is firing (check console logs)

**Loading states don't show:**
- Skeleton loaders should appear on initial page load
- Refresh icon should spin during background updates

**Cash balance incorrect:**
- Check transaction fees (0.1% for stocks, 0.3% for crypto)
- Verify buy deducts: `total + fee`
- Verify sell adds: `total - fee`

**Holdings not appearing:**
- Check MongoDB Portfolio collection
- Verify user ID matches session
- Check for console errors in API route

## Debugging Tips

### Check MongoDB Data
```javascript
// In MongoDB Compass or shell
use hodl_portfolio_tracker

// View user balance
db.userbalances.find({ userId: "YOUR_USER_ID" })

// View portfolio holdings
db.portfolios.find({ userId: "YOUR_USER_ID" })

// View transactions
db.transactions.find({ userId: "YOUR_USER_ID" }).sort({ timestamp: -1 })
```

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   - "Error fetching portfolio:" (API issues)
   - "Trade error:" (trading issues)
   - "portfolioUpdated" event logs

### Check Network Tab
1. Open DevTools Network tab
2. Filter by "Fetch/XHR"
3. After trading, look for:
   - `/api/portfolio/summary` call
   - Should return status 200
   - Response should contain holdings array

### Check Server Logs
In the terminal running `npm run dev`, look for:
- "GET /api/portfolio/summary" requests
- Any error stack traces
- MongoDB connection issues

## Performance Expectations

- **Initial Load:** 1-3 seconds (fetching holdings + live prices)
- **Trade Execution:** 0.5-2 seconds
- **Dashboard Refresh:** 0.5-1 second
- **Auto-Refresh (60s):** <1 second (background, non-blocking)

## Known Limitations

1. **Paper Trading Only**: No real money or assets
2. **Price Updates**: Prices refresh on dashboard load and every 60s
3. **No WebSockets**: For truly real-time updates, add WebSocket integration
4. **Market Hours**: Stock prices may be delayed outside trading hours
5. **API Rate Limits**: Finnhub/CoinGecko have rate limits (usually sufficient for testing)

## Next Steps After Testing

If everything works:
- ✅ Portfolio tracking is complete
- ✅ Dashboard reflects trades instantly
- ✅ Cash balance updates correctly
- ✅ Holdings show accurate values

Consider adding:
- [ ] Transaction history page
- [ ] Performance charts (daily/weekly P&L)
- [ ] Portfolio rebalancing tools
- [ ] Price alerts integration
- [ ] Export portfolio to CSV
- [ ] WebSocket for real-time prices
