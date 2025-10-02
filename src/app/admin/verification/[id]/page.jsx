'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  FileText,
  Camera,
  User,
  Calendar,
  Mail,
  Phone,
  Shield,
  AlertCircle
} from 'lucide-react';

export default function VerificationReviewPage({ params }) {
  const router = useRouter();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check admin access
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchVerification();
  }, [params.id]);

  const fetchVerification = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/verification/review?id=${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setVerification(result.data.verification);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to load verification data');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action) => {
    if (!notes.trim()) {
      setError('Please provide review notes');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/verification/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          verificationId: params.id,
          action,
          notes
        })
      });

      const result = await response.json();
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to process review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading verification details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Verification Review</h1>
              <p className="text-muted-foreground">
                Review and approve or reject identity verification
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <Alert className="mb-6 border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {verification && (
          <>
            {/* User Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-lg">{verification.userId?.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Role</Label>
                      <Badge variant="outline" className="mt-1">
                        {verification.userId?.role}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{verification.userId?.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{verification.userId?.phone}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Account Created</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(verification.userId?.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <FileText className={`w-6 h-6 mx-auto mb-2 ${verification.simpleSteps?.document === 'completed'
                        ? 'text-green-400'
                        : 'text-gray-400'
                      }`} />
                    <p className="font-medium">Document</p>
                    <Badge variant={verification.simpleSteps?.document === 'completed' ? 'default' : 'secondary'}>
                      {verification.simpleSteps?.document || 'Pending'}
                    </Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Camera className={`w-6 h-6 mx-auto mb-2 ${verification.simpleSteps?.selfie === 'completed'
                        ? 'text-green-400'
                        : 'text-gray-400'
                      }`} />
                    <p className="font-medium">Selfie</p>
                    <Badge variant={verification.simpleSteps?.selfie === 'completed' ? 'default' : 'secondary'}>
                      {verification.simpleSteps?.selfie || 'Pending'}
                    </Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${verification.simpleSteps?.review === 'completed'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                      }`} />
                    <p className="font-medium">Review</p>
                    <Badge variant={verification.simpleSteps?.review === 'completed' ? 'default' : 'secondary'}>
                      {verification.simpleSteps?.review || 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            {verification.documents && verification.documents.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {verification.documents.map((doc, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{doc.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <img
                          src={doc.url}
                          alt={doc.type}
                          className="w-full h-48 object-cover rounded border"
                        />
                        {doc.extractedData && (
                          <div className="mt-3 p-2 bg-muted rounded text-sm">
                            <p><strong>Name:</strong> {doc.extractedData.name}</p>
                            <p><strong>ID:</strong> {doc.extractedData.id}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selfie Photo */}
            {verification.selfiePhoto && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Selfie Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <img
                      src={verification.selfiePhoto}
                      alt="Selfie verification"
                      className="w-full h-64 object-cover rounded border"
                    />
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Uploaded on {new Date(verification.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Review Form */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Review Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter your review notes, comments, or reasons for approval/rejection..."
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => handleReview('approve')}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Verification
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleReview('reject')}
                    disabled={submitting}
                    variant="destructive"
                    className="flex-1"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Verification
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}