import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Helper function to verify JWT token and get user
async function getAuthenticatedUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header found' };
    }

    const token = authHeader.substring(7);

    // Use the same JWT verification as the main auth system
    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
      return { error: 'Invalid token payload' };
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { error: 'User not found' };
    }

    // Check if user account is active
    if (!user.isActive) {
      return { error: 'User account is inactive' };
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.message.includes('expired')) {
      return { error: 'Token expired' };
    }
    return { error: 'Invalid or expired token' };
  }
}

// Helper function to validate file type and size
function validateFile(file, type) {
  const allowedImageTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',');
  const allowedVideoTypes = (process.env.ALLOWED_VIDEO_TYPES || 'video/mp4,video/webm,video/quicktime').split(',');

  const maxImageSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
  const maxVideoSize = parseInt(process.env.MAX_VIDEO_SIZE || '104857600'); // 100MB

  if (type === 'image') {
    if (!allowedImageTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid image type. Allowed types: ${allowedImageTypes.join(', ')}`
      };
    }

    if (file.size > maxImageSize) {
      return {
        valid: false,
        error: `Image size too large. Maximum size: ${(maxImageSize / 1024 / 1024).toFixed(1)}MB`
      };
    }
  } else if (type === 'video') {
    if (!allowedVideoTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid video type. Allowed types: ${allowedVideoTypes.join(', ')}`
      };
    }

    if (file.size > maxVideoSize) {
      return {
        valid: false,
        error: `Video size too large. Maximum size: ${(maxVideoSize / 1024 / 1024).toFixed(1)}MB`
      };
    }
  }

  return { valid: true };
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
    const file = formData.get('file');
    const uploadType = formData.get('type') || 'image'; // 'image' or 'video'
    const folder = formData.get('folder') || 'general';
    const width = formData.get('width') ? parseInt(formData.get('width')) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height')) : undefined;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file, uploadType);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    let uploadResult;
    const uploadOptions = {
      folder: `student-nest/${folder}/${user._id}`,
      tags: [folder, 'user-upload', user.role],
    };

    if (width) uploadOptions.width = width;
    if (height) uploadOptions.height = height;

    if (uploadType === 'image') {
      uploadResult = await uploadImage(`data:${file.type};base64,${buffer.toString('base64')}`, uploadOptions);
    } else if (uploadType === 'video') {
      uploadResult = await uploadVideo(`data:${file.type};base64,${buffer.toString('base64')}`, uploadOptions);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid upload type. Use "image" or "video"'
      }, { status: 400 });
    }

    if (!uploadResult.success) {
      return NextResponse.json({
        success: false,
        error: uploadResult.error || 'Upload failed'
      }, { status: 500 });
    }

    // Log upload activity
    console.log(`File uploaded successfully:`, {
      userId: user._id,
      type: uploadType,
      folder,
      publicId: uploadResult.publicId,
      size: uploadResult.size,
    });

    return NextResponse.json({
      success: true,
      message: `${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully`,
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.size,
        duration: uploadResult.duration, // Only for videos
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during upload'
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    const resourceType = searchParams.get('resourceType') || 'image';

    if (!publicId) {
      return NextResponse.json({
        success: false,
        error: 'Public ID is required'
      }, { status: 400 });
    }

    // Verify that the publicId belongs to the user (security check)
    if (!publicId.includes(user._id.toString())) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to delete this file'
      }, { status: 403 });
    }

    const { deleteFile } = await import('@/lib/cloudinary');
    const deleteResult = await deleteFile(publicId, resourceType);

    if (!deleteResult.success) {
      return NextResponse.json({
        success: false,
        error: deleteResult.error || 'Delete failed'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during delete'
    }, { status: 500 });
  }
}