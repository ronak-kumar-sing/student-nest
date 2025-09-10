"use client";

import { Star } from 'lucide-react';

export default function PricingHero() {
  return (
    <section className="py-24 bg-[#0a0a0b] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/20 via-transparent to-[#3b82f6]/20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1b] border border-[#2a2a2b] mb-8">
          <Star className="w-4 h-4 text-[#10b981]" />
          <span className="text-sm text-[#a1a1aa]">Transparent Pricing</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
          <span className="text-white">Simple,</span>
          <br />
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
            Student-Friendly Pricing
          </span>
        </h1>

        <p className="text-xl text-[#a1a1aa] max-w-3xl mx-auto mb-12 leading-relaxed">
          Transparent pricing designed for students and property owners.
          No hidden fees, no surprises, no long-term contracts.
        </p>

        {/* Promise statement */}
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-[#1a1a1b] to-[#2a2a2b] rounded-2xl border border-[#3a3a3b]">
          <p className="text-lg text-[#a1a1aa]">
            <strong className="text-white">Our Promise:</strong> No hidden fees, no setup costs, no long-term contracts.
            Pay for what you use, succeed when you succeed.
          </p>
        </div>
      </div>
    </section>
  );
}
