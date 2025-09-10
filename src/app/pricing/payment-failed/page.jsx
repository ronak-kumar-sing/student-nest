"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  XCircle,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
  MessageSquare,
  Mail,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const amount = searchParams.get('amount');
  const reason = searchParams.get('reason') || 'Payment processing failed';

  const retryPayment = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl mx-auto text-center">

          {/* Failure Icon Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6">
              <XCircle className="h-12 w-12 text-red-400 animate-pulse" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-white mb-4">Payment Failed</h1>
          <p className="text-xl text-[#a1a1aa] mb-8">
            Don't worry, no amount has been deducted from your account.
            You can try again or choose a different payment method.
          </p>

          {/* Failure Details */}
          {orderId && (
            <Card className="p-6 bg-[#1a1a1b] border border-red-500/20 mb-8 text-left">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                Transaction Details
              </h3>
              <div className="space-y-3 text-[#a1a1aa]">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono text-red-400">{orderId}</span>
                </div>
                {amount && (
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">₹{amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-red-400 font-semibold">Failed</span>
                </div>
                <div className="flex justify-between">
                  <span>Reason:</span>
                  <span className="text-red-400">{reason}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Common Failure Reasons */}
          <Card className="p-6 bg-[#1a1a1b] border border-[#2a2a2b] mb-8 text-left">
            <h3 className="font-semibold text-white mb-4">Common Reasons for Payment Failure</h3>
            <ul className="space-y-3 text-[#a1a1aa]">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Insufficient balance in your account</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Network connectivity issues</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Incorrect card details or expired card</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Bank server temporarily unavailable</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Transaction limit exceeded</span>
              </li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              onClick={retryPayment}
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Try Again
            </Button>

            <Button
              variant="outline"
              className="border-[#2a2a2b] text-[#a1a1aa] hover:bg-[#1a1a1b] hover:text-white px-8 py-3"
              asChild
            >
              <Link href="/pricing">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Pricing
              </Link>
            </Button>
          </div>

          {/* Alternative Payment Methods */}
          <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-8">
            <h3 className="font-semibold text-white mb-4">Try Alternative Payment Methods</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "UPI", icon: "📱" },
                { name: "Net Banking", icon: "🏦" },
                { name: "Different Card", icon: "💳" },
                { name: "Wallet", icon: "👛" }
              ].map((method) => (
                <Button
                  key={method.name}
                  variant="outline"
                  className="border-[#2a2a2b] hover:border-green-500 hover:bg-green-500/10"
                  onClick={retryPayment}
                >
                  <span className="mr-2">{method.icon}</span>
                  {method.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* Contact Support */}
          <div className="p-4 bg-[#1a1a1b] rounded-lg border border-[#2a2a2b]">
            <p className="text-[#a1a1aa] mb-4">
              Still facing issues? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-[#2a2a2b] text-[#a1a1aa] hover:bg-[#2a2a2b]">
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" className="border-[#2a2a2b] text-[#a1a1aa] hover:bg-[#2a2a2b]">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button variant="outline" className="border-[#2a2a2b] text-[#a1a1aa] hover:bg-[#2a2a2b]">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
