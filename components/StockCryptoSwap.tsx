'use client';

import { ArrowDownUp, Bitcoin, DollarSign, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { useState } from 'react';

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
  const [fromType, setFromType] = useState<'stock' | 'crypto'>('stock');
  const [selectedStock, setSelectedStock] = useState<Stock>(POPULAR_STOCKS[0]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto>(POPULAR_CRYPTO[0]);
  const [amount, setAmount] = useState<string>('1');

  const handleFlip = () => {
    setFromType(fromType === 'stock' ? 'crypto' : 'stock');
  };

  const calculateOutput = () => {
    const inputAmount = parseFloat(amount) || 0;
    if (fromType === 'stock') {
      // Stock → Crypto
      const stockValue = inputAmount * selectedStock.price;
      return (stockValue / selectedCrypto.price).toFixed(6);
    } else {
      // Crypto → Stock
      const cryptoValue = inputAmount * selectedCrypto.price;
      return (cryptoValue / selectedStock.price).toFixed(6);
    }
  };

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
                  {calculateOutput()}
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                ~${(parseFloat(calculateOutput()) * selectedStock.price).toLocaleString()} USD
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
                  {calculateOutput()}
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                ~${(parseFloat(calculateOutput()) * selectedCrypto.price).toLocaleString()} USD
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

        {/* SWAP BUTTON */}
        <Button
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black"
          disabled
        >
          Swap (Coming Soon)
        </Button>

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

