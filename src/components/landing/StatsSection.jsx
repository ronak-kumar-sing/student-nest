"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, MapPin, Star } from "lucide-react";

export default function StatsSection() {
  const [stats, setStats] = useState({
    students: 0,
    properties: 0,
    cities: 0,
    satisfaction: 0
  });

  const finalStats = {
    students: 50000,
    properties: 10000,
    cities: 100,
    satisfaction: 98
  };

  const statItems = [
    {
      icon: Users,
      label: "Happy Students",
      value: stats.students,
      suffix: "+",
      color: "from-blue-500 to-cyan-500",
      description: "Students found their perfect home"
    },
    {
      icon: MapPin,
      label: "Verified Properties",
      value: stats.properties,
      suffix: "+",
      color: "from-green-500 to-emerald-500",
      description: "Thoroughly verified listings"
    },
    {
      icon: TrendingUp,
      label: "Cities Covered",
      value: stats.cities,
      suffix: "+",
      color: "from-purple-500 to-pink-500",
      description: "Across major education hubs"
    },
    {
      icon: Star,
      label: "Satisfaction Rate",
      value: stats.satisfaction,
      suffix: "%",
      color: "from-orange-500 to-red-500",
      description: "Student satisfaction rating"
    }
  ];

  // Animate counters when component comes into view
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 FPS
      const stepTime = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        setStats({
          students: Math.floor(finalStats.students * easeOutProgress),
          properties: Math.floor(finalStats.properties * easeOutProgress),
          cities: Math.floor(finalStats.cities * easeOutProgress),
          satisfaction: Math.floor(finalStats.satisfaction * easeOutProgress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setStats(finalStats);
        }
      }, stepTime);

      return () => clearInterval(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats-section"
      className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

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
              Our Impact
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Trusted by Students
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Across India
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students who have found their perfect home through our platform.
            Your journey to the ideal accommodation starts here.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:scale-105">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8" />
                </div>

                {/* Stat Number */}
                <div className="mb-4">
                  <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                    {stat.label}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Badges */}
        <motion.div
          className="mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Recognized Excellence
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Awards and recognition that validate our commitment to student welfare
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Best Student Platform 2024
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  EdTech Innovation Awards
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Fastest Growing Platform
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  PropertyTech India Summit
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Student Choice Award
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  National Student Survey 2024
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Trusted by students from top institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-medium">IIT Delhi</div>
            <div className="text-sm font-medium">IIM Bangalore</div>
            <div className="text-sm font-medium">DU</div>
            <div className="text-sm font-medium">BITS Pilani</div>
            <div className="text-sm font-medium">VIT</div>
            <div className="text-sm font-medium">NITS</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
