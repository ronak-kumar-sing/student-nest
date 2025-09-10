"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  ArrowRight,
  LayoutDashboard,
  Plus,
  Download,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || 'ORDER_' + Date.now();
  const amount = searchParams.get('amount') || '99';
  const plan = searchParams.get('plan') || 'Basic Plan';

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl mx-auto text-center">

          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-400 animate-bounce" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-xl text-[#a1a1aa] mb-8">
            Thank you for choosing StudentNest. Your {plan} is now active
            and ready to use.
          </p>

          {/* Payment Receipt */}
          <Card className="p-6 bg-[#1a1a1b] border border-green-500/20 mb-8 text-left">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              Payment Receipt
            </h3>
            <div className="space-y-3 text-[#a1a1aa]">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono text-green-400">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-semibold text-blue-400">{plan}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-semibold text-green-400">₹{amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400 font-semibold">Completed</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>UPI</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8 text-left">
            <h3 className="font-semibold text-white mb-4">What's Next?</h3>
            <ul className="space-y-3 text-[#a1a1aa]">
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                <span>Your listing is now live and visible to students</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                <span>Check your dashboard for inquiries and messages</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                <span>Set up your property profile and add photos</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                <span>Receipt has been sent to your email</span>
              </li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              asChild
            >
              <Link href="/owner/dashboard">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Link>
            </Button>

            <Button
              variant="outline"
              className="border-[#2a2a2b] text-[#a1a1aa] hover:bg-[#1a1a1b] hover:text-white px-8 py-3"
              asChild
            >
              <Link href="/dashboard/post-room">
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </Link>
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="border-[#2a2a2b] text-[#a1a1aa] hover:bg-[#1a1a1b]"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>

            <Button
              variant="outline"
              className="border-[#2a2a2b] text-[#a1a1aa] hover:bg-[#1a1a1b]"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
