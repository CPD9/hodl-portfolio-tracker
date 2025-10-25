'use client';

import { motion } from 'framer-motion';
import ProofOfReserves from '@/components/ProofOfReserves';
import 'boxicons/css/boxicons.min.css';

const ProofOfReservesSection = () => {
  return (
    <section id="proof-of-reserves" className="py-20 px-4 lg:px-20 bg-gradient-to-b from-black to-gray-900 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-purple-500/20 px-6 py-3 rounded-full mb-4 border border-yellow-500/20">
            <h3 className="text-yellow-400 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-purple-400">
              100% Transparent & Verifiable
            </h3>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400">
            Proof of Reserves
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Every stock token is backed 1:1 by USDC reserves. Verify our holdings on-chain, anytime.
          </p>
        </motion.div>

        {/* Key Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
              <i className='bx bx-shield text-2xl text-black'></i>
            </div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">On-Chain Verification</h3>
            <p className="text-gray-400 text-sm">
              All reserves are stored in smart contracts on Base blockchain. Anyone can verify balances using blockchain explorers.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <i className='bx bx-refresh text-2xl text-white'></i>
            </div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Real-Time Updates</h3>
            <p className="text-gray-400 text-sm">
              Reserve attestations updated every 24 hours via Chainlink oracles. Live data always available.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <i className='bx bx-check-circle text-2xl text-white'></i>
            </div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Full Transparency</h3>
            <p className="text-gray-400 text-sm">
              No hidden reserves or fractional backing. Every token is backed 1:1 with auditable USDC.
            </p>
          </div>
        </motion.div>

        {/* Main Proof of Reserves Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ProofOfReserves />
        </motion.div>

        {/* How It Works */}
        <motion.div
          className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">How Proof of Reserves Works</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <i className='bx bx-code-alt text-yellow-500'></i>
                For Hackathon/Demo
              </h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <i className='bx bx-chevron-right text-yellow-500 mt-0.5'></i>
                  <span>Smart contract holds all stock tokens + USDC backing</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className='bx bx-chevron-right text-yellow-500 mt-0.5'></i>
                  <span>Anyone can query <code className="bg-gray-800 px-1 rounded">balanceOf()</code> to verify reserves on-chain</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className='bx bx-chevron-right text-yellow-500 mt-0.5'></i>
                  <span>Example: If contract holds 1000 AAPL tokens, it should hold 1000 × $180 = $180k USDC</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <i className='bx bx-rocket text-purple-500'></i>
                Production Implementation
              </h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <i className='bx bx-chevron-right text-purple-500 mt-0.5'></i>
                  <span>Real-time attestations published on-chain showing custodian holdings</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className='bx bx-chevron-right text-purple-500 mt-0.5'></i>
                  <span>Merkle tree proofs of individual user balances</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className='bx bx-chevron-right text-purple-500 mt-0.5'></i>
                  <span>Third-party audits (similar to Tether/USDC monthly reports)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <i className='bx bx-sitemap text-cyan-500'></i>
              Custodian Flow (Production)
            </h4>
            <div className="grid md:grid-cols-5 gap-3 text-center">
              {[
                { step: 1, text: 'User deposits $180', icon: 'bx-dollar' },
                { step: 2, text: 'Platform buys 1 AAPL share', icon: 'bx-shopping-bag' },
                { step: 3, text: 'Custodian holds physical share', icon: 'bx-lock' },
                { step: 4, text: 'Platform mints 1 AAPL token', icon: 'bx-coin' },
                { step: 5, text: 'Chainlink verifies every 24hrs', icon: 'bx-check-shield' },
              ].map((item) => (
                <div key={item.step} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className={`bx ${item.icon} text-black`}></i>
                  </div>
                  <div className="text-xs font-semibold text-yellow-500 mb-1">Step {item.step}</div>
                  <div className="text-xs text-gray-400">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Smart Contract Links */}
        <motion.div
          className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { symbol: 'AAPL', address: '0x334dFeb48aEC27fCb75249e77F546B687cC6aB94' },
              { symbol: 'TSLA', address: '0x3FF7a28970832F0B31ba496545a000971becFCC2' },
              { symbol: 'NVDA', address: '0x7c57A5BD9942e82Ba61C27B6141c6228c38c7487' },
              { symbol: 'MSFT', address: '0x532995D5C698a725B590550F67F9f90A00b352d8' },
              { symbol: 'AMZN', address: '0x8Fe92F95f0E4CAeE9494341C2B0Fbd93A2BE89A4' },
              { symbol: 'GOOGL', address: '0x75687E5c95e15Ba306b49869e49F017b3103AbF2' },
            ].map((token) => (
              <a
                key={token.symbol}
                href={`https://base-sepolia.blockscout.com/address/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-yellow-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-yellow-400">{token.symbol}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </div>
                  </div>
                  <i className='bx bx-link-external text-gray-600 group-hover:text-yellow-500 transition-colors'></i>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProofOfReservesSection;
