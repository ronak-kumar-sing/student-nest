"use client";

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function PricingPlans() {
  const [isLoading, setIsLoading] = useState({});

  const handlePlanSelect = async (planType, amount) => {
    setIsLoading({ [planType]: true });

    // Simulate payment initiation
    setTimeout(() => {
      setIsLoading({ [planType]: false });
      // In real implementation, redirect to payment gateway
      console.log(`Initiating payment for ${planType} plan: ₹${amount}`);
    }, 2000);
  };

  return (
    <section className="py-24 bg-[#0a0a0b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
                <p className="text-[#a1a1aa]">Forever and always</p>
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
                  <li key={feature} className="flex items-center text-[#a1a1aa]">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#2a2a2b] pt-6 mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">Optional Add-on:</h4>
                <div className="bg-[#2a2a2b] p-4 rounded-lg border border-blue-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-400">Room Partner Search</span>
                    <span className="text-2xl font-bold text-blue-400">₹99</span>
                  </div>
                  <p className="text-sm text-[#a1a1aa]">
                    Find 6 compatible roommates with chat access and phone visibility
                  </p>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3"
                onClick={() => handlePlanSelect('student', 0)}
                disabled={isLoading.student}
              >
                {isLoading.student ? 'Processing...' : 'Get Started Free'}
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
                <p className="text-[#a1a1aa]">Per room / 4 months</p>
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
                  <li key={feature} className="flex items-center text-[#a1a1aa]">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 mb-4"
                onClick={() => handlePlanSelect('basic', 99)}
                disabled={isLoading.basic}
              >
                {isLoading.basic ? 'Processing...' : 'Choose Basic Plan'}
              </Button>

              <p className="text-center text-sm text-[#a1a1aa]">
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
                <p className="text-[#a1a1aa]">Per room / 12 months</p>
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
                  <li key={feature} className="flex items-center text-[#a1a1aa]">
                    <CheckCircle className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 mb-4"
                onClick={() => handlePlanSelect('annual', 199)}
                disabled={isLoading.annual}
              >
                {isLoading.annual ? 'Processing...' : 'Choose Annual Plan'}
              </Button>

              <p className="text-center text-sm text-[#a1a1aa]">
                Success fee: Small commission only on confirmed bookings
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
