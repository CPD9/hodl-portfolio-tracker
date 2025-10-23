'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  type: 'stock' | 'crypto';
}

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  balance: string;
  token: Token;
  readOnly?: boolean;
  onMaxClick?: () => void;
  isLoading?: boolean;
}

export default function AmountInput({ 
  value, 
  onChange, 
  balance, 
  token, 
  readOnly = false,
  onMaxClick,
  isLoading = false
}: AmountInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const val = e.target.value;
    // Allow only numbers and decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="mt-2 relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder="0.0"
          className={`w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-2xl font-semibold text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gray-600 ${
            readOnly ? 'cursor-default' : ''
          }`}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
      
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Balance: {parseFloat(balance).toFixed(4)} {token.symbol}
        </span>
        {!readOnly && onMaxClick && parseFloat(balance) > 0 && (
          <button
            onClick={onMaxClick}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-yellow-400 font-semibold transition-colors"
          >
            MAX
          </button>
        )}
      </div>
    </div>
  );
}

