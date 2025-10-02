'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Square, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function CameraTestPage() {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      console.log('Got media stream:', mediaStream);
      setStream(mediaStream);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video loaded, starting playback...');
          videoRef.current.play()
            .then(() => {
              console.log('Video playing successfully');
              toast.success('Camera started!');
            })
            .catch(err => {
              console.error('Play error:', err);
              toast.error('Failed to start video playback');
            });
        };
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast.error(`Camera error: ${error.message}`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    toast.info('Camera stopped');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error('Camera not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState !== 4) {
      toast.error('Video not ready yet');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedImage(url);
        toast.success('Photo captured!');
      }
    }, 'image/jpeg', 0.9);
  };

  const clearPhoto = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Camera Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              {!isActive ? (
                <Button onClick={startCamera}>
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button onClick={capturePhoto}>
                    <Square className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Stop Camera
                  </Button>
                </>
              )}
            </div>

            {/* Camera Feed */}
            {isActive && (
              <div className="text-center">
                <div className="relative inline-block">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-96 h-72 bg-black rounded-lg border-2 border-blue-500"
                    onLoadedData={() => console.log('Video data loaded')}
                    onCanPlay={() => console.log('Video can play')}
                    onPlaying={() => console.log('Video playing')}
                    onError={(e) => console.error('Video error:', e)}
                  />
                  {stream && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      ● LIVE
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Captured Image */}
            {capturedImage && (
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Captured Photo:</h3>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-96 h-72 object-cover rounded-lg border mx-auto"
                />
                <Button onClick={clearPhoto} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Photo
                </Button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Debug Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <div>Stream: {stream ? '✅ Active' : '❌ Not active'}</div>
              <div>Video Element: {videoRef.current ? '✅ Ready' : '❌ Not ready'}</div>
              <div>Canvas Element: {canvasRef.current ? '✅ Ready' : '❌ Not ready'}</div>
              {videoRef.current && (
                <>
                  <div>Video Ready State: {videoRef.current.readyState}</div>
                  <div>Video Dimensions: {videoRef.current.videoWidth} x {videoRef.current.videoHeight}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}