import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authorization required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Find verification record
    const verification = await Verification.findOne({ userId: user._id });

    const debugInfo = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      verification: verification ? {
        id: verification._id,
        status: verification.status,
        documentsCount: verification.documents.length,
        documents: verification.documents.map(doc => ({
          type: doc.type,
          fileUrl: doc.fileUrl ? 'Present' : 'Missing',
          verified: doc.verified,
          uploadedAt: doc.uploadedAt,
          extractedData: doc.extractedData ? {
            name: doc.extractedData.name || 'Missing',
            documentNumber: doc.extractedData.documentNumber || 'Missing',
            confidence: doc.extractedData.confidence
          } : 'Missing'
        })),
        selfie: verification.selfie ? {
          fileUrl: verification.selfie.fileUrl ? 'Present' : 'Missing',
          faceMatching: verification.selfie.faceMatching
        } : 'Not uploaded',
        scores: verification.scores
      } : 'No verification record',
      // Check face matching eligibility
      eligibleDocuments: verification ? verification.documents.filter(doc => {
        const hasValidType = ['aadhaar', 'driving_license', 'passport', 'pan', 'voter_id'].includes(doc.type);
        const hasUrl = doc.fileUrl && doc.fileUrl.trim() !== '';
        return hasValidType && hasUrl;
      }).map(doc => ({
        type: doc.type,
        verified: doc.verified
      })) : [],
      canTakeSelfie: verification ? verification.documents.some(doc => {
        const hasValidType = ['aadhaar', 'driving_license', 'passport', 'pan', 'voter_id'].includes(doc.type);
        const hasUrl = doc.fileUrl && doc.fileUrl.trim() !== '';
        return hasValidType && hasUrl;
      }) : false
    };

    return NextResponse.json({
      success: true,
      debug: debugInfo
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug API error: ' + error.message
    }, { status: 500 });
  }
}