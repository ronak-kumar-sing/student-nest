# StudentNest - Dedicated Pricing Page with Payment Management

A comprehensive pricing page with dark theme design and integrated payment failure handling, built with Next.js 15 and shadcn/ui components.

## 🎨 Design System

### Dark Theme Consistency
```css
/* Background Colors (Same as Landing Page) */
--bg-primary: #0a0a0b;           /* Main dark background */
--bg-secondary: #1a1a1b;         /* Card backgrounds */
--bg-tertiary: #2a2a2b;          /* Elevated elements */

/* Accent Colors */
--accent-purple: #7c3aed;        /* Primary purple */
--accent-blue: #3b82f6;          /* Secondary blue */
--accent-green: #10b981;         /* Success/CTA green */
--accent-red: #ef4444;           /* Error/Failure red */
--accent-yellow: #f59e0b;        /* Warning/Pending yellow */

/* Text Colors */
--text-primary: #ffffff;         /* Main text */
--text-secondary: #a1a1aa;       /* Secondary text */
--text-muted: #71717a;           /* Muted text */
```

## 📄 Pricing Page Structure

### Page Route
```
/pricing - Dedicated pricing page
/pricing/payment-failed - Payment failure handling page
/pricing/payment-success - Payment success confirmation
```

### Main Pricing Page Layout
```jsx
// app/pricing/page.tsx
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Header />
      <PricingHero />
      <PricingPlans />
      <PricingComparison />
      <PaymentMethods />
      <PricingFAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
```

## 💰 Pricing Plans Section

### Student & Owner Pricing Cards
```jsx
const PricingPlans = () => (
  <section className="py-24 bg-[#0a0a0b]">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
          <span className="text-white">Simple,</span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Student-Friendly Pricing
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Transparent pricing designed for students and property owners. 
          No hidden fees, no surprises.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Student Plan - FREE */}
        <Card className="p-8 bg-gradient-to-br from-[#1a1a1b] to-[#2a2a2b] border border-green-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
                Most Popular
              </Badge>
              <h3 className="text-2xl font-bold text-white mb-2">For Students</h3>
              <div className="text-5xl font-bold text-green-400 mb-2">FREE</div>
              <p className="text-gray-400">Forever and always</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Browse unlimited properties",
                "Contact verified owners",
                "Schedule property visits",
                "Advanced search filters",
                "Save favorite properties",
                "Real-time messaging",
                "Mobile app access",
                "24/7 customer support"
              ].map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-700 pt-6 mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Optional Add-on:</h4>
              <div className="bg-[#2a2a2b] p-4 rounded-lg border border-blue-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-400">Room Partner Search</span>
                  <span className="text-2xl font-bold text-blue-400">₹99</span>
                </div>
                <p className="text-sm text-gray-400">
                  Find 6 compatible roommates with chat access and phone visibility
                </p>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3">
              Get Started Free
            </Button>
          </div>
        </Card>

        {/* Property Owner - Basic Plan */}
        <Card className="p-8 bg-gradient-to-br from-[#1a1a1b] to-[#2a2a2b] border border-blue-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Basic Listing</h3>
              <div className="text-5xl font-bold text-blue-400 mb-1">₹99</div>
              <p className="text-gray-400">Per room / 4 months</p>
              <p className="text-sm text-blue-400 mt-1">Only ₹24.75/month</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "List unlimited photos",
                "Detailed property description",
                "Direct student messaging",
                "Basic listing visibility",
                "Contact management",
                "Booking requests",
                "Payment notifications",
                "Performance analytics"
              ].map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 mb-4">
              Choose Basic Plan
            </Button>
            
            <p className="text-center text-sm text-gray-400">
              Success fee: Small commission only on confirmed bookings
            </p>
          </div>
        </Card>

        {/* Property Owner - Premium Plan */}
        <Card className="p-8 bg-gradient-to-br from-[#1a1a1b] to-[#2a2a2b] border border-purple-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
                Best Value
              </Badge>
              <h3 className="text-2xl font-bold text-white mb-2">Annual Plan</h3>
              <div className="text-5xl font-bold text-purple-400 mb-1">₹199</div>
              <p className="text-gray-400">Per room / 12 months</p>
              <p className="text-sm text-purple-400 mt-1">Only ₹16.58/month</p>
              <div className="mt-2">
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs">
                  Save ₹197
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Everything in Basic Plan",
                "Priority listing placement",
                "Featured property badge",
                "Advanced analytics",
                "Virtual tour integration",
                "Premium customer support",
                "Marketing boost tools",
                "Bulk listing discounts"
              ].map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 mb-4">
              Choose Annual Plan
            </Button>
            
            <p className="text-center text-sm text-gray-400">
              Success fee: Small commission only on confirmed bookings
            </p>
          </div>
        </Card>
      </div>

      {/* Pricing Note */}
      <div className="text-center mt-12">
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          <strong className="text-white">Our Promise:</strong> No hidden fees, no setup costs, no long-term contracts. 
          Pay for what you use, succeed when you succeed.
        </p>
      </div>
    </div>
  </section>
);
```

