"use client";

import dynamic from 'next/dynamic';

// Dynamically import pricing page components
const Header = dynamic(() => import('@/components/landing/Header'), {
  loading: () => <div className="h-20 bg-[#0a0a0b]"></div>
});

const PricingHero = dynamic(() => import('@/components/pricing/PricingHero'), {
  loading: () => <div className="h-96 bg-[#0a0a0b]"></div>
});

const PricingPlans = dynamic(() => import('@/components/pricing/PricingPlans'), {
  loading: () => <div className="h-screen bg-[#0a0a0b]"></div>
});

const PricingComparison = dynamic(() => import('@/components/pricing/PricingComparison'), {
  loading: () => <div className="h-96 bg-[#0a0a0b]"></div>
});

const PaymentMethods = dynamic(() => import('@/components/pricing/PaymentMethods'), {
  loading: () => <div className="h-96 bg-[#0a0a0b]"></div>
});

const PricingFAQ = dynamic(() => import('@/components/pricing/PricingFAQ'), {
  loading: () => <div className="h-96 bg-[#0a0a0b]"></div>
});

const CTASection = dynamic(() => import('@/components/pricing/CTASection'), {
  loading: () => <div className="h-48 bg-[#0a0a0b]"></div>
});

const SimpleFooter = dynamic(() => import('@/components/landing/SimpleFooter'), {
  loading: () => <div className="h-64 bg-[#0a0a0b]"></div>
});

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Header />
      <main className="relative">
        <PricingHero />
        <PricingPlans />
        <PricingComparison />
        <PaymentMethods />
        <PricingFAQ />
        <CTASection />
      </main>
      <SimpleFooter />
    </div>
  );
}
