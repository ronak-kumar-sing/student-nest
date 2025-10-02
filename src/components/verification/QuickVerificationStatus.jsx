'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function QuickVerificationStatus({ className = "", showActions = true }) {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/verify/requirements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setVerificationStatus(result.data);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!verificationStatus) {
    return null;
  }

  const { user, verification, requirements } = verificationStatus;
  const isOwner = user.role.toLowerCase() === 'owner';
  const isVerified = user.isIdentityVerified;
  const isSkipped = user.identityVerificationSkipped;
  const hasVerificationInProgress = verification && verification.completedSteps.length > 0;

  const verificationPath = isOwner ? '/owner/profile/verification' : '/student/profile/verification';

  if (isVerified) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="text-green-800">
              <strong>Identity Verified</strong> - Your account is fully secured
            </span>
            <Badge className="bg-green-600 hover:bg-green-700">
              {isOwner ? 'Verified Owner' : 'Verified'}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (hasVerificationInProgress) {
    return (
      <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-800">
                <strong>Verification In Progress</strong> - {verification.completedSteps.length}/3 steps completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">In Progress</Badge>
              {showActions && (
                <Link href={verificationPath}>
                  <Button size="sm" className="ml-2">
                    Continue
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (isOwner) {
    return (
      <Alert className={`border-red-200 bg-red-50 ${className}`}>
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="text-red-800">
              <strong>Verification Required</strong> - Complete verification to list properties
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Required</Badge>
              {showActions && (
                <Link href={verificationPath}>
                  <Button size="sm" variant="destructive">
                    Verify Now
                    <Shield className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (isSkipped) {
    return (
      <Alert className={`border-gray-200 bg-gray-50 ${className}`}>
        <X className="h-4 w-4 text-gray-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="text-gray-800">
              <strong>Verification Skipped</strong> - You can enable it anytime from your profile
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Skipped</Badge>
              {showActions && (
                <Link href={verificationPath}>
                  <Button size="sm" variant="outline">
                    Enable
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Student - not started
  return (
    <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <span className="text-blue-800">
            <strong>Verification Available</strong> - Optional but recommended for better security
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Optional</Badge>
            {showActions && (
              <Link href={verificationPath}>
                <Button size="sm" variant="outline">
                  <Shield className="w-3 h-3 mr-1" />
                  Verify
                </Button>
              </Link>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}