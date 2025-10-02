import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';
import { uploadImage } from '@/lib/cloudinary';
import { extractTextFromDocument, parseGovernmentID, validateDocumentData } from '@/lib/utils/ocr';

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
    const file = formData.get('document');
    const documentType = formData.get('documentType') || 'auto-detect';

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Document file is required'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Only JPEG, PNG, WebP images and PDF files are allowed'
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'File size must be less than 10MB'
      }, { status: 400 });
    }

    try {
      // Convert file to buffer for upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload to Cloudinary
      console.log('Uploading document to Cloudinary...');
      const uploadResult = await uploadImage(base64Data, {
        folder: `student-nest/documents/${user._id}`,
        tags: ['document', 'verification', documentType],
      });

      if (!uploadResult.success) {
        return NextResponse.json({
          success: false,
          error: uploadResult.error || 'Failed to upload document'
        }, { status: 500 });
      }

      // Extract text using OCR
      console.log('Extracting text from document...');
      const ocrResult = await extractTextFromDocument(`${uploadResult.url}?type=${documentType}`);

      if (!ocrResult.success) {
        return NextResponse.json({
          success: false,
          error: 'Failed to extract text from document. Please ensure the document is clear and readable.'
        }, { status: 400 });
      }

      // Parse document data
      console.log('Parsing document data...');
      const parsedData = parseGovernmentID(ocrResult.text);

      // Ensure the parsed document type matches the selected type
      parsedData.type = documentType;

      // Validate extracted data
      const validation = validateDocumentData(parsedData);

      // Find or create verification record
      let verification = await Verification.findOne({ userId: user._id });

      if (!verification) {
        verification = new Verification({
          userId: user._id,
          status: 'pending'
        });
      }

      // Add document to verification record
      const documentRecord = {
        type: parsedData.type || documentType,
        fileUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        extractedData: {
          name: parsedData.name,
          documentNumber: parsedData.aadhaarNumber || parsedData.panNumber || parsedData.licenseNumber,
          dateOfBirth: parsedData.dateOfBirth,
          address: parsedData.address,
          confidence: parsedData.confidence
        },
        ocrText: ocrResult.text,
        uploadedAt: new Date(),
        verified: validation.isValid
      };

      // Remove existing document of same type
      verification.documents = verification.documents.filter(
        doc => doc.type !== documentRecord.type
      );

      verification.documents.push(documentRecord);

      // Update document score
      verification.scores.documentScore = Math.max(
        verification.scores.documentScore,
        validation.score
      );

      // Update status
      verification.status = 'document_uploaded';

      // Add history entry
      verification.addHistory('document_upload', {
        documentType: documentRecord.type,
        confidence: parsedData.confidence,
        validationScore: validation.score,
        isValid: validation.isValid
      });

      await verification.save();

      return NextResponse.json({
        success: true,
        message: 'Document uploaded and processed successfully',
        data: {
          verificationId: verification._id,
          document: {
            type: documentRecord.type,
            url: uploadResult.url,
            extractedData: parsedData,
            validation: validation,
            ocrConfidence: ocrResult.confidence
          },
          verification: {
            status: verification.status,
            documentScore: verification.scores.documentScore,
            progress: verification.progress
          },
          nextStep: 'selfie_upload'
        }
      });

    } catch (uploadError) {
      console.error('Document processing error:', uploadError);
      return NextResponse.json({
        success: false,
        error: 'Failed to process document'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during document upload'
    }, { status: 500 });
  }
}

// Get uploaded documents
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
          documents: [],
          status: 'not_started'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        documents: verification.documents.map(doc => ({
          type: doc.type,
          url: doc.fileUrl,
          extractedData: doc.extractedData,
          verified: doc.verified,
          uploadedAt: doc.uploadedAt
        })),
        status: verification.status,
        documentScore: verification.scores.documentScore
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error while fetching documents'
    }, { status: 500 });
  }
}