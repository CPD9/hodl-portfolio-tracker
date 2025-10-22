'use client'

import Link from 'next/link'
import PixelCharacter from '@/components/PixelCharacter'
import 'boxicons/css/boxicons.min.css'

const LandingFooter = () => {
  return (
    <footer className="py-16 px-4 lg:px-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <PixelCharacter size="md" />
              <h3 className="text-2xl font-bold text-yellow-500">HODL</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The only platform enabling Stock ↔ Crypto swaps on blockchain. 
              Unify your portfolio, powered by Base L2.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://hodl-portfolio-tracker.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
              >
                <i className='bx bx-link-external'></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
              >
                <i className='bx bxl-twitter'></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
              >
                <i className='bx bxl-github'></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#why-hodl" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Why HODL?
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#transparency" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Transparency
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/sign-up" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2025 HODL. Built on Base L2. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Powered by</span>
            <a 
              href="https://www.base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
            >
              Base
            </a>
            <span>•</span>
            <a 
              href="https://www.coinbase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
            >
              Coinbase
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter

