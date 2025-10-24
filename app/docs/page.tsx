'use client'

import Link from 'next/link'
import { useEffect } from 'react'
// @ts-ignore - AOS types not available
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'boxicons/css/boxicons.min.css'
import PixelCharacter from '@/components/PixelCharacter'

type SectionLink = { label: string; href: string }
type SectionItem = {
  subtitle: string
  description?: string
  steps?: string[]
  code?: string
  links?: SectionLink[]
}
type Section = {
  id: string
  title: string
  icon: string
  content: SectionItem[]
}

export default function Documentation() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    })
  }, [])

  const sections: Section[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'bx-rocket',
      content: [
        {
          subtitle: 'Quick Start',
          description: 'Get up and running with HODL in under 3 minutes',
          steps: [
            'Create free account (no credit card required)',
            'Connect Web3 wallet - Coinbase Wallet recommended for Smart Wallet features',
            'Link traditional brokerage (optional) - secure read-only API access',
            'Start tracking unified portfolio with real-time AI insights across stocks and crypto'
          ]
        }
      ]
    },
    {
      id: 'proof-of-reserves',
      title: 'Proof of Reserves & Custody',
      icon: 'bx-shield-alt',
      content: [
        {
          subtitle: 'How It Works (Hackathon Demo)',
          description:
            'For the hackathon, we demonstrate the smart contract layer: tokenized stock supply is managed on-chain and designed to be backed 1:1 by USDC reserves. Anyone can independently verify the token contracts and their behavior on-chain on Sepolia testnet using the links below.',
        },
        {
          subtitle: 'Hackathon / Demo: On-Chain Verification',
          description:
            'What you can verify today on testnet:',
          steps: [
            'Smart contract holds all stock tokens alongside USDC backing for those tokens',
            'Use Etherscan → Contract → Read Contract to query totalSupply for stock tokens and balanceOf() for USDC holdings',
            'Example: If the contract holds 1,000 AAPL tokens and spot price is $180, then backing should be 1,000 × $180 = $180,000 USDC',
          ]
        },
        {
          subtitle: 'Custodian + Oracle (Production)',
          description:
            'In production, reserves would be held by a licensed custodian (e.g., Interactive Brokers or Bakkt). The custodian would publish signed attestations of reserves that are auditor-verified (similar to USDC monthly attestations). Chainlink oracles would bring these proofs on-chain for programmatic verification. Ondo Finance uses a similar design for tokenized assets.',
        },
        {
          subtitle: 'Production Roadmap: Proofs & Attestations',
          description: 'Key guarantees we would implement for mainnet launch:',
          steps: [
            'Real-time, signed custodian attestations of total reserves published on-chain',
            'Merkle tree proofs of individual user balances enabling self-verification against total reserves',
            'Third-party audits (similar cadence to USDC/Tether monthly attestations)',
            'Chainlink oracle(s) fetch and verify custodian attestations on-chain every 24 hours',
          ]
        },
        {
          subtitle: 'Custodian Flow (Production)',
          steps: [
            'User deposits $180 to the platform',
            'Platform purchases 1 AAPL share via a licensed broker (e.g., Interactive Brokers, Apex Clearing)',
            'Custodian holds the underlying share and publishes a cryptographic proof of holdings',
            'Platform mints 1 AAPL token to the user’s wallet, reflecting 1:1 backing',
            'Chainlink oracle verifies custodian attestations at a set cadence (e.g., every 24 hours) and updates on-chain state',
          ]
        },
        {
          subtitle: 'Verify Contracts (Sepolia Demo Addresses)',
          description:
            'Open each contract on Etherscan to inspect source verification, read totalSupply, and review transactions. These addresses are provided for transparent verification during the hackathon demo.',
          links: [
            { label: 'AAPL (Sepolia)', href: 'https://sepolia.etherscan.io/address/0x334dFeb48aEC27fCb75249e77F546B687cC6aB94' },
            { label: 'TSLA (Sepolia)', href: 'https://sepolia.etherscan.io/address/0x7c57A5BD9942e82Ba61C27B6141c6228c38c7487' },
            { label: 'NVDA (Sepolia)', href: 'https://sepolia.etherscan.io/address/0x532995D5C698a725B590550F67F9f90A00b352d8' },
            { label: 'MSFT (Sepolia)', href: 'https://sepolia.etherscan.io/address/0x8Fe92F95f0E4CAeE9494341C2B0Fbd93A2BE89A4' },
            { label: 'AMZN (Sepolia)', href: 'https://sepolia.etherscan.io/address/0x75687E5c95e15Ba306b49869e49F017b3103AbF2' },
            { label: 'GOOGL (Sepolia)', href: 'https://sepolia.etherscan.io/address/0x4833D6D51b64f93B6708088c90aB6E138b6A1547' }
          ]
        },
        {
          subtitle: 'On-Chain Verification Tips',
          description:
            'To self-verify: (1) View Contract on Etherscan and inspect Read/Write tabs for supply-related functions. (2) Review recent mint/burn/transfer events in the Transactions and ERC-20 Token Txns tabs. (3) Confirm source code verification and compiler settings. In production, you would also cross-check custodian attestations and Chainlink oracle feeds for reserves.',
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
          description: 'Modern investors manage both stocks and crypto, yet financial infrastructure forces them into separate universes. HODL unifies both worlds in one dashboard with real-time updates and AI-powered insights.',
        },
        {
          subtitle: 'Stock ↔ Crypto Swaps',
          description: 'First platform enabling direct cross-asset trading. Swap tokenized stocks for crypto in ~5 seconds with Base L2 (~$0.01 gas fees). No intermediaries, fully transparent on-chain execution.',
        },
        {
          subtitle: 'AI-Powered Analytics',
          description: 'Advanced correlation analysis identifies opportunities across asset classes. Real-time sector rotation alerts, risk optimization suggestions, and personalized portfolio insights powered by machine learning.',
        },
        {
          subtitle: 'Base L2 Integration',
          description: '99.95% cheaper than Ethereum ($2/year vs $3,955/year for active trading). Near-instant transactions (~2s blocks), verified smart contracts, and seamless DeFi integration.',
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
          description: 'Base L2 offers 99.95% cost reduction vs Ethereum mainnet (~$0.01 per transaction), ~2-second block times for near-instant finality, and full EVM compatibility. Built by Coinbase with institutional-grade security.',
        },
        {
          subtitle: 'Connecting Your Wallet',
          description: 'Supports all Base-compatible wallets via WalletConnect. Coinbase Smart Wallets recommended for gasless transactions and enhanced security. Your keys, your crypto - fully non-custodial.',
        },
        {
          subtitle: 'Smart Contracts',
          description: 'All contracts deployed and verified on Base L2. Tokenized stock contracts use Chainlink oracles for real-time pricing. View source code and transactions on BaseScan for complete transparency.',
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
          description: 'Atomic on-chain execution: (1) Burn tokenized stock (e.g., tAAPL), (2) Chainlink oracle provides real-time pricing, (3) Calculate USD value, (4) Uniswap V3 swap for target crypto. All steps complete in one transaction or fully revert - no partial failures.',
        },
        {
          subtitle: 'Supported Assets',
          description: 'Top stocks: AAPL, NVDA, TSLA, AMZN, GOOGL, MSFT, META. Major crypto: ETH, BTC, USDC, and all Base ecosystem tokens. Expanding weekly based on user demand.',
        },
        {
          subtitle: 'Fee Structure',
          description: 'Base L2 gas: ~$0.01 per transaction. No platform fees. No subscription. No hidden charges. Transparent on-chain settlement.',
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
          description: 'Real-time stock quotes via Finnhub API. Sub-5-second latency, updated every second. Covers 10,000+ US equities with historical data and corporate actions.',
          code: `// Example: Get stock quote
const quote = await fetch('/api/stocks/AAPL')
const data = await quote.json()
console.log(data.currentPrice) // $262.43`
        },
        {
          subtitle: 'Crypto Data',
          description: 'Multi-source aggregated cryptocurrency pricing for maximum accuracy. Real-time updates from major exchanges with weighted averaging.',
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
          description: 'Yes! HODL is free to use for portfolio tracking and analytics. For on-chain operations like Stock ↔ Crypto swaps, you only pay minimal Base L2 gas fees (99.95% cheaper than Ethereum - approximately $2/year for active trading vs $3,955/year on Ethereum). No subscription fees, no hidden charges.',
        },
        {
          subtitle: 'Is my data secure?',
          description: 'Bank-grade encryption for all data. Non-custodial wallet architecture - you control your private keys, we never have access to your funds. SOC 2 compliant infrastructure with regular security audits.',
        },
        {
          subtitle: 'What brokers do you support?',
          description: 'Secure API integration with major US brokers: Robinhood, E*TRADE, Fidelity, TD Ameritrade, Charles Schwab, and more. Read-only access for portfolio tracking - we never execute trades without explicit user authorization.',
        },
        {
          subtitle: 'Can I actually trade stocks?',
          description: 'HODL enables tokenized stock-to-crypto swaps via Base L2 smart contracts. Traditional stock trading through integrated brokers coming Q2 2025. Current focus: cross-asset opportunities unavailable elsewhere.',
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
                The first platform unifying stocks and crypto with AI-powered insights and revolutionary cross-asset trading on Base L2
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

                      {item.links && (
                        <ul className="space-y-2">
                          {item.links.map((link: { label: string; href: string }, linkIdx: number) => (
                            <li key={linkIdx}>
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yellow-400 hover:text-yellow-300 underline underline-offset-4"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.steps && (
                        <ol className="space-y-2 ml-4">
                          {item.steps.map((step: string, stepIdx: number) => (
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
                Join the hybrid investing revolution. Track both asset classes, execute cross-asset swaps, and leverage AI insights - all in one platform.
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

