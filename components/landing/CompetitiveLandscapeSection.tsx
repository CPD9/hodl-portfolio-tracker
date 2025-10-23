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

        <div className="overflow-x-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="min-w-max"
          >
            <table className="w-full">
              {/* Feature Names Column */}
              <thead>
                <tr>
                  <th className="p-4 text-left bg-gray-800/50 rounded-tl-lg">
                    <span className="text-lg font-bold text-gray-300">Features</span>
                  </th>
                  {competitors.map((competitor, index) => (
                    <th 
                      key={index}
                      className={`p-4 text-center ${
                        competitor.color === 'yellow' 
                          ? 'bg-yellow-900/30 border-t-2 border-x-2 border-yellow-500/30' 
                          : competitor.color === 'purple'
                          ? 'bg-purple-900/30 border-t-2 border-x-2 border-purple-500/30'
                          : 'bg-cyan-900/30 border-t-2 border-x-2 border-cyan-500/30'
                      } ${index === competitors.length - 1 ? 'rounded-tr-lg' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className={`text-xl font-bold ${
                          competitor.color === 'yellow' 
                            ? 'text-yellow-400' 
                            : competitor.color === 'purple'
                            ? 'text-purple-400'
                            : 'text-cyan-400'
                        }`}>{competitor.name}</span>
                        <span className="text-sm text-gray-400">{competitor.category}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index}>
                    <td className="p-4 bg-gray-800/30">
                      <div className="flex items-center gap-2">
                        <i className={`bx ${feature.icon} text-xl text-gray-400`}></i>
                        <span className="text-gray-300">{feature.name}</span>
                      </div>
                    </td>
                    {competitors.map((competitor, compIndex) => (
                      <td 
                        key={compIndex}
                        className={`p-4 text-center ${
                          competitor.color === 'yellow' 
                            ? 'bg-yellow-900/20 border-x-2 border-yellow-500/30' 
                            : competitor.color === 'purple'
                            ? 'bg-purple-900/20 border-x-2 border-purple-500/30'
                            : 'bg-cyan-900/20 border-x-2 border-cyan-500/30'
                        }`}
                      >
                        {competitor.features[feature.key] ? (
                          <motion.i 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`bx bx-check-circle text-2xl ${
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
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bx bx-x-circle text-2xl text-gray-600"
                          ></motion.i>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Strength Row */}
                <tr>
                  <td className="p-4 bg-gray-800/30 rounded-bl-lg">
                    <div className="flex items-center gap-2">
                      <i className="bx bx-trophy text-xl text-gray-400"></i>
                      <span className="text-gray-300">Key Strength</span>
                    </div>
                  </td>
                  {competitors.map((competitor, index) => (
                    <td 
                      key={index}
                      className={`p-4 text-center ${
                        competitor.color === 'yellow' 
                          ? 'bg-yellow-900/20 border-2 border-yellow-500/30' 
                          : competitor.color === 'purple'
                          ? 'bg-purple-900/20 border-2 border-purple-500/30'
                          : 'bg-cyan-900/20 border-2 border-cyan-500/30'
                      } ${index === competitors.length - 1 ? 'rounded-br-lg' : ''}`}
                    >
                      <span className={`text-sm ${
                        competitor.color === 'yellow' 
                          ? 'text-yellow-400' 
                          : competitor.color === 'purple'
                          ? 'text-purple-400'
                          : 'text-cyan-400'
                      }`}>{competitor.strength}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CompetitiveLandscapeSection