import dynamic from 'next/dynamic';

// Dynamically import landing page components with loading states
const Header = dynamic(() => import('@/components/landing/Header'), {
  ssr: false,
  loading: () => <div className="h-20 bg-white dark:bg-gray-900"></div>
});

const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), {
  ssr: false,
  loading: () => <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-600"></div>
});

const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
});

const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
});

const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
});

const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
});

const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
});

const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
});

const CTASection = dynamic(() => import('@/components/landing/CTASection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gradient-to-br from-blue-900 to-purple-900"></div>
});

const Footer = dynamic(() => import('@/components/landing/Footer'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header with navigation */}
      <Header />

      {/* Main landing page content */}
      <main className="relative">
        {/* Hero section with search and CTAs */}
        <HeroSection />

        {/* Features showcase */}
        <FeaturesSection />

        {/* Statistics and achievements */}
        <StatsSection />

        {/* How it works for students and owners */}
        <HowItWorksSection />

        {/* User testimonials and reviews */}
        <TestimonialsSection />

        {/* Pricing plans */}
        <PricingSection />

        {/* Frequently asked questions */}
        <FAQSection />

        {/* Final call-to-action */}
        <CTASection />
      </main>

      {/* Footer with links and information */}
      <Footer />
    </div>
  );
}
