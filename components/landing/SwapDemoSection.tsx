'use client';

import { StockCryptoSwap } from '@/components/StockCryptoSwap';
import { OnchainProviders } from '@/components/OnchainProviders';

const SwapDemoSection = () => {
  return (
    <section id="swap-demo" className="py-20 px-4 lg:px-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Revolutionary <span className="text-yellow-500">Cross-Asset Trading</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Trade stocks for crypto and vice versa in seconds. Experience the future of unified asset trading on Base blockchain.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Lightning Fast
            </h3>
            <p className="text-sm text-gray-400">
              Complete swaps in ~5 seconds with instant settlement on Base L2
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Ultra Low Fees
            </h3>
            <p className="text-sm text-gray-400">
              ~$0.01 per transaction (99.95% cheaper than Ethereum mainnet)
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Fully Secured
            </h3>
            <p className="text-sm text-gray-400">
              100% on-chain reserves verified with Uniswap V3 integration
            </p>
          </div>
        </div>

        {/* Swap Component Demo */}
        <div className="max-w-2xl mx-auto">
          <OnchainProviders>
            <StockCryptoSwap />
          </OnchainProviders>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by Base L2, Uniswap V3, and OnchainKit
          </p>
        </div>
      </div>
    </section>
  );
};

export default SwapDemoSection;
