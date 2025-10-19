# HODL Smart Contracts

This directory contains Solidity smart contracts for the HODL Portfolio Tracker, deployable on the Base blockchain.

## 📁 Structure

```
contracts/
├── src/              # Smart contract source code
│   ├── PortfolioRebalancer.sol
│   └── interfaces/   # Contract interfaces
├── script/           # Deployment scripts
│   └── DeployPortfolioRebalancer.s.sol
├── test/            # Contract tests (coming soon)
└── DEPLOYMENT_GUIDE.md  # Detailed deployment instructions
```

## 🚀 Quick Start

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Install Dependencies

```bash
forge install
```

### 3. Compile Contracts

```bash
forge build
```

### 4. Deploy to Base Sepolia (Testnet)

```bash
# Set up your .env file first with PRIVATE_KEY and BASE_SEPOLIA_RPC_URL

forge script contracts/script/DeployPortfolioRebalancer.s.sol \
    --rpc-url base-sepolia \
    --broadcast \
    --verify
```

## 📦 Available Contracts

### PortfolioRebalancer

**Purpose**: Automated portfolio rebalancing using Uniswap V3 on Base

**Key Features:**
- ✅ Create custom portfolios with target allocations
- ✅ Automatic rebalancing to maintain target ratios  
- ✅ Integrated with Uniswap V3 for efficient swaps
- ✅ Gas-optimized for low-cost rebalancing
- ✅ Multi-token support (USDC, WETH, DAI, cbBTC, etc.)

**Use Cases:**
- Dollar-cost averaging (DCA) strategies
- Risk-managed portfolios (e.g., 60/40 USDC/WETH)
- Yield optimization with automatic rebalancing
- Multi-asset diversification

**Example Usage:**

```javascript
// Create a 60/40 USDC/WETH portfolio
const tx = await portfolioRebalancer.createPortfolio(
  "Conservative Portfolio",
  [USDC_ADDRESS, WETH_ADDRESS],
  [6000, 4000] // 60% USDC, 40% WETH (in basis points)
);

// Later, rebalance to target allocation
await portfolioRebalancer.rebalance(portfolioId, totalValueInWei);
```

## 🔧 Integration with Next.js App

The contracts are integrated with the HODL web app via:

1. **ABI Export**: `lib/contracts/portfolioRebalancer.ts`
2. **React Component**: `components/PortfolioRebalancerUI.tsx`
3. **Trade Page**: `/trade` route

Users can:
- Create portfolios via the web UI
- Set custom allocations
- Trigger rebalancing with one click
- View their on-chain portfolios

## 🎯 Future Contracts

We're planning to add:

### 1. **TokenizedStock.sol**
ERC20 tokens representing real-world assets (RWAs)

### 2. **AutomatedTrading.sol**
Smart contracts for DCA, stop-loss, and limit orders

### 3. **YieldVault.sol**
Yield aggregation with automatic compounding

### 4. **P2PEscrow.sol**
Peer-to-peer trading escrow with dispute resolution

### 5. **OptionsContract.sol**
On-chain options trading for Base assets

## 🧪 Testing

```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testCreatePortfolio

# Run tests with detailed traces
forge test -vvvv
```

## 🔐 Security

### Audits
- ⏳ Pending third-party audit
- ✅ Internal review completed
- ✅ Static analysis with Slither

### Best Practices
- ✅ Access controls (only portfolio owner can rebalance)
- ✅ Reentrancy guards
- ✅ Input validation
- ✅ Custom errors for gas efficiency
- ⏳ Slippage protection (to be enhanced)
- ⏳ Time-based rate limiting (planned)

**⚠️ WARNING**: These contracts are in beta. Use small amounts for testing. Audit before production use.

## 📊 Contract Addresses

### Base Mainnet (Chain ID: 8453)
- PortfolioRebalancer: `TBD` (not deployed yet)

### Base Sepolia (Chain ID: 84532)
- PortfolioRebalancer: `TBD` (not deployed yet)

Update these addresses in `.env`:
```bash
NEXT_PUBLIC_PORTFOLIO_REBALANCER_BASE=0x...
NEXT_PUBLIC_PORTFOLIO_REBALANCER_BASE_SEPOLIA=0x...
```

## 🛠 Development

### Add a New Contract

1. Create `src/YourContract.sol`
2. Create `script/DeployYourContract.s.sol`
3. Add ABI to `lib/contracts/`
4. Create React component in `components/`
5. Add to trade page or create new page

### Test a Contract

1. Create `test/YourContract.t.sol`
2. Write tests using Foundry
3. Run `forge test`

### Deploy a Contract

1. Update `.env` with deployment config
2. Run deployment script
3. Verify on Basescan
4. Update contract address in `.env`

## 📚 Resources

- **Foundry Book**: https://book.getfoundry.sh/
- **Base Docs**: https://docs.base.org/
- **Uniswap V3 Docs**: https://docs.uniswap.org/
- **OpenZeppelin**: https://docs.openzeppelin.com/contracts/
- **Solidity Docs**: https://docs.soliditylang.org/

## 🤝 Contributing

1. Create a new branch
2. Add your contract
3. Write tests (aim for 100% coverage)
4. Document your contract
5. Submit PR

## 📝 License

MIT License - see LICENSE file for details

## 💡 Questions?

Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions, or open an issue on GitHub.

---

**Happy Building! 🚀**

