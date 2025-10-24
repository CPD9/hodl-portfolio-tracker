'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import BaseAccountAuth from '@/components/miniapp/BaseAccountAuth';
import Link from 'next/link';
import { auth } from '@/lib/better-auth/auth-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  ArrowDownUp, 
  TrendingUp, 
  Wallet,
  ExternalLink 
} from 'lucide-react';

export default function MiniAppPage() {
  const { address, isConnected } = useAccount();
  const { data: session } = auth.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              HODL
            </div>
            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
              Mini App
            </span>
          </div>
          {isConnected && address && (
            <div className="text-xs text-gray-400 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {!isConnected ? (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-100">
                Your Unified Portfolio
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Track stocks and crypto together. Swap between assets seamlessly. 
                All on Base.
              </p>
            </div>

            {/* Auth Component */}
            <BaseAccountAuth />

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <Card className="p-6 bg-gray-800/50 border-gray-700">
                <i className='bx bx-shield-alt-2 text-3xl text-yellow-400 mb-3'></i>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Secure & Decentralized</h3>
                <p className="text-sm text-gray-400">
                  Built on Base with proof of reserves. Your assets, your control.
                </p>
              </Card>
              <Card className="p-6 bg-gray-800/50 border-gray-700">
                <i className='bx bx-dollar-circle text-3xl text-green-400 mb-3'></i>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Low Fees</h3>
                <p className="text-sm text-gray-400">
                  Sub-cent transaction fees on Base. Trade more, spend less.
                </p>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Welcome Message */}
            <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
              <div className="flex items-start space-x-4">
                <i className='bx bx-check-circle text-3xl text-yellow-400 flex-shrink-0'></i>
                <div>
                  <h2 className="text-xl font-bold text-gray-100 mb-1">
                    Connected to Base
                  </h2>
                  <p className="text-sm text-gray-300">
                    You're ready to explore HODL's features. Start tracking your portfolio or execute swaps.
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold text-gray-100">Quick Actions</h3>
              
              <Link href="/dashboard" className="block">
                <Card className="p-6 bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                        <BarChart3 className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-1">View Portfolio</h4>
                        <p className="text-sm text-gray-400">Track all your assets in one place</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link href="/dashboard/trade" className="block">
                <Card className="p-6 bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                        <ArrowDownUp className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-1">Swap Assets</h4>
                        <p className="text-sm text-gray-400">Trade stocks for crypto and vice versa</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link href="/dashboard/stocks" className="block">
                <Card className="p-6 bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-1">Browse Stocks</h4>
                        <p className="text-sm text-gray-400">Explore and trade tokenized stocks</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link href="/dashboard/base" className="block">
                <Card className="p-6 bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <Wallet className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-1">Base Integration</h4>
                        <p className="text-sm text-gray-400">Connect your Base wallet and explore DeFi</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Card>
              </Link>
            </div>

            {/* Stats Preview */}
            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Platform Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Network</p>
                  <p className="text-lg font-bold text-gray-100">Base Sepolia</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Stock Tokens</p>
                  <p className="text-lg font-bold text-gray-100">6 Available</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Transaction Fees</p>
                  <p className="text-lg font-bold text-green-400">&lt; $0.01</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <p className="text-lg font-bold text-green-400">Live</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 mt-12 border-t border-gray-800">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <Link href="/docs" className="hover:text-yellow-400 transition-colors">
              Documentation
            </Link>
            <a 
              href="https://github.com/CPD9/hodl-portfolio-tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              Built on Base
            </a>
          </div>
          <p className="text-xs text-gray-500">
            HODL Portfolio Tracker - START HACK 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

