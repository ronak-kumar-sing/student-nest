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
          <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <CardTitle className="text-2xl">Students</CardTitle>
              </div>
              <CardDescription className="text-base">
                Find your ideal accommodation near your college
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700 dark:text-green-400">Features for Students:</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Email & Phone OTP verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    College ID integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Secure password requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Browse verified properties
                  </li>
                </ul>
              </div>
              <div className="flex gap-2 pt-4">
                <Button asChild className="flex-1">
                  <Link href="/student/signup" className="flex items-center gap-2">
                    Sign Up <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/student/login">Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Owner Card */}
          <Card className="relative overflow-hidden border-2 hover:border-green-300 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <HomeIcon className="w-8 h-8 text-green-600" />
                <CardTitle className="text-2xl">Property Owners</CardTitle>
              </div>
              <CardDescription className="text-base">
                List your properties and connect with students
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700 dark:text-green-400">Features for Owners:</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Email & Phone OTP verification
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    Mandatory Aadhaar/DigiLocker verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Identity verification process
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Trusted property listing
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <Shield className="w-4 h-4 inline mr-1" />
                  <strong>Verification Required:</strong> Complete identity verification to list properties
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button asChild className="flex-1" variant="default">
                  <Link href="/owner/signup" className="flex items-center gap-2">
                    Sign Up <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/owner/login">Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Multi-factor authentication with OTP verification and identity checks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verified Community</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                All property owners undergo strict verification for student safety
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Student-Focused</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Designed specifically for college students with integrated college verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Authentication Demo</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Demo Credentials:</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li><strong>Student:</strong> student@test.com / password123</li>
                    <li><strong>Owner:</strong> owner@test.com / password123</li>
                    <li><strong>OTP Code:</strong> 123456 (for all verifications)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Features Included:</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>• React Hook Form with Zod validation</li>
                    <li>• Email/Phone OTP verification flow</li>
                    <li>• Aadhaar/DigiLocker integration UI</li>
                    <li>• Responsive design with dark mode</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
