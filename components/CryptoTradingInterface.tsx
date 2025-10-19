'use client';

import { DollarSign, Loader2, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { useState, useTransition, useEffect } from 'react';
import { buyCrypto, getUserCryptoPosition, sellCrypto } from '@/lib/actions/crypto-trading.actions';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CryptoTradingInterfaceProps {
  symbol: string;
  currentPrice: number;
  userId?: string;
  session?: any;
}

const CryptoTradingInterface: React.FC<CryptoTradingInterfaceProps> = ({
  symbol,
  currentPrice,
  userId,
  session,
}) => {
  const [quantity, setQuantity] = useState<number>(0.01);
  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL'>('BUY');
  const [isPending, startTransition] = useTransition();
  const [userPosition, setUserPosition] = useState<any | null>(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(true);

  // Load user position on mount
  useEffect(() => {
    const loadPosition = async () => {
      if (userId) {
        try {
          const position = await getUserCryptoPosition(userId, symbol);
          setUserPosition(position);
        } catch (error) {
          console.error('Error loading position:', error);
        } finally {
          setIsLoadingPosition(false);
        }
      } else {
        setIsLoadingPosition(false);
      }
    };

    loadPosition();
  }, [userId, symbol]);

  const total = currentPrice * quantity;
  const fee = total * 0.003; // 0.3% fee for crypto (typically higher than stocks)
  const totalWithFee = total + fee;

  const handleTrade = async () => {
    if (!userId) {
      toast.error('Please sign in to trade crypto');
      return;
    }

    if (quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    startTransition(async () => {
      try {
        let result;
        
        if (activeTab === 'BUY') {
          result = await buyCrypto(userId, symbol, quantity);
        } else {
          result = await sellCrypto(userId, symbol, quantity);
        }

        if (result.success) {
          toast.success(result.message);
          setQuantity(0.01);
          
          // Refresh position
          const updatedPosition = await getUserCryptoPosition(userId, symbol);
          setUserPosition(updatedPosition);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Crypto trade error:', error);
        toast.error('Failed to execute trade');
      }
    });
  };

  if (!session?.user) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Trade {symbol} on Base</h3>
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
          <p className="text-gray-300 text-sm">
            Sign in to trade cryptocurrencies on the Base blockchain network.
          </p>
        </div>
        <Button
          onClick={() => window.location.href = '/sign-in'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Sign In to Trade
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-100">Trade {symbol} on Base</h3>
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-gray-100 font-mono">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-blue-400">
          <Wallet className="w-3 h-3" />
          <span>Base Blockchain Network</span>
        </div>
      </div>

      {/* Current Position */}
      {!isLoadingPosition && userPosition && userPosition.quantity > 0 && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-100 mb-3">Your Position</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400">Amount</p>
              <p className="text-gray-100 font-semibold">{userPosition.quantity.toFixed(8)} {symbol}</p>
            </div>
            <div>
              <p className="text-gray-400">Avg Price</p>
              <p className="text-gray-100 font-semibold">${userPosition.avgPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Value</p>
              <p className="text-gray-100 font-semibold">${userPosition.currentValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">P&L</p>
              <p className={`font-semibold ${userPosition.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {userPosition.pnl >= 0 ? '+' : ''}${userPosition.pnl.toFixed(2)} ({userPosition.pnlPercentage.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Buy/Sell Tabs */}
      <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('BUY')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'BUY'
              ? 'bg-green-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Buy</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('SELL')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'SELL'
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          disabled={!userPosition || userPosition.quantity === 0}
        >
          <div className="flex items-center justify-center space-x-2">
            <TrendingDown className="w-4 h-4" />
            <span>Sell</span>
          </div>
        </button>
      </div>

      {/* Quantity Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Amount ({symbol})
        </label>
        <input
          type="number"
          step="0.00000001"
          min="0.00000001"
          max={activeTab === 'SELL' ? userPosition?.quantity : undefined}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0.00000001, parseFloat(e.target.value) || 0.01))}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          placeholder="0.01"
          disabled={isPending}
        />
        {activeTab === 'SELL' && userPosition && (
          <p className="mt-2 text-sm text-gray-400">
            Available: {userPosition.quantity.toFixed(8)} {symbol}
          </p>
        )}
        {/* Quick amount buttons */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setQuantity(0.01)}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
            disabled={isPending}
          >
            0.01
          </button>
          <button
            onClick={() => setQuantity(0.1)}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
            disabled={isPending}
          >
            0.1
          </button>
          <button
            onClick={() => setQuantity(1)}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
            disabled={isPending}
          >
            1
          </button>
          {activeTab === 'SELL' && userPosition && userPosition.quantity > 0 && (
            <button
              onClick={() => setQuantity(userPosition.quantity)}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
              disabled={isPending}
            >
              Max
            </button>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price per {symbol}</span>
          <span className="text-gray-100">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Amount</span>
          <span className="text-gray-100">{quantity.toFixed(8)} {symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-gray-100">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Network fee (0.3%)</span>
          <span className="text-gray-100">${fee.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-100 font-semibold">Total</span>
            <span className="text-gray-100 font-semibold">
              ${(activeTab === 'BUY' ? totalWithFee : total - fee).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Trade Button */}
      <Button
        onClick={handleTrade}
        disabled={isPending || (activeTab === 'SELL' && (!userPosition || userPosition.quantity === 0))}
        className={`w-full py-6 text-lg font-semibold ${
          activeTab === 'BUY'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        } text-white`}
      >
        {isPending ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <span>
            {activeTab === 'BUY' ? 'Buy' : 'Sell'} {symbol} on Base
          </span>
        )}
      </Button>

      {/* Info & Disclaimer */}
      <div className="mt-4 space-y-2">
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-gray-300">
            <strong className="text-blue-400">Base Network:</strong> Transactions are executed on the Base L2 blockchain for lower fees and faster confirmations.
          </p>
        </div>
        <p className="text-xs text-gray-500 text-center">
          This is simulated paper trading. No real cryptocurrency or money is involved.
        </p>
      </div>
    </div>
  );
};

export default CryptoTradingInterface;