## 💳 Payment Methods Section

```jsx
const PaymentMethods = () => (
  <section className="py-16 bg-gradient-to-b from-[#0a0a0b] to-[#1a1a1b]">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Secure Payment Options</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose from multiple payment methods. All transactions are secured and encrypted.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[
          { name: "UPI", icon: "📱", description: "Pay with any UPI app" },
          { name: "Cards", icon: "💳", description: "Debit & Credit cards" },
          { name: "Net Banking", icon: "🏦", description: "All major banks" },
          { name: "Wallets", icon: "👛", description: "Paytm, PhonePe, GPay" }
        ].map((method) => (
          <Card key={method.name} className="p-6 bg-[#1a1a1b] border border-gray-700 text-center hover:border-blue-500/50 transition-colors">
            <div className="text-3xl mb-3">{method.icon}</div>
            <h3 className="font-semibold text-white mb-2">{method.name}</h3>
            <p className="text-sm text-gray-400">{method.description}</p>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <div className="flex items-center justify-center space-x-4 text-gray-400">
          <Shield className="h-5 w-5" />
          <span>SSL Encrypted</span>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <Lock className="h-5 w-5" />
          <span>Bank-Grade Security</span>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <CheckCircle className="h-5 w-5" />
          <span>PCI Compliant</span>
        </div>
      </div>
    </div>
  </section>
);
```

## ❌ Payment Failure Page

### Route: `/pricing/payment-failed`
```jsx
// app/pricing/payment-failed/page.tsx
export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const amount = searchParams.get('amount');
  const reason = searchParams.get('reason');

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Header />
      <PaymentFailedContent orderId={orderId} amount={amount} reason={reason} />
      <Footer />
    </div>
  );
}

const PaymentFailedContent = ({ orderId, amount, reason }) => (
  <section className="py-24 bg-[#0a0a0b]">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Failure Icon Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6">
            <XCircle className="h-12 w-12 text-red-400 animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-white mb-4">Payment Failed</h1>
        <p className="text-xl text-gray-400 mb-8">
          Don't worry, no amount has been deducted from your account. 
          You can try again or choose a different payment method.
        </p>

        {/* Failure Details */}
        {orderId && (
          <Card className="p-6 bg-[#1a1a1b] border border-red-500/20 mb-8 text-left">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              Transaction Details
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono text-red-400">{orderId}</span>
              </div>
              {amount && (
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">₹{amount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-red-400 font-semibold">Failed</span>
              </div>
              {reason && (
                <div className="flex justify-between">
                  <span>Reason:</span>
                  <span className="text-red-400">{reason}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Common Failure Reasons */}
        <Card className="p-6 bg-[#1a1a1b] border border-gray-700 mb-8 text-left">
          <h3 className="font-semibold text-white mb-4">Common Reasons for Payment Failure</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Insufficient balance in your account</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Network connectivity issues</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Incorrect card details or expired card</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Bank server temporarily unavailable</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Transaction limit exceeded</span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            onClick={() => window.history.back()}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3"
            asChild
          >
            <Link href="/pricing">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Pricing
            </Link>
          </Button>
        </div>

        {/* Alternative Payment Methods */}
        <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
          <h3 className="font-semibold text-white mb-4">Try Alternative Payment Methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "UPI", icon: "📱" },
              { name: "Net Banking", icon: "🏦" },
              { name: "Different Card", icon: "💳" },
              { name: "Wallet", icon: "👛" }
            ].map((method) => (
              <Button 
                key={method.name}
                variant="outline" 
                className="border-gray-600 hover:border-green-500 hover:bg-green-500/10"
              >
                <span className="mr-2">{method.icon}</span>
                {method.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Contact Support */}
        <div className="mt-8 p-4 bg-[#1a1a1b] rounded-lg border border-gray-700">
          <p className="text-gray-400 mb-4">
            Still facing issues? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <MessageSquare className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
```

