"use client";

import { motion } from "framer-motion";
import {
  Search,
  Shield,
  CreditCard,
  MessageSquare,
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle,
  Zap
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "Smart Property Search",
      description: "Find rooms and PGs with advanced filters for location, budget, amenities, and college proximity.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0.1
    },
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All properties are verified with owner identity confirmation and property documents for your safety.",
      gradient: "from-green-500 to-emerald-500",
      delay: 0.2
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Safe and transparent payment processing with deposit protection and digital receipts.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.3
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Chat directly with property owners, schedule visits, and negotiate terms seamlessly.",
      gradient: "from-orange-500 to-red-500",
      delay: 0.4
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "Detailed area information including distance to colleges, transport links, and local amenities.",
      gradient: "from-indigo-500 to-blue-500",
      delay: 0.5
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you with any queries or emergency situations.",
      gradient: "from-teal-500 to-green-500",
      delay: 0.6
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Community Verified",
      description: "Properties rated and reviewed by real students"
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "Only top-rated properties make it to our platform"
    },
    {
      icon: CheckCircle,
      title: "Instant Booking",
      description: "Book your room in just a few clicks"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Find and secure accommodation in under 24 hours"
    }
  ];

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
              Why Choose StudentNest?
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Everything You Need to
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Perfect Home
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We make finding student accommodation simple, safe, and stress-free with cutting-edge technology and human touch.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group cursor-pointer"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full">
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                {benefit.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Find Your Dream Home?
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of students who have found their perfect accommodation
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
              Start Your Search Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
