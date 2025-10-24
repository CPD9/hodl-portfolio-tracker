'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import PixelCharacter from '@/components/PixelCharacter';
import { coinbaseWallet } from 'wagmi/connectors';
import { useEffect } from 'react';

interface BaseAccountAuthProps {
  onAuthenticated?: () => void;
}

export default function BaseAccountAuth({ onAuthenticated }: BaseAccountAuthProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address && onAuthenticated) {
      onAuthenticated();
    }
  }, [isConnected, address, onAuthenticated]);

  const handleConnect = () => {
    connect({
      connector: coinbaseWallet({
        appName: 'HODL Portfolio Tracker',
        preference: 'smartWalletOnly',
      }),
    });
  };

  if (isConnected && address) {
    return (
      <Card className="p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-3">
            <PixelCharacter variant="hero" size="md" animated />
            <div>
              <p className="text-sm text-gray-400">Connected to Base</p>
              <p className="font-mono text-sm text-gray-200">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
              {chain && (
                <p className="text-xs text-gray-500">{chain.name}</p>
              )}
            </div>
          </div>
          <Button
            onClick={() => disconnect()}
            variant="outline"
            className="w-full border-gray-600 hover:bg-gray-800"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700 shadow-2xl">
      <div className="flex flex-col items-center space-y-6 text-center">
        {/* Animated Pixel Character */}
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <PixelCharacter variant="hero" size="xl" animated />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
            Welcome to HODL
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-md">
            Connect with Base Account to access your unified stock and crypto portfolio
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-700 text-left">
            <div className="flex items-start space-x-3">
              <i className='bx bx-wallet text-yellow-400 text-xl flex-shrink-0 mt-0.5'></i>
              <div>
                <h3 className="text-sm font-semibold text-gray-200">Smart Wallet</h3>
                <p className="text-xs text-gray-400">Gasless transactions with Base Smart Wallet</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-700 text-left">
            <div className="flex items-start space-x-3">
              <i className='bx bx-line-chart text-purple-400 text-xl flex-shrink-0 mt-0.5'></i>
              <div>
                <h3 className="text-sm font-semibold text-gray-200">Portfolio Tracking</h3>
                <p className="text-xs text-gray-400">Track stocks and crypto in one place</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-700 text-left">
            <div className="flex items-start space-x-3">
              <i className='bx bx-transfer text-green-400 text-xl flex-shrink-0 mt-0.5'></i>
              <div>
                <h3 className="text-sm font-semibold text-gray-200">Cross-Asset Swaps</h3>
                <p className="text-xs text-gray-400">Swap stocks for crypto and vice versa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connect Button */}
        <Button
          onClick={handleConnect}
          disabled={isPending}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-6 text-lg shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Connecting...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <i className='bx bx-wallet-alt text-xl mr-2'></i>
              Connect with Base Account
            </div>
          )}
        </Button>

        <p className="text-xs text-gray-500 max-w-sm">
          By connecting, you agree to our Terms of Service and Privacy Policy. 
          Your wallet stays secure with Base Smart Wallet technology.
        </p>
      </div>
    </Card>
  );
}

