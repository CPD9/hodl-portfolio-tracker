'use client'

const StatsSection = () => {
  const stats = [
    {
      value: '$0.01',
      label: 'Per Transaction',
      description: 'On Base L2',
      color: 'yellow'
    },
    {
      value: '99.95%',
      label: 'Cost Savings',
      description: '$3,955 → $2/year',
      color: 'purple'
    },
    {
      value: '~5 sec',
      label: 'Swap Speed',
      description: 'vs 5-7 days traditional',
      color: 'yellow'
    },
    {
      value: '92%',
      label: 'Satisfaction',
      description: 'Would recommend',
      color: 'purple'
    }
  ]

  return (
    <section className="py-20 px-4 lg:px-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          By The <span className="text-yellow-500">Numbers</span>
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
          Real metrics from our alpha build and beta testing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border-2 ${
                stat.color === 'yellow' ? 'border-yellow-500/30' : 'border-purple-500/30'
              } hover:${stat.color === 'yellow' ? 'border-yellow-500' : 'border-purple-500'} transition-all duration-300 text-center`}
            >
              <div className={`text-5xl md:text-6xl font-bold mb-3 ${
                stat.color === 'yellow' ? 'text-yellow-400' : 'text-purple-400'
              }`}>
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-gray-100 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-gray-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <p className="text-3xl font-bold text-green-400 mb-2">68%</p>
            <p className="text-sm text-gray-300 font-medium mb-1">Correlation Accuracy</p>
            <p className="text-xs text-gray-500">NVDA-FET validated</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <p className="text-3xl font-bold text-blue-400 mb-2">0</p>
            <p className="text-sm text-gray-300 font-medium mb-1">AI Hallucinations</p>
            <p className="text-xs text-gray-500">127 users, 3 months</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <p className="text-3xl font-bold text-yellow-400 mb-2">&lt;5s</p>
            <p className="text-sm text-gray-300 font-medium mb-1">Data Staleness</p>
            <p className="text-xs text-gray-500">Down from 5-10 min</p>
          </div>
        </div>

        {/* User Testimonial */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/20 to-yellow-900/20 rounded-lg p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-black flex-shrink-0">
              K
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg text-gray-300 italic mb-3">
                "I didn't realize I was 75% exposed to tech until I saw it all in HODL. The correlation insights have saved me thousands in trades I would have missed."
              </p>
              <p className="text-sm font-semibold text-yellow-400">Kamsy U.</p>
              <p className="text-xs text-gray-500">Beta User, Hybrid Investor</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection

