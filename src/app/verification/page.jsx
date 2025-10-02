'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Shield,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Lock,
  Upload
} from 'lucide-react';

// Components
import DigiLockerAuth from '@/components/verification/DigiLockerAuth';
import DocumentUpload from '@/components/verification/DocumentUpload';
import SelfieCapture from '@/components/verification/SelfieCapture';
import VerificationStatus from '@/components/verification/VerificationStatus';

export default function VerificationPage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [currentStep, setCurrentStep] = useState('digilocker');

  useEffect(() => {
    // Get user and token from localStorage
    const userData = localStorage.getItem('user');
    const authToken = localStorage.getItem('token');

    if (userData && authToken) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setToken(authToken);
        fetchVerificationStatus(authToken);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const fetchVerificationStatus = async (authToken) => {
    try {
      const response = await fetch('/api/verify/status', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setVerification(result.data);

        // Determine current step based on verification status
        if (!result.data.steps.digilockerAuth) {
          setCurrentStep('digilocker');
        } else if (!result.data.steps.documentUpload) {
          setCurrentStep('document');
        } else if (!result.data.steps.selfieUpload) {
          setCurrentStep('selfie');
        } else {
          setCurrentStep('status');
        }
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const handleStepComplete = (step, data) => {
    toast.success(`${step} completed successfully!`);

    // Refresh verification status
    fetchVerificationStatus(token);

    // Move to next step
    if (step === 'DigiLocker Authentication') {
      setCurrentStep('document');
    } else if (step === 'Document Upload') {
      setCurrentStep('selfie');
    } else if (step === 'Selfie Upload') {
      setCurrentStep('status');
    }
  };

  const handleStepError = (error) => {
    toast.error(`Verification failed: ${error}`);
  };

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
            <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-2xl font-bold mb-2">Identity Verification</h1>
            <p className="text-gray-600 mb-4">Please log in to start the verification process.</p>
            <Button onClick={() => window.location.href = '/student/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStepIcon = (step, isActive, isCompleted) => {
    const iconClass = `w-8 h-8 ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`;

    switch (step) {
      case 'digilocker': return <Lock className={iconClass} />;
      case 'document': return <FileText className={iconClass} />;
      case 'selfie': return <Camera className={iconClass} />;
      case 'status': return <CheckCircle className={iconClass} />;
      default: return <AlertCircle className={iconClass} />;
    }
  };

  const steps = [
    { id: 'digilocker', title: 'DigiLocker Auth', description: 'Authenticate with government portal' },
    { id: 'document', title: 'Upload Document', description: 'Government ID verification' },
    { id: 'selfie', title: 'Take Selfie', description: 'Face matching verification' },
    { id: 'status', title: 'Verification Complete', description: 'Review results' }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          Identity Verification
        </h1>
        <p className="text-gray-600">Secure verification powered by simulated DigiLocker integration</p>

        {user && (
          <Badge variant="secondary" className="mt-2">
            <User className="w-4 h-4 mr-1" />
            {user.fullName || user.name || user.email} ({user.role || user.userType})
          </Badge>
        )}
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Verification Progress</span>
              <span className="text-sm text-gray-500">
                {verification ? `${verification.progress}%` : '0%'}
              </span>
            </div>
            <Progress value={verification?.progress || 0} className="w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = verification?.steps?.[step.id === 'status' ? 'verification' : step.id === 'digilocker' ? 'digilockerAuth' : step.id === 'document' ? 'documentUpload' : 'selfieUpload'] || false;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 transition-all ${isActive
                      ? 'border-blue-500 bg-blue-50'
                      : isCompleted
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                >
                  <div className="flex flex-col items-center text-center">
                    {getStepIcon(step.id, isActive, isCompleted)}
                    <h3 className="font-medium mt-2">{step.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-600 mt-2" />
                    )}
                    {isActive && (
                      <Clock className="w-4 h-4 text-blue-600 mt-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="grid gap-6">
        {currentStep === 'digilocker' && (
          <DigiLockerAuth
            token={token}
            onSuccess={(data) => handleStepComplete('DigiLocker Authentication', data)}
            onError={handleStepError}
          />
        )}

        {currentStep === 'document' && (
          <DocumentUpload
            token={token}
            onSuccess={(data) => handleStepComplete('Document Upload', data)}
            onError={handleStepError}
          />
        )}

        {currentStep === 'selfie' && (
          <SelfieCapture
            token={token}
            onSuccess={(data) => handleStepComplete('Selfie Upload', data)}
            onError={handleStepError}
          />
        )}

        {currentStep === 'status' && (
          <VerificationStatus
            verification={verification}
            token={token}
            onRefresh={() => fetchVerificationStatus(token)}
          />
        )}
      </div>

      {/* Quick Actions */}
      {verification && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => fetchVerificationStatus(token)}
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Refresh Status
              </Button>

              <Button
                variant="outline"
                onClick={() => setCurrentStep('document')}
                disabled={!verification.steps.digilockerAuth}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Another Document
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}