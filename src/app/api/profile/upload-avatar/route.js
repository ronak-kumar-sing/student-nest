import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/jwt';
import { uploadImage } from '@/lib/cloudinary';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('profilePhoto') || formData.get('avatar');

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed.'
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadImage(file, {
      folder: `student-nest/profile-photos/${decoded.userId}`,
      tags: ['profile', 'avatar', 'user'],
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    if (!uploadResult.success) {
      return NextResponse.json({
        success: false,
        error: uploadResult.error || 'Failed to upload image'
      }, { status: 500 });
    }

    // Update user profile with new photo URL
    await connectDB();
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { profilePhoto: uploadResult.url },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile photo updated successfully',
      data: {
        photoUrl: uploadResult.url,
        publicId: uploadResult.public_id
      }
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}