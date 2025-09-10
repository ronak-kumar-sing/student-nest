"use client";

import { Card } from '@/components/ui/card';
import { Shield, Lock, CheckCircle } from 'lucide-react';

export default function PaymentMethods() {
  const paymentMethods = [
    { name: "UPI", icon: "📱", description: "Pay with any UPI app" },
    { name: "Cards", icon: "💳", description: "Debit & Credit cards" },
    { name: "Net Banking", icon: "🏦", description: "All major banks" },
    { name: "Wallets", icon: "👛", description: "Paytm, PhonePe, GPay" }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#0a0a0b] to-[#1a1a1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Secure Payment Options</h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto">
            Choose from multiple payment methods. All transactions are secured and encrypted.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
          {paymentMethods.map((method) => (
            <Card
              key={method.name}
              className="p-6 bg-[#1a1a1b] border border-[#2a2a2b] text-center hover:border-blue-500/50 transition-colors cursor-pointer group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {method.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{method.name}</h3>
              <p className="text-sm text-[#a1a1aa]">{method.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 text-[#a1a1aa] flex-wrap gap-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>SSL Encrypted</span>
            </div>
            <div className="w-1 h-1 bg-[#71717a] rounded-full hidden md:block"></div>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="w-1 h-1 bg-[#71717a] rounded-full hidden md:block"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
