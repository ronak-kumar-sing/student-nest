'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Lock, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function DigiLockerAuth({ token, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    otp: ''
  });

  const handleAadhaarSubmit = async (e) => {
    e.preventDefault();

    if (!formData.aadhaarNumber) {
      toast.error('Please enter your Aadhaar number');
      return;
    }

    if (!/^\d{12}$/.test(formData.aadhaarNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setLoading(true);

    // Simulate OTP sending
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('OTP sent to your registered mobile number');
      setStep('otp');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      toast.error('Please enter the OTP');
      return;
    }

    if (!/^\d{6}$/.test(formData.otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/verify/digilocker', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aadhaarNumber: formData.aadhaarNumber.replace(/\s/g, ''),
          otp: formData.otp
        })
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.data);
        toast.success('DigiLocker authentication successful!');
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError('Network error during DigiLocker authentication');
    } finally {
      setLoading(false);
    }
  };

  const formatAadhaarNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 14); // Max 12 digits with spaces
  };

  const handleInputChange = (field, value) => {
    if (field === 'aadhaarNumber') {
      setFormData(prev => ({ ...prev, [field]: formatAadhaarNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          DigiLocker Authentication
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Secure verification powered by Government of India's DigiLocker platform
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Benefits Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Why DigiLocker?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Government-verified identity
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Instant document access
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Secure and encrypted
            </li>
          </ul>
        </div>

        {step === 'login' ? (
          /* Aadhaar Number Input */
          <form onSubmit={handleAadhaarSubmit} className="space-y-4">
            <div>
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                type="text"
                placeholder="1234 5678 9012"
                value={formData.aadhaarNumber}
                onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                className="mt-1 text-lg tracking-wider"
                maxLength={14}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your 12-digit Aadhaar number
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.aadhaarNumber}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        ) : (
          /* OTP Verification */
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800">
                OTP sent to your registered mobile number ending with
                <Badge variant="secondary" className="ml-1">****7890</Badge>
              </p>
            </div>

            <div>
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').substring(0, 6))}
                className="mt-1 text-lg tracking-widest text-center"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                OTP is valid for 10 minutes
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('login')}
                disabled={loading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.otp}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => toast.info('OTP resent successfully')}
              className="w-full text-blue-600"
              disabled={loading}
            >
              Resend OTP
            </Button>
          </form>
        )}

        {/* Security Notice */}
        <div className="border-t pt-4">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p>
              This is a simulated DigiLocker authentication for demonstration purposes.
              In production, this would connect to the actual Government of India DigiLocker APIs
              with proper security protocols and user consent mechanisms.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}