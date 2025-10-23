'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import 'boxicons/css/boxicons.min.css'
import { FC } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

// Animation variants
const fadeInUpOnce = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
} as const

const staggerContainerOnce = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
} as const

interface RevenueStream {
  icon: string
  title: string
  percentage: string
  description: string
  example: string
  color: 'yellow' | 'purple'
}

interface SubscriptionFeature {
  name: string
  included: boolean
  description?: string
}

interface SubscriptionTier {
  name: string
  price: string
  period: string
  description: string
  features: SubscriptionFeature[]
  color: string
  highlight?: boolean
}

const BusinessModelSection: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('')

  const subscriptionTiers: SubscriptionTier[] = [
    {
      name: 'Free Tier',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      color: 'gray',
      features: [
        { name: 'Basic Portfolio Tracking', included: true, description: 'View all your stocks and crypto in one dashboard' },
        { name: '1 Swap Per Month', included: true, description: 'Up to $1,000 value, $0.01 transaction fee' },
        { name: 'Standard AI Insights', included: true, description: 'Basic correlation alerts and market summaries' },
        { name: '7-Day Price History', included: true, description: 'Limited historical data access' },
        { name: 'Real-time Alerts', included: false },
        { name: 'Priority Support', included: false }
      ]
    },
    {
      name: 'Pro Tier',
      price: '$29',
      period: 'per month',
      description: 'For serious hybrid investors',
      color: 'purple',
      highlight: true,
      features: [
        { name: 'Unlimited Swaps', included: true, description: 'No monthly limits, swap as often as you want' },
        { name: 'Advanced AI Analytics', included: true, description: 'Deep insights into stock-crypto relationships' },
        { name: 'Real-time Alerts', included: true, description: 'Instant updates on price movements and correlations' },
        { name: '30-Day Price History', included: true, description: 'Extended historical charts and data' },
        { name: 'Priority Support', included: true, description: 'Live chat, 4-hour response time' },
        { name: 'API Access', included: true, description: '1,000 API calls per month' }
      ]
    },
    {
      name: 'Enterprise Tier',
      price: '$299',
      period: 'per month',
      description: 'For institutions and teams',
      color: 'yellow',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Dedicated Account Manager', included: true, description: 'Personal onboarding and support' },
        { name: 'White-label API Access', included: true, description: 'Unlimited API calls with custom branding' },
        { name: 'Custom Integration Support', included: true, description: 'Direct engineering assistance' },
        { name: 'Team Accounts', included: true, description: 'Up to 10 users with admin controls' },
        { name: 'Advanced Analytics Dashboard', included: true, description: 'Custom reports and institutional-grade analytics' }
      ]
    }
  ]

  const revenueStreams: RevenueStream[] = [
    {
      icon: 'bx-transfer-alt',
      title: 'Swap Fees',
      percentage: '45%',
      description: '0.5% on all Stock ↔ Crypto swaps',
      example: '$500 swap = $2.50 fee',
      color: 'yellow'
    },
    {
      icon: 'bx-diamond',
      title: 'Premium Subscriptions',
      percentage: '30%',
      description: '$29/month for advanced AI analytics, priority support, higher swap limits',
      example: '10K users = $290K MRR',
      color: 'purple'
    },
    {
      icon: 'bx-bar-chart-alt-2',
      title: 'Data & API Access',
      percentage: '15%',
      description: 'Enterprise API for correlation data and market intelligence',
      example: 'Hedge funds, trading firms',
      color: 'yellow'
    },
    {
      icon: 'bx-wallet',
      title: 'Asset Management',
      percentage: '10%',
      description: '0.75% AUM fee on managed portfolios (future)',
      example: '$100M AUM = $750K/year',
      color: 'purple'
    }
  ]

  return (
    <section className="py-20 px-4 lg:px-20 bg-gray-900/50">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainerOnce}
      >
        <motion.h2 
          className={`${inter.className} text-3xl md:text-4xl font-bold text-center mb-4`}
          variants={fadeInUpOnce}
        >
          <span className="text-purple-500">Business Model</span>
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"
          variants={fadeInUpOnce}
        >
          Multiple revenue streams, capital-efficient growth
        </motion.p>

        {/* Revenue Streams */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={staggerContainerOnce}
        >
          {revenueStreams.map((stream, index) => (
            <motion.div 
              key={index}
              variants={fadeInUpOnce}
              className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-lg p-6 border-2 ${
                stream.color === 'yellow' ? 'border-yellow-500/30' : 'border-purple-500/30'
              } hover:${stream.color === 'yellow' ? 'border-yellow-500' : 'border-purple-500'} 
              transition-all duration-300 backdrop-blur-sm
              hover:shadow-lg hover:shadow-${stream.color === 'yellow' ? 'yellow' : 'purple'}-500/20`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${
                  stream.color === 'yellow' 
                    ? 'from-yellow-500 to-purple-500' 
                    : 'from-purple-500 to-yellow-500'
                } rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`bx ${stream.icon} text-2xl text-black`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`${inter.className} text-lg font-bold text-gray-100`}>
                      {stream.title}
                    </h3>
                    <span className={`${inter.className} text-xl font-bold ${
                      stream.color === 'yellow' ? 'text-yellow-400' : 'text-purple-400'
                    }`}>
                      {stream.percentage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{stream.description}</p>
                  <div className="bg-gray-700/50 rounded px-3 py-2">
                    <p className="text-xs text-gray-400">
                      <i className='bx bx-info-circle mr-1'></i>
                      {stream.example}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Financial Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={staggerContainerOnce}
        >
          <motion.div 
            variants={fadeInUpOnce}
            className="bg-gray-800/50 rounded-lg p-6 text-center backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <p className={`${inter.className} text-2xl font-bold text-purple-400 mb-2`}>12%</p>
            <p className="text-sm text-gray-400">Conversion Rate</p>
          </motion.div>
          <motion.div 
            variants={fadeInUpOnce}
            className="bg-gray-800/50 rounded-lg p-6 text-center backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <p className={`${inter.className} text-2xl font-bold text-yellow-400 mb-2`}>$626K</p>
            <p className="text-sm text-gray-400">Year 1 Revenue</p>
          </motion.div>
          <motion.div 
            variants={fadeInUpOnce}
            className="bg-gray-800/50 rounded-lg p-6 text-center backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <p className={`${inter.className} text-2xl font-bold text-green-400 mb-2`}>$680</p>
            <p className="text-sm text-gray-400">User LTV</p>
          </motion.div>
        </motion.div>

        {/* Premium Subscription Tiers */}
        <motion.div 
          variants={staggerContainerOnce}
          className="mt-20"
        >
          <motion.h3 
            variants={fadeInUpOnce}
            className="text-2xl font-bold text-center mb-10 text-gray-100"
          >
            Premium Subscription Tiers 🔥
          </motion.h3>

          <motion.div 
            variants={staggerContainerOnce}
            className="space-y-4 max-w-5xl mx-auto"
          >
            {subscriptionTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                variants={fadeInUpOnce}
                className={`bg-gradient-to-br ${
                  tier.color === 'purple' 
                    ? 'from-purple-900/40 to-purple-800/40 border-purple-500' 
                    : tier.color === 'yellow'
                    ? 'from-yellow-900/40 to-yellow-800/40 border-yellow-500/50'
                    : 'from-gray-800 to-gray-900 border-gray-700'
                } rounded-lg ${tier.highlight ? 'border-2' : 'border'} overflow-hidden relative`}
              >
                {tier.highlight && (
                  <div className="absolute -top-2 right-6">
                    <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <motion.button 
                  onClick={() => setActiveTab(activeTab === tier.name.toLowerCase() ? '' : tier.name.toLowerCase())}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-700/30 transition-all"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-6">
                    <div className="text-left">
                      <h4 className="text-2xl font-bold text-gray-100 mb-1">
                        {tier.name}
                      </h4>
                      <p className="text-sm text-gray-400">{tier.description}</p>
                    </div>
                    <div className={`hidden sm:block ${
                      tier.color === 'purple' 
                        ? 'bg-purple-700/50' 
                        : tier.color === 'yellow'
                        ? 'bg-yellow-700/30'
                        : 'bg-gray-700/50'
                    } px-4 py-2 rounded-full`}>
                      <span className="text-3xl font-bold text-gray-100">{tier.price}</span>
                      <span className="text-sm text-gray-400 ml-2">{tier.period}</span>
                    </div>
                  </div>
                  <i className={`bx ${activeTab === tier.name.toLowerCase() ? 'bx-chevron-up' : 'bx-chevron-down'} text-3xl ${
                    tier.color === 'purple' 
                      ? 'text-purple-400' 
                      : tier.color === 'yellow'
                      ? 'text-yellow-400'
                      : 'text-gray-400'
                  }`}></i>
                </motion.button>
                
                <motion.div 
                  initial={false}
                  animate={{ height: activeTab === tier.name.toLowerCase() ? 'auto' : 0, opacity: activeTab === tier.name.toLowerCase() ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`px-6 pb-6 ${
                    tier.color === 'purple' 
                      ? 'bg-purple-900/20' 
                      : tier.color === 'yellow'
                      ? 'bg-yellow-900/10'
                      : 'bg-gray-700/20'
                  } rounded-lg mx-6 mb-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2 text-sm text-gray-300">
                          <i className={`bx ${feature.included ? 'bx-check-circle text-green-400' : 'bx-x-circle text-gray-600'} flex-shrink-0 mt-0.5 text-lg`}></i>
                          <div>
                            <p className="font-semibold">{feature.name}</p>
                            {feature.description && (
                              <p className="text-xs text-gray-500">{feature.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <motion.button
                      className={`w-full py-3 rounded-lg font-bold transition-all ${
                        tier.color === 'purple'
                          ? 'bg-purple-500 text-white hover:bg-purple-600'
                          : tier.color === 'yellow'
                          ? 'border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10'
                          : 'border-2 border-gray-600 text-gray-200 hover:bg-gray-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tier.name === 'Free Tier' 
                        ? 'Get Started Free' 
                        : tier.name === 'Pro Tier'
                        ? 'Start 14-Day Free Trial'
                        : 'Contact Sales Team'}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default BusinessModelSection