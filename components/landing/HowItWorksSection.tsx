'use client'

import Link from 'next/link'
import 'boxicons/css/boxicons.min.css'

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: 'bx-wallet',
      title: 'Connect Wallet & Link Brokerage',
      description: 'Connect your Web3 wallet via WalletConnect and link your traditional brokerage account. HODL supports all major brokers and Base-compatible wallets.'
    },
    {
      number: '02',
      icon: 'bx-pie-chart-alt-2',
      title: 'View Unified Portfolio',
      description: 'See your complete financial picture in one dashboard. Track stocks, crypto, and DeFi positions with real-time updates and cross-asset analytics.'
    },
    {
      number: '03',
      icon: 'bx-brain',
      title: 'Get AI-Powered Insights',
      description: 'Receive intelligent market analysis, correlation insights, and personalized alerts. Our AI identifies opportunities you would have missed.'
    },
    {
      number: '04',
      icon: 'bx-transfer-alt',
      title: 'Execute Cross-Asset Swaps',
      description: 'Swap between stocks and crypto in one atomic transaction. Convert AAPL shares to ETH in ~5 seconds for ~$0.01 on Base L2.'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 lg:px-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          How It <span className="text-purple-500">Works</span>
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
          Four simple steps to unified portfolio management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative"
            >
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-yellow-500 -z-10" />
              )}

              {/* Step Card */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="text-6xl font-bold text-purple-500/20 mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <i className={`bx ${step.icon} text-2xl text-black`}></i>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-gray-100">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/sign-up"
            className="inline-block bg-purple-600 text-white py-3 px-8 rounded-full font-medium transition-all duration-500 hover:bg-purple-700 cursor-pointer"
          >
            Start Your Journey
            <i className='bx bx-right-arrow-alt ml-2'></i>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection

