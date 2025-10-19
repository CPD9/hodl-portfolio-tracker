# Stock ↔ Crypto Swap: Revolutionary Cross-Asset Trading

## What Is This?

**Trade Apple stock for Ethereum. Trade Bitcoin for Tesla stock. All on Base blockchain.**

This is a revolutionary feature that enables cross-asset swaps between traditional stocks and cryptocurrencies using Base as the intermediary layer.

## How It Works

```
AAPL (Apple Stock) → USDC (Base) → ETH (Ethereum)
BTC (Bitcoin) → USDC (Base) → TSLA (Tesla Stock)
```

1. **Stocks are Tokenized** - Stocks become ERC20 tokens on Base (RWAs - Real World Assets)
2. **Base USDC is the Bridge** - All swaps route through USDC on Base
3. **Instant Swaps** - Trade between stocks and crypto in one transaction
4. **Low Fees** - Base blockchain fees (~$0.01 per transaction)

## Architecture

### Smart Contract: `StockCryptoSwap.sol`

**Key Features:**
- List tokenized stocks (AAPL, TSLA, GOOGL, etc.)
- Swap stock tokens ↔ crypto tokens
- Price oracle integration (Finnhub for stocks, Chainlink for crypto)
- USDC as intermediary currency
- Slippage protection

**Example Use Cases:**
- **Diversification**: Convert stock gains into crypto
- **Hedging**: Balance traditional and digital assets
- **24/7 Trading**: Trade tokenized stocks outside market hours
- **Fractional Ownership**: Buy 0.5 AAPL tokens

## Deployment

### Quick Deploy

1. **Install dependencies**:
```bash
git clone https://github.com/foundry-rs/forge-std.git contracts/lib/forge-std
```

2. **Set up `.env`**:
```bash
PRIVATE_KEY=0x...
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_key
```

3. **Deploy to Base Sepolia**:
```bash
forge script contracts/script/DeployStockCryptoSwap.s.sol \
    --rpc-url base-sepolia --broadcast --verify
```

4. **Add contract address to `.env`**:
```bash
NEXT_PUBLIC_STOCK_CRYPTO_SWAP_BASE_SEPOLIA=0x...
```

### After Deployment: List Stocks

List popular stocks for trading:

```bash
# List Apple (AAPL) at $180.25
cast send $CONTRACT_ADDRESS \
    "listStock(string,address,uint256)" \
    "AAPL" 0xYourStockTokenAddress 180250000 \
    --private-key $PRIVATE_KEY \
    --rpc-url base-sepolia

# List Tesla (TSLA) at $242.84
cast send $CONTRACT_ADDRESS \
    "listStock(string,address,uint256)" \
    "TSLA" 0xYourStockTokenAddress 242840000 \
    --private-key $PRIVATE_KEY \
    --rpc-url base-sepolia
```

## UI Features

The Stock-Crypto Swap UI (`/base` page) includes:

- **Stock Selection**: Choose from AAPL, TSLA, NVDA, MSFT, GOOGL
- **Crypto Selection**: Choose from ETH, BTC, USDC, cbBTC
- **Real-time Quotes**: Live exchange rates
- **Flip Button**: Quickly reverse swap direction
- **Clean Design**: Modern, professional interface

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic swap mechanism
- ✅ Stock tokenization structure
- ✅ USDC intermediary
- ✅ Price oracle setup

### Phase 2 (Planned)
- [ ] Integration with real stock tokenization providers
- [ ] Chainlink price feeds for accurate real-time prices
- [ ] Liquidity pools for better rates
- [ ] Automated market making (AMM)

### Phase 3 (Advanced)
- [ ] Options trading (stock options as crypto)
- [ ] Leveraged positions
- [ ] Limit orders
- [ ] Stop-loss mechanisms
- [ ] Multi-chain support

## Example Flows

### Swap Stock → Crypto

```solidity
// Swap 10 AAPL tokens for ETH
swapContract.swapStockForCrypto(
    "AAPL",           // Stock symbol
    10 * 1e18,        // Amount (10 tokens)
    WETH_ADDRESS,     // Crypto to receive
    minEthAmount      // Slippage protection
);
```

### Swap Crypto → Stock

