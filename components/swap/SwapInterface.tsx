'use client';

import { AlertCircle, ArrowDownUp, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { ERC20_ABI, STOCK_TOKENS, USDC_ADDRESS, WETH_ADDRESS } from '@/lib/contracts/stockCryptoSwap';
import React, { useCallback, useEffect, useState } from 'react';

import AmountInput from './AmountInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SwapService } from '@/lib/web3/swapService';
import TokenSelector from './TokenSelector';
import { ethers } from 'ethers';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
  type: 'stock' | 'crypto';
}

// Available tokens for swapping
const AVAILABLE_TOKENS: Token[] = [
  // Stock Tokens
  { address: STOCK_TOKENS.AAPL, symbol: 'AAPL', name: 'Apple Inc.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.TSLA, symbol: 'TSLA', name: 'Tesla Inc.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.NVDA, symbol: 'NVDA', name: 'NVIDIA Corp.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.MSFT, symbol: 'MSFT', name: 'Microsoft Corp.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.AMZN, symbol: 'AMZN', name: 'Amazon.com Inc.', decimals: 18, type: 'stock' },
  { address: STOCK_TOKENS.GOOGL, symbol: 'GOOGL', name: 'Alphabet Inc.', decimals: 18, type: 'stock' },
  // Crypto Tokens
  { address: WETH_ADDRESS, symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, type: 'crypto' },
  { address: USDC_ADDRESS, symbol: 'USDC', name: 'USD Coin', decimals: 6, type: 'crypto' },
];

