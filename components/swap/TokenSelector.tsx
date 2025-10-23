'use client';

import { ChevronDown, X } from 'lucide-react';
import React, { useState } from 'react';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
  type: 'stock' | 'crypto';
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  otherToken?: Token;
}

export default function TokenSelector({ tokens, selectedToken, onSelectToken, otherToken }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (token: Token) => {
    onSelectToken(token);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Selected Token Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            selectedToken.type === 'stock' ? 'bg-yellow-500/20' : 'bg-purple-500/20'
          }`}>
            <span className="text-lg font-bold">
              {selectedToken.symbol.charAt(0)}
            </span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-100">{selectedToken.symbol}</p>
            <p className="text-xs text-gray-400">{selectedToken.name}</p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100">Select Token</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stock Tokens */}
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Stock Tokens
              </p>
              {tokens.filter(t => t.type === 'stock').map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleSelect(token)}
                  disabled={otherToken?.address === token.address}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    otherToken?.address === token.address
                      ? 'opacity-40 cursor-not-allowed'
                      : selectedToken.address === token.address
                      ? 'bg-yellow-500/10 border border-yellow-500/30'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-yellow-500">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-100">{token.symbol}</p>
                    <p className="text-xs text-gray-400">{token.name}</p>
                  </div>
                  {selectedToken.address === token.address && (
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Crypto Tokens */}
            <div className="p-2 border-t border-gray-700">
              <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Crypto Tokens
              </p>
              {tokens.filter(t => t.type === 'crypto').map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleSelect(token)}
                  disabled={otherToken?.address === token.address}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    otherToken?.address === token.address
                      ? 'opacity-40 cursor-not-allowed'
                      : selectedToken.address === token.address
                      ? 'bg-purple-500/10 border border-purple-500/30'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-500">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-100">{token.symbol}</p>
                    <p className="text-xs text-gray-400">{token.name}</p>
                  </div>
                  {selectedToken.address === token.address && (
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