```solidity
// Swap 1 ETH for TSLA tokens
swapContract.swapCryptoForStock(
    WETH_ADDRESS,     // Crypto to sell
    1 * 1e18,         // Amount (1 ETH)
    "TSLA",           // Stock symbol
    minTslaAmount     // Slippage protection
);
```

## Integration with HODL App

### Current Integration

- **Base Chain Page**: `/base` route
- **UI Component**: `StockCryptoSwap.tsx`
- **Smart Contract**: `contracts/src/StockCryptoSwap.sol`
- **Wagmi Hooks**: For wallet connection and transactions

### Data Flow

```
1. User selects: 10 AAPL → ETH
2. Frontend calls: getStockToCryptoQuote()
3. Smart contract calculates: 10 AAPL × $180 = $1,800 → ÷ $2,450 ETH = 0.735 ETH
4. User confirms swap
5. Contract executes: Burns AAPL tokens, transfers ETH
6. Event emitted: StockToCryptoSwap
7. UI updates with transaction hash
```

## Regulatory Considerations

**Important**: This is an experimental feature for hackathon purposes.

In production, you would need:
- **Securities License**: To offer tokenized stocks
- **KYC/AML**: Know Your Customer and Anti-Money Laundering
- **Compliance**: With SEC, FINRA, and other regulators
- **Custody**: Proper stock custody mechanisms
- **Oracle Security**: Reliable price feeds

**Alternative Approach for Production**:
- Partner with existing RWA providers (e.g., Ondo Finance, Backed, Matrixdock)
- Use regulated stock token protocols
- Implement strict compliance measures

## Technical Details

### Stock Token Structure

```solidity
struct StockToken {
    string symbol;           // "AAPL"
    address tokenAddress;    // ERC20 token
    uint256 priceUSD;        // 180250000 (6 decimals)
    uint256 totalSupply;     // Total tokens minted
    bool active;             // Tradeable?
    uint256 lastUpdated;     // Price update timestamp
}
```

### Price Precision

- Stock prices: 6 decimals (e.g., $180.25 = 180250000)
- Crypto amounts: 18 decimals (standard ERC20)
- Conversion: Handled by smart contract math

### Security Features

- **Access Control**: Only owner can list stocks
- **Price Oracle**: Only authorized oracle can update prices
- **Slippage Protection**: Min/max amounts
- **Emergency Pause**: Owner can pause trading
- **Reentrancy Guards**: Protection against attacks

## Cost Analysis

### Transaction Costs (Base Sepolia)

| Action | Gas Cost | USD Cost |
|--------|----------|----------|
| List Stock | ~100k gas | Free (testnet) |
| Update Price | ~50k gas | Free (testnet) |
| Swap Stock→Crypto | ~150k gas | Free (testnet) |
| Swap Crypto→Stock | ~180k gas | Free (testnet) |

### Production Costs (Base Mainnet)

| Action | Gas Cost | USD Cost (estimated) |
|--------|----------|---------------------|
| List Stock | ~100k gas | ~$0.50 |
| Swap | ~150k gas | ~$0.75 |

*Much cheaper than Ethereum mainnet ($10-50 per swap)*

## Comparison: Stock-Crypto Swap vs Traditional

| Feature | Traditional Broker | HODL Stock-Crypto Swap |
|---------|-------------------|------------------------|
| **Trading Hours** | 9:30am-4pm ET | 24/7 |
| **Settlement** | T+2 days | Instant |
| **Fees** | $5-10 per trade | ~$0.75 per swap |
| **Cross-Asset** | Not possible | One-click swaps |
| **Fractional** | Limited | Any amount |
| **Global Access** | Restrictions | Anyone with wallet |

## Vision

**The future of finance is unified**. Stocks, crypto, commodities, and more - all tradeable in one place, on one blockchain.

Stock-Crypto Swap is the first step toward a truly unified financial system where traditional and digital assets coexist and trade seamlessly.

---

## Get Started

1. Deploy the contract (see above)
2. Visit `/base` page
3. Connect wallet
4. Start swapping!

**Questions?** Check the smart contract code in `contracts/src/StockCryptoSwap.sol`

**Want to contribute?** This is an open innovation - help us build the future of cross-asset trading!

