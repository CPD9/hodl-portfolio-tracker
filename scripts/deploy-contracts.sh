#!/bin/bash

# HODL Portfolio Rebalancer Deployment Script
# This script deploys the Portfolio Rebalancer contract to Base blockchain

set -e

echo "=========================================="
echo "HODL Smart Contract Deployment"
echo "=========================================="
echo ""

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not found. Installing..."
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
    echo "✅ Foundry installed!"
else
    echo "✅ Foundry found"
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with:"
    echo "  PRIVATE_KEY=0x..."
    echo "  BASESCAN_API_KEY=..."
    exit 1
fi

# Source .env file
source .env

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not found in .env"
    echo "Please add: PRIVATE_KEY=0x..."
    exit 1
fi

echo ""
echo "Select deployment network:"
echo "1) Base Sepolia (Testnet) - Recommended for testing"
echo "2) Base Mainnet (Production) - Use real ETH"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        NETWORK="base-sepolia"
        RPC_URL="${BASE_SEPOLIA_RPC_URL:-https://sepolia.base.org}"
        CHAIN_ID=84532
        echo ""
        echo "📡 Deploying to Base Sepolia..."
        echo "⚠️  Make sure you have Sepolia ETH!"
        echo "Get free testnet ETH: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
        ;;
    2)
        NETWORK="base"
        RPC_URL="${BASE_RPC_URL:-https://mainnet.base.org}"
        CHAIN_ID=8453
        echo ""
        echo "📡 Deploying to Base Mainnet..."
        echo "⚠️  This will use REAL ETH!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Deployment cancelled"
            exit 0
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📦 Installing dependencies..."
forge install foundry-rs/forge-std --no-commit 2>/dev/null || echo "Dependencies already installed"

echo ""
echo "🔨 Compiling contracts..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi

echo "✅ Compilation successful"
echo ""
echo "🚀 Deploying PortfolioRebalancer..."

# Deploy the contract
forge script contracts/script/DeployPortfolioRebalancer.s.sol \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify \
    --private-key $PRIVATE_KEY \
    -vvv

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed"
    echo "Common issues:"
    echo "  - Insufficient ETH for gas"
    echo "  - Wrong network"
    echo "  - Invalid private key"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📝 Next steps:"
echo "1. Copy the contract address from above"
echo "2. Add to your .env file:"
if [ "$NETWORK" = "base-sepolia" ]; then
    echo "   NEXT_PUBLIC_PORTFOLIO_REBALANCER_BASE_SEPOLIA=0x..."
else
    echo "   NEXT_PUBLIC_PORTFOLIO_REBALANCER_BASE=0x..."
fi
echo "3. Restart your Next.js dev server"
echo "4. Test the Portfolio Rebalancer on /base page"
echo ""
echo "🔗 View on explorer:"
if [ "$NETWORK" = "base-sepolia" ]; then
    echo "   https://sepolia.basescan.org/"
else
    echo "   https://basescan.org/"
fi
echo ""

