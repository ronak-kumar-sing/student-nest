"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare, Shield, CreditCard } from "lucide-react";

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      color: "from-blue-500 to-cyan-500",
      faqs: [
        {
          question: "What is StudentNest and how does it work?",
          answer: "StudentNest is a comprehensive platform that connects students with verified property owners. Students can search for accommodation near their colleges, while property owners can list their properties. Our platform facilitates secure communication, virtual tours, and safe payment processing to make the entire rental process seamless."
        },
        {
          question: "Is StudentNest available in my city?",
          answer: "We currently operate in 100+ cities across India, covering all major educational hubs. This includes metros like Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune, and Kolkata, as well as tier-2 cities with prominent colleges and universities. Check our city list or search for properties in your area to see if we're available."
        },
        {
          question: "How do I know if a property is genuine?",
          answer: "Every property on StudentNest goes through a rigorous verification process. We verify property ownership documents, conduct physical inspections, and confirm owner identity through government-issued IDs. Additionally, properties have reviews from previous tenants and detailed photo galleries to help you make informed decisions."
        },
        {
          question: "Can I schedule property visits?",
          answer: "Absolutely! You can schedule both virtual and in-person property visits directly through our platform. Our integrated chat system allows you to coordinate with property owners to find convenient times. We also offer guided virtual tours for properties that support this feature."
        }
      ]
    },
    {
      title: "For Students",
      icon: MessageSquare,
      color: "from-green-500 to-emerald-500",
      faqs: [
        {
          question: "Is StudentNest free for students?",
          answer: "Yes! Students can use StudentNest completely free, including browsing properties, messaging owners, and scheduling visits. We also offer a Premium plan with additional features like unlimited inquiries, priority support, and advanced search filters for ₹99/month."
        },
        {
          question: "How do I search for properties near my college?",
          answer: "Use our smart search feature by entering your college name or area. Our location intelligence system will show properties within walking distance or with good transport connectivity to your college. You can filter by budget, amenities, room type, and distance to find your perfect match."
        },
        {
          question: "What if I face issues with a property after moving in?",
          answer: "We provide 24/7 customer support to help resolve any issues. Our dispute resolution team works with both students and property owners to find fair solutions. Additionally, our platform includes rating and review systems that help maintain quality standards across all listed properties."
        },
        {
          question: "Can I share accommodation with friends?",
          answer: "Yes! Our platform supports group bookings. You can search for shared apartments, dormitories, or properties with multiple rooms. Many owners specifically cater to student groups and offer special rates for multiple occupancy."
        }
      ]
    },
    {
      title: "For Property Owners",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      faqs: [
        {
          question: "How much does it cost to list my property?",
          answer: "We offer flexible plans starting from ₹299/month for our Basic plan (up to 3 properties) and ₹599/month for our Professional plan (unlimited properties). Annual plans come with significant discounts. There are no hidden fees or commissions on bookings."
        },
        {
          question: "How do you verify students?",
          answer: "We verify students through multiple methods including college ID verification, government-issued ID confirmation, and background checks. Our verification process ensures you connect with genuine students who are serious about finding accommodation."
        },
        {
          question: "How quickly can I find tenants?",
          answer: "Most property owners find suitable tenants within 1-2 weeks of listing. Properties with competitive pricing, good amenities, and quality photos typically receive inquiries within 24-48 hours. Our platform's visibility and targeted student audience significantly reduce vacancy periods."
        },
        {
          question: "What support do you provide for property management?",
          answer: "Our Professional plan includes lead management tools, automated responses, performance analytics, and priority customer support. We also provide guidance on pricing, photography tips, and listing optimization to maximize your property's visibility and attractiveness."
        }
      ]
    },
    {
      title: "Payments & Security",
      icon: CreditCard,
      color: "from-orange-500 to-red-500",
      faqs: [
        {
          question: "How secure are the payments?",
          answer: "All payments are processed through industry-leading secure payment gateways with 256-bit SSL encryption. We support UPI, net banking, credit/debit cards, and digital wallets. Your financial information is never stored on our servers and all transactions are PCI DSS compliant."
        },
        {
          question: "What is your refund policy?",
          answer: "We offer a 30-day money-back guarantee for all paid plans. For property bookings, refunds depend on the cancellation policy set by the property owner, which is clearly mentioned in each listing. We also provide dispute resolution services for genuine grievances."
        },
        {
          question: "How do security deposits work?",
          answer: "Security deposits are handled transparently through our platform. The amount is clearly stated in property listings and is held securely until the end of the tenancy. Our escrow service ensures fair resolution of any deposit-related disputes between students and property owners."
        },
        {
          question: "Can I get a receipt for my payments?",
          answer: "Yes, you'll receive detailed digital receipts for all payments made through StudentNest. These can be downloaded as PDFs and are useful for expense tracking, tax purposes, or reimbursement claims. All receipts include GST details where applicable."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const globalIndex = categoryIndex * 1000 + faqIndex;
    setOpenFAQ(openFAQ === globalIndex ? -1 : globalIndex);
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

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
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Got Questions?
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              We've Got Answers
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about StudentNest, from getting started to advanced features.
            Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="max-w-6xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 1000 + faqIndex;
                  const isOpen = openFAQ === globalIndex;

                  return (
                    <div
                      key={faqIndex}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </h4>
                        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Still Have Questions?
              </h3>
              <p className="text-xl mb-6 opacity-90">
                Our friendly support team is here to help you 24/7. Get in touch and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
                  Contact Support
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                  Live Chat
                </button>
              </div>

              {/* Support Stats */}
              <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/20">
                <div>
                  <div className="text-2xl font-bold mb-1">&lt; 2 hrs</div>
                  <div className="text-sm opacity-80">Average Response Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">98%</div>
                  <div className="text-sm opacity-80">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">24/7</div>
                  <div className="text-sm opacity-80">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="mt-12 grid md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            { title: "Getting Started Guide", description: "Step-by-step guide for new users" },
            { title: "Video Tutorials", description: "Watch how to use StudentNest" },
            { title: "Help Center", description: "Detailed documentation" },
            { title: "Community Forum", description: "Connect with other users" }
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
