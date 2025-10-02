import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';
import { uploadImage } from '@/lib/cloudinary';

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

export async function POST(request) {
  console.log('🧪 MOCK SELFIE UPLOAD API - Starting...');

  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('selfie');

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Selfie image is required'
      }, { status: 400 });
    }

    console.log('🧪 MOCK: Processing selfie file:', file.name, file.size);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Only JPEG, PNG, and WebP images are allowed'
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'File size must be less than 5MB'
      }, { status: 400 });
    }

    try {
      // Convert file to buffer for upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload selfie to Cloudinary (real upload)
      console.log('🧪 MOCK: Uploading selfie to Cloudinary...');
      const uploadResult = await uploadImage(base64Data, {
        folder: `student-nest/selfies/${user._id}`,
        width: 800,
        height: 800,
        crop: 'limit',
        tags: ['selfie', 'verification', 'mock'],
      });

      if (!uploadResult.success) {
        return NextResponse.json({
          success: false,
          error: uploadResult.error || 'Failed to upload selfie'
        }, { status: 500 });
      }

      // 🧪 MOCK: Skip all real verification and return successful results
      console.log('🧪 MOCK: Skipping face matching, returning mock success');

      // Find or create verification record
      let verification = await Verification.findOne({ userId: user._id });

      if (!verification) {
        verification = new Verification({
          userId: user._id,
          status: 'pending'
        });
      }

      // 🧪 MOCK: Add fake document if none exists
      if (verification.documents.length === 0) {
        verification.documents.push({
          type: 'aadhaar',
          fileUrl: 'https://res.cloudinary.com/demo/image/upload/mock-document.jpg',
          publicId: 'mock-document',
          extractedData: {
            name: 'Mock User',
            documentNumber: '1234-5678-9012',
            dateOfBirth: '1990-01-01',
            address: 'Mock Address',
            confidence: 95
          },
          ocrText: 'Mock OCR Text',
          uploadedAt: new Date(),
          verified: true
        });
      }

      // Update verification record with mock successful data
      verification.selfie = {
        fileUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        uploadedAt: new Date(),
        faceMatching: {
          similarity: 85.5, // Mock high similarity score
          threshold: 70,
          matched: true,
          matchedWith: 'aadhaar',
          processedAt: new Date()
        }
      };

      // Update face match score
      verification.scores.faceMatchScore = 85.5;

      // Update status to verified
      verification.status = 'verified';

      // Add history entry
      verification.addHistory('selfie_upload_mock', {
        similarity: 85.5,
        matched: true,
        livenessScore: 92.3,
        qualityScore: 88.7,
        documentType: 'aadhaar',
        mockMode: true
      });

      await verification.save();

      // Return mock successful response
      const mockResponse = {
        verification: {
          overallScore: 87,
          status: 'verified',
          verificationLevel: 'high',
          progress: 100
        },
        selfie: {
          fileUrl: uploadResult.url,
          quality: {
            score: 88.7,
            issues: [],
            recommendations: []
          },
          liveness: {
            isLive: true,
            score: 92.3,
            confidence: 'high'
          },
          faceMatching: {
            similarity: 85.5,
            threshold: 70,
            matched: true,
            matchedWith: 'aadhaar'
          }
        }
      };

      console.log('🧪 MOCK: Returning successful verification result');

      return NextResponse.json({
        success: true,
        data: mockResponse,
        message: '🧪 Mock verification completed successfully',
        mock: true
      });

    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({
        success: false,
        error: 'Failed to upload selfie: ' + uploadError.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Mock selfie upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}