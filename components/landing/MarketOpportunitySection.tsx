'use client'

import 'boxicons/css/boxicons.min.css'
import { DollarSign, TrendingUp, Globe, PieChart } from 'lucide-react'

const MarketOpportunitySection = () => {
  const stats = [
    {
      icon: DollarSign,
      value: '$17.1T',
      label: 'Total Global Stock Market Volume (Daily)',
      percentage: '67%',
      description: 'Of global financial transactions'
    },
    {
      icon: TrendingUp,
      value: '$278B',
      label: 'Total Crypto Market Volume (Daily)',
      percentage: '23%',
      description: 'Year-over-year growth'
    },
    {
      icon: Globe,
      value: '392M',
      label: 'Global Digital Asset Users',
      percentage: '115%',
      description: 'Expected growth by 2025'
    },
    {
      icon: PieChart,
      value: '$4.2B',
      label: 'Cross-Asset Trading Volume',
      percentage: '184%',
      description: 'Annual increase in hybrid portfolios'
    }
  ]

  const opportunities = [
    {
      title: 'Fragmented Investment Landscape',
      problem: 'Investors need 5+ apps to trade stocks, crypto, check analytics, and track portfolios',
      solution: 'One unified platform for all financial assets',
      impact: 'Save 5 hours/week in portfolio management'
    },
    {
      title: 'High Cross-Asset Trading Costs',
      problem: 'Converting between stocks and crypto costs $40+ and takes 5-7 days',
      solution: 'Instant swaps for $0.01 on Base L2',
      impact: '99.95% cost reduction & instant settlement'
    },
    {
      title: 'Limited Correlation Insights',
      problem: 'No easy way to see how NVIDIA stock affects your GPU mining tokens',
      solution: 'AI-powered cross-asset correlation engine',
      impact: 'Discover 2.3x more trading opportunities'
    }
  ]

  return (
    <section id="market-opportunity" className="py-20 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-yellow-500">Market</span> Opportunity
          </h2>
          <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Traditional finance and crypto markets are converging. HODL bridges the gap.
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mr-4">
                  <stat.icon className="w-6 h-6 text-yellow-500" />
                </div>
                <span className="text-3xl font-bold text-gray-100">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-300 mb-2">{stat.label}</p>
              <div className="flex items-center">
                <span className="text-green-400 font-semibold">{stat.percentage} ↑</span>
                <span className="text-gray-400 text-sm ml-2">{stat.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Market Opportunities */}
        <div className="grid md:grid-cols-3 gap-8">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-gray-100 mb-4">
                {opportunity.title}
              </h3>

              {/* Problem */}
              <div className="mb-4 p-3 bg-red-900/20 border-l-4 border-red-500 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-red-400">Problem:</span>{' '}
                  {opportunity.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-4 p-3 bg-green-900/20 border-l-4 border-green-500 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-green-400">Solution:</span>{' '}
                  {opportunity.solution}
                </p>
              </div>

              {/* Impact */}
              <div className="p-3 bg-purple-900/20 border-l-4 border-purple-500 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-purple-400">Impact:</span>{' '}
                  {opportunity.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MarketOpportunitySection