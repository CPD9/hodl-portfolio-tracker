'use client'

import { motion } from 'framer-motion'
import 'boxicons/css/boxicons.min.css'

const CompetitiveLandscapeSection = () => {
  const competitors = [
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
      strength: 'First platform with Stock ↔ Crypto swaps',
      color: 'yellow'
    },
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
      color: 'purple'
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
      strength: 'Crypto expertise',
      color: 'cyan'
    }
  ]

  const features = [
    { name: 'Stocks Trading', key: 'stocks', icon: 'bx-chart' },
    { name: 'Crypto Trading', key: 'crypto', icon: 'bx-bitcoin' },
    { name: 'Unified Portfolio', key: 'unified', icon: 'bx-layer' },
    { name: 'Cross-Asset Swaps', key: 'swaps', icon: 'bx-transfer-alt' },
    { name: 'AI Analytics', key: 'ai', icon: 'bx-brain' },
    { name: 'DeFi Integration', key: 'defi', icon: 'bx-cube-alt' }
  ]

  return (
    <section className="py-20 px-4 lg:px-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Competitive <span className="text-yellow-500">Landscape</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how HODL stacks up against traditional platforms
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <table className="w-full">
            {/* Features as Column Headers */}
            <thead>
              <tr>
                <th className="p-4 text-left bg-gray-800/50 rounded-tl-lg">
                  <span className="text-lg font-bold text-gray-300">Platform</span>
                </th>
                {features.map((feature, index) => (
                  <th 
                    key={index}
                    className={`p-4 text-center bg-gradient-to-b from-gray-700/50 to-gray-800/50 border-2 border-gray-600/30 ${
                      index === features.length - 1 ? 'rounded-tr-lg' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <i className={`bx ${feature.icon} text-2xl text-gray-300`}></i>
                      <span className="text-sm font-medium text-gray-300">{feature.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Competitors as Rows */}
            <tbody>
              {competitors.map((competitor, compIndex) => (
                <tr key={compIndex}>
                  <td 
                    className={`p-4 ${
                      competitor.color === 'yellow' 
                        ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-900/20 border-l-4 border-yellow-500' 
                        : competitor.color === 'purple'
                        ? 'bg-gradient-to-r from-purple-900/30 to-purple-900/20 border-l-4 border-purple-500'
                        : 'bg-gradient-to-r from-cyan-900/30 to-cyan-900/20 border-l-4 border-cyan-500'
                    } ${compIndex === competitors.length - 1 ? 'rounded-bl-lg' : ''}`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className={`text-lg font-bold ${
                        competitor.color === 'yellow' 
                          ? 'text-yellow-400' 
                          : competitor.color === 'purple'
                          ? 'text-purple-400'
                          : 'text-cyan-400'
                      }`}>{competitor.name}</span>
                      <span className="text-sm text-gray-400">{competitor.category}</span>
                      <span className={`text-xs mt-1 ${
                        competitor.color === 'yellow' 
                          ? 'text-yellow-300/80' 
                          : competitor.color === 'purple'
                          ? 'text-purple-300/80'
                          : 'text-cyan-300/80'
                      }`}>
                        <i className="bx bx-trophy text-sm"></i> {competitor.strength}
                      </span>
                    </div>
                  </td>
                  {features.map((feature, featIndex) => (
                    <td 
                      key={featIndex}
                      className={`p-4 text-center ${
                        competitor.color === 'yellow' 
                          ? 'bg-yellow-900/10 border border-yellow-500/20' 
                          : competitor.color === 'purple'
                          ? 'bg-purple-900/10 border border-purple-500/20'
                          : 'bg-cyan-900/10 border border-cyan-500/20'
                      } ${compIndex === competitors.length - 1 && featIndex === features.length - 1 ? 'rounded-br-lg' : ''}`}
                    >
                      {competitor.features[feature.key] ? (
                        <motion.i 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: compIndex * 0.1 }}
                          className={`bx bx-check-circle text-3xl ${
                            competitor.color === 'yellow' 
                              ? 'text-yellow-400' 
                              : competitor.color === 'purple'
                              ? 'text-purple-400'
                              : 'text-cyan-400'
                          }`}
                        ></motion.i>
                      ) : (
                        <motion.i 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: compIndex * 0.1 }}
                          className="bx bx-x-circle text-3xl text-gray-600"
                        ></motion.i>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}

export default CompetitiveLandscapeSection