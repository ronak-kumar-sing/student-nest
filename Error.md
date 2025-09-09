✓ Starting...
 ✓ Ready in 1970ms
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ○ Compiling /dashboard/messages ...
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⨯ ./src/app/page.js
Error:   × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:4:1]
  1 │     import dynamic from 'next/dynamic';
  2 │
  3 │     // Dynamically import landing page components with loading states
  4 │ ╭─▶ const Header = dynamic(() => import('@/components/landing/Header'), {
  5 │ │     ssr: false,
  6 │ │     loading: () => <div className="h-20 bg-white dark:bg-gray-900"></div>
  7 │ ╰─▶ });
  8 │
  9 │     const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), {
 10 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:9:1]
  6 │       loading: () => <div className="h-20 bg-white dark:bg-gray-900"></div>
  7 │     });
  8 │
  9 │ ╭─▶ const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), {
 10 │ │     ssr: false,
 11 │ │     loading: () => <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-600"></div>
 12 │ ╰─▶ });
 13 │
 14 │     const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
 15 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:14:1]
 11 │       loading: () => <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-600"></div>
 12 │     });
 13 │
 14 │ ╭─▶ const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
 15 │ │     ssr: false,
 16 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 17 │ ╰─▶ });
 18 │
 19 │     const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), {
 20 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:19:1]
 16 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 17 │     });
 18 │
 19 │ ╭─▶ const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), {
 20 │ │     ssr: false,
 21 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 22 │ ╰─▶ });
 23 │
 24 │     const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), {
 25 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:24:1]
 21 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 22 │     });
 23 │
 24 │ ╭─▶ const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), {
 25 │ │     ssr: false,
 26 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 27 │ ╰─▶ });
 28 │
 29 │     const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
 30 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:29:1]
 26 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 27 │     });
 28 │
 29 │ ╭─▶ const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
 30 │ │     ssr: false,
 31 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 32 │ ╰─▶ });
 33 │
 34 │     const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), {
 35 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:34:1]
 31 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 32 │     });
 33 │
 34 │ ╭─▶ const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), {
 35 │ │     ssr: false,
 36 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 37 │ ╰─▶ });
 38 │
 39 │     const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
 40 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:39:1]
 36 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 37 │     });
 38 │
 39 │ ╭─▶ const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
 40 │ │     ssr: false,
 41 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 42 │ ╰─▶ });
 43 │
 44 │     const CTASection = dynamic(() => import('@/components/landing/CTASection'), {
 45 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:44:1]
 41 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 42 │     });
 43 │
 44 │ ╭─▶ const CTASection = dynamic(() => import('@/components/landing/CTASection'), {
 45 │ │     ssr: false,
 46 │ │     loading: () => <div className="h-96 bg-gradient-to-br from-blue-900 to-purple-900"></div>
 47 │ ╰─▶ });
 48 │
 49 │     const Footer = dynamic(() => import('@/components/landing/Footer'), {
 50 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:49:1]
 46 │       loading: () => <div className="h-96 bg-gradient-to-br from-blue-900 to-purple-900"></div>
 47 │     });
 48 │
 49 │ ╭─▶ const Footer = dynamic(() => import('@/components/landing/Footer'), {
 50 │ │     ssr: false,
 51 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 52 │ ╰─▶ });
 53 │
 54 │     export default function Home() {
 55 │       return (
    ╰────

Import trace for requested module:
./src/app/page.js
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⨯ ./src/app/page.js
Error:   × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:4:1]
  1 │     import dynamic from 'next/dynamic';
  2 │
  3 │     // Dynamically import landing page components with loading states
  4 │ ╭─▶ const Header = dynamic(() => import('@/components/landing/Header'), {
  5 │ │     ssr: false,
  6 │ │     loading: () => <div className="h-20 bg-white dark:bg-gray-900"></div>
  7 │ ╰─▶ });
  8 │
  9 │     const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), {
 10 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:9:1]
  6 │       loading: () => <div className="h-20 bg-white dark:bg-gray-900"></div>
  7 │     });
  8 │
  9 │ ╭─▶ const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), {
 10 │ │     ssr: false,
 11 │ │     loading: () => <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-600"></div>
 12 │ ╰─▶ });
 13 │
 14 │     const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
 15 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:14:1]
 11 │       loading: () => <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-600"></div>
 12 │     });
 13 │
 14 │ ╭─▶ const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
 15 │ │     ssr: false,
 16 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 17 │ ╰─▶ });
 18 │
 19 │     const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), {
 20 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:19:1]
 16 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 17 │     });
 18 │
 19 │ ╭─▶ const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), {
 20 │ │     ssr: false,
 21 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 22 │ ╰─▶ });
 23 │
 24 │     const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), {
 25 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:24:1]
 21 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 22 │     });
 23 │
 24 │ ╭─▶ const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), {
 25 │ │     ssr: false,
 26 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 27 │ ╰─▶ });
 28 │
 29 │     const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
 30 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:29:1]
 26 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 27 │     });
 28 │
 29 │ ╭─▶ const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
 30 │ │     ssr: false,
 31 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 32 │ ╰─▶ });
 33 │
 34 │     const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), {
 35 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:34:1]
 31 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 32 │     });
 33 │
 34 │ ╭─▶ const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), {
 35 │ │     ssr: false,
 36 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 37 │ ╰─▶ });
 38 │
 39 │     const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
 40 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:39:1]
 36 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 37 │     });
 38 │
 39 │ ╭─▶ const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
 40 │ │     ssr: false,
 41 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 42 │ ╰─▶ });
 43 │
 44 │     const CTASection = dynamic(() => import('@/components/landing/CTASection'), {
 45 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:44:1]
 41 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 42 │     });
 43 │
 44 │ ╭─▶ const CTASection = dynamic(() => import('@/components/landing/CTASection'), {
 45 │ │     ssr: false,
 46 │ │     loading: () => <div className="h-96 bg-gradient-to-br from-blue-900 to-purple-900"></div>
 47 │ ╰─▶ });
 48 │
 49 │     const Footer = dynamic(() => import('@/components/landing/Footer'), {
 50 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:49:1]
 46 │       loading: () => <div className="h-96 bg-gradient-to-br from-blue-900 to-purple-900"></div>
 47 │     });
 48 │
 49 │ ╭─▶ const Footer = dynamic(() => import('@/components/landing/Footer'), {
 50 │ │     ssr: false,
 51 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 52 │ ╰─▶ });
 53 │
 54 │     export default function Home() {
 55 │       return (
    ╰────

Import trace for requested module:
./src/app/page.js
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 ⨯ ./src/app/page.js
Error:   × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:4:1]
  1 │     import dynamic from 'next/dynamic';
  2 │
  3 │     // Dynamically import landing page components with loading states
  4 │ ╭─▶ const Header = dynamic(() => import('@/components/landing/Header'), {
  5 │ │     ssr: false,
  6 │ │     loading: () => <div className="h-20 bg-white dark:bg-gray-900"></div>
  7 │ ╰─▶ });
  8 │
  9 │     const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), {
 10 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:9:1]
  6 │       loading: () => <div className="h-20 bg-white dark:bg-gray-900"></div>
  7 │     });
  8 │
  9 │ ╭─▶ const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), {
 10 │ │     ssr: false,
 11 │ │     loading: () => <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-600"></div>
 12 │ ╰─▶ });
 13 │
 14 │     const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
 15 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:14:1]
 11 │       loading: () => <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-600"></div>
 12 │     });
 13 │
 14 │ ╭─▶ const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
 15 │ │     ssr: false,
 16 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 17 │ ╰─▶ });
 18 │
 19 │     const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), {
 20 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:19:1]
 16 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 17 │     });
 18 │
 19 │ ╭─▶ const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), {
 20 │ │     ssr: false,
 21 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 22 │ ╰─▶ });
 23 │
 24 │     const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), {
 25 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:24:1]
 21 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 22 │     });
 23 │
 24 │ ╭─▶ const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'), {
 25 │ │     ssr: false,
 26 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 27 │ ╰─▶ });
 28 │
 29 │     const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
 30 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:29:1]
 26 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 27 │     });
 28 │
 29 │ ╭─▶ const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
 30 │ │     ssr: false,
 31 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 32 │ ╰─▶ });
 33 │
 34 │     const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), {
 35 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:34:1]
 31 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 32 │     });
 33 │
 34 │ ╭─▶ const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), {
 35 │ │     ssr: false,
 36 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 37 │ ╰─▶ });
 38 │
 39 │     const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
 40 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:39:1]
 36 │       loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 37 │     });
 38 │
 39 │ ╭─▶ const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
 40 │ │     ssr: false,
 41 │ │     loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 42 │ ╰─▶ });
 43 │
 44 │     const CTASection = dynamic(() => import('@/components/landing/CTASection'), {
 45 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:44:1]
 41 │       loading: () => <div className="h-96 bg-white dark:bg-gray-800"></div>
 42 │     });
 43 │
 44 │ ╭─▶ const CTASection = dynamic(() => import('@/components/landing/CTASection'), {
 45 │ │     ssr: false,
 46 │ │     loading: () => <div className="h-96 bg-gradient-to-br from-blue-900 to-purple-900"></div>
 47 │ ╰─▶ });
 48 │
 49 │     const Footer = dynamic(() => import('@/components/landing/Footer'), {
 50 │       ssr: false,
    ╰────
  × `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/page.js:49:1]
 46 │       loading: () => <div className="h-96 bg-gradient-to-br from-blue-900 to-purple-900"></div>
 47 │     });
 48 │
 49 │ ╭─▶ const Footer = dynamic(() => import('@/components/landing/Footer'), {
 50 │ │     ssr: false,
 51 │ │     loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900"></div>
 52 │ ╰─▶ });
 53 │
 54 │     export default function Home() {
 55 │       return (
    ╰────

Import trace for requested module:
./src/app/page.js
 GET /dashboard/messages 500 in 578ms
 GET / 500 in 539ms
 GET /?id=ad8db667-cb62-45bf-b086-5d3857ce53b7&vscodeBrowserReqId=1757430026787 500 in 156ms
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
<w> [webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, rename '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz_' -> '/Users/ronakkumarsingh/Desktop/student-nest/.next/cache/webpack/client-development-fallback/0.pack.gz'
