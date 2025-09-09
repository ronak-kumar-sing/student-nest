"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Users, Search, MessageSquare, Home } from "lucide-react";

export default function HowItWorksSection() {
  const studentSteps = [
    {
      step: "01",
      icon: Search,
      title: "Search & Discover",
      description: "Browse verified properties near your college with detailed photos, amenities, and reviews from fellow students.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "02",
      icon: MessageSquare,
      title: "Connect & Chat",
      description: "Directly message property owners, ask questions, schedule virtual or in-person visits at your convenience.",
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "03",
      icon: CheckCircle,
      title: "Book & Move In",
      description: "Secure your accommodation with our safe payment system and move into your new home hassle-free.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const ownerSteps = [
    {
      step: "01",
      icon: Home,
      title: "List Your Property",
      description: "Create a detailed listing with high-quality photos, amenities, and rental terms. Our team helps optimize your listing.",
      color: "from-orange-500 to-red-500"
    },
    {
      step: "02",
      icon: Users,
      title: "Connect with Students",
      description: "Receive inquiries from verified students, chat directly, and schedule property visits with interested tenants.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      step: "03",
      icon: CheckCircle,
      title: "Secure & Earn",
      description: "Complete the rental agreement with our secure payment system and start earning from your property investment.",
      color: "from-teal-500 to-green-500"
    }
  ];

  const [activeTab, setActiveTab] = useState("students");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.2
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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20"></div>

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
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Simple Steps to
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Your Perfect Home
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you're a student looking for accommodation or a property owner wanting to rent out,
            we've made the process incredibly simple and secure.
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

        {/* Steps Content */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {(activeTab === "students" ? studentSteps : ownerSteps).map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Connection Line (hidden on mobile) */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full">
                    <div className="relative">
                      <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500"></div>
                      <ArrowRight className="absolute top-1/2 right-4 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                )}

                <div className="text-center">
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white relative z-10`}>
                      <step.icon className="h-12 w-12" />
                    </div>
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-white dark:bg-gray-900 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white dark:bg-gray-900 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Stats */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Average Success Timeline
            </h3>
            <p className="text-xl opacity-90">
              Most students find their perfect home within this timeframe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">24hrs</div>
              <div className="text-lg opacity-90">First Response</div>
              <div className="text-sm opacity-75">From property owners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">3 days</div>
              <div className="text-lg opacity-90">Property Visit</div>
              <div className="text-sm opacity-75">Schedule and complete</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">1 week</div>
              <div className="text-lg opacity-90">Move In</div>
              <div className="text-sm opacity-75">Complete booking</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Get Started?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              {activeTab === "students" ? "Find Properties" : "List Your Property"}
            </button>
            <button className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
