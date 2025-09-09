"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Star,
  Shield,
  Award,
  Heart
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "For Students",
      links: [
        { name: "Find Housing", href: "/search" },
        { name: "Student Guide", href: "/guide" },
        { name: "Safety Tips", href: "/safety" },
        { name: "Legal Help", href: "/legal" },
        { name: "Budget Calculator", href: "/calculator" },
        { name: "College Partners", href: "/colleges" }
      ]
    },
    {
      title: "For Property Owners",
      links: [
        { name: "List Your Property", href: "/list-property" },
        { name: "Owner Dashboard", href: "/owner/dashboard" },
        { name: "Pricing Guide", href: "/pricing-guide" },
        { name: "Success Stories", href: "/success-stories" },
        { name: "Owner Resources", href: "/owner-resources" },
        { name: "Marketing Tools", href: "/marketing" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
        { name: "Investors", href: "/investors" },
        { name: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Support", href: "/support" },
        { name: "Report Issue", href: "/report" },
        { name: "Feature Requests", href: "/features" },
        { name: "Community Forum", href: "/community" },
        { name: "Developer API", href: "/api" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/studentnest", color: "hover:text-blue-600" },
    { icon: Twitter, href: "https://twitter.com/studentnest", color: "hover:text-blue-400" },
    { icon: Instagram, href: "https://instagram.com/studentnest", color: "hover:text-pink-600" },
    { icon: Linkedin, href: "https://linkedin.com/company/studentnest", color: "hover:text-blue-700" },
    { icon: Youtube, href: "https://youtube.com/studentnest", color: "hover:text-red-600" }
  ];

  const trustIndicators = [
    { icon: Star, text: "4.8/5 Rating", subtext: "50,000+ Reviews" },
    { icon: Shield, text: "100% Verified", subtext: "Properties & Owners" },
    { icon: Award, text: "Industry Leader", subtext: "Student Housing" }
  ];

  const cities = [
    "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune",
    "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur"
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 pt-20 pb-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 mb-16 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Stay Updated with StudentNest
              </h3>
              <p className="text-xl opacity-90 mb-6 lg:mb-0">
                Get the latest property listings, housing tips, and exclusive offers delivered to your inbox.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <motion.button
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
              <p className="text-sm opacity-80">
                Join 25,000+ students and property owners in our community. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-6 gap-12 mb-16">
          {/* Company Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">SN</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StudentNest
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">
                  Find Your Perfect Home
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              India's most trusted student housing platform, connecting 100,000+ students
              with verified properties across 100+ cities. Making student accommodation
              search simple, safe, and seamless.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {trustIndicators.map((item, index) => (
                <div key={index} className="text-center">
                  <item.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.text}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.subtext}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@studentnest.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 8000-123-456</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Bangalore, Karnataka, India</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Cities Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Available in 100+ Cities Across India
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city, index) => (
              <Link
                key={index}
                href={`/search?city=${city.toLowerCase()}`}
                className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {city}
              </Link>
            ))}
            <Link
              href="/cities"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              View All Cities →
            </Link>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-200 dark:border-gray-700 pt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {currentYear} StudentNest. All rights reserved.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                Made with <Heart className="h-3 w-3 inline text-red-500" /> for students across India
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <Link
                href="/refund"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Refund Policy
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-200`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-center items-center gap-8 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Best Student Housing Platform 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Trusted by 100+ Colleges</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
