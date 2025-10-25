'use client';

import { DollarSign, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { buyStock, getUserPosition, sellStock } from '@/lib/actions/stock-trading.actions';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TradingInterfaceProps {
  symbol: string;
  currentPrice: number;
  userId: string;
  userPosition?: PortfolioHolding | null;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({
  symbol,
  currentPrice,
  userId,
  userPosition: initialPosition,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL'>('BUY');
  const [isPending, startTransition] = useTransition();
  const [userPosition, setUserPosition] = useState<PortfolioHolding | null>(initialPosition || null);

  const total = currentPrice * quantity;
  const fee = total * 0.001; // 0.1% fee
  const totalWithFee = total + fee;

  const handleTrade = async () => {
    if (!userId) {
      toast.error('Please sign in to trade');
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
          result = await buyStock(userId, symbol, quantity);
        } else {
          result = await sellStock(userId, symbol, quantity);
        }

        if (result.success) {
          toast.success(result.message);
          setQuantity(1);
          
          // Refresh position
          const updatedPosition = await getUserPosition(userId, symbol);
          setUserPosition(updatedPosition);
          
          // Trigger a custom event to notify other components (like dashboard)
          window.dispatchEvent(new CustomEvent('portfolioUpdated'));
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Trade error:', error);
        toast.error('Failed to execute trade');
      }
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-100">Trade {symbol}</h3>
        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-gray-100 font-mono">${currentPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Current Position */}
      {userPosition && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-100 mb-3">Your Position</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400">Shares</p>
              <p className="text-gray-100 font-semibold">{userPosition.quantity}</p>
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
          Quantity
        </label>
        <input
          type="number"
          min="1"
          max={activeTab === 'SELL' ? userPosition?.quantity : undefined}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quantity"
          disabled={isPending}
        />
        {activeTab === 'SELL' && userPosition && (
          <p className="mt-2 text-sm text-gray-400">
            Available: {userPosition.quantity} shares
          </p>
        )}
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price per share</span>
          <span className="text-gray-100">${currentPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Quantity</span>
          <span className="text-gray-100">{quantity}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-gray-100">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Trading fee (0.1%)</span>
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
            {activeTab === 'BUY' ? 'Buy' : 'Sell'} {symbol}
          </span>
        )}
      </Button>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        This is simulated paper trading. No real money is involved.
      </p>
    </div>
  );
};

export default TradingInterface;

