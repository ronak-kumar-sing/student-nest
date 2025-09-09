"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const studentPlans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for students getting started",
      icon: Star,
      color: "from-gray-500 to-gray-600",
      features: [
        "Browse unlimited properties",
        "Direct messaging with owners",
        "Basic property filters",
        "Standard customer support",
        "Property photos and details"
      ],
      limitations: [
        "Limited to 5 inquiries per month",
        "Basic profile visibility"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Premium",
      price: billingCycle === "monthly" ? 99 : 999,
      description: "Most popular choice for serious students",
      icon: Zap,
      color: "from-blue-500 to-purple-500",
      features: [
        "Everything in Free",
        "Unlimited property inquiries",
        "Priority listing visibility",
        "Advanced search filters",
        "24/7 priority support",
        "Property visit scheduling",
        "Wishlist and favorites",
        "Email notifications",
        "Profile verification badge"
      ],
      cta: "Go Premium",
      popular: true,
      savings: billingCycle === "yearly" ? "Save ₹189" : null
    }
  ];

  const ownerPlans = [
    {
      name: "Basic",
      price: billingCycle === "monthly" ? 299 : 2999,
      description: "Great for individual property owners",
      icon: Shield,
      color: "from-green-500 to-emerald-500",
      features: [
        "List up to 3 properties",
        "Basic property analytics",
        "Direct student messaging",
        "Standard support",
        "Property photo uploads (up to 10)",
        "Basic listing optimization"
      ],
      cta: "Start Basic",
      popular: false,
      savings: billingCycle === "yearly" ? "Save ₹589" : null
    },
    {
      name: "Professional",
      price: billingCycle === "monthly" ? 599 : 5999,
      description: "Perfect for serious property managers",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      features: [
        "List unlimited properties",
        "Advanced analytics dashboard",
        "Featured listing placement",
        "Priority customer support",
        "Unlimited photo uploads",
        "Professional listing optimization",
        "Lead management tools",
        "Automated responses",
        "Property performance insights",
        "Revenue tracking",
        "Tenant verification reports"
      ],
      cta: "Go Professional",
      popular: true,
      savings: billingCycle === "yearly" ? "Save ₹1189" : null
    }
  ];

  const [activeTab, setActiveTab] = useState("students");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              Simple, Transparent Pricing
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Choose Your Perfect
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you're a student looking for accommodation or a property owner wanting to rent out,
            we have the perfect plan for your needs.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-8 py-4 rounded-xl transition-all duration-300 font-medium ${activeTab === "students"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
            >
              For Students
            </button>
            <button
              onClick={() => setActiveTab("owners")}
              className={`px-8 py-4 rounded-xl transition-all duration-300 font-medium ${activeTab === "owners"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
            >
              For Property Owners
            </button>
          </div>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${billingCycle === "monthly"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium relative ${billingCycle === "yearly"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300"
                }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-8 max-w-5xl mx-auto ${activeTab === "students" ? "lg:grid-cols-2" : "lg:grid-cols-2"
            }`}
        >
          {(activeTab === "students" ? studentPlans : ownerPlans).map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 transition-all duration-300 hover:scale-105 ${plan.popular
                  ? "border-blue-500 shadow-2xl shadow-blue-500/20"
                  : "border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl"
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                  <plan.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 dark:text-gray-300">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    )}
                  </div>
                  {plan.savings && (
                    <div className="text-green-600 font-medium mt-2">
                      {plan.savings}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                    }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  What's included:
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {plan.limitations && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                      Limitations:
                    </h5>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 mt-0.5 flex-shrink-0"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Shield className="h-12 w-12 text-green-500" />
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  30-Day Money Back Guarantee
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                Can I upgrade or downgrade my plan?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, you can change your plan at any time. The changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                Is there a setup fee?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                No, there are no setup fees. You only pay for your chosen plan with no hidden charges.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
