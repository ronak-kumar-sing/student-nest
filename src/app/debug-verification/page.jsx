'use client';

import VerificationDebugger from '@/components/verification/VerificationDebugger';

export default function VerificationDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Verification Debug Page</h1>
        <VerificationDebugger />
      </div>
    </div>
  );
}