type SwapStatus = 'idle' | 'approving' | 'swapping' | 'success' | 'error';

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState<Token>(AVAILABLE_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(AVAILABLE_TOKENS[6]); // WETH
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromBalance, setFromBalance] = useState<string>('0');
  const [toBalance, setToBalance] = useState<string>('0');
  const [quote, setQuote] = useState<any>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [swapStatus, setSwapStatus] = useState<SwapStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [swapService, setSwapService] = useState<SwapService | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);

  // Initialize swap service and connect wallet
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const service = new SwapService();
        await service.connect();
        setSwapService(service);

        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      }
    };

    init();
  }, []);

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    if (!swapService || !userAddress) return;

    try {
      const fromBal = await swapService.getTokenBalance(fromToken.address, userAddress);
      const toBal = await swapService.getTokenBalance(toToken.address, userAddress);
      
      setFromBalance(ethers.utils.formatUnits(fromBal, fromToken.decimals));
      setToBalance(ethers.utils.formatUnits(toBal, toToken.decimals));
    } catch (error: any) {
      // Silently handle CALL_EXCEPTION errors (contract not deployed on current network)
      if (error.code === 'CALL_EXCEPTION') {
        setFromBalance('0');
        setToBalance('0');
      } else {
        console.error('Error fetching balances:', error);
      }
    }
  }, [swapService, userAddress, fromToken, toToken]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Get quote whenever amount or tokens change
  useEffect(() => {
    const getQuote = async () => {
      if (!swapService || !fromAmount || parseFloat(fromAmount) <= 0) {
        setToAmount('');
        setQuote(null);
        return;
      }

      setIsLoadingQuote(true);
      try {
        const amount = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
        const quoteResult = await swapService.getQuote(
          fromToken.address,
          toToken.address,
          amount
        );

        setQuote(quoteResult);
        setToAmount(ethers.utils.formatUnits(quoteResult.outputAmount, toToken.decimals));
      } catch (error: any) {
        // Silently handle CALL_EXCEPTION errors (contract not deployed on current network)
        if (error.code !== 'CALL_EXCEPTION') {
          console.error('Error getting quote:', error);
        }
        setToAmount('0');
        setQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    const debounce = setTimeout(getQuote, 500);
    return () => clearTimeout(debounce);
  }, [fromAmount, fromToken, toToken, swapService]);

  // Check approval status
  const checkApproval = useCallback(async () => {
    if (!swapService || !fromAmount || !userAddress) {
      setNeedsApproval(false);
      return;
    }

    try {
      const amount = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const tokenContract = new ethers.Contract(fromToken.address, ERC20_ABI, provider);
      
      // Check allowance for Uniswap Router (for crypto-crypto swaps)
      const UNISWAP_ROUTER = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3';
      const allowance = await tokenContract.allowance(userAddress, UNISWAP_ROUTER);
      
      setNeedsApproval(allowance.lt(amount));
    } catch (error: any) {
      // Silently handle CALL_EXCEPTION errors (contract not deployed on current network)
      if (error.code !== 'CALL_EXCEPTION') {
        console.error('Error checking approval:', error);
      }
      setNeedsApproval(true);
    }
  }, [swapService, fromAmount, fromToken, userAddress]);

  useEffect(() => {
    checkApproval();
  }, [checkApproval]);

  // Handle token swap
  const handleSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Handle approval
  const handleApprove = async () => {
    if (!swapService || !fromAmount) return;

    setSwapStatus('approving');
    setStatusMessage('Approving token spend...');

    try {
      const amount = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
      const UNISWAP_ROUTER = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3';
      
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(fromToken.address, ERC20_ABI, signer);
      
      const tx = await tokenContract.approve(UNISWAP_ROUTER, amount);
      setStatusMessage('Waiting for approval confirmation...');
      await tx.wait();
      
      setNeedsApproval(false);
      setSwapStatus('success');
      setStatusMessage('Token approved successfully!');
      
      setTimeout(() => {
        setSwapStatus('idle');
        setStatusMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Approval error:', error);
      setSwapStatus('error');
      setStatusMessage(error.message || 'Approval failed');
      
      setTimeout(() => {
        setSwapStatus('idle');
        setStatusMessage('');
      }, 5000);
    }
  };

  // Handle execute swap
  const handleExecuteSwap = async () => {
    if (!swapService || !fromAmount || !quote) return;

    setSwapStatus('swapping');
    setStatusMessage('Executing swap...');

    try {
      const amount = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
      const minOutput = quote.outputAmount.mul(95).div(100); // 5% slippage
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      const tx = await swapService.executeSwap({
        fromToken: fromToken.address,
        toToken: toToken.address,
        amount,
        minOutput,
        deadline,
        userAddress
      });

      setStatusMessage('Waiting for transaction confirmation...');
      await tx.wait();
      
      setSwapStatus('success');
      setStatusMessage('Swap completed successfully!');
      
      // Refresh balances
      fetchBalances();
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFromAmount('');
        setToAmount('');
        setQuote(null);
        setSwapStatus('idle');
        setStatusMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Swap error:', error);
      setSwapStatus('error');
      setStatusMessage(error.message || 'Swap failed');
      
      setTimeout(() => {
        setSwapStatus('idle');
        setStatusMessage('');
      }, 5000);
    }
  };

  const canSwap = fromAmount && parseFloat(fromAmount) > 0 && quote && swapStatus === 'idle' && !needsApproval;

  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      {/* From Token */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">From</label>
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
          onMaxClick={() => setFromAmount(fromBalance)}
        />
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-4">
        <button
          onClick={handleSwap}
          className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
          disabled={swapStatus !== 'idle'}
        >
          <ArrowDownUp className="w-6 h-6 text-gray-300" />
        </button>
      </div>

      {/* To Token */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">To</label>
        <TokenSelector
          tokens={AVAILABLE_TOKENS}
          selectedToken={toToken}
          onSelectToken={setToToken}
          otherToken={fromToken}
        />
        <AmountInput
          value={toAmount}
          onChange={() => {}} // Read-only
          balance={toBalance}
          token={toToken}
          readOnly
          isLoading={isLoadingQuote}
        />
      </div>

      {/* Quote Info */}
      {quote && (
        <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Exchange Rate</span>
            <span className="text-gray-200">
              1 {fromToken.symbol} = {parseFloat(quote.exchangeRate).toFixed(6)} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Price Impact</span>
            <span className={quote.priceImpact > 5 ? 'text-red-400' : 'text-green-400'}>
              {quote.priceImpact.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Route</span>
            <span className="text-gray-200 text-right">
              {quote.route.map((addr: string, idx: number) => {
                const token = AVAILABLE_TOKENS.find(t => t.address.toLowerCase() === addr.toLowerCase());
                return token ? token.symbol : addr.slice(0, 6);
              }).join(' → ')}
            </span>
          </div>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className={`mb-4 p-4 rounded-lg flex items-center ${
          swapStatus === 'success' ? 'bg-green-900/20 border border-green-700' :
          swapStatus === 'error' ? 'bg-red-900/20 border border-red-700' :
          'bg-blue-900/20 border border-blue-700'
        }`}>
          {swapStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400 mr-3" />}
          {swapStatus === 'error' && <XCircle className="w-5 h-5 text-red-400 mr-3" />}
          {(swapStatus === 'approving' || swapStatus === 'swapping') && <Loader2 className="w-5 h-5 text-blue-400 mr-3 animate-spin" />}
          {!['success', 'error', 'approving', 'swapping'].includes(swapStatus) && <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />}
          <span className="text-sm text-gray-200">{statusMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      {!userAddress ? (
        <Button className="w-full bg-gradient-to-r from-yellow-500 to-purple-500 hover:from-yellow-600 hover:to-purple-600 text-black font-semibold">
          Connect Wallet
        </Button>
      ) : needsApproval ? (
        <Button
          onClick={handleApprove}
          disabled={swapStatus !== 'idle'}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
        >
          {swapStatus === 'approving' ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Approving...</>
          ) : (
            `Approve ${fromToken.symbol}`
          )}
        </Button>
      ) : (
        <Button
          onClick={handleExecuteSwap}
          disabled={!canSwap || swapStatus === 'swapping'}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {swapStatus === 'swapping' ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Swapping...</>
          ) : (
            'Execute Swap'
          )}
        </Button>
      )}
    </Card>
  );
}

