import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Helper function to verify JWT token and get user
async function getAuthenticatedUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header found' };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return { error: 'Invalid token' };
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { error: 'User not found' };
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
    const file = formData.get('avatar');

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Avatar image is required'
      }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Only JPEG, PNG, WebP files are allowed'
      }, { status: 400 });
    }

    if (file.size > 2000000) { // 2MB
      return NextResponse.json({
        success: false,
        error: 'File size should be less than 2MB'
      }, { status: 400 });
    }

    try {
      // Create upload directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
      await mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.type.split('/')[1];
      const fileName = `avatar-${user._id}-${timestamp}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Generate public URL
      const avatarUrl = `/uploads/avatars/${fileName}`;

      // Update user avatar in database
      user.avatar = avatarUrl;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Avatar updated successfully',
        data: {
          avatarUrl,
          user: user.toPublicProfile()
        }
      });

    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      return NextResponse.json({
        success: false,
        error: 'Failed to upload avatar'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
