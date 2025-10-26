"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState, useTransition } from 'react';

import { BasePortfolioSummary } from '@/lib/base/types';
import { Button } from '@/components/ui/button';
import PixelCharacter from '@/components/PixelCharacter';
import { getPortfolioSummary } from '@/lib/actions/base.actions';
import { toast } from 'sonner';

interface WalletConnection {
  address: string;
  isConnected: boolean;
  network: {
    chainId: number;
    chainName: string;
    rpcUrl: string;
    blockExplorerUrl: string;
    isTestnet: boolean;
  };
}

const BaseIntegration: React.FC = () => {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [portfolio, setPortfolio] = useState<BasePortfolioSummary | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Connect wallet following existing patterns
  const connectWallet = async () => {
    if (!isClient) return;
    
    setError(null);
    
    startTransition(async () => {
      try {
        // Check if wallet is available
        if (!window.ethereum) {
          throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
        }

        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts.length === 0) {
          throw new Error('No accounts found. Please connect your wallet.');
        }

        const address = accounts[0];
        
        // Switch to Base network
        await switchToBaseNetwork();

        // Create wallet connection object
        const walletConnection: WalletConnection = {
          address,
          isConnected: true,
          network: {
            chainId: 8453,
            chainName: 'Base',
            rpcUrl: 'https://mainnet.base.org',
            blockExplorerUrl: 'https://basescan.org',
            isTestnet: false,
          },
        };

        setWallet(walletConnection);
        localStorage.setItem('wallet_connected', 'true');
        localStorage.setItem('wallet_address', address);
        
        // Load portfolio data using server action
        await loadPortfolio(address);
        
        toast.success('Wallet connected successfully!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Connection failed';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  // Load portfolio data using server action
  const loadPortfolio = async (address: string) => {
    try {
      const portfolioData = await getPortfolioSummary(address);
      setPortfolio(portfolioData);
    } catch (err) {
      console.error('Error loading portfolio:', err);
      toast.error('Failed to load portfolio data');
    }
  };

  // Switch to Base network
  const switchToBaseNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }], // Base mainnet chain ID
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x2105',
            chainName: 'Base',
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
          }],
        });
      } else {
        throw switchError;
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet(null);
    setPortfolio(null);
    setError(null);
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
    toast.success('Wallet disconnected');
  };

  // Check for existing connection on mount
  useEffect(() => {
    if (!isClient) return;
    
    const isConnected = localStorage.getItem('wallet_connected');
    const address = localStorage.getItem('wallet_address');
    
    if (isConnected && address) {
      setWallet({
        address,
        isConnected: true,
        network: {
          chainId: 8453,
          chainName: 'Base',
          rpcUrl: 'https://mainnet.base.org',
          blockExplorerUrl: 'https://basescan.org',
          isTestnet: false,
        },
      });
      loadPortfolio(address);
    }
  }, [isClient]);

  // Show loading state while checking client-side
  if (!isClient) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-yellow-500">
            🔗 Connect to Base
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-400">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-100">Base Chain Portfolio</h3>
          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full flex-shrink-0"></div>
        </div>
        
        <div className="text-center py-6 md:py-8">
          <div className="flex justify-center mb-4">
            <PixelCharacter variant="hero" size="xl" animated={true} />
          </div>
          
          <h4 className="text-lg md:text-xl font-medium text-gray-100 mb-2">Connect Your Base Wallet</h4>
          <p className="text-sm md:text-base text-gray-400 mb-6 max-w-md mx-auto px-4">
            Track your Base portfolio alongside traditional stocks with real-time data and analytics
          </p>
          
          {/* Wallet Installation Guide */}
          {error && error.includes('No wallet found') && (
            <div className="bg-gray-700 rounded-lg p-3 md:p-4 mb-6 text-left max-w-md mx-auto">
              <h5 className="text-sm md:text-base text-blue-400 font-medium mb-2">Install Web3 Wallet</h5>
              <p className="text-xs md:text-sm text-gray-300 mb-3">
                To connect to Base, install MetaMask:
              </p>
              <ol className="text-xs md:text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Install <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">MetaMask</a> extension</li>
                <li>Create or import wallet</li>
                <li>Add Base network</li>
                <li>Connect below</li>
              </ol>
            </div>
          )}
          
          <Button 
            onClick={connectWallet}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium text-sm md:text-base"
          >
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </Button>
          
          {error && !error.includes('No wallet found') && (
            <p className="text-red-400 text-xs md:text-sm mt-3 px-4">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <div className="flex items-center space-x-2 md:space-x-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-100">Base Chain Portfolio</h3>
          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full flex-shrink-0"></div>
        </div>
        <Button 
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="text-gray-400 hover:text-white text-sm"
        >
          Disconnect
        </Button>
      </div>

      {/* Wallet Info */}
      <div className="mb-6 p-3 md:p-4 bg-gray-700 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <p className="text-xs md:text-sm text-gray-400">Connected Wallet</p>
            <p className="text-sm md:text-base text-gray-100 font-mono break-all sm:break-normal">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs md:text-sm text-gray-400">Network</p>
            <p className="text-sm md:text-base text-gray-100">{wallet.network.chainName}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Summary - TradingView Style */}
      {portfolio && (
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-gray-700 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-400">Total Value</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-100 break-words">
                ${portfolio.totalValueUSD.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-400">Tokens</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-100">
                {portfolio.tokenCount}
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-400">Gas Spent</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-100 break-words">
                ${portfolio.gasSpentUSD.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-400">DeFi Positions</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-100">
                {portfolio.defiPositions.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions - Table Style */}
      {portfolio?.recentTransactions && portfolio.recentTransactions.length > 0 && (
        <div>
          <h4 className="text-sm md:text-base font-semibold text-gray-100 mb-3 md:mb-4">Recent Transactions</h4>
          <div className="space-y-2">
            {portfolio.recentTransactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors gap-2">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-300">TX</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-mono text-gray-200 truncate">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs md:text-sm text-gray-200 whitespace-nowrap">
                    {(parseInt(tx.value, 16) / 1e18).toFixed(4)} ETH
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">Base Network</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseIntegration;