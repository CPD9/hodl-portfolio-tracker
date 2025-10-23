'use client'

import { motion } from 'framer-motion'
import 'boxicons/css/boxicons.min.css'
import { FC } from 'react'

const CompetitiveLandscapeSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  }

  const competitors = [
    {
      name: 'Robinhood',
      category: 'TradFi Broker',
      features: {
        stocks: true,
        crypto: true,
        unified: false,
        swaps: false,
        ai: false,
        defi: false
      },
      strength: 'Large user base (23M)',
      weakness: 'Separate stock/crypto UX, no cross-asset trading'
    },
    {
      name: 'Coinbase',
      category: 'Crypto Exchange',
      features: {
        stocks: false,
        crypto: true,
        unified: false,
        swaps: false,
        ai: false,
        defi: true
      },
      strength: 'Crypto expertise, Base L2',
      weakness: 'No stock integration, high fees'
    },
    {
      name: 'Wealthfront',
      category: 'Robo-Advisor',
      features: {
        stocks: true,
        crypto: true,
        unified: true,
        swaps: false,
        ai: true,
        defi: false
      },
      strength: 'Portfolio automation',
      weakness: 'No cross-asset swaps, limited crypto'
    },
    {
      name: 'HODL',
      category: 'Hybrid Platform',
      features: {
        stocks: true,
        crypto: true,
        unified: true,
        swaps: true,
        ai: true,
        defi: true
      },
      strength: 'Only platform with Stock ↔ Crypto swaps',
      weakness: 'Early stage, building brand awareness'
    }
  ]

  return (
    <section className="py-20 px-4 lg:px-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          Competitive <span className="text-yellow-500">Landscape</span>
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          variants={fadeIn}
          className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"
        >
          We're building in a category of one
        </motion.p>

        {/* Comparison Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-12"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Platform</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-300">Stocks</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-300">Crypto</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-300">Unified View</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-300">Cross-Asset Swaps</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-300">AI Analytics</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-300">DeFi</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className={`border-t border-gray-700 ${
                      comp.name === 'HODL' ? 'bg-gradient-to-r from-purple-900/20 to-yellow-900/20' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className={`font-bold ${comp.name === 'HODL' ? 'text-yellow-400' : 'text-gray-100'}`}>
                          {comp.name}
                        </p>
                        <p className="text-xs text-gray-500">{comp.category}</p>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      {comp.features.stocks ? (
                        <i className='bx bx-check-circle text-2xl text-green-400'></i>
                      ) : (
                        <i className='bx bx-x-circle text-2xl text-gray-600'></i>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {comp.features.crypto ? (
                        <i className='bx bx-check-circle text-2xl text-green-400'></i>
                      ) : (
                        <i className='bx bx-x-circle text-2xl text-gray-600'></i>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {comp.features.unified ? (
                        <i className='bx bx-check-circle text-2xl text-green-400'></i>
                      ) : (
                        <i className='bx bx-x-circle text-2xl text-gray-600'></i>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {comp.features.swaps ? (
                        <i className='bx bx-check-circle text-2xl text-yellow-400'></i>
                      ) : (
                        <i className='bx bx-x-circle text-2xl text-gray-600'></i>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {comp.features.ai ? (
                        <i className='bx bx-check-circle text-2xl text-green-400'></i>
                      ) : (
                        <i className='bx bx-x-circle text-2xl text-gray-600'></i>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {comp.features.defi ? (
                        <i className='bx bx-check-circle text-2xl text-green-400'></i>
                      ) : (
                        <i className='bx bx-x-circle text-2xl text-gray-600'></i>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Competitive Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-lg p-6 border border-yellow-500/30"
          >
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <i className='bx bx-lock-open text-2xl text-black'></i>
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-3">First-Mover Advantage</h3>
            <p className="text-sm text-gray-400">
              We're the only platform enabling atomic Stock ↔ Crypto swaps. This creates a 12-18 month moat before competitors can replicate our infrastructure.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            variants={fadeIn}
            className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-lg p-6 border border-purple-500/30"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <i className='bx bx-network-chart text-2xl text-black'></i>
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-3">Network Effects</h3>
            <p className="text-sm text-gray-400">
              More users → Better correlation data → More accurate AI insights → More users. Data moat grows exponentially with usage.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            variants={fadeIn}
            className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-lg p-6 border border-green-500/30"
          >
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <i className='bx bx-chip text-2xl text-black'></i>
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-3">Technical Moat</h3>
            <p className="text-sm text-gray-400">
              Base L2 smart contracts, zero-hallucination RAG, and real-time WebSocket infrastructure took 18 months to build and validate.
            </p>
          </motion.div>
        </div>

        {/* Market Position */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="bg-gradient-to-r from-purple-900/30 to-yellow-900/30 rounded-lg p-8 border border-purple-500/30"
        >
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-100">
            Strategic Positioning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-yellow-400 mb-3">Short-Term (1-2 years)</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <i className='bx bx-check text-green-400 flex-shrink-0 mt-0.5'></i>
                  <span>Capture early adopters frustrated with fragmented portfolios</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className='bx bx-check text-green-400 flex-shrink-0 mt-0.5'></i>
                  <span>Build liquidity pools for top 20 stocks (AAPL, NVDA, TSLA, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className='bx bx-check text-green-400 flex-shrink-0 mt-0.5'></i>
                  <span>Establish brand as "Robinhood for hybrid portfolios"</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-purple-400 mb-3">Long-Term (3-5 years)</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <i className='bx bx-check text-green-400 flex-shrink-0 mt-0.5'></i>
                  <span>Expand cross-asset liquidity to global markets</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className='bx bx-check text-green-400 flex-shrink-0 mt-0.5'></i>
                  <span>Partner with broker-dealers to scale custody and liquidity</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className='bx bx-check text-green-400 flex-shrink-0 mt-0.5'></i>
                  <span>Drive adoption through AI portfolio advisor and institutional partnerships</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CompetitiveLandscapeSection