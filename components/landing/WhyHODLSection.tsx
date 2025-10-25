'use client'

import 'boxicons/css/boxicons.min.css'

const WhyHODLSection = () => {
  const problems = [
    {
      icon: 'bx-show',
      title: 'Fragmented Visibility',
      problem: 'Managing $85K in stocks, $15K in crypto, $5K in DeFi across separate apps creates hidden risk',
      solution: 'Unified Dashboard',
      description: 'Complete portfolio visibility reveals true risk exposure across both markets with AI-powered correlation analytics'
    },
    {
      icon: 'bx-trending-up',
      title: 'Missed Opportunities',
      problem: 'NVIDIA reports strong earnings, stock jumps 8.5%. 24-48 hours later, AI tokens pump +12%. Your apps don\'t connect the dots',
      solution: 'Cross-Market Intelligence',
      description: 'Personalized alerts combining traditional and crypto markets: "NVDA reports earnings today - could impact your FET positions"'
    },
    {
      icon: 'bx-dollar-circle',
      title: 'Prohibitive Costs',
      problem: 'Experimenting with $500 on Ethereum: $35 deposit fee, $7/day checks, $40 withdrawal = $124 for one week',
      solution: 'Base L2 Integration',
      description: '$0.01 transaction costs (99.95% cheaper). Check DeFi 10x daily for $0.03. Experiment with $100-500 profitably'
    },
    {
      icon: 'bx-transfer',
      title: 'No Cross-Asset Trading',
      problem: 'Want to convert NVDA profits to FET tokens? Sell → Wait T+2 → Bank transfer → Buy. Total: 5-7 days, ~$15 fees',
      solution: 'Stock ↔ Crypto Swaps',
      description: 'Connect wallet → Select shares → Choose crypto → Approve. Total: ~5 seconds, ~$0.01 fee. One atomic transaction on Base'
    }
  ]

  return (
    <section id="why-hodl" className="py-20 px-4 lg:px-20 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Why <span className="text-yellow-500">HODL</span>?
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
          The problems modern investors face - and how we solve them
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((item, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <i className={`bx ${item.icon} text-3xl text-black`}></i>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-3 text-gray-100">
                {item.title}
              </h3>

              {/* Problem */}
              <div className="mb-4 p-3 bg-red-900/20 border-l-4 border-red-500 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-red-400">Problem:</span> {item.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-3">
                <p className="text-lg font-bold text-yellow-400 mb-2">
                  ✓ {item.solution}
                </p>
                <p className="text-sm text-gray-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyHODLSection

