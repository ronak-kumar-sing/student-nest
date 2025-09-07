"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import VerificationBadge from '@/components/profile/VerificationBadge';
import { getStudentProfile, initiateAadhaarVerification, initiateDigilockerVerification } from '@/lib/api';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Upload,
  RefreshCw,
  Loader2,
  ExternalLink,
  User,
  CreditCard,
  GraduationCap,
  Building
} from 'lucide-react';

const verificationSteps = [
  {
    id: 'email',
    title: 'Email Verification',
    description: 'Verify your email address',
    icon: CheckCircle,
    required: true
  },
  {
    id: 'phone',
    title: 'Phone Verification',
    description: 'Verify your phone number',
    icon: CheckCircle,
    required: true
  },
  {
    id: 'aadhaar',
    title: 'Aadhaar Verification',
    description: 'Verify your identity with Aadhaar',
    icon: User,
    required: false
  },
  {
    id: 'student',
    title: 'Student ID Verification',
    description: 'Upload your student ID card',
    icon: GraduationCap,
    required: false
  },
  {
    id: 'college',
    title: 'College Verification',
    description: 'Verify your college enrollment',
    icon: Building,
    required: false
  }
];

function StudentVerificationPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getStudentProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarVerification = async () => {
    setVerifying({ ...verifying, aadhaar: true });
    try {
      const response = await initiateAadhaarVerification();
      if (response.success) {
        // Redirect to verification URL or show success message
        alert('Aadhaar verification initiated. Please complete the process.');
      }
    } catch (error) {
      console.error('Error initiating Aadhaar verification:', error);
      alert('Failed to initiate Aadhaar verification. Please try again.');
    } finally {
      setVerifying({ ...verifying, aadhaar: false });
    }
  };

  const handleDigilockerVerification = async () => {
    setVerifying({ ...verifying, digilocker: true });
    try {
      const response = await initiateDigilockerVerification();
      if (response.success) {
        // Redirect to DigiLocker or show success message
        alert('DigiLocker verification initiated. Please complete the process.');
      }
    } catch (error) {
      console.error('Error initiating DigiLocker verification:', error);
      alert('Failed to initiate DigiLocker verification. Please try again.');
    } finally {
      setVerifying({ ...verifying, digilocker: false });
    }
  };

  const getVerificationStatus = (verificationType) => {
    if (!profile) return 'pending';

    switch (verificationType) {
      case 'email':
        return profile.emailVerified ? 'verified' : 'pending';
      case 'phone':
        return profile.phoneVerified ? 'verified' : 'pending';
      case 'aadhaar':
        return profile.aadhaarVerified ? 'verified' : 'pending';
      case 'student':
        return profile.studentIdVerified ? 'verified' : 'pending';
      case 'college':
        return profile.collegeVerified ? 'verified' : 'pending';
      default:
        return 'pending';
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'failed':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const calculateCompletionPercentage = () => {
    if (!profile) return 0;

    const totalSteps = verificationSteps.length;
    const completedSteps = verificationSteps.filter(step =>
      getVerificationStatus(step.id) === 'verified'
    ).length;

    return Math.round((completedSteps / totalSteps) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw size={24} className="animate-spin" />
              <span>Loading verification status...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Verification</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <ProfileNavigation userType="student" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Verification Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Verification Progress</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {completionPercentage}% Complete
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Complete all verifications to increase your profile credibility</span>
                    <VerificationBadge
                      emailVerified={profile?.emailVerified}
                      phoneVerified={profile?.phoneVerified}
                      idVerified={profile?.aadhaarVerified}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Steps */}
            <div className="space-y-4">
              {verificationSteps.map((step) => {
                const status = getVerificationStatus(step.id);
                const StepIcon = step.icon;

                return (
                  <Card key={step.id} className={`transition-all duration-200 ${status === 'verified' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : ''
                    }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${status === 'verified'
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                            <StepIcon size={24} className={
                              status === 'verified' ? 'text-green-600' : 'text-gray-600'
                            } />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{step.title}</h3>
                              {step.required && (
                                <Badge variant="outline" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {getVerificationBadge(status)}
                          {status !== 'verified' && (
                            <div className="flex gap-2">
                              {step.id === 'aadhaar' && (
                                <Button
                                  onClick={handleAadhaarVerification}
                                  disabled={verifying.aadhaar}
                                  variant="outline"
                                  size="sm"
                                >
                                  {verifying.aadhaar ? (
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                  ) : (
                                    <ExternalLink size={16} className="mr-2" />
                                  )}
                                  Verify with Aadhaar
                                </Button>
                              )}

                              {step.id === 'student' && (
                                <Button
                                  onClick={handleDigilockerVerification}
                                  disabled={verifying.digilocker}
                                  variant="outline"
                                  size="sm"
                                >
                                  {verifying.digilocker ? (
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                  ) : (
                                    <Upload size={16} className="mr-2" />
                                  )}
                                  Upload Document
                                </Button>
                              )}

                              {(step.id === 'email' || step.id === 'phone') && (
                                <Button variant="outline" size="sm">
                                  <RefreshCw size={16} className="mr-2" />
                                  Resend
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Benefits Card */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                  <Shield size={20} />
                  Verification Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                      Increased Trust
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Verified profiles are more likely to be trusted by property owners
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                      Priority Listings
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Get priority access to premium room listings
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                      Faster Responses
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Verified users receive faster responses from owners
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                      Security Badge
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Display verification badges on your profile
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentVerificationPage;
