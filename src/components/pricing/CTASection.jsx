"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Home } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0a0a0b] to-[#1a1a1b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          <span className="text-white">Ready to Get</span>
          <br />
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
            Started?
          </span>
        </h2>

        <p className="text-xl text-[#a1a1aa] mb-12 max-w-2xl mx-auto">
          Join thousands of students and property owners who trust StudentNest
          for safe, verified accommodation solutions.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* Student CTA */}
          <div className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
            <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">For Students</h3>
            <p className="text-[#a1a1aa] mb-6">
              Start your housing search today. Browse thousands of verified properties
              and connect with trusted owners.
            </p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Link href="/student/signup">
                Sign Up Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Owner CTA */}
          <div className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl">
            <Home className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">For Property Owners</h3>
            <p className="text-[#a1a1aa] mb-6">
              List your property and reach verified students. Start earning with
              transparent, student-friendly pricing.
            </p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Link href="/owner/signup">
                List Property
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[#a1a1aa] mb-4">
            Need help choosing the right plan?
          </p>
          <Button
            variant="outline"
            className="border-[#2a2a2b] text-[#a1a1aa] hover:bg-[#1a1a1b] hover:text-white"
            asChild
          >
            <Link href="/contact">
              Talk to Our Team
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
