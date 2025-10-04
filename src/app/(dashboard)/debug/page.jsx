'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const [roomsStatus, setRoomsStatus] = useState('Not tested');
  const [authStatus, setAuthStatus] = useState('Not tested');
  const [roomsData, setRoomsData] = useState(null);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(false);

  const testRoomsAPI = async () => {
    setLoading(true);
    setRoomsStatus('Testing...');
    
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setRoomsStatus(`✅ Success - Found ${data.data.rooms.length} rooms`);
        setRoomsData(data);
      } else {
        setRoomsStatus(`❌ Failed - ${data.error || 'Unknown error'}`);
        setRoomsData(data);
      }
    } catch (error) {
      setRoomsStatus(`❌ Error - ${error.message}`);
      setRoomsData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAuthAPI = async () => {
    setLoading(true);
    setAuthStatus('Testing...');
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const response = await fetch('/api/verify/requirements', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAuthStatus('✅ Auth Success');
        setAuthData(data);
      } else {
        setAuthStatus(`❌ Auth Failed - ${response.status} ${data.error || 'Unknown error'}`);
        setAuthData(data);
      }
    } catch (error) {
      setAuthStatus(`❌ Auth Error - ${error.message}`);
      setAuthData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testBoth = async () => {
    await testRoomsAPI();
    await testAuthAPI();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">API Debug Dashboard</h1>
        <div className="flex gap-4 justify-center">
          <Button onClick={testRoomsAPI} disabled={loading}>
            Test Rooms API
          </Button>
          <Button onClick={testAuthAPI} disabled={loading}>
            Test Auth API
          </Button>
          <Button onClick={testBoth} disabled={loading}>
            Test Both
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Rooms API Status
              <span className={`text-sm px-2 py-1 rounded ${
                roomsStatus.includes('✅') ? 'bg-green-100 text-green-800' :
                roomsStatus.includes('❌') ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {roomsStatus}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>User Info:</strong>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify({
                    hasToken: !!localStorage.getItem('token'),
                    hasAccessToken: !!localStorage.getItem('accessToken'),
                    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
                  }, null, 2)}
                </pre>
              </div>
              
              {roomsData && (
                <div>
                  <strong>Response:</strong>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40">
                    {JSON.stringify(roomsData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Auth API Status
              <span className={`text-sm px-2 py-1 rounded ${
                authStatus.includes('✅') ? 'bg-green-100 text-green-800' :
                authStatus.includes('❌') ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {authStatus}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {authData && (
              <div>
                <strong>Response:</strong>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40">
                  {JSON.stringify(authData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Browser Console Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">
            Check the browser console (F12) for detailed logs from the API calls.
          </p>
          <p className="text-sm">
            • Rooms API calls will show: 🏠 Rooms API called, 🔍 Searching with filters, ✅ Found X rooms<br/>
            • Auth API calls will show verification status or authentication errors
          </p>
        </CardContent>
      </Card>
    </div>
  );
}