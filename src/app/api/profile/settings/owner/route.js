import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Owner from '@/lib/models/Owner';
import { verifyAccessToken } from '@/lib/utils/jwt';

// GET /api/profile/settings/owner - Get owner settings
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

    // Find the owner
    const owner = await Owner.findById(payload.userId);
    if (!owner) {
      return NextResponse.json(
        { error: 'User not found', message: 'Owner account not found' },
        { status: 404 }
      );
    }

    if (owner.role !== 'owner') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only owners can access these settings' },
        { status: 403 }
      );
    }

    // Return current settings or defaults if not set
    const settings = owner.settings || {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      bookingNotifications: true,
      inquiryNotifications: true,
      paymentNotifications: true,
      profileVisibility: 'public',
      showContactInfo: true,
      allowMessages: true,
      autoReply: false,
      instantBooking: false,
      showPricing: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings retrieved successfully'
    });
  } catch (error) {
    console.error('Get owner settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

// PUT /api/profile/settings/owner - Update owner settings
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

    // Find the owner
    const owner = await Owner.findById(payload.userId);
    if (!owner) {
      return NextResponse.json(
        { error: 'User not found', message: 'Owner account not found' },
        { status: 404 }
      );
    }

    if (owner.role !== 'owner') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only owners can update these settings' },
        { status: 403 }
      );
    }

    // Update settings
    const currentSettings = owner.settings || {};
    const updatedSettings = { ...currentSettings, ...settingsUpdate };

    // Save to database
    owner.settings = updatedSettings;
    await owner.save();

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update owner settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
