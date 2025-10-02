'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export default function OTPTestPage() {
  const [phoneNumber, setPhoneNumber] = useState('+917814031234');
  const [otpCode, setOtpCode] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);

  const handleSendOTP = async () => {
    setSendLoading(true);
    setSendResult(null);

    try {
      const response = await fetch('/api/otp/phone/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          purpose: 'signup'
        })
      });

      const result = await response.json();
      setSendResult(result);
    } catch (error) {
      setSendResult({
        success: false,
        message: 'Network error occurred'
      });
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setVerifyLoading(true);
    setVerifyResult(null);

    try {
      const response = await fetch('/api/otp/phone/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          code: otpCode
        })
      });

      const result = await response.json();
      setVerifyResult(result);
    } catch (error) {
      setVerifyResult({
        success: false,
        message: 'Network error occurred'
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">OTP System Test</h1>
          <p className="text-muted-foreground">
            Test the mock OTP system for development
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Phone OTP Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+917814031234"
                type="tel"
              />
            </div>

            {/* Send OTP */}
            <div className="space-y-2">
              <Button
                onClick={handleSendOTP}
                disabled={sendLoading || !phoneNumber}
                className="w-full"
              >
                {sendLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </div>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send OTP
                  </>
                )}
              </Button>
            </div>

            {/* Send Result */}
            {sendResult && (
              <Alert className={sendResult.success ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}>
                {sendResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <AlertDescription className={sendResult.success ? 'text-green-400' : 'text-red-400'}>
                  <div className="space-y-2">
                    <p>{sendResult.message}</p>
                    {sendResult.data?.mockMode && (
                      <div className="space-y-1">
                        <Badge variant="secondary">Mock Mode Active</Badge>
                        <p className="text-sm">Use OTP: <code className="bg-muted px-1 rounded">123456</code></p>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* OTP Input */}
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                In mock mode, use: 123456
              </p>
            </div>

            {/* Verify OTP */}
            <div className="space-y-2">
              <Button
                onClick={handleVerifyOTP}
                disabled={verifyLoading || !otpCode}
                className="w-full"
                variant="outline"
              >
                {verifyLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify OTP
                  </>
                )}
              </Button>
            </div>

            {/* Verify Result */}
            {verifyResult && (
              <Alert className={verifyResult.success ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}>
                {verifyResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                )}
                <AlertDescription className={verifyResult.success ? 'text-green-400' : 'text-red-400'}>
                  <div className="space-y-2">
                    <p>{verifyResult.message}</p>
                    {verifyResult.data?.mockMode && (
                      <Badge variant="secondary">Mock Verification</Badge>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Instructions */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Testing Instructions:</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Enter any phone number</li>
                <li>Click "Send OTP" - it will use mock system if Twilio fails</li>
                <li>Use OTP code: <code className="bg-background px-1 rounded">123456</code></li>
                <li>Click "Verify OTP" to test verification</li>
                <li>System will automatically fall back to mock mode for unverified numbers</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}