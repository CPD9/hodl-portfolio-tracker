import React from 'react';
import SwapInterfaceV2 from '@/components/swap/SwapInterfaceV2';

export default function TradePage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100 mb-3">
          Stock ↔ Crypto Swap
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Trade tokenized stocks for crypto and vice versa with revolutionary cross-asset swaps
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto mt-8">
        <SwapInterfaceV2 />
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
              <i className='bx bx-lock-alt text-yellow-500 text-xl'></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Secure</h3>
          </div>
          <p className="text-sm text-gray-400">
            Non-custodial swaps powered by audited smart contracts on Ethereum Sepolia
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <i className='bx bx-tachometer text-green-500 text-xl'></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Fast</h3>
          </div>
          <p className="text-sm text-gray-400">
            Lightning-fast swaps with real-time pricing via Uniswap V2 liquidity pools
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
              <i className='bx bx-dollar-circle text-purple-500 text-xl'></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Low Fees</h3>
          </div>
          <p className="text-sm text-gray-400">
            Minimal gas fees on Ethereum Sepolia, typically under $0.10 per transaction
          </p>
        </div>
      </div>
    </div>
  );
}

