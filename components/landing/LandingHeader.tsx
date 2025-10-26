'use client'

import 'boxicons/css/boxicons.min.css'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import PixelCharacter from '@/components/PixelCharacter'

const LandingHeader = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [isCollapsedByClick, setIsCollapsedByClick] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      const current = window.scrollY
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const last = lastScrollYRef.current
          setIsVisible(!(current > last && current > 100))
          lastScrollYRef.current = current
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const toggleHeaderCollapse = () => {
    setIsCollapsedByClick(!isCollapsedByClick)
  }

  const shouldShowHeader = isVisible && !isCollapsedByClick

  return (
    <>
      <header className={`flex justify-between items-center py-4 px-4 lg:px-8 xl:px-12 fixed top-0 left-0 right-0 z-[999] bg-gradient-to-b from-black via-black/95 to-black/80 backdrop-blur-xl border-b border-yellow-500/10 shadow-lg shadow-yellow-500/5 pointer-events-auto transition-transform duration-300 ${
        shouldShowHeader ? 'translate-y-0' : '-translate-y-full'
      }`}>
        {/* Logo - Click character/text to navigate, click header background to collapse */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-3 hover:scale-105 transition-all duration-300 pointer-events-auto group">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full group-hover:bg-yellow-500/15 transition-colors"></div>
              <PixelCharacter size="2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold m-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:via-yellow-400 group-hover:to-yellow-500 transition-all duration-300 whitespace-nowrap">
              HODL
            </h1>
          </Link>
          <button
            onClick={toggleHeaderCollapse}
            className="ml-2 text-yellow-500 hover:text-yellow-400 transition-colors p-1"
            aria-label="Toggle header"
          >
            <i className='bx bx-chevron-up text-xl'></i>
          </button>
        </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-4 xl:gap-5 pointer-events-auto flex-1 justify-center max-w-2xl mx-4">
        <a href="#why-hodl" className="relative text-sm xl:text-base font-semibold tracking-wide transition-all duration-300 hover:text-yellow-400 pointer-events-auto group whitespace-nowrap">
          <span className="relative z-10">Why HODL?</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#how-it-works" className="relative text-sm xl:text-base font-semibold tracking-wide transition-all duration-300 hover:text-yellow-400 pointer-events-auto group whitespace-nowrap">
          <span className="relative z-10">How it Works</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#market-opportunity" className="relative text-sm xl:text-base font-semibold tracking-wide transition-all duration-300 hover:text-yellow-400 pointer-events-auto group whitespace-nowrap">
          <span className="relative z-10">Opportunity</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#pricing" className="relative text-sm xl:text-base font-semibold tracking-wide transition-all duration-300 hover:text-yellow-400 pointer-events-auto group whitespace-nowrap">
          <span className="relative z-10">Pricing</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#competitive-landscape" className="relative text-sm xl:text-base font-semibold tracking-wide transition-all duration-300 hover:text-yellow-400 pointer-events-auto group whitespace-nowrap">
          <span className="relative z-10">Competitive</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#transparency" className="relative text-sm xl:text-base font-semibold tracking-wide transition-all duration-300 hover:text-yellow-400 pointer-events-auto group whitespace-nowrap">
          <span className="relative z-10">Transparency</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
        </a>
        <Link href="/docs" className="relative text-sm xl:text-base font-semibold tracking-wide transition-all duration-300 hover:text-yellow-400 pointer-events-auto group whitespace-nowrap">
          <span className="relative z-10">Docs</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </nav>

      {/* Desktop Buttons */}
      <div className="hidden lg:flex items-center gap-2 xl:gap-3 pointer-events-auto flex-shrink-0">
        <Link 
          href="/sign-in"
          className="py-2 px-5 xl:px-6 rounded-full border-2 border-gray-700 font-semibold text-sm transition-all duration-300 hover:border-yellow-500 hover:bg-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer pointer-events-auto group relative overflow-hidden whitespace-nowrap"
        >
          <span className="relative z-10">Log In</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        <Link 
          href="/sign-up"
          className="relative py-2 px-5 xl:px-6 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40 cursor-pointer pointer-events-auto group overflow-hidden whitespace-nowrap"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transition-all duration-300 group-hover:from-yellow-300 group-hover:via-yellow-400 group-hover:to-yellow-500"></div>
          <span className="relative z-10 text-black">Sign Up</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-500 -translate-x-full"></div>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="lg:hidden text-3xl p-3 relative z-[1000] pointer-events-auto bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl hover:from-yellow-500/30 hover:to-yellow-600/20 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/20"
      >
        <i className='bx bx-menu text-yellow-400'></i>
      </button>

      {/* Mobile Menu */}
      <div 
        id="mobileMenu"
        className="hidden fixed inset-0 px-3 py-4 lg:hidden z-[1000] bg-black pointer-events-auto border-t border-gray-800 flex items-start justify-center pt-[18vh]"
      >
        {/* Close button inside overlay for full-screen menu */}
        <button
          onClick={toggleMobileMenu}
          aria-label="Close menu"
          className="absolute top-3 right-3 text-2xl p-2 rounded-lg text-gray-300 hover:text-yellow-400 hover:bg-gray-800/60 border border-gray-700"
        >
          <i className='bx bx-x'></i>
        </button>
  <div className="mx-auto w-full max-w-sm max-h-[70vh] max-h-[70svh] overflow-y-auto mobile-menu-scroll rounded-xl bg-gray-900/90 border border-gray-800 p-4 shadow-xl shadow-black/40">
          <nav className="mt-0 flex flex-col gap-3 items-center text-center pointer-events-auto">
          <a 
            href="#why-hodl" 
            onClick={toggleMobileMenu}
            className="w-full text-center text-sm leading-tight font-medium tracking-wide transition-all duration-300 hover:text-yellow-400 py-1.5"
          >
            Why HODL?
          </a>
          <a 
            href="#how-it-works" 
            onClick={toggleMobileMenu}
            className="w-full text-center text-sm leading-tight font-medium tracking-wide transition-all duration-300 hover:text-yellow-400 py-1.5"
          >
            How it Works
          </a>
          <a 
            href="#market-opportunity" 
            onClick={toggleMobileMenu}
            className="w-full text-center text-sm leading-tight font-medium tracking-wide transition-all duration-300 hover:text-yellow-400 py-1.5"
          >
            Market Opportunity
          </a>
          <a 
            href="#pricing" 
            onClick={toggleMobileMenu}
            className="w-full text-center text-sm leading-tight font-medium tracking-wide transition-all duration-300 hover:text-yellow-400 py-1.5"
          >
            Pricing
          </a>
          <a 
            href="#competitive-landscape" 
            onClick={toggleMobileMenu}
            className="w-full text-center text-sm leading-tight font-medium tracking-wide transition-all duration-300 hover:text-yellow-400 py-1.5"
          >
            Competitive Landscape
          </a>
          <a 
            href="#transparency" 
            onClick={toggleMobileMenu}
            className="w-full text-center text-sm leading-tight font-medium tracking-wide transition-all duration-300 hover:text-yellow-400 py-1.5"
          >
            Transparency
          </a>
          <Link 
            href="/docs"
            onClick={toggleMobileMenu}
            className="w-full text-center text-sm leading-tight font-medium tracking-wide transition-all duration-300 hover:text-yellow-400 py-1.5"
          >
            Documentation
          </Link>
          
          <div className="w-full border-t border-gray-800 my-2"></div>
          
          <Link 
            href="/sign-in"
            onClick={toggleMobileMenu}
            className="w-full text-center py-2.5 px-5 rounded-lg border border-gray-700 font-semibold transition-all duration-300 hover:border-yellow-500 hover:bg-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer text-sm"
          >
            Log In
          </Link>
          <Link 
            href="/sign-up"
            onClick={toggleMobileMenu}
            className="w-full text-center relative py-2.5 px-5 rounded-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/40 cursor-pointer overflow-hidden text-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
            <span className="relative z-10 text-black">Sign Up</span>
          </Link>
          </nav>
        </div>
      </div>
    </header>

    {/* Floating Chevron Button - Shows when header is collapsed by click */}
    {isCollapsedByClick && (
      <button
        onClick={toggleHeaderCollapse}
        className="fixed top-2 left-1/2 -translate-x-1/2 z-[1000] bg-gradient-to-br from-yellow-500/90 to-yellow-600/90 backdrop-blur-sm text-black p-2 rounded-full shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all duration-300 hover:scale-110 pointer-events-auto"
        aria-label="Expand header"
      >
        <i className='bx bx-chevron-down text-xl'></i>
      </button>
    )}
    </>
  )
}

export default LandingHeader

