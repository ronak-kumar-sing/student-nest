"use client";

import { CheckCircle, X } from 'lucide-react';

export default function PricingComparison() {
  const features = [
    { feature: "Browse Properties", student: true, basic: true, annual: true },
    { feature: "Direct Messaging", student: true, basic: true, annual: true },
    { feature: "Property Listings", student: false, basic: "Unlimited", annual: "Unlimited" },
    { feature: "Room Partner Search", student: "₹99 add-on", basic: false, annual: false },
    { feature: "Priority Support", student: false, basic: true, annual: true },
    { feature: "Featured Listings", student: false, basic: false, annual: true },
    { feature: "Analytics Dashboard", student: false, basic: "Basic", annual: "Advanced" },
    { feature: "Virtual Tour Integration", student: false, basic: false, annual: true },
    { feature: "Marketing Boost", student: false, basic: false, annual: true }
  ];

  return (
    <section className="py-16 bg-[#1a1a1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Feature Comparison</h2>
          <p className="text-[#a1a1aa]">See what's included in each plan</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#2a2a2b]">
                  <th className="text-left py-4 px-6 text-white font-semibold">Features</th>
                  <th className="text-center py-4 px-6 text-green-400 font-semibold">
                    Students
                    <br />
                    <span className="text-sm font-normal">FREE</span>
                  </th>
                  <th className="text-center py-4 px-6 text-blue-400 font-semibold">
                    Basic
                    <br />
                    <span className="text-sm font-normal">₹99/4mo</span>
                  </th>
                  <th className="text-center py-4 px-6 text-purple-400 font-semibold">
                    Annual
                    <br />
                    <span className="text-sm font-normal">₹199/12mo</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, index) => (
                  <tr key={index} className="border-b border-[#2a2a2b] hover:bg-[#2a2a2b]/50">
                    <td className="py-4 px-6 text-white">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.student === 'boolean' ? (
                        row.student ?
                          <CheckCircle className="h-5 w-5 text-green-400 mx-auto" /> :
                          <X className="h-5 w-5 text-[#71717a] mx-auto" />
                      ) : (
                        <span className="text-green-400 text-sm">{row.student}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ?
                          <CheckCircle className="h-5 w-5 text-blue-400 mx-auto" /> :
                          <X className="h-5 w-5 text-[#71717a] mx-auto" />
                      ) : (
                        <span className="text-blue-400 text-sm">{row.basic}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.annual === 'boolean' ? (
                        row.annual ?
                          <CheckCircle className="h-5 w-5 text-purple-400 mx-auto" /> :
                          <X className="h-5 w-5 text-[#71717a] mx-auto" />
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
}
