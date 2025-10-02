'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Upload,
  X
} from 'lucide-react';

export default function SelfieCapture({ token, onSuccess, onError }) {
  // 🧪 MOCK MODE CONFIGURATION
  // Check URL params for mock mode or default to true for testing
  const [MOCK_MODE, setMockMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const mockParam = urlParams.get('mock');
      if (mockParam !== null) {
        return mockParam !== 'false';
      }
    }
    return true; // Default to mock mode for testing
  });

  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [documentCheckLoading, setDocumentCheckLoading] = useState(true);
  const [canTakeSelfie, setCanTakeSelfie] = useState(false);
  const [documentStatus, setDocumentStatus] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check document status when component mounts
  useEffect(() => {
    checkDocumentStatus();
  }, [token]);

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const checkDocumentStatus = async () => {
    if (!token) return;

    setDocumentCheckLoading(true);

    if (MOCK_MODE) {
      // MOCK: Always allow selfie capture for testing
      console.log('🧪 MOCK MODE: Bypassing document check');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful document status
      const mockDocumentStatus = {
        hasVerificationRecord: true,
        documentsCount: 1,
        documents: [
          {
            type: 'aadhaar',
            verified: true,
            hasFileUrl: true,
            uploadedAt: new Date().toISOString()
          }
        ],
        suitableDocumentsCount: 1,
        canTakeSelfie: true,
        message: 'Ready for selfie capture (Mock Mode)',
        verification: {
          status: 'pending',
          hasSelife: false,
          scores: { faceMatchScore: 0 }
        }
      };

      setDocumentStatus(mockDocumentStatus);
      setCanTakeSelfie(true);
      setDocumentCheckLoading(false);

      toast.success('🧪 Mock Mode: Ready for selfie capture');
      return;
    }

    // Real document status check
    try {
      const response = await fetch('/api/verify/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setDocumentStatus(result.data);
        setCanTakeSelfie(result.data.canTakeSelfie);

        if (!result.data.canTakeSelfie) {
          toast.info(result.data.message || 'Please upload a document first');
        }
      } else {
        toast.error('Failed to check document status');
      }
    } catch (error) {
      console.error('Error checking document status:', error);
      toast.error('Failed to check document status');
    } finally {
      setDocumentCheckLoading(false);
    }
  }; const startCamera = async () => {
    // Check if documents are available before starting camera
    if (!canTakeSelfie) {
      toast.error('Please upload a valid ID document first');
      return;
    }

    try {
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      console.log('Media stream obtained:', mediaStream);
      setStream(mediaStream);
      setUseCamera(true);

      // Wait for next tick to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          console.log('Setting video source...');
          videoRef.current.srcObject = mediaStream;

          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, attempting to play...');
            videoRef.current.play()
              .then(() => {
                console.log('Video playing successfully');
                toast.success('Camera started successfully!');
              })
              .catch((playError) => {
                console.error('Error playing video:', playError);
                toast.error('Unable to display camera feed');
              });
          };

          videoRef.current.onerror = (error) => {
            console.error('Video error:', error);
            toast.error('Video display error');
          };
        } else {
          console.error('Video ref not available');
        }
      }, 100);

    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera. ';

      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else {
        errorMessage += 'Please use file upload instead.';
      }

      toast.error(errorMessage);
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = useCallback(() => {
    console.log('Capture photo called');

    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
      toast.error('Camera not ready. Please try again.');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Check if video is ready
    if (video.readyState !== 4) {
      console.error('Video not ready, readyState:', video.readyState);
      toast.error('Video not ready. Please wait a moment and try again.');
      return;
    }

    console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video dimensions are zero');
      toast.error('Camera feed not available. Please restart camera.');
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');

      // Mirror the image back (since we mirrored the video display)
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Photo captured successfully, blob size:', blob.size);
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage({ file, url: imageUrl });
          stopCamera();
          toast.success('Selfie captured successfully!');
        } else {
          console.error('Failed to create blob');
          toast.error('Failed to capture photo. Please try again.');
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error('Failed to capture photo. Please try again.');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setCapturedImage({ file, url: imageUrl });
    toast.success('Selfie selected successfully');
  };

  const handleUpload = async () => {
    if (!capturedImage) {
      toast.error('Please capture or select a selfie first');
      return;
    }

    if (!canTakeSelfie) {
      toast.error('Please upload a valid ID document first');
      await checkDocumentStatus(); // Refresh status
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('selfie', capturedImage.file);

      const apiEndpoint = MOCK_MODE ? '/api/verify/upload-selfie-mock' : '/api/verify/upload-selfie';
      console.log(`🧪 Using ${MOCK_MODE ? 'MOCK' : 'REAL'} verification API:`, apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
        onSuccess(result.data);
        const successMessage = MOCK_MODE
          ? '🧪 Mock verification completed successfully!'
          : 'Selfie verification completed!';
        toast.success(successMessage);
      } else {
        console.error('Selfie upload error:', result.error);
        onError(result.error);

        // Show more helpful error messages
        if (result.error.includes('No verified document')) {
          toast.error('Please complete document upload first, then try taking a selfie again.');
        } else if (result.error.includes('upload a document first')) {
          toast.error('Please upload your ID document before taking a selfie.');
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      onError('Network error during selfie upload');
      toast.error('Network error during selfie upload');
    } finally {
      setLoading(false);
    }
  };

  const retakeSelfie = () => {
    setCapturedImage(null);
    setUploadResult(null);
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
  };

  const debugCamera = () => {
    console.log('=== CAMERA DEBUG INFO ===');
    console.log('Stream:', stream);
    console.log('Video ref:', videoRef.current);
    console.log('Canvas ref:', canvasRef.current);
    console.log('Use camera:', useCamera);

    if (videoRef.current) {
      const video = videoRef.current;
      console.log('Video ready state:', video.readyState);
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      console.log('Video paused:', video.paused);
      console.log('Video ended:', video.ended);
      console.log('Video src object:', video.srcObject);
    }

    toast.info('Check browser console for debug info');
  };

  const debugVerification = async () => {
    try {
      const response = await fetch('/api/verify/debug', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      console.log('=== VERIFICATION DEBUG INFO ===');
      console.log(result.debug);
      toast.info('Check browser console for verification debug info');
    } catch (error) {
      console.error('Debug error:', error);
      toast.error('Failed to get debug info');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (uploadResult) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${uploadResult.selfie.faceMatching.matched
              ? 'bg-green-100'
              : 'bg-amber-100'
              }`}>
              {uploadResult.selfie.faceMatching.matched ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>
          </div>
          <CardTitle>
            {uploadResult.selfie.faceMatching.matched
              ? 'Face Verification Successful!'
              : 'Face Verification Needs Review'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Uploaded Selfie */}
            <div>
              <h4 className="font-medium mb-3">Your Selfie</h4>
              <img
                src={capturedImage.url}
                alt="Captured selfie"
                className="w-full h-64 object-cover rounded-lg border"
              />
            </div>

            {/* Verification Results */}
            <div>
              <h4 className="font-medium mb-3">Verification Results</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Face Match Similarity</span>
                  <Badge variant={uploadResult.selfie.faceMatching.similarity >= 70 ? "default" : "secondary"}>
                    {uploadResult.selfie.faceMatching.similarity.toFixed(1)}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Match Status</span>
                  <Badge variant={uploadResult.selfie.faceMatching.matched ? "default" : "destructive"}>
                    {uploadResult.selfie.faceMatching.matched ? 'Matched' : 'No Match'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Compared With</span>
                  <Badge variant="outline">
                    {uploadResult.selfie.faceMatching.matchedWith.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Image Quality</span>
                  <Badge variant="outline">
                    {uploadResult.selfie.quality.score}% Quality
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Liveness Detection</span>
                  <Badge variant={uploadResult.selfie.liveness.isLive ? "default" : "destructive"}>
                    {uploadResult.selfie.liveness.isLive ? 'Live Person' : 'Possible Spoofing'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Status */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Verification Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="font-medium text-lg">{uploadResult.verification.overallScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className="mt-1">
                  {uploadResult.verification.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <Badge variant="outline" className="mt-1">
                  {uploadResult.verification.verificationLevel.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-medium text-lg">{uploadResult.verification.progress}%</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={retakeSelfie}
              variant="outline"
              className="flex-1"
            >
              Take Another Selfie
            </Button>
            <Button
              onClick={() => window.location.href = '/verification'}
              className="flex-1"
            >
              View Full Status
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <CardTitle className="text-gray-900 dark:text-gray-100">Take a Selfie</CardTitle>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Take a live selfie for face matching with your uploaded document
        </p>

        {/* Mock Mode Indicator & Toggle */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Verification Mode:</span>
              <Badge variant={MOCK_MODE ? "secondary" : "default"}>
                {MOCK_MODE ? "🧪 Mock" : "🔒 Real"}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMockMode(!MOCK_MODE);
                checkDocumentStatus();
              }}
            >
              Switch to {MOCK_MODE ? "Real" : "Mock"}
            </Button>
          </div>

          {MOCK_MODE && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                🧪 <strong>Mock Mode Active:</strong> Face verification is bypassed for testing. All selfies will be automatically verified as successful.
              </p>
            </div>
          )}
        </div>

        {/* Prerequisite Information */}
        {!MOCK_MODE && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              📋 <strong>Prerequisite:</strong> Make sure you have uploaded a valid ID document (Aadhaar, PAN, Passport, Driving License, or Voter ID) in the previous step before taking your selfie.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {documentCheckLoading ? (
          /* Loading document status */
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600 dark:text-gray-300">Checking document status...</p>
          </div>
        ) : !canTakeSelfie ? (
          /* Show document requirement message */
          <div className="text-center py-8 space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Document Upload Required</h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm mb-4">
                You need to upload a valid ID document before taking a selfie for face matching.
              </p>
              {documentStatus && (
                <div className="text-xs text-amber-700 dark:text-amber-300 mb-4">
                  <p>Documents found: {documentStatus.documentsCount}</p>
                  <p>Suitable for face matching: {documentStatus.suitableDocumentsCount}</p>
                </div>
              )}
              <Button
                onClick={() => window.location.href = '#document'}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Go Back to Document Upload
              </Button>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={checkDocumentStatus}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
              <Button
                onClick={debugVerification}
                variant="ghost"
                size="sm"
              >
                Debug Info
              </Button>
            </div>
          </div>
        ) : capturedImage ? (
          /* Show captured/selected image */
          <div className="text-center space-y-4">
            <img
              src={capturedImage.url}
              alt="Captured selfie"
              className="w-64 h-64 object-cover rounded-lg border mx-auto"
            />
            <div className="flex gap-2 justify-center">
              <Button onClick={retakeSelfie} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button onClick={openFileDialog} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Choose Different
              </Button>
            </div>
          </div>
        ) : useCamera ? (
          /* Camera view */
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm">Starting camera...</span>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width="640"
                height="480"
                style={{
                  transform: 'scaleX(-1)',
                  maxWidth: '100%',
                  height: 'auto'
                }}
                className="w-80 h-60 bg-gray-100 dark:bg-gray-800 rounded-lg border object-cover"
                onLoadedData={() => {
                  console.log('Video data loaded');
                  toast.success('Camera feed ready!');
                }}
                onCanPlay={() => console.log('Video can play')}
                onPlaying={() => console.log('Video is playing')}
                onError={(e) => {
                  console.error('Video error:', e);
                  toast.error('Video display error');
                }}
              />
              <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none opacity-50"></div>

              {/* Camera status indicator */}
              {stream && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                  ● Live
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2 justify-center">
              <Button onClick={capturePhoto} className="px-8">
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button onClick={stopCamera} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>

            {/* Debug button - remove in production */}
            <div className="text-center">
              <Button onClick={debugCamera} variant="ghost" size="sm" className="text-xs">
                Debug Camera
              </Button>
            </div>
          </div>
        ) : (
          /* Initial options */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={startCamera}
                variant="outline"
                className="h-32 flex flex-col gap-2"
              >
                <Camera className="w-8 h-8" />
                <span>Use Camera</span>
                <span className="text-xs text-gray-600">Take a live selfie</span>
              </Button>

              <Button
                onClick={openFileDialog}
                variant="outline"
                className="h-32 flex flex-col gap-2"
              >
                <Upload className="w-8 h-8" />
                <span>Upload Image</span>
                <span className="text-xs text-gray-600">Select from gallery</span>
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Selfie Guidelines</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Look directly at the camera</li>
            <li>• Ensure your face is well-lit and clearly visible</li>
            <li>• Remove sunglasses, hats, or face coverings</li>
            <li>• Keep a neutral expression</li>
            <li>• Make sure the photo is not blurry</li>
          </ul>
        </div>

        {/* Upload Button */}
        {capturedImage && (
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying Face Match...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Selfie
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}