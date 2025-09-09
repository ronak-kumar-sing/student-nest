"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function PricingSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900" id="pricing">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Simple, Student-Friendly Pricing</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built for students with transparent, affordable pricing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Students - Free */}
          <motion.div
            className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">For Students</h3>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">FREE</div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Always free to find your perfect home</p>

              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Browse all properties</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Contact property owners</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Schedule visits</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Verified listings</span>
                </li>
              </ul>

              <div className="border-t border-green-200 dark:border-green-800 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Optional Add-on:</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">Room Partner Search: ₹99</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Find 6 compatible roommates</p>
              </div>

              <motion.button
                className="w-full mt-6 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Free
              </motion.button>
            </div>
          </motion.div>

          {/* Property Owners */}
          <motion.div
            className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">For Property Owners</h3>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">₹99</div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">4-month listing per room</p>

              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <span>List your property</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Reach verified students</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <span>Direct messaging</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <span>No hidden fees</span>
                </li>
              </ul>

              <div className="border-t border-blue-200 dark:border-blue-800 pt-4 mb-6">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Annual Plan: ₹199</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Save ₹197 with yearly plan</p>
              </div>

              <motion.button
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Listing
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Success-based model:</strong> Small commission only when bookings are successful
          </p>
        </motion.div>
      </div>
    </section>
  );
}