## ✅ Payment Success Page

### Route: `/pricing/payment-success`
```jsx
// app/pricing/payment-success/page.tsx
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const amount = searchParams.get('amount');
  const plan = searchParams.get('plan');

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Header />
      <PaymentSuccessContent orderId={orderId} amount={amount} plan={plan} />
      <Footer />
    </div>
  );
}

const PaymentSuccessContent = ({ orderId, amount, plan }) => (
  <section className="py-24 bg-[#0a0a0b]">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-400 animate-bounce" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-400 mb-8">
          Thank you for choosing StudentNest. Your {plan} plan is now active 
          and ready to use.
        </p>

        {/* Payment Receipt */}
        <Card className="p-6 bg-[#1a1a1b] border border-green-500/20 mb-8 text-left">
          <h3 className="font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            Payment Receipt
          </h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono text-green-400">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-semibold text-blue-400">{plan}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-semibold text-green-400">₹{amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-400 font-semibold">Completed</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>UPI</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8 text-left">
          <h3 className="font-semibold text-white mb-4">What's Next?</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
              <span>Your listing is now live and visible to students</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
              <span>Check your dashboard for inquiries and messages</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
              <span>Set up your property profile and add photos</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
              <span>Receipt has been sent to your email</span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            asChild
          >
            <Link href="/owner/dashboard">
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3"
            asChild
          >
            <Link href="/owner/post-room">
              <Plus className="h-5 w-5 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
```

## 🎨 Pricing Comparison Table

```jsx
const PricingComparison = () => (
  <section className="py-16 bg-[#1a1a1b]">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Feature Comparison</h2>
        <p className="text-gray-400">See what's included in each plan</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 text-white font-semibold">Features</th>
                <th className="text-center py-4 px-6 text-green-400 font-semibold">Students<br /><span className="text-sm font-normal">FREE</span></th>
                <th className="text-center py-4 px-6 text-blue-400 font-semibold">Basic<br /><span className="text-sm font-normal">₹99/4mo</span></th>
                <th className="text-center py-4 px-6 text-purple-400 font-semibold">Annual<br /><span className="text-sm font-normal">₹199/12mo</span></th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Browse Properties", student: true, basic: true, annual: true },
                { feature: "Direct Messaging", student: true, basic: true, annual: true },
                { feature: "Property Listings", student: false, basic: "Unlimited", annual: "Unlimited" },
                { feature: "Room Partner Search", student: "₹99 add-on", basic: false, annual: false },
                { feature: "Priority Support", student: false, basic: true, annual: true },
                { feature: "Featured Listings", student: false, basic: false, annual: true },
                { feature: "Analytics Dashboard", student: false, basic: "Basic", annual: "Advanced" },
                { feature: "Virtual Tour Integration", student: false, basic: false, annual: true },
                { feature: "Marketing Boost", student: false, basic: false, annual: true }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-[#2a2a2b]/50">
                  <td className="py-4 px-6 text-white">{row.feature}</td>
                  <td className="py-4 px-6 text-center">
                    {typeof row.student === 'boolean' ? (
                      row.student ? <CheckCircle className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-gray-600 mx-auto" />
                    ) : (
                      <span className="text-green-400 text-sm">{row.student}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {typeof row.basic === 'boolean' ? (
                      row.basic ? <CheckCircle className="h-5 w-5 text-blue-400 mx-auto" /> : <X className="h-5 w-5 text-gray-600 mx-auto" />
                    ) : (
                      <span className="text-blue-400 text-sm">{row.basic}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {typeof row.annual === 'boolean' ? (
                      row.annual ? <CheckCircle className="h-5 w-5 text-purple-400 mx-auto" /> : <X className="h-5 w-5 text-gray-600 mx-auto" />
                    ) : (
                      <span className="text-purple-400 text-sm">{row.annual}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
);
```

