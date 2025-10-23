'use client';

import { AlertCircle, ArrowDownUp, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { auth } from '@/lib/better-auth/auth-client';
import { toast } from 'sonner';
import { useRealtimeQuote } from '@/hooks/useRealtimeQuote';

interface Token {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  icon?: string;
}

const AVAILABLE_TOKENS: Token[] = [
  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', icon: '🍎' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', icon: '🚗' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock', icon: '🎮' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', icon: '💻' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', icon: '📦' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', icon: '🔍' },
  // Crypto
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', icon: '⟠' },
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', icon: '₿' },
  { symbol: 'USDC', name: 'USD Coin', type: 'crypto', icon: '💵' },
];

export default function SwapInterfaceV2() {
  const { data: session } = auth.useSession();
  const [fromToken, setFromToken] = useState<Token>(AVAILABLE_TOKENS[7]); // USDC
  const [toToken, setToToken] = useState<Token>(AVAILABLE_TOKENS[0]); // AAPL
  const [fromAmount, setFromAmount] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get realtime quote
  const { quote, loading: quoteLoading, error: quoteError, refetch } = useRealtimeQuote({
    fromSymbol: fromToken.symbol,
    toSymbol: toToken.symbol,
    fromAmount,
    fromType: fromToken.type,
    toType: toToken.type,
    enabled: !!fromAmount && parseFloat(fromAmount) > 0,
  });

  // Handle token swap
  const handleSwap = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(quote?.toAmount.toFixed(6) || '');
  };

  // Execute swap (paper trading - updates database)
  const executeSwap = async () => {
    if (!session?.user?.id) {
      toast.error('Please sign in to trade');
      return;
    }

    if (!quote || !fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsExecuting(true);

    try {
      // Call your existing trade execution action
      // This would be similar to your existing buy/sell actions but for swaps
      const response = await fetch('/api/execute-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          fromSymbol: fromToken.symbol,
          toSymbol: toToken.symbol,
          fromAmount: parseFloat(fromAmount),
          toAmount: quote.toAmount,
          fromType: fromToken.type,
          toType: toToken.type,
          exchangeRate: quote.exchangeRate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          `Successfully swapped ${parseFloat(fromAmount).toFixed(2)} ${fromToken.symbol} for ${quote.toAmount.toFixed(4)} ${toToken.symbol}!`
        );
        toast.success('Swap executed successfully!');
        setFromAmount('');
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        toast.error(data.message || 'Swap failed');
      }
    } catch (error: any) {
      console.error('Swap execution error:', error);
      toast.error(error.message || 'Failed to execute swap');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6 bg-gray-800 border-gray-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Swap Assets</h2>
          <p className="text-sm text-gray-400 mt-1">Trade tokenized stocks for crypto and vice versa</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refetch}
          disabled={quoteLoading}
          className="text-gray-400 hover:text-gray-200"
        >
          <RefreshCw className={`w-5 h-5 ${quoteLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* From Token */}
      <div className="space-y-2 mb-4">
        <label className="text-sm text-gray-400">From</label>
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <select
              value={fromToken.symbol}
              onChange={(e) => {
                const token = AVAILABLE_TOKENS.find(t => t.symbol === e.target.value);
                if (token) setFromToken(token);
              }}
              className="bg-gray-800 text-gray-100 text-lg font-bold border-none outline-none cursor-pointer"
            >
              {AVAILABLE_TOKENS.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.icon} {token.symbol} - {token.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded">
              {fromToken.type.toUpperCase()}
            </span>
          </div>
          <input
            type="number"
            placeholder="0.00"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="w-full bg-transparent text-3xl font-bold text-gray-100 outline-none"
            min="0"
            step="0.01"
          />
          {quote && (
            <p className="text-xs text-gray-400 mt-2">
              ≈ ${(parseFloat(fromAmount) * quote.fromPrice).toFixed(2)} USD
            </p>
          )}
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <Button
          onClick={handleSwap}
          variant="ghost"
          size="icon"
          className="bg-gray-700 hover:bg-gray-600 rounded-full border-2 border-gray-800"
        >
          <ArrowDownUp className="w-5 h-5 text-gray-300" />
        </Button>
      </div>

      {/* To Token */}
      <div className="space-y-2 mb-6">
        <label className="text-sm text-gray-400">To</label>
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <select
              value={toToken.symbol}
              onChange={(e) => {
                const token = AVAILABLE_TOKENS.find(t => t.symbol === e.target.value);
                if (token) setToToken(token);
              }}
              className="bg-gray-800 text-gray-100 text-lg font-bold border-none outline-none cursor-pointer"
            >
              {AVAILABLE_TOKENS.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.icon} {token.symbol} - {token.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded">
              {toToken.type.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-100">
              {quoteLoading ? (
                <Loader2 className="w-8 h-8 animate-spin inline" />
              ) : quote?.toAmount ? (
                quote.toAmount.toFixed(6)
              ) : (
                '0.00'
              )}
            </p>
          </div>
          {quote && (
            <p className="text-xs text-gray-400 mt-2">
              ≈ ${(quote.toAmount * quote.toPrice).toFixed(2)} USD
            </p>
          )}
        </div>
      </div>

      {/* Quote Info */}
      {quote && !quoteLoading && (
        <div className="bg-gray-700/30 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Exchange Rate</span>
            <span className="text-gray-200 font-medium">
              1 {fromToken.symbol} = {quote.exchangeRate.toFixed(6)} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price Impact</span>
            <span className="text-green-400">&lt; {quote.priceImpact}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{fromToken.symbol} Price</span>
            <span className="text-gray-200">${quote.fromPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{toToken.symbol} Price</span>
            <span className="text-gray-200">${quote.toPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {quoteError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{quoteError}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4 flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Execute Button */}
      <Button
        onClick={executeSwap}
        disabled={isExecuting || quoteLoading || !quote || !fromAmount || parseFloat(fromAmount) <= 0}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExecuting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Executing Swap...
          </div>
        ) : session?.user ? (
          'Execute Swap'
        ) : (
          'Sign In to Trade'
        )}
      </Button>

      {!session?.user && (
        <p className="text-xs text-center text-gray-400 mt-3">
          <Link href="/sign-in" className="text-yellow-400 hover:underline">
            Sign in
          </Link>{' '}
          to start trading
        </p>
      )}

      {/* Paper Trading Notice */}
      <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-400 text-center">
          📊 Paper Trading Mode - All trades are simulated with virtual funds
        </p>
      </div>
    </Card>
  );
}

