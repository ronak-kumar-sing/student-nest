import { NextResponse } from 'next/server';

// Mock owner business data
const mockOwnerBusiness = {
  businessName: 'Patel Properties & Accommodations',
  businessType: 'Property Management Company',
  gstNumber: '29ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  experience: '8',
  businessDescription: 'Leading property management company specializing in student accommodations across Delhi NCR. We provide safe, comfortable, and affordable housing solutions with modern amenities.',
  businessAddress: 'Shop No. 15, Sector 18, Noida, Uttar Pradesh 201301',
  businessPhone: '+91 8765432108',
  businessEmail: 'business@patelproperties.com',
  websiteUrl: 'https://patelproperties.com',
  socialMedia: {
    facebook: 'https://facebook.com/patelproperties',
    instagram: 'https://instagram.com/patelproperties',
    linkedin: 'https://linkedin.com/company/patel-properties'
  },
  totalProperties: 15,
  averageRating: 4.3,
  totalBookings: 78
};

// GET /api/profile/owner/business - Get owner business info
export async function GET(request) {
  try {
    // In production, get business info from database based on authenticated user
    return NextResponse.json({
      success: true,
      data: mockOwnerBusiness,
      message: 'Business information retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve business information' },
      { status: 500 }
    );
  }
}

// PUT /api/profile/owner/business - Update owner business info
export async function PUT(request) {
  try {
    const businessData = await request.json();

    // In production, validate business data and update in database

    return NextResponse.json({
      success: true,
      data: { ...mockOwnerBusiness, ...businessData },
      message: 'Business information updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update business information' },
      { status: 500 }
    );
  }
}
