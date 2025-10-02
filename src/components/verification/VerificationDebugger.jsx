'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerificationDebugger() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      results.localStorage = {
        token: token ? 'Present' : 'Missing',
        tokenLength: token ? token.length : 0,
        userData: userData ? 'Present' : 'Missing',
        userParsed: userData ? JSON.parse(userData) : null
      };

      if (!token) {
        results.error = 'No token in localStorage';
        setTestResults(results);
        setLoading(false);
        return;
      }

      // Test 2: Test connection endpoint
      console.log('Testing connection with token:', token.substring(0, 20) + '...');

      const testResponse = await fetch('/api/verify/test-connection', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const testData = await testResponse.json();
      results.connectionTest = {
        status: testResponse.status,
        success: testData.success,
        data: testData.data || testData.error,
        debug: testData.debug
      };

      // Test 3: Test requirements endpoint
      const reqResponse = await fetch('/api/verify/requirements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const reqData = await reqResponse.json();
      results.requirementsTest = {
        status: reqResponse.status,
        success: reqData.success,
        data: reqData.data || reqData.error
      };

      // Test 4: Setup user if needed
      const setupResponse = await fetch('/api/verify/setup-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const setupData = await setupResponse.json();
      results.setupTest = {
        status: setupResponse.status,
        success: setupData.success,
        data: setupData.data || setupData.error
      };

    } catch (error) {
      results.error = error.message;
      results.errorDetails = error;
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Verification System Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={loading}>
          {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
        </Button>

        {testResults && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">localStorage Test</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(testResults.localStorage, null, 2)}
              </pre>
            </div>

            {testResults.connectionTest && (
              <div>
                <h3 className="font-semibold">Connection Test</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.connectionTest, null, 2)}
                </pre>
              </div>
            )}

            {testResults.requirementsTest && (
              <div>
                <h3 className="font-semibold">Requirements Test</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.requirementsTest, null, 2)}
                </pre>
              </div>
            )}

            {testResults.setupTest && (
              <div>
                <h3 className="font-semibold">Setup Test</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.setupTest, null, 2)}
                </pre>
              </div>
            )}

            {testResults.error && (
              <div>
                <h3 className="font-semibold text-red-600">Error</h3>
                <pre className="bg-red-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}