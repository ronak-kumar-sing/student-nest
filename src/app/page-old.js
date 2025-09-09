import dynamic from 'next/dynamic';

// Dynamically import landing page components
const Header = dynamic(() => import('@/components/landing/Header'), { ssr: false });
const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), { ssr: false });
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), { ssr: false });
const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), { ssr: false });
const CTASection = dynamic(() => import('@/components/landing/CTASection'), { ssr: false });
const Footer = dynamic(() => import('@/components/landing/Footer'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}