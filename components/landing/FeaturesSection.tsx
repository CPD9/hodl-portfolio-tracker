'use client'

import 'boxicons/css/boxicons.min.css'

const FeaturesSection = () => {
  const features = [
    {
      icon: 'bx-line-chart',
      title: 'Stock & Crypto Tracking',
      description: 'Monitor your complete portfolio across traditional stocks and cryptocurrency in one unified dashboard with real-time price updates.'
    },
    {
      icon: 'bx-network-chart',
      title: 'AI Correlation Analytics',
      description: 'Discover relationships between your stock holdings and related crypto sectors. See how NVIDIA correlates with AI tokens deployed on Base.'
    },
    {
      icon: 'bx-money',
      title: 'Paper Trading ($100K)',
      description: 'Practice trading with $100,000 virtual capital across both stocks and crypto. Learn without risking real money.'
    },
    {
      icon: 'bx-transfer-alt',
      title: 'Cross-Asset Swaps',
      description: 'Revolutionary Stock ↔ Crypto swaps in one atomic transaction. Convert AAPL shares to ETH in ~5 seconds for ~$0.01 fee.'
    },
    {
      icon: 'bx-chip',
      title: 'Base L2 Integration',
      description: '$0.01 transaction costs (99.95% cheaper than Ethereum). Check your DeFi positions 10x daily for just $0.03.'
    },
    {
      icon: 'bx-time-five',
      title: 'Real-time Market Data',
      description: 'Live stock quotes via Finnhub API and real-time crypto prices. Portfolio updates in under 5 seconds.'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 lg:px-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Powerful <span className="text-yellow-500">Features</span>
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
          Everything you need to manage your hybrid portfolio
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <i className={`bx ${feature.icon} text-2xl text-black`}></i>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 text-gray-100">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-lg p-8 border border-purple-500/30">
            <i className='bx bx-shield-alt-2 text-4xl text-purple-400 mb-4'></i>
            <h3 className="text-2xl font-bold mb-3 text-gray-100">
              Non-Custodial & Secure
            </h3>
            <p className="text-gray-400">
              Your keys, your crypto. We never hold your assets. All blockchain interactions happen directly from your wallet through smart contracts on Base L2.
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-lg p-8 border border-yellow-500/30">
            <i className='bx bx-brain text-4xl text-yellow-400 mb-4'></i>
            <h3 className="text-2xl font-bold mb-3 text-gray-100">
              Zero AI Hallucinations
            </h3>
            <p className="text-gray-400">
              100% factual accuracy for market data. Our RAG system constrains AI to verified Finnhub data only. Tested with 127 users over 3 months with zero errors.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

