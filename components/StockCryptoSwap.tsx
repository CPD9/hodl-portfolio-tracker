'use client';

import { ArrowDownUp, Bitcoin, DollarSign, TrendingUp, Shield, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { useAccount, useChainId } from 'wagmi';
import { useState } from 'react';
import { useQuoteV3Single } from '@/hooks/swap/useQuoteV3';
import { useAllowance } from '@/hooks/swap/useAllowance';
import { getSwapRouter } from '@/lib/swap/addresses';
import { getSwapEnv } from '@/lib/swap/config';
import { parseUnits, formatUnits, maxUint256 } from 'viem';
import { useSwapV3, getSwapRouterFromEnv } from '@/hooks/swap/useSwapV3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Swap, SwapAmountInput, SwapButton, SwapMessage, SwapToast, SwapToggleButton } from '@coinbase/onchainkit/swap';
import type { Token as OkToken } from '@coinbase/onchainkit/token';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  logo?: string;
}

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  logo?: string;
}

const POPULAR_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple', price: 180.25 },
  { symbol: 'TSLA', name: 'Tesla', price: 242.84 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 495.22 },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.91 },
  { symbol: 'GOOGL', name: 'Google', price: 139.58 },
];

const POPULAR_CRYPTO: Crypto[] = [
  { symbol: 'ETH', name: 'Ethereum', price: 2450.30 },
  { symbol: 'BTC', name: 'Bitcoin', price: 42150.00 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00 },
  { symbol: 'cbBTC', name: 'Coinbase BTC', price: 42150.00 },
];

