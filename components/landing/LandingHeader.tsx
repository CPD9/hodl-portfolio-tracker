'use client'

import 'boxicons/css/boxicons.min.css'

import Link from 'next/link'
import PixelCharacter from '@/components/PixelCharacter'

const LandingHeader = () => {
  const toggleMobileMenu = () => {
    const menu = document.getElementById('mobileMenu')
    if (menu) {
      if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden')
      } else {
        menu.classList.add('hidden')
      }
    }
  }

  return (
    <header className="flex justify-between items-center py-4 px-4 lg:px-20 fixed top-0 left-0 right-0 z-[999] bg-black/80 backdrop-blur-md pointer-events-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity pointer-events-auto">
        <PixelCharacter size="md" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light m-0 text-yellow-500">
          HODL
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 pointer-events-auto">
        <a href="#why-hodl" className="text-sm tracking-wider transition-colors hover:text-gray-300 pointer-events-auto">
          Why HODL?
        </a>
        <a href="#how-it-works" className="text-sm tracking-wider transition-colors hover:text-gray-300 pointer-events-auto">
          How it Works
        </a>
        <a href="#pricing" className="text-sm tracking-wider transition-colors hover:text-gray-300 pointer-events-auto">
          Pricing
        </a>
        <a href="#market-opportunity" className="text-sm tracking-wider transition-colors hover:text-gray-300 pointer-events-auto">
          Opportunity
        </a>
        <a href="#competitive-landscape" className="text-sm tracking-wider transition-colors hover:text-gray-300 pointer-events-auto">
          Competitive
        </a>
        <a href="#transparency" className="text-sm tracking-wider transition-colors hover:text-gray-300 pointer-events-auto">
          Transparency
        </a>
        <Link href="/docs" className="text-sm tracking-wider transition-colors hover:text-gray-300 pointer-events-auto">
          Documentation
        </Link>
      </nav>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-4 pointer-events-auto">
        <Link 
          href="/sign-in"
          className="py-3 px-8 rounded-full border border-gray-600 font-medium transition-all duration-500 hover:bg-gray-800 cursor-pointer pointer-events-auto"
        >
          Log In
        </Link>
        <Link 
          href="/sign-up"
          className="bg-yellow-500 text-black py-3 px-8 rounded-full border-none font-medium transition-all duration-500 hover:bg-yellow-400 cursor-pointer pointer-events-auto"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden text-3xl p-2 relative z-[1000] pointer-events-auto bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors"
      >
        <i className='bx bx-menu'></i>
      </button>

      {/* Mobile Menu */}
      <div 
        id="mobileMenu"
        className="hidden fixed top-[72px] bottom-0 right-0 left-0 p-5 md:hidden z-[998] bg-black bg-opacity-95 backdrop-blur-md pointer-events-auto"
      >
        <nav className="flex flex-col gap-6 items-center pointer-events-auto">
          <a 
            href="#why-hodl" 
            onClick={toggleMobileMenu}
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            Why HODL?
          </a>
          <a 
            href="#how-it-works" 
            onClick={toggleMobileMenu}
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            How it Works
          </a>
          <a 
            href="#pricing" 
            onClick={toggleMobileMenu}
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            Pricing
          </a>
          <a 
            href="#market-opportunity" 
            onClick={toggleMobileMenu}
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            Market Opportunity
          </a>
          <a 
            href="#competitive-landscape" 
            onClick={toggleMobileMenu}
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            Competitive Landscape
          </a>
          <a 
            href="#transparency" 
            onClick={toggleMobileMenu}
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            Transparency
          </a>
          <Link 
            href="/docs"
            onClick={toggleMobileMenu}
            className="text-base tracking-wider transition-colors hover:text-gray-300"
          >
            Documentation
          </Link>
          <Link 
            href="/sign-in"
            onClick={toggleMobileMenu}
            className="py-3 px-8 rounded-full border border-gray-600 font-medium transition-all duration-500 hover:bg-gray-800 cursor-pointer mt-4"
          >
            Log In
          </Link>
          <Link 
            href="/sign-up"
            onClick={toggleMobileMenu}
            className="bg-yellow-500 text-black py-3 px-8 rounded-full border-none font-medium transition-all duration-500 hover:bg-yellow-400 cursor-pointer"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default LandingHeader

