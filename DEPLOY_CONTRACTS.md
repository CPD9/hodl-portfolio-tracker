# Deploy Portfolio Rebalancer Contract

Quick guide to deploy the Portfolio Rebalancer smart contract to Base blockchain.

## Prerequisites

1. **Install Foundry** (Solidity toolkit):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. **Install dependencies**:
```bash
forge install foundry-rs/forge-std --no-commit
```

3. **Get Base Sepolia ETH** (for testnet):
   - Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Connect wallet and claim free testnet ETH

4. **Set up environment variables** in `.env`:
```bash
# Your wallet private key (NEVER commit this!)
PRIVATE_KEY=0x...

# RPC URLs (these are public, no signup needed)
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Optional: For automatic verification
BASESCAN_API_KEY=your_key_from_basescan.org
```

## Option 1: Automatic Deployment (Easiest)

Run the deployment script:

```bash
bash scripts/deploy-contracts.sh
```

Follow the prompts:
1. Choose network (1 for testnet, 2 for mainnet)
2. Wait for deployment
3. Copy the contract address
4. Add to `.env`

## Option 2: Manual Deployment

### Deploy to Base Sepolia (Testnet)

```bash
forge script contracts/script/DeployPortfolioRebalancer.s.sol \
    --rpc-url base-sepolia \
    --broadcast \
    --verify
```

### Deploy to Base Mainnet (Production)

```bash
forge script contracts/script/DeployPortfolioRebalancer.s.sol \
    --rpc-url base \
    --broadcast \
    --verify
```

## After Deployment

1. **Copy the deployed contract address** from the terminal output
2. **Add to your `.env` file**:

   For testnet:
   ```bash
   NEXT_PUBLIC_PORTFOLIO_REBALANCER_BASE_SEPOLIA=0x...
   ```

   For mainnet:
   ```bash
   NEXT_PUBLIC_PORTFOLIO_REBALANCER_BASE=0x...
   ```

3. **Restart your Next.js dev server**:
   ```bash
   npm run dev
   ```

4. **Visit the Base Chain page** at http://localhost:3000/base

The Portfolio Rebalancer should now work!

## Verify Deployment

Check your deployment on the explorer:
- **Base Sepolia**: https://sepolia.basescan.org/
- **Base Mainnet**: https://basescan.org/

Search for your contract address to see:
- Contract code
- Transactions
- Verification status

## Troubleshooting

### "Insufficient funds for gas"
- You need ETH on Base to deploy
- Get testnet ETH: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- For mainnet: Bridge ETH to Base via https://bridge.base.org/

### "Transaction failed"
- Check your private key is correct
- Ensure you're on the right network
- Verify you have enough ETH for gas

### "Verification failed"
- Get a Basescan API key: https://basescan.org/myapikey
- Add to `.env`: `BASESCAN_API_KEY=...`
- Verification is optional but recommended

### Contract not showing in UI
- Check the contract address in `.env` matches deployment
- Restart your Next.js server
- Verify you're connected to the correct network in MetaMask

## Cost Estimate

- **Base Sepolia**: Free (testnet ETH)
- **Base Mainnet**: ~$0.50-$2 USD (depends on gas prices)

## Need Help?

- Full deployment guide: `contracts/DEPLOYMENT_GUIDE.md`
- Foundry docs: https://book.getfoundry.sh/
- Base docs: https://docs.base.org/

## Security Notes

- Always test on Sepolia before mainnet
- Never commit your private key
- Use a separate wallet for development
- Consider a hardware wallet for mainnet deployments

