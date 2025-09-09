"use client";

import dynamic from 'next/dynamic';

// Dynamically import simplified landing page components
const Header = dynamic(() => import('@/components/landing/Header'), {
  loading: () => <div className="h-20 bg-white dark:bg-gray-900"></div>
});

const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), {
  loading: () => <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-600"></div>
});

const ValueProposition = dynamic(() => import('@/components/landing/ValueProposition'), {
  loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
});

const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), {
  loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
});

const PricingSectionSimple = dynamic(() => import('@/components/landing/PricingSectionSimple'), {
  loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
});

const EarlyAdopterSection = dynamic(() => import('@/components/landing/EarlyAdopterSection'), {
  loading: () => <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
});

const EssentialFAQ = dynamic(() => import('@/components/landing/EssentialFAQ'), {
  loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
});

const SimpleFooter = dynamic(() => import('@/components/landing/SimpleFooter'), {
  loading: () => <div className="h-64 bg-gray-50 dark:bg-gray-900"></div>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Simplified header with minimal navigation */}
      <Header />

      {/* Main landing page content - streamlined for new launch */}
      <main className="relative">
        {/* Hero section with clear value proposition */}
        <HeroSection />

        {/* Core value proposition - 3 key benefits only */}
        <ValueProposition />

        {/* Simplified how it works - 3 steps */}
        <HowItWorksSection />

        {/* Accurate pricing with ₹99/₹199 model */}
        <PricingSectionSimple />

        {/* Early adopter section for new launch */}
        <EarlyAdopterSection />

        {/* Essential FAQ - only 4 key questions */}
        <EssentialFAQ />
      </main>

      {/* Simplified footer with basic links only */}
      <SimpleFooter />
    </div>
  );
}
