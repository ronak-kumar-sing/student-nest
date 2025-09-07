import { NextResponse } from 'next/server';

// Mock student settings data
const mockStudentSettings = {
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

// GET /api/profile/settings/student - Get student settings
export async function GET(request) {
  try {
    // In production, get settings from database based on authenticated user
    return NextResponse.json({
      success: true,
      data: mockStudentSettings,
      message: 'Settings retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

// PUT /api/profile/settings/student - Update student settings
export async function PUT(request) {
  try {
    const settings = await request.json();

    // In production, validate settings and update in database

    return NextResponse.json({
      success: true,
      data: { ...mockStudentSettings, ...settings },
      message: 'Settings updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
