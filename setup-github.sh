#!/bin/bash

# HODL Portfolio Tracker - GitHub Setup Script
# START HACK 2025 - Team HODL

echo "🚀 Setting up GitHub repository for HODL Portfolio Tracker"
echo "=================================================="

# Check if git remote exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Remote origin already exists"
    git remote -v
else
    echo "❌ No remote origin found"
    echo ""
    echo "Please create a GitHub repository first, then run:"
    echo ""
    echo "git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo "git push -u origin hackathon-development"
    echo ""
    echo "Replace YOUR_USERNAME and REPOSITORY_NAME with your actual values"
fi

echo ""
echo "📋 Recommended repository settings:"
echo "- Name: hodl-portfolio-tracker or start-hack-2025-hodl"
echo "- Description: HODL - Advanced Stock & Crypto Tracker with Base Integration for START HACK 2025"
echo "- Visibility: Public"
echo "- Topics: start-hack-2025, base-blockchain, coinbase, portfolio-tracker, web3, defi, nextjs, typescript"
echo ""
echo "🎯 Current branch: $(git branch --show-current)"
echo "📊 Files ready to push: $(git ls-files | wc -l) files"
