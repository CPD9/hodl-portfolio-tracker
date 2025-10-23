'use client'

import 'aos/dist/aos.css'

// @ts-ignore - AOS types not available
import AOS from 'aos'
import ChallengesSection from '@/components/landing/ChallengesSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingHeader from '@/components/landing/LandingHeader'
import MarketOpportunitySection from '@/components/landing/MarketOpportunitySection'
import CompetitiveLandscapeSection from '@/components/landing/CompetitiveLandscapeSection'
import BusinessModelSection from '@/components/landing/BusinessModelSection'
import StatsSection from '@/components/landing/StatsSection'
import TransparencySection from '@/components/landing/TransparencySection'
import WhyHODLSection from '@/components/landing/WhyHODLSection'
import { useEffect } from 'react'

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true
    })
  }, [])

  return (
    <div className="relative bg-black text-white overflow-x-hidden">
      {/* Gradient background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-yellow-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
      
      {/* Blur glow effect */}
      <div className="h-0 w-[40rem] absolute top-[20%] -right-[5%] shadow-[0_0_900px_20px_#e99b63] rotate-[30deg] -z-10 pointer-events-none" />
      
      {/* Header - No AOS animation for fixed header */}
      <LandingHeader />
      {/* Spacer to prevent header from overlapping intro content */}
      <div aria-hidden className="h-[72px] md:h-[80px]" />
      
      {/* Hero Section */}
      <div data-aos="fade-right">
        <HeroSection />
      </div>
      
      {/* Why HODL Section */}
      <div data-aos="fade-up">
        <WhyHODLSection />
      </div>
      
      {/* How It Works Section */}
      <div data-aos="fade-up">
        <HowItWorksSection />
      </div>
      
      {/* Market Opportunity Section */}
      <div data-aos="fade-up">
        <MarketOpportunitySection />
      </div>

      {/* Competitive Landscape Section */}
      <div data-aos="fade-up">
        <CompetitiveLandscapeSection />
      </div>

      {/* Business Model / Pricing Section */}
      <div data-aos="fade-up">
        <BusinessModelSection />
      </div>

      {/* Transparency Section */}
      <div data-aos="fade-up">
        <TransparencySection />
      </div>
      
      {/* Features Section */}
      <div data-aos="fade-up">
        <FeaturesSection />
      </div>
      
      {/* Challenges Section */}
      <div data-aos="fade-up">
        <ChallengesSection />
      </div>
      
      {/* Stats Section */}
      <div data-aos="fade-up">
        <StatsSection />
      </div>
      
      {/* Footer */}
      <LandingFooter />
    </div>
  )
}

