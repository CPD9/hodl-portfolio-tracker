'use client'

import 'boxicons/css/boxicons.min.css'

const ChallengesSection = () => {
  const challenges = [
    {
      icon: 'bx-timer',
      title: 'Data Staleness',
      before: '5-10 minutes',
      after: '<5 seconds',
      improvement: '98% faster',
      description: 'Real-time portfolio updates through WebSocket subscriptions and optimized RPC calls to Base L2'
    },
    {
      icon: 'bx-brain',
      title: 'AI Accuracy',
      before: 'Frequent Hallucinations',
      after: 'Zero Hallucinations',
      improvement: '100% accuracy',
      description: 'Strict RAG implementation with verified Finnhub data. Tested with 127 users over 3 months'
    },
    {
      icon: 'bx-dollar',
      title: 'Transaction Costs',
      before: '$3,955/Year',
      after: '$2/Year',
      improvement: '99.95% reduction',
      description: 'Base L2 enables ~$0.01 transactions vs $5-50 on Ethereum mainnet for active portfolio management'
    },
    {
      icon: 'bx-search',
      title: 'Stock-Crypto Correlation',
      before: 'Manual Research',
      after: '68% Correlation Score',
      improvement: 'Automated',
      description: 'Multi-signal algorithm: sector overlap (40%), semantic similarity (30%), price correlation (30%)'
    }
  ]

  return (
    <section className="py-20 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          What We've <span className="text-purple-500">Solved</span>
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
          Technical challenges that made HODL possible
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.map((challenge, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`bx ${challenge.icon} text-2xl text-black`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-100">
                  {challenge.title}
                </h3>
              </div>

              {/* Before/After Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-900/20 rounded-lg p-3 md:p-4 border border-red-500/30">
                  <p className="text-xs text-gray-400 mb-1">Before</p>
                  <p className="text-xs md:text-sm lg:text-lg font-bold text-red-400 break-words leading-tight">{challenge.before}</p>
                </div>
                <div className="bg-green-900/20 rounded-lg p-3 md:p-4 border border-green-500/30">
                  <p className="text-xs text-gray-400 mb-1">After</p>
                  <p className="text-xs md:text-sm lg:text-lg font-bold text-green-400 break-words leading-tight">{challenge.after}</p>
                </div>
              </div>

              {/* Improvement Badge */}
              <div className="bg-purple-900/30 rounded-full px-4 py-2 inline-block mb-4">
                <p className="text-sm font-bold text-purple-400">
                  <i className='bx bx-trending-up mr-1'></i>
                  {challenge.improvement}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">
                {challenge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Key Takeaway */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 rounded-lg p-8 border border-purple-500/30">
          <div className="flex items-start gap-4">
            <i className='bx bx-bulb text-4xl text-yellow-400 flex-shrink-0'></i>
            <div>
              <h4 className="text-xl font-bold text-gray-100 mb-3">
                Key Takeaway
              </h4>
              <p className="text-gray-300 leading-relaxed">
                Building at the intersection of TradeFi and DeFi means solving challenges neither ecosystem faces alone. 
                Each challenge taught us to validate assumptions, measure everything, and prioritize user experience over technical elegance. 
                The result: a platform that's not incrementally better - it's categorically different.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChallengesSection

