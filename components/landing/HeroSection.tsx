'use client'

import 'boxicons/css/boxicons.min.css'

import Link from 'next/link'
import Spline from '@splinetool/react-spline'

const HeroSection = () => {
  return (
    <main className="flex flex-col lg:flex-row items-center justify-between mt-24 lg:mt-32 min-h-screen px-4 lg:px-20 relative">
      {/* Mobile Robot - Positioned at Top */}
      <div className="lg:hidden w-full h-[300px] sm:h-[400px] flex items-center justify-center mb-8 relative z-0">
        <Spline
          scene="https://prod.spline.design/pExWJS0pvvlINgYf/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Left Side Content */}
      <div className="max-w-xl lg:ml-4 z-10 lg:mt-0">
        {/* Tag Box */}
        <div className="relative w-[95%] sm:w-48 h-10 bg-gradient-to-r from-gray-800 to-yellow-900 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.4)] mb-8">
          <div className="absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1">
            <i className='bx bxs-diamond text-yellow-500'></i>
            <span className="text-sm text-gray-200">INTRODUCING</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8">
          The Only Platform for <br />
          <span className="text-yellow-500">Stock ↔ Crypto Swaps</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg tracking-wider text-gray-400 max-w-[25rem] lg:max-w-[30rem] mb-8">
          Modern investors manage stocks and crypto, yet financial infrastructure forces them into two separate universes. 
          HODL unifies both worlds with AI-powered insights, Base L2 integration, and revolutionary cross-asset trading.
        </p>

        {/* Stats Highlight */}
        <div className="bg-gradient-to-r from-purple-900/30 to-yellow-900/30 rounded-lg p-4 mb-8 border border-purple-500/30">
          <p className="text-lg font-bold text-yellow-400">
            99.95% cheaper than Ethereum
          </p>
          <p className="text-sm text-gray-300">
            $3,955/year → $2/year for active portfolio management
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-8 lg:mb-0">
          <Link 
            href="/sign-up"
            className="bg-yellow-500 text-black py-3 px-8 rounded-full border-none font-medium transition-all duration-500 hover:bg-yellow-400 cursor-pointer text-center"
          >
            Get Started
            <i className='bx bx-right-arrow-alt ml-2'></i>
          </Link>
          <Link 
            href="/docs"
            className="py-3 px-8 rounded-full border border-gray-600 font-medium transition-all duration-500 hover:bg-gray-800 cursor-pointer flex items-center justify-center gap-2"
          >
            Documentation
            <i className='bx bx-link-external text-sm'></i>
          </Link>
        </div>
      </div>

      {/* Desktop Robot - Hidden on Mobile */}
      <div className="hidden lg:block absolute lg:top-0 bottom-0 lg:left-[50%] lg:right-[5%] h-full z-20 pointer-events-none">
        <Spline
          scene="https://prod.spline.design/pExWJS0pvvlINgYf/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </main>
  )
}

export default HeroSection

