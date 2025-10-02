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
  Building,
  FileText,
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Info,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import DocumentUpload from '@/components/verification/DocumentUpload';
import SelfieCapture from '@/components/verification/SelfieCapture';

export default function OwnerVerificationPage() {
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

  // Helper function to check if a step is completed
  const isStepCompleted = (stepName) => {
    if (verificationStatus?.verification?.simpleSteps) {
      return verificationStatus.verification.simpleSteps[stepName] === 'completed';
    }
    return verificationStatus?.verification?.completedSteps?.includes(stepName) || false;
  };

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
      const response = await fetch('/api/verify/requirements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setVerificationStatus(result.data);

        // Set current step based on completion - using direct data since state update is async
        const verification = result.data.verification;
        const checkStepCompleted = (stepName) => {
          if (verification?.simpleSteps) {
            return verification.simpleSteps[stepName] === 'completed';
          }
          return verification?.completedSteps?.includes(stepName) || false;
        };

        if (checkStepCompleted('review')) {
          setCurrentStep(2);
        } else if (checkStepCompleted('selfie')) {
          setCurrentStep(2);
        } else if (checkStepCompleted('document')) {
          setCurrentStep(1);
        } else {
          setCurrentStep(0);
        }
      } else {
        toast.error('Failed to load verification status');
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
      toast.error('Failed to load verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUploadSuccess = (documentData) => {
    setVerificationData(prev => ({ ...prev, document: documentData }));
    toast.success('Document uploaded successfully! Proceeding to selfie verification.');
    setCurrentStep(1);
    fetchVerificationStatus(authToken);
  };

  const handleSelfieUploadSuccess = (selfieData) => {
    setVerificationData(prev => ({ ...prev, selfie: selfieData }));
    toast.success('Selfie uploaded successfully! Verification complete.');
    setCurrentStep(2);
    fetchVerificationStatus(authToken);
  };

  const handleError = (error) => {
    toast.error(error || 'Verification failed. Please try again.');
  };

  const handleCompleteVerification = () => {
    toast.success('Identity verification completed successfully! You can now list properties.');
    router.push('/owner/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading verification status...</p>
            </div>
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
                  Verified Property Owner
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <Alert className="border-green-200 bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your identity has been verified successfully. You can now list properties and gain user trust.
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
                    <Building className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Owner Status</h4>
                    <p className="text-xs text-gray-600">Verified</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-green-900">You can now:</h4>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>List unlimited properties</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Get verified owner badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Access premium owner features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Build trust with students</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push('/owner/profile')}
                    className="flex-1"
                  >
                    Back to Profile
                  </Button>
                  <Button
                    onClick={() => router.push('/owner/dashboard')}
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
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Building className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Property Owner Verification
            </h1>
            <Badge variant="destructive" className="mb-4">
              Required for All Property Owners
            </Badge>
            <p className="text-gray-600">
              Complete identity verification to list properties and build trust with students
            </p>
          </div>

          {/* Required Notice */}
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Verification Required:</strong> All property owners must complete identity verification before listing properties. This helps build trust and ensures the safety of our student community.
            </AlertDescription>
          </Alert>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = isStepCompleted(step.id) || index < currentStep;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isActive
                        ? 'bg-red-600 border-red-600 text-white'
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
                      Congratulations! Your identity has been successfully verified. You can now list properties and start building your rental business.
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
                    <h4 className="font-semibold">Next Steps:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        <span>Create your first property listing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        <span>Set up your owner dashboard</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        <span>Start connecting with students</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleCompleteVerification}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Complete Verification & Start Listing
                    <Building className="w-4 h-4 ml-2" />
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

          {/* Required Notice */}
          <div className="text-center mt-6">
            <Alert className="max-w-md mx-auto border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                Verification cannot be skipped for property owners. This ensures the safety and trust of our student community.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}