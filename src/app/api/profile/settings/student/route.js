import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Student from '@/lib/models/Student';
import { verifyAccessToken } from '@/lib/utils/jwt';

// GET /api/profile/settings/student - Get student settings
export async function GET(request) {
  try {
    // Get and verify JWT token
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Access token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the student
    const student = await Student.findById(payload.userId);
    if (!student) {
      return NextResponse.json(
        { error: 'User not found', message: 'Student account not found' },
        { status: 404 }
      );
    }

    if (student.role !== 'student') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only students can access these settings' },
        { status: 403 }
      );
    }

    // Return current settings or defaults if not set
    const settings = student.settings || {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      roomRecommendations: true,
      profileVisibility: 'public',
      showContactInfo: false,
      allowMessages: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings retrieved successfully'
    });
  } catch (error) {
    console.error('Get student settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

// PUT /api/profile/settings/student - Update student settings
export async function PUT(request) {
  try {
    // Get and verify JWT token
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Access token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const settingsUpdate = await request.json();

    // Connect to database
    await connectDB();

    // Find the student
    const student = await Student.findById(payload.userId);
    if (!student) {
      return NextResponse.json(
        { error: 'User not found', message: 'Student account not found' },
        { status: 404 }
      );
    }

    if (student.role !== 'student') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only students can update these settings' },
        { status: 403 }
      );
    }

    // Update settings
    const currentSettings = student.settings || {};
    const updatedSettings = { ...currentSettings, ...settingsUpdate };

    // Save to database
    student.settings = updatedSettings;
    await student.save();

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update student settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
