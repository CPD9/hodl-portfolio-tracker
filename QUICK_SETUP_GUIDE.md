# Quick Setup Guide - Fix & Continue

## ⚠️ CRITICAL: Fix Your Alchemy Configuration

Your Alchemy URL is pointing to **Ethereum mainnet** instead of **Base Sepolia**!

### Current (WRONG):
```
https://eth-mainnet.g.alchemy.com/v2/-eyXY7SsTg6s4PrCodk-R
```

### Should be (CORRECT):
```
https://base-sepolia.g.alchemy.com/v2/YOUR_NEW_API_KEY
```

## Step-by-Step Fix

### 1. Create Base Sepolia App on Alchemy

1. Go to https://dashboard.alchemy.com/
2. Click **"Create new app"**
3. Fill in:
   - **Name:** HODL Base Sepolia
   - **Chain:** Ethereum
   - **Network:** **Base Sepolia** ← THIS IS CRITICAL!
4. Click **"Create app"**
5. Click **"View key"**
6. Copy:
   - API Key
   - HTTPS URL (should start with `https://base-sepolia.g.alchemy.com/v2/`)

### 2. Create .env.local File

Create a file named `.env.local` in the project root with this content:

```bash
# Alchemy (Base Sepolia - NEW values from step 1)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_new_api_key_here
NEXT_PUBLIC_ALCHEMY_HTTPS=https://base-sepolia.g.alchemy.com/v2/your_new_api_key_here

# Your Wallet
NEXT_PUBLIC_WALLET_ADDRESS=0xbE26e3a1f50E39E828Ab089FA6f7E4a372b2CB9b

# Private Key (Get from MetaMask: 3 dots → Account details → Export private key)
# ⚠️ NEVER share this!
PRIVATE_KEY=your_private_key_here

# Network
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_NAME=base-sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Uniswap V3 (Already deployed - no changes needed!)
NEXT_PUBLIC_UNISWAP_FACTORY=0x33128a8fC17869897dcE68Ed026d694621f6FDfD
NEXT_PUBLIC_UNISWAP_ROUTER=0x2626664c2603336E57B271c5C0b26F421741e481

# Stock Tokens (Create these next - leave empty for now)
NEXT_PUBLIC_TOKEN_AAPL=
NEXT_PUBLIC_TOKEN_TSLA=
NEXT_PUBLIC_TOKEN_NVDA=
NEXT_PUBLIC_TOKEN_MSFT=

# StockCryptoSwap (Deploy after tokens - leave empty for now)
NEXT_PUBLIC_STOCK_CRYPTO_SWAP_ADDRESS=
```

### 3. Get Your Private Key (Needed for Deployment)

**⚠️ IMPORTANT: This is VERY sensitive - NEVER share it!**

1. Open MetaMask
2. Click the **three dots** next to your account
3. Click **"Account details"**
4. Click **"Export private key"**
5. Enter your MetaMask password
6. **Copy the private key** (it's a long hex string starting with 0x)
7. Add it to `.env.local` as `PRIVATE_KEY=...`

## Next Steps (In Order)

### ✅ Step 1: Get Test ETH (15 seconds)
```bash
# Go to: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
# Paste your address: 0xbE26e3a1f50E39E828Ab089FA6f7E4a372b2CB9b
# Click "Send me ETH"
# Wait ~30 seconds, check MetaMask
```

### ✅ Step 2: Create Stock Tokens (10 minutes)

**IMPORTANT:** Make sure MetaMask is on **Base Sepolia Testnet**!

Go to: https://www.smartcontracts.tools/token-generator/base-sepolia/

Create 4 tokens:

#### Token 1: AAPL
- **Name:** Apple Stock Token
- **Symbol:** AAPL
- **Supply:** 1000000
- **Decimals:** 18
- Click **"Create Token"** → Confirm in MetaMask
- **Save the contract address!**

#### Token 2: TSLA
- **Name:** Tesla Stock Token
- **Symbol:** TSLA  
- **Supply:** 1000000
- Click **"Create Token"** → Confirm
- **Save address!**

#### Token 3: NVDA
- **Name:** NVIDIA Stock Token
- **Symbol:** NVDA
- **Supply:** 1000000
- Click **"Create Token"** → Confirm
- **Save address!**

#### Token 4: MSFT
- **Name:** Microsoft Stock Token
- **Symbol:** MSFT
- **Supply:** 1000000
- Click **"Create Token"** → Confirm
- **Save address!**

**Add all 4 addresses to `.env.local`:**
```bash
NEXT_PUBLIC_TOKEN_AAPL=0xYourTokenAddress1
NEXT_PUBLIC_TOKEN_TSLA=0xYourTokenAddress2
NEXT_PUBLIC_TOKEN_NVDA=0xYourTokenAddress3
NEXT_PUBLIC_TOKEN_MSFT=0xYourTokenAddress4
```

### ✅ Step 3: Deploy StockCryptoSwap Contract (5 minutes)

First, update the deployment script:

```bash
# Edit: contracts/script/DeployStockCryptoSwap.s.sol
# Replace the token addresses with your actual addresses from Step 2
```

Then deploy:
```bash
cd contracts

# Load environment variables
source ../.env.local

# Deploy contract
forge script script/DeployStockCryptoSwap.s.sol \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

**Save the deployed contract address to `.env.local`:**
```bash
NEXT_PUBLIC_STOCK_CRYPTO_SWAP_ADDRESS=0xYourContractAddress
```

### ✅ Step 4: Test the App! (2 minutes)

```bash
# Start the development server
npm run dev

# Open http://localhost:3000
# Connect your MetaMask wallet
# Try swapping AAPL → ETH!
```

## Troubleshooting

### "Insufficient funds" error
- Make sure you got test ETH from the faucet
- Check your balance in MetaMask

### "Network mismatch" error
- Make sure MetaMask is on **Base Sepolia Testnet**
- Check the network dropdown shows "Base Sepolia Testnet"

### "Token not found" error
- Make sure you added all token addresses to `.env.local`
- Make sure you created the tokens on Base Sepolia (not mainnet!)

### "Contract not deployed" error
- Make sure you deployed StockCryptoSwap contract
- Make sure you added the address to `.env.local`
- Restart the dev server after updating `.env.local`

## Summary Checklist

- [ ] Fixed Alchemy - created Base Sepolia app
- [ ] Updated `.env.local` with correct Alchemy URL
- [ ] Added private key to `.env.local`
- [ ] Got test ETH from faucet
- [ ] Created 4 stock tokens (AAPL, TSLA, NVDA, MSFT)
- [ ] Added token addresses to `.env.local`
- [ ] Deployed StockCryptoSwap contract
- [ ] Added contract address to `.env.local`
- [ ] Tested swap in app!

## Important Notes

1. **No CRANQ needed** - We're using official Uniswap V3 on Base
2. **Test on Base Sepolia first** - Free testnet tokens
3. **Base Sepolia fees are ~$0.00** - Very cheap to test!
4. **Keep your private key safe** - Never share or commit it

---

Need help? Check `IMPLEMENTATION_STATUS.md` for detailed documentation.

