# Swap Testing on Base Sepolia

This guide helps you smoke-test the Uniswap V3 quote path and then try a small swap in the app on Base Sepolia.

## Prerequisites

- Wallet with Base Sepolia ETH: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- RPC URL for Base Sepolia (Alchemy free tier is fine)
- Uniswap V3 QuoterV2 and SwapRouter addresses for Base Sepolia
- Token addresses with a liquid pool (e.g., WETH/USDC if available on Base Sepolia)

> Note: Test token addresses and pool availability on Base Sepolia vary. Ensure the pair you choose actually has liquidity on the testnet, otherwise quotes may revert or return 0.

## 1) Configure environment

Copy the example and fill in the values for Base Sepolia:

```bash
cp .env.local.example .env.local
```

Required for quoting and swapping:

- `NEXT_PUBLIC_UNISWAP_V3_QUOTER_ADDRESS`
- `NEXT_PUBLIC_UNISWAP_V3_SWAP_ROUTER_ADDRESS`
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`

Optional (used by the quote test script):

- `TEST_TOKEN_IN` – ERC-20 address for token in (e.g., WETH)
- `TEST_TOKEN_OUT` – ERC-20 address for token out (e.g., USDC)
- `TEST_DECIMALS_IN` – decimals for token in (18 for WETH)
- `TEST_DECIMALS_OUT` – decimals for token out (6 for USDC)
- `TEST_AMOUNT_IN` – human amount to test (e.g., 0.01)
- `TEST_POOL_FEE` – Uniswap pool fee (500/3000/10000)

## 2) Smoke test the Quoter

Run the quote smoke-test script. It does a read-only call to Uniswap's Quoter.

```bash
npm run test:swap:quote
```

Expected output when configured correctly:

- Shows chain (Base Sepolia)
- Prints the path and amountIn
- Displays amountOut in raw and formatted units

If it fails, check:

- Quoter address correct for Base Sepolia
- Token addresses are correct and a pool with the given fee exists
- RPC URL is working

## 3) Try a swap in the app

- Start the app and connect your wallet on Base Sepolia
- Navigate to the Stock ↔ Crypto Swap card
- Use the simple flow to swap WETH → USDC
  - Approve when prompted (approval goes to Universal Router)
  - Swap with small amount first

Troubleshooting:

- If Swap button is disabled, ensure the SwapRouter env var is set and you are on Base Sepolia
- If you see quote errors, re-check Quoter and token addresses; pool liquidity may be missing
- For native ETH, use WETH instead in the simple flow. The Advanced modal supports more paths.

## Tips

- Fees: 3000 is common for many WETH/USDC pools; try 500 or 10000 if your test pool uses those
- Deadline and slippage are configurable via env (`NEXT_PUBLIC_SLIPPAGE_BPS`, `NEXT_PUBLIC_SWAP_DEADLINE_SEC`)
- For broader pair coverage, consider using the Advanced Swap modal powered by OnchainKit
