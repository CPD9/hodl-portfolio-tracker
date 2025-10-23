# Testing Guide - Stock ↔ Crypto Swap Interface

## 🎉 Implementation Complete!

All core swap functionality has been implemented and is ready for testing.

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to Swap Interface
Open: http://localhost:3000/dashboard/trade

### 3. Connect Your Wallet
- Click "Connect Wallet" or ensure MetaMask is connected
- Make sure you're on **Ethereum Sepolia** network
- Confirm your wallet address matches: `0xbE26e3a1f50E39E828Ab089FA6f7E4a372b2CB9b`

## 📋 Test Scenarios

### Test 1: Stock → Crypto Swap (e.g., AAPL → WETH)

**Steps:**
1. Select **AAPL** as "From" token
2. Select **WETH** as "To" token
3. Enter amount (e.g., `1.0`)
4. Wait for quote to load
5. Review exchange rate, price impact, and route
6. If first time, click "Approve AAPL"
   - Confirm transaction in MetaMask
   - Wait for approval confirmation
7. Click "Execute Swap"
   - Confirm transaction in MetaMask
   - Wait for swap confirmation
8. ✅ Success message should appear
9. ✅ Balances should update

**Expected Result:**
- Your AAPL balance decreases
- Your WETH balance increases
- Quote shows route: AAPL → USDC → WETH (or direct if pool exists)

### Test 2: Crypto → Stock Swap (e.g., WETH → TSLA)

**Steps:**
1. Select **WETH** as "From" token
2. Select **TSLA** as "To" token
3. Enter amount (e.g., `0.1`)
4. Wait for quote
5. If needed, approve WETH
6. Execute swap
7. ✅ Verify balances updated

**Expected Result:**
- WETH balance decreases
- TSLA balance increases

### Test 3: Stock → Stock Swap (e.g., NVDA → MSFT)

**Steps:**
1. Select **NVDA** as "From" token
2. Select **MSFT** as "To" token
3. Enter amount
4. Review route (should go through USDC)
5. Approve if needed
6. Execute swap
7. ✅ Verify balances

**Expected Result:**
- Route: NVDA → USDC → MSFT
- Both stock balances update correctly

### Test 4: Crypto → Crypto Swap (e.g., WETH → USDC)

**Steps:**
1. Select **WETH** as "From" token
2. Select **USDC** as "To" token
3. Enter amount
4. Approve if needed
5. Execute swap
6. ✅ Verify balances

**Expected Result:**
- Direct swap via Uniswap V2
- USDC balance increases (note: 6 decimals)

## 🔍 Things to Verify

### UI Elements
- [ ] Token selector shows all 6 stocks + 2 crypto tokens
- [ ] Token selector separates stocks and crypto
- [ ] Balance displays correctly for both tokens
- [ ] MAX button sets correct balance
- [ ] Quote updates automatically when amount changes
- [ ] Quote shows exchange rate, price impact, and route
- [ ] Loading spinner appears during quote fetch
- [ ] Approval button appears when needed
- [ ] Swap button is disabled when invalid input

### Functionality
- [ ] Real-time balance tracking works
- [ ] Quote debouncing (500ms delay)
- [ ] Approval detection is automatic
- [ ] Approval transaction completes
- [ ] Swap transaction completes
- [ ] Success/error messages display correctly
- [ ] Balances refresh after swap
- [ ] Can swap between any token pair
- [ ] Smart routing works (direct → USDC → WETH)

### Error Handling
- [ ] Error message if no liquidity
- [ ] Error message if insufficient balance
- [ ] Error message if transaction fails
- [ ] Error message if user rejects transaction

## 🐛 Troubleshooting

### Issue: "Cannot read properties of undefined"
**Solution:** Make sure MetaMask is installed and connected

### Issue: "No liquidity pool found"
**Solution:** This is expected for some pairs on Sepolia testnet. Try different token combinations or use USDC as intermediary.

### Issue: "Insufficient balance"
**Solution:** You need actual token balances. Check your MetaMask.

### Issue: "Transaction failed"
**Solution:** 
- Check you have enough test ETH for gas
- Verify network is Ethereum Sepolia
- Check token addresses in .env.local

### Issue: Quote not updating
**Solution:** 
- Check browser console for errors
- Verify contract addresses are correct
- Try refreshing the page

## 📊 Contract Addresses (Ethereum Sepolia)

### Your Deployed Contracts
- **StockCryptoSwap:** `0xc1127c80e98a742052746cbc41a5bad9447be8b9`

### Stock Tokens
- **AAPL:** `0x334dFeb48aEC27fCb75249e77F546B687cC6aB94`
- **TSLA:** `0x7c57A5BD9942e82Ba61C27B6141c6228c38c7487`
- **NVDA:** `0x532995D5C698a725B590550F67F9f90A00b352d8`
- **MSFT:** `0x8Fe92F95f0E4CAeE9494341C2B0Fbd93A2BE89A4`
- **AMZN:** `0x75687E5c95e15Ba306b49869e49F017b3103AbF2`
- **GOOGL:** `0x4833D6D51b64f93B6708088c90aB6E138b6A1547`

### Crypto Tokens
- **WETH:** `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`
- **USDC:** `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

### Uniswap V2 (Already Deployed)
- **Factory:** `0xF62c03E08ada871A0bEb309762E260a7a6a880E6`
- **Router:** `0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3`

## 🎯 Success Criteria

For a successful test:
1. ✅ At least one swap of each type completes
2. ✅ Balances update correctly after each swap
3. ✅ No console errors (except expected "no liquidity" for some pairs)
4. ✅ UI is responsive and user-friendly
5. ✅ All status messages display correctly

## 📝 Next Steps

After successful testing:
1. ✅ Mark testing TODO as complete
2. ⏳ (Optional) Add transaction history component
3. ⏳ Merge feature/swap-interface to main branch
4. ⏳ Deploy to production

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify .env.local has all correct addresses
3. Ensure MetaMask is on Ethereum Sepolia
4. Check you have test ETH and token balances
5. Share the error message for debugging

---

**Happy Testing! 🚀**