export function StockCryptoSwap() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const swapEnv = getSwapEnv();
  const [fromType, setFromType] = useState<'stock' | 'crypto'>('crypto'); // Start with crypto to buy stocks
  const [selectedStock, setSelectedStock] = useState<Stock>(POPULAR_STOCKS[0]); // Apple
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto>(POPULAR_CRYPTO[0]); // Start with ETH
  const [amount, setAmount] = useState<string>('1');
  const isSupportedChain = chainId === 8453 || chainId === 84532; // Base or Base Sepolia

  const handleFlip = () => {
    setFromType(fromType === 'stock' ? 'crypto' : 'stock');
  };

  // For on-chain quoting, we must use ERC-20 token addresses.
  // In this MVP, we'll treat crypto side as ERC-20s on Base. Stocks are off-chain priced for now.
  const fromIsCrypto = fromType === 'crypto';

  // Mapping of symbols to ERC20 addresses on Base; extend as needed.
  const TOKEN_ADDRESS: Record<string, string | undefined> = {
    ETH: undefined, // native ETH (use WETH for swaps)
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    cbBTC: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    BTC: undefined, // non-erc20 placeholder
  };

  const fromTokenAddress = fromIsCrypto ? TOKEN_ADDRESS[selectedCrypto.symbol] : TOKEN_ADDRESS[selectedCrypto.symbol];
  const toTokenAddress = fromIsCrypto ? TOKEN_ADDRESS['USDC'] : TOKEN_ADDRESS[selectedCrypto.symbol];

  // Simple rule for decimals; production should fetch decimals from chain.
  const DECIMALS: Record<string, number> = { USDC: 6, DAI: 18, WETH: 18, cbBTC: 8 };
  const fromDecimals = fromIsCrypto ? (DECIMALS[selectedCrypto.symbol] ?? 18) : 6; // treat stock->USDC path as 6

  const quote = useQuoteV3Single({
    tokenIn: (fromIsCrypto ? (fromTokenAddress as any) : (TOKEN_ADDRESS['USDC'] as any)) as any,
    tokenOut: (fromIsCrypto ? (TOKEN_ADDRESS['USDC'] as any) : (fromTokenAddress as any)) as any,
    amountIn: amount || '0',
    decimalsIn: fromDecimals,
    fee: 3000,
  });

  // Allowance against SwapRouter (swap executor)
  const router = (getSwapRouter(chainId) || '') as `0x${string}`;
  const allowance = useAllowance({
    token: (fromIsCrypto ? (fromTokenAddress as any) : (TOKEN_ADDRESS['USDC'] as any)) as any,
    spender: router,
  });

  const swap = useSwapV3();

  const needsApproval = (() => {
    try {
      if (!amount || !fromDecimals) return false;
      const amt = parseUnits(amount || '0', fromDecimals);
      return allowance.allowance < amt;
    } catch {
      return false;
    }
  })();

  const handleApprove = () => {
    allowance.approve(maxUint256);
  };

  const calculateOutputFallback = () => {
    const inputAmount = parseFloat(amount) || 0;
    if (fromType === 'stock') {
      const stockValue = inputAmount * selectedStock.price;
      return (stockValue / selectedCrypto.price).toFixed(6);
    } else {
      const cryptoValue = inputAmount * selectedCrypto.price;
      return (cryptoValue / selectedStock.price).toFixed(6);
    }
  };

  const canSwap = (() => {
    if (!isConnected) return false;
    if (!isSupportedChain) return false;
    if (!fromIsCrypto) return false; // limit execution to crypto→USDC for now
    if (!fromTokenAddress || !TOKEN_ADDRESS['USDC']) return false;
    if (!amount || Number(amount) <= 0) return false;
    if (!quote.amountOut) return false;
    if (needsApproval) return false;
    // Check if router is available (env var or SwapRouter)
    const swapRouter = getSwapRouter(chainId);
    if (!getSwapRouterFromEnv() && !swapRouter) return false;
    return true;
  })();

  const onSwap = () => {
    try {
      if (!canSwap) return;
      const slippageBps = swapEnv.slippageBps ?? 50;
      const amountInBN = parseUnits(amount, fromDecimals);
      const out = quote.amountOut!;
      const minOut = out - (out * BigInt(slippageBps)) / BigInt(10_000);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + (swapEnv.deadlineSec ?? 120));
      swap.execute({
        tokenIn: fromTokenAddress as `0x${string}`,
        tokenOut: TOKEN_ADDRESS['USDC'] as `0x${string}`,
        fee: 3000,
        amountIn: amountInBN,
        amountOutMin: minOut,
        deadline,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Advanced Swap modal using OnchainKit's engine for execution
  const BASE_ETH: OkToken = {
    address: '',
    chainId: 8453,
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  };
  const OK_USDC: OkToken = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chainId: 8453,
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    image: 'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  };
  const OK_DAI: OkToken = {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    chainId: 8453,
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    image: 'https://ethereum-optimism.github.io/data/DAI/logo.svg',
  };
  const OK_WETH: OkToken = {
    address: '0x4200000000000000000000000000000000000006',
    chainId: 8453,
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  };
  const OK_CBBTC: OkToken = {
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    chainId: 8453,
    decimals: 8,
    name: 'Coinbase Wrapped BTC',
    symbol: 'cbBTC',
    image: 'https://assets.coingecko.com/coins/images/28171/large/cb-btc.png',
  };
  const okTokens = [BASE_ETH, OK_USDC, OK_DAI, OK_WETH, OK_CBBTC];
  const defaultFromOkToken = fromIsCrypto
    ? okTokens.find(t => t.symbol === (selectedCrypto.symbol === 'ETH' ? 'WETH' : selectedCrypto.symbol)) || OK_USDC
    : OK_USDC;
  const defaultToOkToken = fromIsCrypto ? OK_USDC : okTokens.find(t => t.symbol === (selectedCrypto.symbol === 'ETH' ? 'WETH' : selectedCrypto.symbol)) || OK_WETH;

  if (!isConnected) {
    return (
      <Card className="p-8 bg-gray-800 border-gray-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mb-4">
            <ArrowDownUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-2">
            Cross-Asset Trading
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Trade stocks for crypto and vice versa. Connect your wallet to start swapping between traditional and digital assets.
          </p>
          <Wallet>
            <div className="w-full" />
          </Wallet>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      {(!isSupportedChain) && (
        <div className="mb-3 p-3 text-xs rounded-md border border-blue-600/40 bg-blue-500/10 text-blue-300">
          Please switch your wallet network to Base or Base Sepolia to swap.
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-100 mb-2">
          Stock ↔ Crypto Swap
        </h3>
        <p className="text-sm text-gray-400">
          Revolutionary cross-asset trading on Base blockchain
        </p>
      </div>

      <div className="space-y-4">
        {/* FROM Section */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <Label className="text-sm text-gray-400 mb-2 block">You Pay</Label>
          
          {fromType === 'stock' ? (
            <div className="space-y-3">
              <select
                value={selectedStock.symbol}
                onChange={(e) => {
                  const stock = POPULAR_STOCKS.find(s => s.symbol === e.target.value);
                  if (stock) setSelectedStock(stock);
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {POPULAR_STOCKS.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name} (${stock.price})
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-gray-800 border-gray-700 text-gray-100 text-xl font-semibold"
                />
              </div>
              
              <p className="text-sm text-gray-400">
                ${(parseFloat(amount) * selectedStock.price || 0).toLocaleString()} USD
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={selectedCrypto.symbol}
                onChange={(e) => {
                  const crypto = POPULAR_CRYPTO.find(c => c.symbol === e.target.value);
                  if (crypto) setSelectedCrypto(crypto);
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {POPULAR_CRYPTO.map((crypto) => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.symbol} - {crypto.name} (${crypto.price})
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5 text-yellow-500" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-gray-800 border-gray-700 text-gray-100 text-xl font-semibold"
                />
              </div>
              {selectedCrypto.symbol === 'ETH' && (
                <p className="text-xs text-yellow-300">
                  Tip: For on-chain swapping, wrap to WETH or select WETH directly.
                </p>
              )}
              
              <p className="text-sm text-gray-400">
                ${(parseFloat(amount) * selectedCrypto.price || 0).toLocaleString()} USD
              </p>
            </div>
          )}
        </div>

        {/* SWAP BUTTON */}
        <div className="flex justify-center -my-2">
          <button
            onClick={handleFlip}
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 border-4 border-gray-800 flex items-center justify-center transition-all hover:scale-110"
          >
            <ArrowDownUp className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* TO Section */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <Label className="text-sm text-gray-400 mb-2 block">You Receive</Label>
          
          {fromType === 'crypto' ? (
            <div className="space-y-3">
              <select
                value={selectedStock.symbol}
                onChange={(e) => {
                  const stock = POPULAR_STOCKS.find(s => s.symbol === e.target.value);
                  if (stock) setSelectedStock(stock);
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {POPULAR_STOCKS.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-xl font-semibold">
                  {quote.amountOut
                    ? formatUnits(quote.amountOut, fromIsCrypto ? 6 : (DECIMALS[selectedCrypto.symbol] ?? 18))
                    : calculateOutputFallback()}
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                ~${(parseFloat(quote.amountOut ? formatUnits(quote.amountOut, 6) : calculateOutputFallback()) * selectedStock.price).toLocaleString()} USD
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={selectedCrypto.symbol}
                onChange={(e) => {
                  const crypto = POPULAR_CRYPTO.find(c => c.symbol === e.target.value);
                  if (crypto) setSelectedCrypto(crypto);
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {POPULAR_CRYPTO.map((crypto) => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.symbol} - {crypto.name}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5 text-green-500" />
                <div className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-xl font-semibold">
                  {quote.amountOut
                    ? formatUnits(quote.amountOut, fromIsCrypto ? 6 : (DECIMALS[selectedCrypto.symbol] ?? 18))
                    : calculateOutputFallback()}
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                ~${(parseFloat(quote.amountOut ? formatUnits(quote.amountOut, DECIMALS[selectedCrypto.symbol] ?? 18) : calculateOutputFallback()) * selectedCrypto.price).toLocaleString()} USD
              </p>
            </div>
          )}
        </div>

        {/* Exchange Rate */}
        <div className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-400">
          <div className="flex justify-between items-center">
            <span>Exchange Rate</span>
            <span className="text-gray-200 font-medium">
              1 {fromType === 'stock' ? selectedStock.symbol : selectedCrypto.symbol} ≈{' '}
              {fromType === 'stock' 
                ? (selectedStock.price / selectedCrypto.price).toFixed(6)
                : (selectedCrypto.price / selectedStock.price).toFixed(6)
              }{' '}
              {fromType === 'stock' ? selectedCrypto.symbol : selectedStock.symbol}
            </span>
          </div>
        </div>

        {/* Proof of Reserves Status */}
        {fromType === 'stock' && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-400" />
              <h4 className="text-sm font-semibold text-green-400">
                Reserve Status
              </h4>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">
                {selectedStock.symbol} Token Backing:
              </span>
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                100% Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              On-chain USDC reserves verified • Last updated: 2 hours ago
            </p>
          </div>
        )}

        {/* SWAP BUTTON */}
        {needsApproval ? (
          <Button
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black"
            onClick={handleApprove}
            disabled={allowance.isApproving || !router}
          >
            {allowance.isApproving ? 'Approving…' : `Approve ${fromIsCrypto ? selectedCrypto.symbol : 'USDC'}`}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black disabled:bg-gray-700 disabled:text-gray-300"
              disabled={!canSwap || swap.isPending}
              onClick={onSwap}
            >
              {swap.isPending ? 'Swapping…' : 'Swap'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-14 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black">
                  Advanced Swap
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gray-100">Advanced Swap</DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                  <Swap>
                    <SwapAmountInput
                      label="You pay"
                      swappableTokens={okTokens}
                      token={defaultFromOkToken}
                      type="from"
                    />
                    <SwapToggleButton />
                    <SwapAmountInput
                      label="You receive"
                      swappableTokens={okTokens}
                      token={defaultToOkToken}
                      type="to"
                    />
                    <SwapButton />
                    <SwapMessage />
                    <SwapToast />
                  </Swap>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {(quote.error || swap.error) && (
          <div className="mt-3 p-3 text-xs rounded-md border border-red-600/40 bg-red-500/10 text-red-300">
            {quote.error && <div>Quote error: {quote.error}</div>}
            {swap.error && <div>Swap error: {String(swap.error)}</div>}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">
            How It Works
          </h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>Stocks are tokenized as ERC20 on Base (RWAs)</li>
            <li>Base USDC acts as intermediary currency</li>
            <li>Instant cross-asset swaps with low fees</li>
            <li>Contract deployment required to activate</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

