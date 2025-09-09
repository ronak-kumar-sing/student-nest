"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Zap, Users, MapPin, Heart } from "lucide-react";

export default function CTASection() {
  const benefits = [
    { icon: Star, text: "4.8/5 rated by 50,000+ students" },
    { icon: Shield, text: "100% verified properties & owners" },
    { icon: Zap, text: "Find your home in under 7 days" },
    { icon: Users, text: "Join 100,000+ happy students" }
  ];

  const successStories = [
    {
      name: "Priya S.",
      location: "Delhi",
      story: "Found my perfect PG in just 3 days!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=60&h=60&q=80"
    },
    {
      name: "Rahul M.",
      location: "Bangalore",
      story: "Best platform for student housing",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&h=60&q=80"
    },
    {
      name: "Ananya K.",
      location: "Mumbai",
      story: "Saved ₹10,000 on broker fees!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=60&h=60&q=80"
    }
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: 0,
              opacity: 0
            }}
            animate={{
              y: [0, -20, 0],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          >
            {i % 3 === 0 && <Heart className="h-4 w-4 text-pink-300" />}
            {i % 3 === 1 && <MapPin className="h-4 w-4 text-blue-300" />}
            {i % 3 === 2 && <Star className="h-4 w-4 text-yellow-300" />}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Success Stories Floating Cards */}
        <div className="absolute top-10 left-10 hidden lg:block">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center gap-3">
              <img
                src={successStories[0].image}
                alt={successStories[0].name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-white font-medium text-sm">{successStories[0].name}</div>
                <div className="text-blue-200 text-xs">{successStories[0].story}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-32 right-10 hidden lg:block">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            <div className="flex items-center gap-3">
              <img
                src={successStories[1].image}
                alt={successStories[1].name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-white font-medium text-sm">{successStories[1].name}</div>
                <div className="text-blue-200 text-xs">{successStories[1].story}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-20 left-1/4 hidden lg:block">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          >
            <div className="flex items-center gap-3">
              <img
                src={successStories[2].image}
                alt={successStories[2].name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-white font-medium text-sm">{successStories[2].name}</div>
                <div className="text-blue-200 text-xs">{successStories[2].story}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            className="inline-block mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full text-sm font-medium">
              🎉 Limited Time: Get 3 months free with annual plans
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Ready to Find Your
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Perfect Home?
              </span>
            </h2>
          </motion.div>

          <motion.p
            className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of students who have found their ideal accommodation through StudentNest.
            Start your journey today and discover why we're India's #1 student housing platform.
          </motion.p>

          {/* Benefits Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <benefit.icon className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <p className="text-white text-sm font-medium">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Primary CTA */}
            <motion.button
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 hover:shadow-2xl transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Search Now
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              className="border-2 border-white text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              List Your Property
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">100% Secure & Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-sm">4.8/5 Student Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">50,000+ Happy Students</span>
            </div>
          </motion.div>

          {/* Urgency Element */}
          <motion.div
            className="mt-12 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg border border-red-300/30 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">⚡ Limited Time Offer</span>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-white/90 text-sm">
              <strong>48 students</strong> signed up in the last 24 hours. Don't miss out on the best properties!
            </p>
          </motion.div>

          {/* Fine Print */}
          <motion.p
            className="text-blue-300/70 text-xs mt-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            viewport={{ once: true }}
          >
            No hidden fees • Cancel anytime • 30-day money-back guarantee •
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </motion.p>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 text-gray-50 dark:text-gray-900">
          <path fill="currentColor" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}