## 🔧 Technical Implementation

### Payment Integration
```jsx
// lib/payment.js
export const initiatePayment = async (planData) => {
  try {
    const response = await fetch('/api/payment/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: planData.amount,
        plan: planData.plan,
        userId: planData.userId,
        propertyId: planData.propertyId
      })
    });

    const { orderId, paymentUrl } = await response.json();
    
    // Redirect to payment gateway
    window.location.href = paymentUrl;
    
  } catch (error) {
    console.error('Payment initiation failed:', error);
    // Redirect to failure page
    router.push(`/pricing/payment-failed?reason=${encodeURIComponent(error.message)}`);
  }
};

// Handle payment callback
export const handlePaymentCallback = (searchParams) => {
  const status = searchParams.get('status');
  const orderId = searchParams.get('order_id');
  const amount = searchParams.get('amount');
  
  if (status === 'success') {
    router.push(`/pricing/payment-success?order_id=${orderId}&amount=${amount}`);
  } else {
    const reason = searchParams.get('failure_reason') || 'Payment processing failed';
    router.push(`/pricing/payment-failed?order_id=${orderId}&reason=${encodeURIComponent(reason)}`);
  }
};
```

### API Routes
```jsx
// app/api/payment/initiate/route.js
export async function POST(request) {
  try {
    const { amount, plan, userId } = await request.json();
    
    // Create order with payment gateway
    const order = await createPaymentOrder({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: { plan, userId }
    });
    
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      paymentUrl: `${process.env.PAYMENT_GATEWAY_URL}?order_id=${order.id}`
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment initiation failed' }, 
      { status: 500 }
    );
  }
}

// app/api/payment/callback/route.js
export async function POST(request) {
  try {
    const { orderId, paymentId, signature } = await request.json();
    
    // Verify payment signature
    const isValid = verifyPaymentSignature({ orderId, paymentId, signature });
    
    if (isValid) {
      // Update user subscription
      await updateUserSubscription(orderId);
      
      return NextResponse.json({ status: 'success' });
    } else {
      return NextResponse.json({ status: 'failed', reason: 'Invalid signature' });
    }
    
  } catch (error) {
    return NextResponse.json({ status: 'failed', reason: error.message });
  }
}
```

## 📱 Mobile Responsiveness

### Mobile-Optimized Pricing Cards
```css
@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .pricing-card {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .comparison-table {
    font-size: 0.875rem;
  }
  
  .payment-methods {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .payment-methods {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
}
```

## 🚀 Performance & SEO

### Meta Tags for Pricing Page
```jsx
// app/pricing/layout.tsx
export const metadata = {
  title: 'Pricing - StudentNest | Affordable Student Housing Platform',
  description: 'Transparent pricing for students and property owners. Free for students, ₹99 for property listings. No hidden fees, no surprises.',
  keywords: 'student housing pricing, property listing fees, affordable accommodation, student-friendly pricing',
  openGraph: {
    title: 'StudentNest Pricing - Transparent & Student-Friendly',
    description: 'Free for students, affordable for property owners. Join thousands using StudentNest.',
    images: ['/og/pricing-page.jpg']
  }
};
```

### Analytics Tracking
```jsx
// Track pricing page interactions
const trackPricingEvent = (eventName, properties) => {
  analytics.track(eventName, {
    page: 'pricing',
    timestamp: new Date().toISOString(),
    ...properties
  });
};

// Usage examples
trackPricingEvent('Plan Selected', { plan: 'basic', amount: 99 });
trackPricingEvent('Payment Initiated', { orderId, amount });
trackPricingEvent('Payment Failed', { reason, orderId });
trackPricingEvent('Payment Successful', { plan, amount, orderId });
```

This pricing page provides a comprehensive, user-friendly experience with proper error handling, success confirmations, and maintains the dark theme consistency throughout the entire payment flow.