"use client";

import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function PricingFAQ() {
  const [openItems, setOpenItems] = useState([0]); // First item open by default

  const toggleItem = (index) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "Is StudentNest really free for students?",
      answer: "Yes! StudentNest is completely free for students. You can browse properties, contact owners, schedule visits, and use all core features without any cost. We only charge property owners for listing their properties."
    },
    {
      question: "What's included in the Room Partner Search add-on?",
      answer: "For ₹99, you get access to find 6 compatible roommates based on your preferences, direct chat access with potential roommates, and phone number visibility for easier coordination."
    },
    {
      question: "How does the property owner pricing work?",
      answer: "Property owners pay ₹99 for 4 months of basic listing or ₹199 for 12 months with premium features. Additionally, we charge a small success fee only when a booking is confirmed through our platform."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees whatsoever. What you see is what you pay. For students, it's completely free. For property owners, you only pay the listing fee and success commission on confirmed bookings."
    },
    {
      question: "Can I cancel my plan anytime?",
      answer: "Yes, you can cancel anytime. However, since our plans are prepaid (4 months or 12 months), you'll continue to have access until the end of your current billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including UPI (GPay, PhonePe, Paytm), debit/credit cards, net banking, and digital wallets. All payments are secured with bank-grade encryption."
    },
    {
      question: "What happens if my payment fails?",
      answer: "If your payment fails, no amount will be deducted from your account. You can retry the payment or choose a different payment method. Our support team is available to help resolve any payment issues."
    },
    {
      question: "Do you offer refunds?",
      answer: "Refunds are processed on a case-by-case basis. If you face technical issues preventing you from using our service, contact our support team within 7 days of payment for assistance."
    }
  ];

  return (
    <section className="py-16 bg-[#0a0a0b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-[#a1a1aa]">Everything you need to know about our pricing</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-[#1a1a1b] border border-[#2a2a2b] hover:border-[#3a3a3b] transition-colors"
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between focus:outline-none"
                onClick={() => toggleItem(index)}
              >
                <h3 className="font-semibold text-white pr-4">{faq.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-[#a1a1aa] flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#a1a1aa] flex-shrink-0" />
                )}
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <p className="text-[#a1a1aa] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#a1a1aa] mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@studentnest.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Email Support
            </a>
            <span className="hidden sm:block text-[#71717a]">•</span>
            <a
              href="/contact"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
