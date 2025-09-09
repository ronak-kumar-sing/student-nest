"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Heart } from "lucide-react";

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Engineering Student",
      college: "IIT Delhi",
      content: "Found my perfect PG within a week! The verification process gave me confidence, and the direct chat feature made everything so easy. The owner was super responsive and the photos were exactly what I saw during the visit.",
      rating: 5,
      avatar: "/testimonials/priya.jpg",
      category: "student",
      location: "New Delhi"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Property Owner",
      college: "Mumbai Region",
      content: "StudentNest helped me find reliable tenants quickly. The platform handles everything from verification to payments seamlessly. I've had zero issues with the students I've rented to through this platform.",
      rating: 5,
      avatar: "/testimonials/rajesh.jpg",
      category: "owner",
      location: "Mumbai"
    },
    {
      id: 3,
      name: "Ananya Patel",
      role: "MBA Student",
      college: "IIM Bangalore",
      content: "The search filters were incredibly helpful! I could find exactly what I needed - a quiet place near campus with good WiFi for my studies. The whole process was transparent and hassle-free.",
      rating: 5,
      avatar: "/testimonials/ananya.jpg",
      category: "student",
      location: "Bangalore"
    },
    {
      id: 4,
      name: "Suresh Reddy",
      role: "Property Owner",
      college: "Hyderabad Region",
      content: "The quality of students I get through StudentNest is exceptional. They're serious about their studies and respectful of the property. The payment system is secure and I get my rent on time every month.",
      rating: 5,
      avatar: "/testimonials/suresh.jpg",
      category: "owner",
      location: "Hyderabad"
    },
    {
      id: 5,
      name: "Kavya Singh",
      role: "Medical Student",
      college: "AIIMS Delhi",
      content: "As a medical student, I needed a place that was both affordable and close to the hospital. StudentNest helped me find exactly that! The 24/7 support was crucial when I had to move in urgently.",
      rating: 5,
      avatar: "/testimonials/kavya.jpg",
      category: "student",
      location: "New Delhi"
    },
    {
      id: 6,
      name: "Deepak Gupta",
      role: "Property Owner",
      college: "Pune Region",
      content: "I've been using StudentNest for 2 years now and it's completely changed how I manage my rental properties. The student verification gives me peace of mind, and the platform makes everything so professional.",
      rating: 5,
      avatar: "/testimonials/deepak.jpg",
      category: "owner",
      location: "Pune"
    }
  ];

  const stats = [
    { label: "Average Rating", value: "4.9/5", icon: Star },
    { label: "Success Rate", value: "98%", icon: Heart },
    { label: "Response Time", value: "< 2hrs", icon: Quote }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

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
              What Our Users Say
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Stories of Success
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              From Our Community
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied students and property owners who have found their perfect match through StudentNest.
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white opacity-10">
                <Quote className="h-8 w-8" />
              </div>

              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${testimonials[currentTestimonial].category === 'student'
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                      }`}></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {testimonials[currentTestimonial].college} • {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Testimonial Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentTestimonial(index)}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                "{testimonial.content.substring(0, 120)}..."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {testimonial.college}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
