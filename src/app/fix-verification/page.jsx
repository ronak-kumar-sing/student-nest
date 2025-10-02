'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FixVerificationPage() {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/verify/debug-user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDebugData(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const fixStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/verify/fix-status', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      alert(data.message);
      checkStatus(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
      alert('Error fixing status');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Fix Verification Status</h1>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={checkStatus} disabled={loading}>
              Check Current Status
            </Button>
            <Button onClick={fixStatus} disabled={loading} variant="outline">
              Fix Verification Status
            </Button>
          </div>

          {debugData && (
            <Card>
              <CardHeader>
                <CardTitle>Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(debugData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}