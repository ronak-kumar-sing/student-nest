'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/ui/FileUpload';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function UploadTestPage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [debugInfo, setDebugInfo] = useState(null);
  const [debugLoading, setDebugLoading] = useState(false);

  useEffect(() => {
    // Get user and token from localStorage (same pattern as your existing auth)
    const userData = localStorage.getItem('user');
    const authToken = localStorage.getItem('token');

    if (userData && authToken) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setToken(authToken);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg">Please log in to test file uploads.</p>
            <div className="mt-4 space-x-4">
              <Button onClick={() => window.location.href = '/student/login'}>
                Student Login
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/owner/login'}>
                Owner Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUploadComplete = (result) => {
    toast.success('Upload completed successfully!');
    setUploadedFiles(prev => [...prev, result]);
  };

  const handleUploadError = (error) => {
    toast.error(`Upload failed: ${error}`);
  };

  const debugAuthentication = async () => {
    setDebugLoading(true);
    try {
      const response = await fetch('/api/upload/debug', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      setDebugInfo(result);

      if (result.success) {
        toast.success('Authentication debug completed');
      } else {
        toast.error(`Debug failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Debug request failed: ${error.message}`);
      setDebugInfo({
        success: false,
        error: error.message,
        debug: { requestError: true }
      });
    } finally {
      setDebugLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Cloudinary Upload Test</h1>
        <p className="text-gray-600">Test file uploads with Cloudinary integration</p>
        <Badge variant="secondary" className="mt-2">
          Logged in as: {user.fullName || user.name || user.email} ({user.role || user.userType})
        </Badge>

        {/* Debug Authentication */}
        <div className="mt-4 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={debugAuthentication}
            disabled={debugLoading || !token}
          >
            {debugLoading ? 'Testing...' : 'Test Authentication'}
          </Button>

          {debugInfo && (
            <details className="text-left bg-gray-100 p-4 rounded text-sm">
              <summary className="cursor-pointer font-medium mb-2">
                Authentication Debug Results
                {debugInfo.success ? '✅' : '❌'}
              </summary>
              <pre className="mt-2 overflow-auto text-xs bg-white p-2 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left bg-gray-50 p-2 rounded text-xs">
            <summary className="cursor-pointer font-medium">Local Storage Data</summary>
            <pre className="mt-2 overflow-auto">
              User: {JSON.stringify(user, null, 2)}
              Token: {token ? `${token.substring(0, 20)}...` : 'No token'}
            </pre>
          </details>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* DigiLocker Verification */}
        <Card>
          <CardHeader>
            <CardTitle>DigiLocker Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Verify your identity using simulated DigiLocker integration with document upload and face matching.
            </p>
            <Button
              onClick={() => window.location.href = '/verification'}
              className="w-full"
            >
              Start Verification Process
            </Button>
          </CardContent>
        </Card>

        {/* General File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>General File Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              acceptedTypes="image/*"
              maxFileSize={10}
              uploadType="image"
              folder="general"
              token={token}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              multiple={false}
            />
          </CardContent>
        </Card>

        {/* Property Images (Owner Only) */}
        {user.role === 'owner' && (
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                acceptedTypes="image/*"
                maxFileSize={10}
                uploadType="image"
                folder="properties"
                token={token}
                endpoint="/api/upload/property"
                onUploadComplete={(result) => {
                  handleUploadComplete(result);
                  // You would normally pass propertyId here
                }}
                onUploadError={handleUploadError}
                multiple={true}
              >
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    Upload property images
                  </p>
                  <p className="text-xs text-gray-400">
                    Optimized to 1200x800px • Multiple files allowed
                  </p>
                </div>
              </FileUpload>
            </CardContent>
          </Card>
        )}

        {/* Property Videos (Owner Only) */}
        {user.role === 'owner' && (
          <Card>
            <CardHeader>
              <CardTitle>Property Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                acceptedTypes="video/*"
                maxFileSize={100}
                uploadType="video"
                folder="property-videos"
                token={token}
                endpoint="/api/upload/property"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                multiple={false}
              >
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    Upload property tour video
                  </p>
                  <p className="text-xs text-gray-400">
                    Max 100MB • MP4, WebM, MOV supported
                  </p>
                </div>
              </FileUpload>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Results */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={file.url}
                      alt="Uploaded"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Upload Successful</p>
                      <p className="text-sm text-gray-600">URL: {file.url}</p>
                      <p className="text-sm text-gray-600">Public ID: {file.publicId}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">{file.format?.toUpperCase()}</Badge>
                        <Badge variant="outline">{file.width}x{file.height}</Badge>
                        <Badge variant="outline">{(file.size / 1024).toFixed(1)}KB</Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cloudinary Free Tier Information */}
      <Card>
        <CardHeader>
          <CardTitle>Cloudinary Free Tier Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Storage & Bandwidth</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 25GB storage</li>
                <li>• 25GB monthly bandwidth</li>
                <li>• 25,000 monthly transformations</li>
                <li>• 1,000 monthly auto-backup</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">File Limits</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Images: 10MB max</li>
                <li>• Videos: 100MB max</li>
                <li>• Raw files: 1MB max</li>
                <li>• Auto-format & quality optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}