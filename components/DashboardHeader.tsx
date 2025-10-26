'use client'

import 'boxicons/css/boxicons.min.css'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PixelCharacter from '@/components/PixelCharacter'
import NavItems from '@/components/NavItems'
import OnchainWalletConnect from '@/components/OnchainWalletConnect'
import UserDropdown from '@/components/UserDropdown'
import { signOut } from '@/lib/actions/auth.actions'

type Props = {
  user: User
  initialStocks: StockWithWatchlistStatus[]
}

const DashboardHeader = ({ user, initialStocks }: Props) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isCollapsedByClick, setIsCollapsedByClick] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    // Throttle scroll handler to avoid frequent state updates on every scroll event
    let timeoutId: number | null = null

    const handleScroll = () => {
      if (timeoutId) return

      timeoutId = window.setTimeout(() => {
        const currentScrollY = window.scrollY
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        setLastScrollY(currentScrollY)
        timeoutId = null
      }, 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [lastScrollY])

  const toggleMobileMenu = () => {
    const menu = document.getElementById('dashboardMobileMenu')
    if (!menu) return
    menu.classList.toggle('hidden')
  }

  const toggleHeaderCollapse = () => {
    setIsCollapsedByClick(!isCollapsedByClick)
  }

  const handleLogout = async () => {
    await signOut()
  }

  const shouldShowHeader = isVisible && !isCollapsedByClick

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[50] bg-gradient-to-b from-black via-black/95 to-black/80 backdrop-blur-xl border-b border-yellow-500/10 shadow-lg shadow-yellow-500/5 transition-transform duration-300 ${
        shouldShowHeader ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center py-3 px-4 lg:px-6 xl:px-8">
          {/* Logo */}
          <Link href="/" onClick={toggleHeaderCollapse} className="flex items-center space-x-2 hover:scale-[1.02] transition-all duration-300 group flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full group-hover:bg-yellow-500/15 transition-colors"></div>
            <PixelCharacter size="xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold m-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent whitespace-nowrap">
            HODL
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center flex-1 justify-center max-w-4xl mx-4">
          <NavItems initialStocks={initialStocks} dense />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2 min-w-[220px] justify-end">
          <OnchainWalletConnect />
          <UserDropdown user={user} initialStocks={initialStocks} />
        </div>

        {/* Mobile actions */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleMobileMenu}
            className="text-3xl p-3 relative z-[60] bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl hover:from-yellow-500/30 hover:to-yellow-600/20 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/40"
            aria-label="Open menu"
          >
            <i className='bx bx-menu text-yellow-400'></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        id="dashboardMobileMenu"
        className="hidden fixed inset-0 px-3 py-4 lg:hidden z-[60] bg-black/95 border-t border-gray-800 flex items-start justify-center pt-[18vh]"
      >
        <button
          onClick={toggleMobileMenu}
          aria-label="Close menu"
          className="absolute top-3 right-3 text-2xl p-2 rounded-lg text-gray-300 hover:text-yellow-400 hover:bg-gray-800/60 border border-gray-700"
        >
          <i className='bx bx-x'></i>
        </button>
        <div className="mx-auto w-full max-w-sm max-h-[70vh] rounded-xl bg-gray-900/90 border border-gray-800 p-4 shadow-xl shadow-black/40 flex flex-col">
          {/* Account Icon at Top */}
          <div className="flex justify-center mb-3 pb-3 border-b border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 text-yellow-900 text-xl font-bold">
              {user.name[0].toUpperCase()}
            </div>
          </div>
          
          <nav className="mt-0 flex-1 overflow-y-auto scrollbar-black flex flex-col gap-1 items-stretch text-center">
            <NavItems initialStocks={initialStocks} vertical onNavigate={toggleMobileMenu} />
          </nav>
          <div className="mt-4 border-t border-gray-800 pt-3 flex justify-center">
            <OnchainWalletConnect />
          </div>
          
          {/* Logout Button at Bottom */}
          <div className="mt-3 border-t border-gray-800 pt-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 transition-all text-black font-semibold"
            >
              <i className='bx bx-log-out text-xl'></i>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Floating Chevron Button - Shows when header is collapsed by click */}
    {isCollapsedByClick && (
      <button
        onClick={toggleHeaderCollapse}
        className="fixed top-2 left-1/2 -translate-x-1/2 z-[60] bg-gradient-to-br from-yellow-500/90 to-yellow-600/90 backdrop-blur-sm text-black p-2 rounded-full shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all duration-300 hover:scale-110"
        aria-label="Expand header"
      >
        <i className='bx bx-chevron-down text-xl'></i>
      </button>
    )}
    </>
  )
}

export default DashboardHeader
