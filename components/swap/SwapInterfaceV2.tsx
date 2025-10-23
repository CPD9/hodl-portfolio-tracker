'use client';

import { AlertCircle, ArrowDownUp, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';

import AmountInput from './AmountInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ERC20_ABI, STOCK_TOKENS, USDC_ADDRESS, WETH_ADDRESS } from '@/lib/contracts/stockCryptoSwap';
import Link from 'next/link';
import TokenSelector from './TokenSelector';
import { auth } from '@/lib/better-auth/auth-client';
import { toast } from 'sonner';
import { useRealtimeQuote } from '@/hooks/useRealtimeQuote';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  type: 'stock' | 'crypto';
}

const AVAILABLE_TOKENS: Token[] = [
  // Stock Tokens
  { address: STOCK_TOKENS.AAPL, symbol: 'AAPL', name: 'Apple Inc.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.TSLA, symbol: 'TSLA', name: 'Tesla Inc.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.NVDA, symbol: 'NVDA', name: 'NVIDIA Corp.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.MSFT, symbol: 'MSFT', name: 'Microsoft Corp.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.AMZN, symbol: 'AMZN', name: 'Amazon.com Inc.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.GOOGL, symbol: 'GOOGL', name: 'Alphabet Inc.', decimals: 18, type: 'stock' },
  // Crypto Tokens
  { address: WETH_ADDRESS, symbol: 'ETH', name: 'Ethereum', decimals: 18, type: 'crypto' },
  { address: USDC_ADDRESS, symbol: 'USDC', name: 'USD Coin', decimals: 6, type: 'crypto' },
  { address: '0x0000000000000000000000000000000000000001', symbol: 'BTC', name: 'Bitcoin', decimals: 8, type: 'crypto' },
];

export default function SwapInterfaceV2() {
  const { data: session } = auth.useSession();
  const [fromToken, setFromToken] = useState<Token>(AVAILABLE_TOKENS[8]); // BTC
  const [toToken, setToToken] = useState<Token>(AVAILABLE_TOKENS[0]); // AAPL
  const [fromAmount, setFromAmount] = useState('');
  const [fromBalance, setFromBalance] = useState('0');
  const [toBalance, setToBalance] = useState('0');
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
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(quote?.toAmount.toFixed(6) || '');
  };

  // Handle MAX button click
  const handleMaxClick = () => {
    setFromAmount(fromBalance);
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
    <Card className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-100">Swap Assets</h2>
          <p className="text-sm text-gray-400 mt-2">Trade tokenized stocks for crypto and vice versa</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refetch}
          disabled={quoteLoading}
          className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          title="Refresh prices"
        >
          <RefreshCw className={`w-5 h-5 ${quoteLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* From Token */}
      <div className="space-y-1 mb-1">
        <label className="text-sm font-medium text-gray-400">From</label>
        <TokenSelector
          tokens={AVAILABLE_TOKENS}
          selectedToken={fromToken}
          onSelectToken={setFromToken}
          otherToken={toToken}
        />
        <AmountInput
          value={fromAmount}
          onChange={setFromAmount}
          balance={fromBalance}
          token={fromToken}
          onMaxClick={handleMaxClick}
        />
        {quote && fromAmount && parseFloat(fromAmount) > 0 && (
          <p className="text-sm text-gray-400 mt-2 px-1">
            ≈ ${(parseFloat(fromAmount) * quote.fromPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </p>
        )}
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-4 relative z-10">
        <Button
          onClick={handleSwap}
          variant="ghost"
          size="icon"
          className="bg-gray-700 hover:bg-gray-600 rounded-full border-4 border-gray-800 shadow-lg"
        >
          <ArrowDownUp className="w-5 h-5 text-gray-300" />
        </Button>
      </div>

      {/* To Token */}
      <div className="space-y-1 mb-6">
        <label className="text-sm font-medium text-gray-400">To (Estimated)</label>
        <TokenSelector
          tokens={AVAILABLE_TOKENS}
          selectedToken={toToken}
          onSelectToken={setToToken}
          otherToken={fromToken}
        />
        <AmountInput
          value={quoteLoading ? '' : (quote?.toAmount.toFixed(6) || '0')}
          onChange={() => {}}
          balance={toBalance}
          token={toToken}
          readOnly
          isLoading={quoteLoading}
        />
        {quote && (
          <p className="text-sm text-gray-400 mt-2 px-1">
            ≈ ${(quote.toAmount * quote.toPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </p>
        )}
      </div>

      {/* Quote Info */}
      {quote && !quoteLoading && fromAmount && parseFloat(fromAmount) > 0 && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-sm text-gray-400 flex items-center">
              <i className='bx bx-transfer mr-2 text-gray-500'></i>
              Exchange Rate
            </span>
            <span className="text-sm text-gray-100 font-semibold">
              1 {fromToken.symbol} = {quote.exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toToken.symbol}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400 flex items-center">
              <i className='bx bx-trending-down mr-2 text-gray-500'></i>
              Price Impact
            </span>
            <span className="text-sm text-green-400 font-medium">&lt; {quote.priceImpact}%</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">{fromToken.symbol} Price</span>
            <span className="text-sm text-gray-100 font-medium">${quote.fromPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">{toToken.symbol} Price</span>
            <span className="text-sm text-gray-100 font-medium">${quote.toPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
        disabled={isExecuting || quoteLoading || !quote || !fromAmount || parseFloat(fromAmount) <= 0 || !session?.user}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
      >
        {isExecuting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Executing Swap...
          </div>
        ) : session?.user ? (
          <div className="flex items-center justify-center">
            <ArrowDownUp className="w-5 h-5 mr-2" />
            Execute Swap
          </div>
        ) : (
          'Sign In to Trade'
        )}
      </Button>

      {!session?.user && (
        <p className="text-sm text-center text-gray-400 mt-4">
          <Link href="/sign-in" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
            Sign in
          </Link>{' '}
          to start trading
        </p>
      )}

      {/* Paper Trading Notice */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center justify-center">
          <i className='bx bx-line-chart text-yellow-400 text-xl mr-2'></i>
          <p className="text-sm text-yellow-400 font-medium">
            Paper Trading Mode - All trades use virtual funds
          </p>
        </div>
      </div>
    </Card>
  );
}

