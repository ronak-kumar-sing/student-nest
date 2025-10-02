'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  Shield,
  ShieldCheck,
  User,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import DocumentUpload from '@/components/verification/DocumentUpload';
import SelfieCapture from '@/components/verification/SelfieCapture';
import VerificationPrompt from '@/components/verification/VerificationPrompt';

export default function StudentVerificationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationData, setVerificationData] = useState({
    document: null,
    selfie: null,
    status: 'pending'
  });
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState('');
  const router = useRouter();

  const steps = [
    { id: 'document', title: 'Document Upload', icon: FileText },
    { id: 'selfie', title: 'Selfie Verification', icon: Camera },
    { id: 'review', title: 'Review & Complete', icon: CheckCircle }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    setAuthToken(token);
    fetchVerificationStatus(token);
  }, [router]);

  const fetchVerificationStatus = async (token) => {
    try {
      console.log('Fetching verification status with token:', token ? 'Present' : 'Missing');

      const response = await fetch('/api/verify/requirements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        setVerificationStatus(result.data);

        // Set current step based on completion
        const verification = result.data.verification;
        if (verification) {
          const completedSteps = verification.completedSteps || [];
          const simpleSteps = verification.simpleSteps || {};

          // Use simpleSteps if available, otherwise fall back to completedSteps
          if (simpleSteps.review === 'completed' || completedSteps.includes('review')) {
            setCurrentStep(2);
          } else if (simpleSteps.selfie === 'completed' || completedSteps.includes('selfie')) {
            setCurrentStep(2);
          } else if (simpleSteps.document === 'completed' || completedSteps.includes('document')) {
            setCurrentStep(1);
          } else {
            setCurrentStep(0);
          }
        } else {
          setCurrentStep(0);
        }
      } else {
        console.error('API Error:', result.error);
        toast.error(`Failed to load verification status: ${result.error}`);

        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Network error fetching verification status:', error);
      toast.error(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }; const handleDocumentUploadSuccess = (documentData) => {
    setVerificationData(prev => ({ ...prev, document: documentData }));
    toast.success('Document uploaded successfully! Proceeding to selfie verification.');
    setCurrentStep(1);
    // Refresh status
    fetchVerificationStatus(authToken);
  };

  const handleSelfieUploadSuccess = (selfieData) => {
    setVerificationData(prev => ({ ...prev, selfie: selfieData }));
    toast.success('Selfie uploaded successfully! Verification complete.');
    setCurrentStep(2);
    // Refresh status
    fetchVerificationStatus(authToken);
  };

  const handleError = (error) => {
    toast.error(error || 'Verification failed. Please try again.');
  };

  const handleCompleteVerification = () => {
    toast.success('Identity verification completed successfully!');
    router.push('/student/profile');
  };

  const handleSkipVerification = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading verification status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show verification prompt if user hasn't started or decided to skip
  if (!verificationStatus?.requirements?.verificationRequired &&
    !verificationStatus?.user?.identityVerificationSkipped &&
    !verificationStatus?.verification) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/student/profile')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </div>

          <div className="flex justify-center">
            <VerificationPrompt
              userRole="student"
              onSkip={handleSkipVerification}
              onProceed={(path) => router.push(path)}
              showInDashboard={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show completed status
  if (verificationStatus?.user?.isIdentityVerified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ProfileNavigation />

          <div className="mt-8 max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-green-900">Identity Verified Successfully!</CardTitle>
                <Badge variant="default" className="bg-green-600 mt-2">
                  Verified Student
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <Alert className="border-green-200 bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your identity has been verified successfully. You now have access to all platform features.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Document</h4>
                    <p className="text-xs text-gray-600">Verified</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <Camera className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Selfie</h4>
                    <p className="text-xs text-gray-600">Verified</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Status</h4>
                    <p className="text-xs text-gray-600">Active</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push('/student/profile')}
                    className="flex-1"
                  >
                    Back to Profile
                  </Button>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    className="flex-1"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProfileNavigation />

        <div className="mt-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Student Identity Verification
            </h1>
            <p className="text-gray-600">
              Secure your account and access premium features
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = verificationStatus?.verification?.completedSteps?.includes(step.id) || index < currentStep;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isActive
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-500'
                      }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'
                        }`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-3">
              <h3 className="font-semibold">{steps[currentStep]?.title}</h3>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            {currentStep === 0 && (
              <DocumentUpload
                token={authToken}
                onSuccess={handleDocumentUploadSuccess}
                onError={handleError}
              />
            )}

            {currentStep === 1 && (
              <SelfieCapture
                token={authToken}
                onSuccess={handleSelfieUploadSuccess}
                onError={handleError}
              />
            )}

            {currentStep === 2 && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <CardTitle>Verification Complete!</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your identity has been successfully verified. You now have access to all student features.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Document Verified</h4>
                      <p className="text-sm text-gray-600">Identity confirmed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Camera className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Selfie Matched</h4>
                      <p className="text-sm text-gray-600">Face verification passed</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">You can now:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Access verified-only properties</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Get priority in room applications</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Use advanced search filters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Receive premium support</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleCompleteVerification}
                    className="w-full"
                  >
                    Complete Verification
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Navigation */}
          {currentStep > 0 && !verificationStatus?.user?.isIdentityVerified && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Step
              </Button>
            </div>
          )}

          {/* Skip Option for Students */}
          {!verificationStatus?.requirements?.verificationRequired && currentStep === 0 && (
            <div className="text-center mt-6">
              <Button
                variant="ghost"
                onClick={() => router.push('/student/profile')}
                className="text-gray-600"
              >
                Skip Verification (Can enable later)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}