'use client';

import { Activity, ArrowDownUp, BarChart3, DollarSign, Target, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getPortfolioSummary } from '@/lib/actions/portfolio.actions';
import { useSession } from '@/lib/better-auth/auth-client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PixelCharacter from '@/components/PixelCharacter';
import { toast } from 'sonner';

interface WalletConnection {
  address: string;
  isConnected: boolean;
  balance: string;
  chainId: number;
  chainName: string;
}

interface PortfolioData {
  totalValue: number;
  stockValue: number;
  cryptoValue: number;
  cashBalance: number;
  totalPnL: number;
  totalPnLPercentage: number;
  topHoldings: {
    symbol: string;
    type: 'STOCK' | 'CRYPTO';
    value: number;
    pnlPercentage: number;
  }[];
}

const UnifiedWalletDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem('wallet_address');
    if (savedAddress) {
      reconnectWallet(savedAddress);
    }
  }, []);

  const reconnectWallet = async (address: string) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        
        const ethBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
        
        setWallet({
          address,
          isConnected: true,
          balance: ethBalance,
          chainId: parseInt(chainId, 16),
          chainName: getChainName(parseInt(chainId, 16)),
        });
        
        await loadPortfolio(address);
      } catch (error) {
        console.error('Reconnection failed:', error);
        localStorage.removeItem('wallet_address');
      }
    }
  };

  const getChainName = (chainId: number): string => {
    const chains: Record<number, string> = {
      1: 'Ethereum Mainnet',
      11155111: 'Ethereum Sepolia',
      8453: 'Base Mainnet',
      84532: 'Base Sepolia',
      137: 'Polygon',
      80001: 'Mumbai Testnet',
    };
    return chains[chainId] || `Chain ${chainId}`;
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask or another Web3 wallet');
      return;
    }

    setLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      
      // Get chain info
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });

      const ethBalance = (parseInt(balance, 16) / 1e18).toFixed(4);

      const walletConnection: WalletConnection = {
        address,
        isConnected: true,
        balance: ethBalance,
        chainId: parseInt(chainId, 16),
        chainName: getChainName(parseInt(chainId, 16)),
      };

      setWallet(walletConnection);
      localStorage.setItem('wallet_address', address);
      
      // Load portfolio data
      await loadPortfolio(address);
      
      setShowDashboard(true);
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolio = async (address: string) => {
    try {
      if (!session?.user?.id) {
        console.log('No user session found');
        return;
      }

      const data = await getPortfolioSummary(session.user.id);
      
      if (!data) {
        console.log('No portfolio data returned');
        return;
      }

      // Calculate stock and crypto values from holdings
      const stockValue = data.holdings
        .filter(h => h.type === 'STOCK')
        .reduce((sum, h) => sum + h.currentValue, 0);
      
      const cryptoValue = data.holdings
        .filter(h => h.type === 'CRYPTO')
        .reduce((sum, h) => sum + h.currentValue, 0);

      // Get top 5 holdings by value
      const topHoldings = data.holdings
        .sort((a, b) => b.currentValue - a.currentValue)
        .slice(0, 5)
        .map(h => ({
          symbol: h.symbol,
          type: h.type,
          value: h.currentValue,
          pnlPercentage: h.pnlPercentage,
        }));

      setPortfolio({
        totalValue: data.totalValue,
        stockValue,
        cryptoValue,
        cashBalance: data.cashBalance,
        totalPnL: data.totalPnL,
        totalPnLPercentage: data.totalPnLPercentage,
        topHoldings,
      });
    } catch (error) {
      console.error('Error loading portfolio:', error);
      toast.error('Failed to load portfolio data');
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setPortfolio(null);
    setShowDashboard(false);
    localStorage.removeItem('wallet_address');
    toast.success('Wallet disconnected');
  };

  if (!isClient) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  // Wallet Not Connected State
  if (!wallet) {
    return (
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
        <div className="text-center space-y-6">
          {/* Animated Pixel Character */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <PixelCharacter variant="hero" size="xl" animated={true} />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-100">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Access your unified portfolio dashboard with real-time stock and crypto tracking
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-200">Asset Tracking</h3>
              <p className="text-xs text-gray-400 mt-1">Combined stock + crypto value</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-200">Portfolio Analytics</h3>
              <p className="text-xs text-gray-400 mt-1">Real-time performance metrics</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
              <ArrowDownUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-200">Instant Swaps</h3>
              <p className="text-xs text-gray-400 mt-1">Stock ↔ Crypto exchanges</p>
            </div>
          </div>

          {/* Connect Button */}
          <Button
            onClick={connectWallet}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg px-8 py-6 rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center">
                <Wallet className="w-5 h-5 mr-3" />
                Connect MetaMask
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            By connecting, you agree to our Terms of Service
          </p>
        </div>
      </div>
    );
  }

  // Wallet Connected - Portfolio Dashboard
  return (
    <div className="space-y-6">
      {/* Header with Wallet Info */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-purple-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-100">Connected Wallet</h3>
              <p className="text-sm text-gray-400 font-mono">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-700 rounded-lg px-4 py-2">
              <p className="text-xs text-gray-400">Balance</p>
              <p className="text-sm font-bold text-gray-100">{wallet.balance} ETH</p>
            </div>
            <div className="bg-gray-700 rounded-lg px-4 py-2">
              <p className="text-xs text-gray-400">Network</p>
              <p className="text-sm font-bold text-gray-100">{wallet.chainName}</p>
            </div>
            <Button
              onClick={disconnectWallet}
              variant="outline"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </div>

      {/* Net Worth Dashboard */}
      {portfolio && (
        <>
          {/* Paper Trading Badge */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 text-center">
            <p className="text-sm text-yellow-400 font-semibold">📊 Paper Trading Mode - Practice with $100,000 virtual cash</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Total Assets</span>
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-gray-100">
                ${portfolio.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                +${portfolio.cashBalance.toLocaleString()} cash
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Stock Portfolio</span>
                <BarChart3 className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-gray-100">
                ${portfolio.stockValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {portfolio.totalValue > 0 ? ((portfolio.stockValue / portfolio.totalValue) * 100).toFixed(1) : 0}% allocation
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Crypto Portfolio</span>
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-gray-100">
                ${portfolio.cryptoValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {portfolio.totalValue > 0 ? ((portfolio.cryptoValue / portfolio.totalValue) * 100).toFixed(1) : 0}% allocation
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Total P&L</span>
                {portfolio.totalPnL >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className={`text-3xl font-bold ${
                portfolio.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolio.totalPnL >= 0 ? '+' : ''}${Math.abs(portfolio.totalPnL).toLocaleString()}
              </p>
              <p className={`text-sm mt-2 ${
                portfolio.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolio.totalPnLPercentage >= 0 ? '+' : ''}{portfolio.totalPnLPercentage.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Asset Allocation & Top Holdings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Allocation */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                Asset Allocation
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Stocks</span>
                    <span className="text-sm text-yellow-400 font-semibold">
                      {((portfolio.stockValue / portfolio.totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-1000"
                      style={{ width: `${(portfolio.stockValue / portfolio.totalValue) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">${portfolio.stockValue.toLocaleString()}</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Crypto</span>
                    <span className="text-sm text-purple-400 font-semibold">
                      {((portfolio.cryptoValue / portfolio.totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-1000"
                      style={{ width: `${(portfolio.cryptoValue / portfolio.totalValue) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">${portfolio.cryptoValue.toLocaleString()}</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Cash</span>
                    <span className="text-sm text-green-400 font-semibold">
                      {((portfolio.cashBalance / (portfolio.totalValue + portfolio.cashBalance)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000"
                      style={{ width: `${(portfolio.cashBalance / (portfolio.totalValue + portfolio.cashBalance)) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">${portfolio.cashBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Top Holdings */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Top Holdings
              </h3>
              <div className="space-y-3">
                {portfolio.topHoldings.length > 0 ? (
                  portfolio.topHoldings.map((holding, index) => (
                    <Link
                      key={holding.symbol}
                      href={`/dashboard/${holding.type === 'STOCK' ? 'stocks' : 'crypto'}/${holding.symbol}`}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          holding.type === 'STOCK' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-100">{holding.symbol}</p>
                          <p className="text-xs text-gray-400">{holding.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-100">${holding.value.toLocaleString()}</p>
                        <p className={`text-xs font-medium ${
                          holding.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {holding.pnlPercentage >= 0 ? '+' : ''}{holding.pnlPercentage.toFixed(2)}%
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No holdings yet</p>
                    <p className="text-gray-500 text-xs mt-1">Start trading to see your top holdings here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/trade" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6">
                  <ArrowDownUp className="w-5 h-5 mr-2" />
                  Swap Assets
                </Button>
              </Link>
              <Link href="/dashboard/portfolio" className="block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Portfolio
                </Button>
              </Link>
              <Link href="/dashboard/stocks" className="block">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-gray-900 py-6">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Trade Stocks
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UnifiedWalletDashboard;

