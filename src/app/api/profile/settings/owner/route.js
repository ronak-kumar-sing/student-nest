import { NextResponse } from 'next/server';

// Mock owner settings data
const mockOwnerSettings = {
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

// GET /api/profile/settings/owner - Get owner settings
export async function GET(request) {
  try {
    // In production, get settings from database based on authenticated user
    return NextResponse.json({
      success: true,
      data: mockOwnerSettings,
      message: 'Settings retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

// PUT /api/profile/settings/owner - Update owner settings
export async function PUT(request) {
  try {
    const settings = await request.json();

    // In production, validate settings and update in database

    return NextResponse.json({
      success: true,
      data: { ...mockOwnerSettings, ...settings },
      message: 'Settings updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
