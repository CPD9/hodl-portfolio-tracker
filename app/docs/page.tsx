'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'boxicons/css/boxicons.min.css'
import PixelCharacter from '@/components/PixelCharacter'

export default function Documentation() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    })
  }, [])

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'bx-rocket',
      content: [
        {
          subtitle: 'Quick Start',
          description: 'Get up and running with HODL in minutes',
          steps: [
            'Sign up for a free account',
            'Connect your Web3 wallet (Coinbase Wallet recommended)',
            'Link your traditional brokerage account (optional)',
            'Start tracking your portfolio across stocks and crypto'
          ]
        }
      ]
    },
    {
      id: 'features',
      title: 'Core Features',
      icon: 'bx-star',
      content: [
        {
          subtitle: 'Unified Portfolio Tracking',
          description: 'View your complete financial picture in one dashboard. Track stocks, crypto, and DeFi positions with real-time updates.',
        },
        {
          subtitle: 'Stock ↔ Crypto Swaps',
          description: 'Revolutionary cross-asset trading powered by Base L2. Swap AAPL shares for ETH in ~5 seconds for ~$0.01 fee.',
        },
        {
          subtitle: 'AI-Powered Insights',
          description: 'Get personalized market analysis and correlation insights. Our AI identifies opportunities you would have missed.',
        },
        {
          subtitle: 'Paper Trading',
          description: 'Practice with $100,000 virtual capital across both stocks and crypto. Learn without risking real money.',
        }
      ]
    },
    {
      id: 'base-integration',
      title: 'Base L2 Integration',
      icon: 'bx-chip',
      content: [
        {
          subtitle: 'Why Base?',
          description: 'Base provides ~$0.01 transaction costs (99.95% cheaper than Ethereum mainnet) and ~2-second block times for near-instant updates.',
        },
        {
          subtitle: 'Connecting Your Wallet',
          description: 'HODL supports all Base-compatible wallets via WalletConnect. We recommend Coinbase Wallet for the best experience with Smart Wallets.',
        },
        {
          subtitle: 'Smart Contracts',
          description: 'Our tokenized stock contracts are deployed and verified on Base L2. View them on BaseScan for full transparency.',
        }
      ]
    },
    {
      id: 'trading',
      title: 'Trading & Swaps',
      icon: 'bx-transfer-alt',
      content: [
        {
          subtitle: 'How Cross-Asset Swaps Work',
          description: 'Our smart contract burns tokenized stock (tAAPL), uses Chainlink oracle for pricing, calculates value in USDC, and swaps for crypto via Uniswap V3 - all in one atomic transaction.',
        },
        {
          subtitle: 'Supported Assets',
          description: 'Currently supporting major stocks (AAPL, NVDA, TSLA, AMZN, GOOGL) and major cryptocurrencies (ETH, BTC, USDC, Base tokens).',
        },
        {
          subtitle: 'Transaction Fees',
          description: 'Base L2 transactions cost ~$0.01. No hidden fees. What you see is what you pay.',
        }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: 'bx-code-alt',
      content: [
        {
          subtitle: 'Stock Data',
          description: 'Real-time stock quotes powered by Finnhub API. Updated every second with <5s latency.',
          code: `// Example: Get stock quote
const quote = await fetch('/api/stocks/AAPL')
const data = await quote.json()
console.log(data.currentPrice) // $262.43`
        },
        {
          subtitle: 'Crypto Data',
          description: 'Live cryptocurrency prices from multiple sources aggregated for accuracy.',
          code: `// Example: Get crypto price
const price = await fetch('/api/crypto/ETH')
const data = await price.json()
console.log(data.usd) // $3,245.67`
        }
      ]
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: 'bx-help-circle',
      content: [
        {
          subtitle: 'Is HODL free to use?',
          description: 'Yes! HODL is free to use. We only charge Base L2 transaction fees (~$0.01) for on-chain swaps.',
        },
        {
          subtitle: 'Is my data secure?',
          description: 'Absolutely. We use industry-standard encryption. Your crypto is non-custodial (you control your keys). We never have access to your funds.',
        },
        {
          subtitle: 'What brokers do you support?',
          description: 'We support all major US brokers including Robinhood, E*TRADE, Fidelity, TD Ameritrade, and more via secure API connections.',
        },
        {
          subtitle: 'Can I actually trade stocks?',
          description: 'Currently, HODL tracks stocks and enables tokenized stock-to-crypto swaps. Full stock trading is coming soon.',
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="container mx-auto px-4 lg:px-20 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <PixelCharacter size="sm" />
            <span className="text-2xl font-bold text-yellow-500">HODL</span>
            <span className="text-gray-500 mx-2">/</span>
            <span className="text-lg text-gray-400">Documentation</span>
          </Link>
          <Link 
            href="/sign-up"
            className="bg-yellow-500 text-black py-2 px-6 rounded-full font-medium transition-all duration-300 hover:bg-yellow-400"
          >
            Get Started
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                On This Page
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 transition-colors py-2 text-sm"
                  >
                    <i className={`bx ${section.icon}`}></i>
                    {section.title}
                  </a>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-gradient-to-br from-purple-900/30 to-yellow-900/30 rounded-lg border border-purple-500/30">
                <p className="text-sm text-gray-300 mb-3">
                  <i className='bx bx-info-circle text-yellow-500 mr-2'></i>
                  Need help?
                </p>
                <Link 
                  href="#"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  Join our Discord
                  <i className='bx bx-link-external text-xs'></i>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Hero */}
            <div className="mb-16" data-aos="fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                HODL <span className="text-yellow-500">Documentation</span>
              </h1>
              <p className="text-xl text-gray-400 mb-6">
                Everything you need to know about using HODL to manage your hybrid portfolio
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="#getting-started"
                  className="bg-purple-600 text-white py-3 px-6 rounded-full font-medium transition-all duration-300 hover:bg-purple-700"
                >
                  Quick Start Guide
                </Link>
                <Link 
                  href="#api"
                  className="border border-gray-600 py-3 px-6 rounded-full font-medium transition-all duration-300 hover:bg-gray-800"
                >
                  API Reference
                </Link>
              </div>
            </div>

            {/* Documentation Sections */}
            {sections.map((section, idx) => (
              <section 
                key={section.id} 
                id={section.id}
                className="mb-16 scroll-mt-24"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <i className={`bx ${section.icon} text-2xl text-black`}></i>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-100">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-8">
                  {section.content.map((item, itemIdx) => (
                    <div key={itemIdx} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-gray-100 mb-3">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {item.steps && (
                        <ol className="space-y-2 ml-4">
                          {item.steps.map((step, stepIdx) => (
                            <li key={stepIdx} className="flex items-start gap-3 text-gray-300">
                              <span className="flex-shrink-0 w-6 h-6 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                                {stepIdx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}

                      {item.code && (
                        <pre className="mt-4 bg-black/50 rounded-lg p-4 border border-gray-600 overflow-x-auto">
                          <code className="text-sm text-green-400 font-mono">
                            {item.code}
                          </code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 rounded-lg p-8 border border-purple-500/30" data-aos="fade-up">
              <h3 className="text-2xl font-bold text-gray-100 mb-3">
                Ready to get started?
              </h3>
              <p className="text-gray-300 mb-6">
                Join thousands of investors unifying their portfolios with HODL
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/sign-up"
                  className="bg-yellow-500 text-black py-3 px-8 rounded-full font-medium transition-all duration-300 hover:bg-yellow-400"
                >
                  Create Free Account
                </Link>
                <Link 
                  href="/"
                  className="border border-gray-600 py-3 px-8 rounded-full font-medium transition-all duration-300 hover:bg-gray-800"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 lg:px-20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 HODL. Built on Base L2. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Powered by</span>
              <a href="https://www.base.org" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                Base
              </a>
              <span>•</span>
              <a href="https://www.coinbase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                Coinbase
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

