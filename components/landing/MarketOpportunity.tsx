'use client'

import { motion } from 'framer-motion'
import 'boxicons/css/boxicons.min.css'
import { FC } from 'react'

const MarketOpportunitySection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="py-20 px-4 lg:px-20 bg-black relative">
      {/* Background gradients matching landing page style */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-yellow-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/20 via-yellow-500/10 to-transparent rounded-full blur-3xl opacity-50 -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          The <span className="text-yellow-500">Market Opportunity</span>
        </motion.h2>
        
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          variants={fadeInUp}
          className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"
        >
          At the intersection of two massive markets
        </motion.p>

        {/* TAM/SAM/SOM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'TAM',
              amount: '$120T',
              desc: 'Total Addressable Market',
              detail: 'Global stock market ($109T) + Crypto market cap ($2.5T) + DeFi TVL ($85B)',
              gradient: 'from-purple-900/20 to-purple-800/20',
              border: 'border-purple-500/30',
              textColor: 'purple'
            },
            {
              title: 'SAM',
              amount: '$8.4T',
              desc: 'Serviceable Available Market',
              detail: 'US retail investors ($7.2T) holding both stocks and crypto (est. 15% = $1.08T) + DeFi users ($40B)',
              gradient: 'from-yellow-900/20 to-yellow-800/20',
              border: 'border-yellow-500/30',
              textColor: 'yellow'
            },
            {
              title: 'SOM',
              amount: '$420B',
              desc: 'Serviceable Obtainable Market',
              detail: '5% of hybrid investors seeking unified portfolio management (3-year target)',
              gradient: 'from-green-900/20 to-green-800/20',
              border: 'border-green-500/30',
              textColor: 'green'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              variants={fadeInUp}
              className={`bg-gradient-to-br ${item.gradient} rounded-lg p-8 border-2 ${item.border} hover:border-opacity-75 transition-all duration-300`}
            >
              <div className="text-center">
                <p className={`text-sm text-${item.textColor}-300 mb-2 font-semibold`}>{item.title}</p>
                <p className={`text-5xl font-bold text-${item.textColor}-400 mb-3`}>{item.amount}</p>
                <p className="text-sm text-gray-300 mb-4">{item.desc}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Market Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            {
              icon: 'bx-trending-up',
              title: 'Crypto Adoption Accelerating',
              desc: '52 million Americans now own crypto (16% of population). 67% of millennial investors hold both stocks and crypto.',
              source: 'Pew Research, 2024'
            },
            {
              icon: 'bx-layer',
              title: 'L2 Infrastructure Maturity',
              desc: 'Base L2 processed 3.2M daily transactions in Q4 2024, proving scalability. Gas fees dropped 99.8% vs Ethereum mainnet.',
              source: 'L2Beat, Q4 2024'
            },
            {
              icon: 'bx-dollar',
              title: 'RWA Tokenization Growing',
              desc: 'Real-world asset tokenization market projected to reach $16T by 2030. Stocks are the natural starting point.',
              source: 'BCG Analysis, 2024'
            },
            {
              icon: 'bx-brain',
              title: 'AI-Powered Finance',
              desc: '73% of investors want AI tools for portfolio insights. Current solutions focus on single asset classes.',
              source: 'Deloitte Finance Survey, 2024'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              variants={fadeInUp}
              className="bg-black/40 rounded-lg p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`bx ${item.icon} text-2xl text-black`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{item.desc}</p>
                  <p className="text-xs text-gray-500">Source: {item.source}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Now? */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-purple-900/30 to-yellow-900/30 rounded-lg p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
        >
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-100">
            Why Now? Our Unique Timing Advantage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🏗️',
                title: 'Infrastructure Ready',
                desc: 'Base L2 makes $0.01 transactions viable'
              },
              {
                emoji: '👥',
                title: 'User Behavior Shift',
                desc: '52M Americans now bridge both markets'
              },
              {
                emoji: '⚡',
                title: 'First-Mover Position',
                desc: 'No competitor offers cross-asset swaps'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <p className="text-sm font-semibold text-gray-200 mb-1">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MarketOpportunitySection