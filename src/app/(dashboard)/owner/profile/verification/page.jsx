"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import VerificationBadge from '@/components/profile/VerificationBadge';
import { getOwnerProfile, initiateAadhaarVerification, initiateDigilockerVerification } from '@/lib/api';
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
  Building,
  Briefcase,
  Award
} from 'lucide-react';

const ownerVerificationSteps = [
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
    required: true
  },
  {
    id: 'pan',
    title: 'PAN Verification',
    description: 'Verify your PAN card',
    icon: CreditCard,
    required: true
  },
  {
    id: 'business',
    title: 'Business Verification',
    description: 'Verify your business documents',
    icon: Building,
    required: false
  },
  {
    id: 'gst',
    title: 'GST Verification',
    description: 'Verify your GST registration',
    icon: FileText,
    required: false
  },
  {
    id: 'property',
    title: 'Property Ownership',
    description: 'Verify property ownership documents',
    icon: Briefcase,
    required: false
  }
];

function OwnerVerificationPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getOwnerProfile();
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
      case 'pan':
        return profile.panVerified ? 'verified' : 'pending';
      case 'business':
        return profile.businessVerified ? 'verified' : 'pending';
      case 'gst':
        return profile.gstVerified ? 'verified' : 'pending';
      case 'property':
        return profile.propertyVerified ? 'verified' : 'pending';
      default:
        return 'pending';
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

    const totalSteps = ownerVerificationSteps.length;
    const completedSteps = ownerVerificationSteps.filter(step =>
      getVerificationStatus(step.id) === 'verified'
    ).length;

    return Math.round((completedSteps / totalSteps) * 100);
  };

  const getTrustLevel = () => {
    const percentage = calculateCompletionPercentage();
    if (percentage >= 85) return { level: 'Elite', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (percentage >= 70) return { level: 'Premium', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 50) return { level: 'Trusted', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Basic', color: 'text-yellow-600', bg: 'bg-yellow-100' };
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
  const trustLevel = getTrustLevel();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Verification</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <ProfileNavigation userType="owner" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Verification Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Verification Progress</span>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={`text-lg px-3 py-1 ${trustLevel.bg} ${trustLevel.color}`}
                    >
                      {trustLevel.level} Owner
                    </Badge>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {completionPercentage}% Complete
                    </Badge>
                  </div>
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
                    <span>Complete all verifications to become a trusted property owner</span>
                    <VerificationBadge
                      emailVerified={profile?.emailVerified}
                      phoneVerified={profile?.phoneVerified}
                      idVerified={profile?.aadhaarVerified}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Level Benefits */}
            <Card className={`border-2 ${trustLevel.bg} border-opacity-30`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${trustLevel.color}`}>
                  <Award size={20} />
                  {trustLevel.level} Owner Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${trustLevel.color}`}>
                      Priority Listing Display
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your properties appear higher in search results
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${trustLevel.color}`}>
                      Increased Student Trust
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Students are more likely to inquire about verified properties
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${trustLevel.color}`}>
                      Lower Commission Rates
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enjoy reduced platform fees for verified owners
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${trustLevel.color}`}>
                      Premium Support
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get priority customer support and dedicated assistance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Steps */}
            <div className="space-y-4">
              {ownerVerificationSteps.map((step) => {
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
                                <Badge variant="destructive" className="text-xs">Required</Badge>
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
                              {(step.id === 'aadhaar' || step.id === 'pan') && (
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

                              {(['business', 'gst', 'property'].includes(step.id)) && (
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

            {/* Verification Requirements */}
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <FileText size={20} />
                  Document Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                      Required Documents
                    </h4>
                    <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                      <li>Valid Aadhaar Card (for identity verification)</li>
                      <li>PAN Card (for tax compliance)</li>
                      <li>Property ownership documents</li>
                      <li>Recent utility bills for address proof</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                      Optional Business Documents
                    </h4>
                    <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                      <li>GST registration certificate (if applicable)</li>
                      <li>Business registration documents</li>
                      <li>Professional licenses or certifications</li>
                      <li>Bank account statements (last 3 months)</li>
                    </ul>
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

export default OwnerVerificationPage;
