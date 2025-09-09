import { NextResponse } from 'next/server';
import { notificationPreferencesSchema } from '@/lib/validation/profileSchemas';

// Mock database
let userSettings = [
  {
    userId: 1,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    meetingReminders: true,
    propertyUpdates: true,
    messageNotifications: true,
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(request) {
  try {
    const userId = 1; // Mock user ID

    const settings = userSettings.find(s => s.userId === userId);

    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: false,
        meetingReminders: true,
        propertyUpdates: true,
        messageNotifications: true,
      };

      return NextResponse.json({
        success: true,
        data: defaultSettings
      });
    }

    return NextResponse.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const userId = 1; // Mock user ID

    // Validate input
    const validatedData = notificationPreferencesSchema.parse(body);

    // Find and update settings
    const settingsIndex = userSettings.findIndex(s => s.userId === userId);

    if (settingsIndex === -1) {
      // Create new settings
      const newSettings = {
        userId,
        ...validatedData,
        updatedAt: new Date().toISOString()
      };
      userSettings.push(newSettings);
    } else {
      // Update existing settings
      userSettings[settingsIndex] = {
        ...userSettings[settingsIndex],
        ...validatedData,
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({
      success: true,
      data: validatedData,
      message: 'Notification preferences updated successfully'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
