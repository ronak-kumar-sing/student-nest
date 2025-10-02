'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  FileText,
  Camera,
  Trophy,
  RefreshCw,
  Download,
  ExternalLink,
  User
} from 'lucide-react';

export default function VerificationStatus({ verification, token, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const getBadgeConfig = (level) => {
    const configs = {
      basic: {
        emoji: '✅',
        text: 'Email Verified',
        color: 'bg-green-100 text-green-800',
        description: 'Basic email and phone verification completed'
      },
      standard: {
        emoji: '🆔',
        text: 'ID Verified',
        color: 'bg-blue-100 text-blue-800',
        description: 'Government document successfully verified'
      },
      premium: {
        emoji: '🔐',
        text: 'DigiLocker Verified',
        color: 'bg-purple-100 text-purple-800',
        description: 'DigiLocker authentication and face matching completed'
      },
      full: {
        emoji: '🏆',
        text: 'Fully Verified',
        color: 'bg-amber-100 text-amber-800',
        description: 'Complete verification with highest confidence level'
      }
    };
    return configs[level] || configs.basic;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await onRefresh();
    setLoading(false);
  };

  if (!verification) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">No Verification Data</h3>
          <p className="text-gray-600">Start your verification process to see status here.</p>
        </CardContent>
      </Card>
    );
  }

  const badgeConfig = getBadgeConfig(verification.verificationLevel);

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">{badgeConfig.emoji}</div>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            {badgeConfig.text}
          </CardTitle>
          <p className="text-gray-600 mt-2">{badgeConfig.description}</p>

          <div className="flex justify-center items-center gap-4 mt-4">
            {getStatusIcon(verification.status)}
            <Badge className={badgeConfig.color}>
              {verification.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline">
              Level: {verification.verificationLevel.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Verification Progress</span>
              <span className="text-sm text-gray-500">{verification.progress}%</span>
            </div>
            <Progress value={verification.progress} className="w-full" />
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{verification.scores.documentScore}%</p>
              <p className="text-sm text-gray-600">Document Score</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{verification.scores.faceMatchScore}%</p>
              <p className="text-sm text-gray-600">Face Match Score</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{verification.scores.overallScore}%</p>
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps Breakdown */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Verification Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* DigiLocker Auth */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className={`p-2 rounded-full ${verification.steps.digilockerAuth ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Shield className={`w-6 h-6 ${verification.steps.digilockerAuth ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">DigiLocker Authentication</h4>
                <p className="text-sm text-gray-600">
                  {verification.steps.digilockerAuth
                    ? `Authenticated on ${new Date(verification.digilocker.authenticatedAt).toLocaleDateString()}`
                    : 'Not completed'
                  }
                </p>
              </div>
              {verification.steps.digilockerAuth && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>

            {/* Document Upload */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className={`p-2 rounded-full ${verification.steps.documentUpload ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FileText className={`w-6 h-6 ${verification.steps.documentUpload ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Document Verification</h4>
                <p className="text-sm text-gray-600">
                  {verification.documents.length > 0
                    ? `${verification.documents.length} document(s) uploaded`
                    : 'No documents uploaded'
                  }
                </p>
              </div>
              {verification.steps.documentUpload && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>

            {/* Selfie Upload */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className={`p-2 rounded-full ${verification.steps.selfieUpload ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Camera className={`w-6 h-6 ${verification.steps.selfieUpload ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Face Matching</h4>
                <p className="text-sm text-gray-600">
                  {verification.selfie.uploaded
                    ? `${verification.selfie.faceMatching.similarity}% similarity with ${verification.selfie.faceMatching.matchedWith}`
                    : 'Selfie not uploaded'
                  }
                </p>
              </div>
              {verification.steps.selfieUpload && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>

            {/* Final Verification */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className={`p-2 rounded-full ${verification.steps.verification ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Trophy className={`w-6 h-6 ${verification.steps.verification ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Final Verification</h4>
                <p className="text-sm text-gray-600">
                  {verification.steps.verification
                    ? `Verified on ${new Date(verification.updatedAt).toLocaleDateString()}`
                    : 'Pending completion of previous steps'
                  }
                </p>
              </div>
              {verification.steps.verification && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Details */}
      {verification.documents.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verification.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{doc.type.toUpperCase()}</p>
                      {doc.extractedData.name && (
                        <p className="text-sm text-gray-600">Name: {doc.extractedData.name}</p>
                      )}
                      {doc.extractedData.documentNumber && (
                        <p className="text-sm text-gray-600">
                          Number: {doc.extractedData.documentNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.verified ? "default" : "secondary"}>
                      {doc.verified ? 'Verified' : 'Pending'}
                    </Badge>
                    <Badge variant="outline">
                      {doc.extractedData.confidence}% Confidence
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {verification.recentHistory && verification.recentHistory.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verification.recentHistory.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border-l-4 border-blue-200 bg-blue-50">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {item.action.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(item.timestamp).toLocaleString()} • By {item.performedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Review */}
      {verification.adminReview && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Admin Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={verification.adminReview.action === 'approved' ? "default" :
                  verification.adminReview.action === 'rejected' ? "destructive" : "secondary"}>
                  {verification.adminReview.action.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  {new Date(verification.adminReview.reviewedAt).toLocaleString()}
                </span>
              </div>
              {verification.adminReview.notes && (
                <p className="text-sm text-gray-700 mt-2">{verification.adminReview.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {verification.status === 'verified' && (
              <Button
                onClick={() => toast.info('Certificate download will be available soon')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Certificate
              </Button>
            )}

            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Go to Dashboard
            </Button>

            <Button
              onClick={() => window.open('/verification', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Share Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}