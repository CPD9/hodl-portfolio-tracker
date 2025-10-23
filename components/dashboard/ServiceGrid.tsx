'use client';

import Link from 'next/link';
import 'boxicons/css/boxicons.min.css';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  gradient: string;
  isActive: boolean;
  badge?: string;
}

export default function ServiceGrid() {
  const services: Service[] = [
    {
      id: 'stocks',
      name: 'Stock Trading',
      description: 'Track and trade traditional stocks with real-time market data',
      icon: 'bx-line-chart',
      href: '/dashboard/stocks',
      gradient: 'from-yellow-500 to-orange-500',
      isActive: true,
    },
    {
      id: 'crypto',
      name: 'Crypto Trading',
      description: 'Trade cryptocurrencies on Base L2 with minimal fees',
      icon: 'bx-bitcoin',
      href: '/dashboard/crypto',
      gradient: 'from-purple-500 to-pink-500',
      isActive: true,
    },
    {
      id: 'swap',
      name: 'Stock ↔ Crypto Swap',
      description: 'Revolutionary cross-asset swaps in one atomic transaction',
      icon: 'bx-transfer-alt',
      href: '/dashboard/trade',
      gradient: 'from-yellow-500 to-purple-500',
      isActive: true,
      badge: 'New',
    },
    {
      id: 'portfolio',
      name: 'Portfolio Manager',
      description: 'Unified view of your stocks, crypto, and DeFi positions',
      icon: 'bx-pie-chart-alt-2',
      href: '/dashboard/portfolio',
      gradient: 'from-green-500 to-teal-500',
      isActive: true,
    },
    {
      id: 'watchlist',
      name: 'Watchlist',
      description: 'Monitor your favorite stocks and crypto assets',
      icon: 'bx-bookmark',
      href: '/dashboard/watchlist',
      gradient: 'from-blue-500 to-cyan-500',
      isActive: true,
    },
    {
      id: 'consultations',
      name: 'Expert Consultations',
      description: 'Live video calls with financial experts and analysts',
      icon: 'bx-video',
      href: '/dashboard/consultation',
      gradient: 'from-pink-500 to-rose-500',
      isActive: true,
    },
    {
      id: 'ai-chat',
      name: 'AI Companion',
      description: 'Chat with AI for market insights and portfolio analysis',
      icon: 'bx-brain',
      href: '/dashboard#ai-companion',
      gradient: 'from-indigo-500 to-purple-500',
      isActive: true,
    },
    {
      id: 'gamification',
      name: 'Gamification',
      description: 'Earn rewards, compete on leaderboards, unlock achievements',
      icon: 'bx-trophy',
      href: '/dashboard/gamification',
      gradient: 'from-amber-500 to-yellow-500',
      isActive: true,
    },
  ];

  return (
    <section className="w-full mb-8">
      <SectionHeader 
        title="Explore Services" 
        subtitle="Access all features of your unified portfolio management platform"
        gradient="yellow"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Link
            key={service.id}
            href={service.href}
            className={`
              relative bg-gray-800 rounded-lg p-6 border border-gray-700 
              hover:border-yellow-500 transition-all duration-300 
              hover:shadow-lg hover:shadow-yellow-500/20 
              group cursor-pointer
              ${!service.isActive ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {/* Badge */}
            {service.badge && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                  {service.badge}
                </span>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-3 left-3">
              <span 
                className={`w-2 h-2 rounded-full ${
                  service.isActive ? 'bg-green-500' : 'bg-gray-500'
                }`}
                title={service.isActive ? 'Active' : 'Coming Soon'}
              ></span>
            </div>

            {/* Icon */}
            <div className={`
              w-14 h-14 bg-gradient-to-br ${service.gradient} 
              rounded-lg flex items-center justify-center mb-4 mt-4
              group-hover:scale-110 transition-transform duration-300
            `}>
              <i className={`bx ${service.icon} text-2xl text-white`}></i>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold mb-2 text-gray-100 group-hover:text-yellow-400 transition-colors">
              {service.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed">
              {service.description}
            </p>

            {/* Arrow Icon */}
            <div className="mt-4 flex items-center text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">Explore</span>
              <i className='bx bx-right-arrow-alt ml-1 text-lg'></i>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

