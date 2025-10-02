import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';
import { uploadImage } from '@/lib/cloudinary';
import { compareFaces, validateImageQuality, detectLiveness } from '@/lib/utils/faceMatch';

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

    // Find verification record
    let verification = await Verification.findOne({ userId: user._id });

    if (!verification) {
      return NextResponse.json({
        success: false,
        error: 'Please complete DigiLocker authentication first'
      }, { status: 400 });
    }

    if (verification.documents.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Please upload a document first'
      }, { status: 400 });
    }

    try {
      // Convert file to buffer for upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload selfie to Cloudinary
      console.log('Uploading selfie to Cloudinary...');
      const uploadResult = await uploadImage(base64Data, {
        folder: `student-nest/selfies/${user._id}`,
        width: 800,
        height: 800,
        crop: 'limit',
        tags: ['selfie', 'verification'],
      });

      if (!uploadResult.success) {
        return NextResponse.json({
          success: false,
          error: uploadResult.error || 'Failed to upload selfie'
        }, { status: 500 });
      }

      // Validate image quality
      console.log('Validating image quality...');
      const qualityValidation = await validateImageQuality(uploadResult.url);

      if (!qualityValidation.isValid) {
        return NextResponse.json({
          success: false,
          error: `Image quality issues: ${qualityValidation.issues.join(', ')}`,
          recommendations: qualityValidation.recommendations
        }, { status: 400 });
      }

      // Detect liveness (anti-spoofing)
      console.log('Detecting liveness...');
      const livenessResult = await detectLiveness(uploadResult.url);

      if (!livenessResult.isLive) {
        return NextResponse.json({
          success: false,
          error: 'Liveness detection failed. Please take a live selfie.',
          details: livenessResult.message
        }, { status: 400 });
      }

      // Find the most recent verified document with a face
      const documentWithFace = verification.documents
        .filter(doc => doc.verified && ['aadhaar', 'driving_license', 'passport'].includes(doc.type))
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];

      if (!documentWithFace) {
        return NextResponse.json({
          success: false,
          error: 'No verified document with photo found for face matching'
        }, { status: 400 });
      }

      // Perform face matching
      console.log('Performing face matching...');
      const faceMatchResult = await compareFaces(
        uploadResult.url,
        documentWithFace.fileUrl,
        70 // 70% similarity threshold
      );

      // Update verification record
      verification.selfie = {
        fileUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        uploadedAt: new Date(),
        faceMatching: {
          similarity: faceMatchResult.similarity || 0,
          threshold: 70,
          matched: faceMatchResult.match || false,
          matchedWith: documentWithFace.type,
          processedAt: new Date()
        }
      };

      // Update face match score
      verification.scores.faceMatchScore = faceMatchResult.similarity || 0;

      // Update status based on results
      if (faceMatchResult.match) {
        verification.status = 'verified';
      } else {
        verification.status = 'processing'; // May need manual review
      }

      // Add history entry
      verification.addHistory('selfie_upload', {
        similarity: faceMatchResult.similarity,
        matched: faceMatchResult.match,
        livenessScore: livenessResult.score,
        qualityScore: qualityValidation.score,
        documentType: documentWithFace.type
      });

      await verification.save();

      return NextResponse.json({
        success: true,
        message: faceMatchResult.match
          ? 'Selfie uploaded and face matching successful!'
          : 'Selfie uploaded but face matching failed. Manual review may be required.',
        data: {
          verificationId: verification._id,
          selfie: {
            url: uploadResult.url,
            faceMatching: {
              similarity: faceMatchResult.similarity,
              matched: faceMatchResult.match,
              threshold: 70,
              matchedWith: documentWithFace.type
            },
            quality: qualityValidation,
            liveness: livenessResult
          },
          verification: {
            status: verification.status,
            verificationLevel: verification.verificationLevel,
            faceMatchScore: verification.scores.faceMatchScore,
            overallScore: verification.scores.overallScore,
            progress: verification.progress
          },
          nextStep: faceMatchResult.match ? 'complete' : 'manual_review'
        }
      });

    } catch (processingError) {
      console.error('Selfie processing error:', processingError);
      return NextResponse.json({
        success: false,
        error: 'Failed to process selfie'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Selfie upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during selfie upload'
    }, { status: 500 });
  }
}

// Get selfie verification status
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

    if (!verification || !verification.selfie.fileUrl) {
      return NextResponse.json({
        success: true,
        data: {
          selfieUploaded: false,
          status: 'not_uploaded'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        selfieUploaded: true,
        url: verification.selfie.fileUrl,
        faceMatching: verification.selfie.faceMatching,
        uploadedAt: verification.selfie.uploadedAt,
        status: verification.status,
        faceMatchScore: verification.scores.faceMatchScore
      }
    });

  } catch (error) {
    console.error('Get selfie status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error while fetching selfie status'
    }, { status: 500 });
  }
}