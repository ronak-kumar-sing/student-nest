'use client';

import { useState, useRef, useCallback } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setUseCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please use file upload instead.');
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
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage({ file, url: imageUrl });
          stopCamera();
          toast.success('Selfie captured successfully!');
        }
      }, 'image/jpeg', 0.9);
    }
  }, [stream]);

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

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('selfie', capturedImage.file);

      const response = await fetch('/api/verify/upload-selfie', {
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
        toast.success('Selfie verification completed!');
      } else {
        onError(result.error);
        toast.error(result.error);
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <CardTitle>Take a Selfie</CardTitle>
        <p className="text-gray-600 mt-2">
          Take a live selfie for face matching with your uploaded document
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {capturedImage ? (
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
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-80 h-60 object-cover rounded-lg border bg-gray-100"
              />
              <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none opacity-50"></div>
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
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Selfie Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
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