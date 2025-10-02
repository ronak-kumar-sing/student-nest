import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Helper function to verify JWT token and get user
async function getAuthenticatedUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header found' };
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
      return { error: 'Invalid token payload' };
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { error: 'User not found' };
    }

    if (!user.isActive) {
      return { error: 'User account is inactive' };
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Invalid or expired token' };
  }
}

// Get verification status
export async function GET(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const verification = await Verification.findOne({ userId: user._id });

    if (!verification) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'not_started',
          verificationLevel: 'basic',
          progress: 0,
          steps: {
            digilockerAuth: false,
            documentUpload: false,
            selfieUpload: false,
            verification: false
          },
          scores: {
            documentScore: 0,
            faceMatchScore: 0,
            overallScore: 0
          }
        }
      });
    }

    // Calculate steps completion
    const steps = {
      digilockerAuth: verification.digilockerAuth.authenticated || false,
      documentUpload: verification.documents.length > 0,
      selfieUpload: !!verification.selfie.fileUrl,
      verification: verification.status === 'verified'
    };

    // Auto-complete verification if both document and selfie are uploaded and not already verified
    if (steps.documentUpload && steps.selfieUpload && verification.status !== 'verified') {
      // Update verification status to completed
      verification.status = 'verified';
      verification.verificationLevel = 'full';
      verification.progress = 100;
      verification.completedAt = new Date();

      // Update user verification status
      await User.findByIdAndUpdate(user._id, {
        isIdentityVerified: true,
        identityVerificationRequired: false
      });

      // Add to history
      verification.history.push({
        action: 'verification_completed',
        details: 'Identity verification completed automatically',
        timestamp: new Date(),
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      });

      await verification.save();

      console.log(`Verification auto-completed for user ${user._id}`);

      // Update steps after completion
      steps.verification = true;
    }

    // Get verification badge based on level
    const getBadge = (level) => {
      const badges = {
        basic: { emoji: '✅', text: 'Email Verified', color: 'green' },
        standard: { emoji: '🆔', text: 'ID Verified', color: 'blue' },
        premium: { emoji: '✅', text: 'DigiLocker Verified', color: 'purple' },
        full: { emoji: '🏆', text: 'Fully Verified', color: 'gold' }
      };
      return badges[level] || badges.basic;
    };

    const badge = getBadge(verification.verificationLevel);

    return NextResponse.json({
      success: true,
      data: {
        verificationId: verification._id,
        status: verification.status,
        verificationLevel: verification.verificationLevel,
        progress: verification.progress,
        steps: steps,
        scores: verification.scores,
        badge: badge,

        // DigiLocker details
        digilocker: {
          authenticated: verification.digilockerAuth.authenticated,
          documentsAvailable: verification.digilockerAuth.documentsAvailable,
          authenticatedAt: verification.digilockerAuth.authenticatedAt
        },

        // Documents summary
        documents: verification.documents.map(doc => ({
          type: doc.type,
          verified: doc.verified,
          uploadedAt: doc.uploadedAt,
          extractedData: {
            name: doc.extractedData.name,
            documentNumber: doc.extractedData.documentNumber ?
              `****-****-${doc.extractedData.documentNumber.slice(-4)}` : null,
            confidence: doc.extractedData.confidence
          }
        })),

        // Selfie details (if uploaded)
        selfie: verification.selfie.fileUrl ? {
          uploaded: true,
          faceMatching: {
            similarity: verification.selfie.faceMatching.similarity,
            matched: verification.selfie.faceMatching.matched,
            matchedWith: verification.selfie.faceMatching.matchedWith
          },
          uploadedAt: verification.selfie.uploadedAt
        } : { uploaded: false },

        // Admin review (if any)
        adminReview: verification.adminReview.action ? {
          action: verification.adminReview.action,
          notes: verification.adminReview.notes,
          reviewedAt: verification.adminReview.reviewedAt
        } : null,

        // Recent history
        recentHistory: verification.history
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5)
          .map(h => ({
            action: h.action,
            timestamp: h.timestamp,
            performedBy: h.performedBy
          })),

        // Next steps
        nextSteps: getNextSteps(verification),

        createdAt: verification.createdAt,
        updatedAt: verification.updatedAt
      }
    });

  } catch (error) {
    console.error('Get verification status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error while fetching verification status'
    }, { status: 500 });
  }
}

// Helper function to determine next steps
function getNextSteps(verification) {
  const steps = [];

  if (!verification.digilockerAuth.authenticated) {
    steps.push({
      step: 'digilocker_auth',
      title: 'Authenticate with DigiLocker',
      description: 'Complete DigiLocker authentication to access government documents',
      action: 'Start DigiLocker Authentication'
    });
    return steps;
  }

  if (verification.documents.length === 0) {
    steps.push({
      step: 'upload_document',
      title: 'Upload Government ID',
      description: 'Upload your Aadhaar, PAN, or other government-issued ID',
      action: 'Upload Document'
    });
    return steps;
  }

  if (!verification.selfie.fileUrl) {
    steps.push({
      step: 'upload_selfie',
      title: 'Take a Selfie',
      description: 'Take a live selfie for face matching verification',
      action: 'Take Selfie'
    });
    return steps;
  }

  if (verification.status === 'processing') {
    steps.push({
      step: 'manual_review',
      title: 'Manual Review in Progress',
      description: 'Your verification is under manual review by our team',
      action: 'Wait for Review'
    });
    return steps;
  }

  if (verification.status === 'verified') {
    steps.push({
      step: 'completed',
      title: 'Verification Complete!',
      description: `You are ${verification.verificationLevel} verified with ${verification.scores.overallScore}% confidence`,
      action: 'View Certificate'
    });
  }

  return steps;
}

// Get verification history
export async function POST(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const verification = await Verification.findOne({ userId: user._id });

    if (!verification) {
      return NextResponse.json({
        success: true,
        data: {
          history: []
        }
      });
    }

    const fullHistory = verification.history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(h => ({
        action: h.action,
        timestamp: h.timestamp,
        details: h.details,
        performedBy: h.performedBy
      }));

    return NextResponse.json({
      success: true,
      data: {
        verificationId: verification._id,
        history: fullHistory,
        totalEntries: fullHistory.length
      }
    });

  } catch (error) {
    console.error('Get verification history error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error while fetching verification history'
    }, { status: 500 });
  }
}