import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/utils/jwt';

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

    if (user.role?.toLowerCase() !== 'owner') {
      return { error: 'Unauthorized: Owner access required' };
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
    console.log('🏠 Property posting API called');

    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const propertyData = await request.json();
    console.log('Property data received:', {
      title: propertyData.title,
      propertyType: propertyData.propertyType,
      city: propertyData.city,
      monthlyRent: propertyData.monthlyRent,
      amenitiesCount: propertyData.amenities?.length || 0,
      imagesCount: propertyData.images?.length || 0
    });

    // TODO: Replace with actual property creation in database
    // For now, we'll simulate the creation process

    // Validate required fields
    const requiredFields = ['title', 'propertyType', 'address', 'city', 'monthlyRent', 'securityDeposit'];
    const missingFields = requiredFields.filter(field => !propertyData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Simulate property creation
    const mockProperty = {
      id: `prop_${Date.now()}`,
      title: propertyData.title,
      description: propertyData.description,
      propertyType: propertyData.propertyType,
      address: propertyData.address,
      city: propertyData.city,
      state: propertyData.state,
      pincode: propertyData.pincode,
      landmark: propertyData.landmark,
      monthlyRent: parseFloat(propertyData.monthlyRent),
      securityDeposit: parseFloat(propertyData.securityDeposit),
      maintenanceCharges: parseFloat(propertyData.maintenanceCharges || 0),
      totalRooms: parseInt(propertyData.totalRooms || 1),
      availableRooms: parseInt(propertyData.availableRooms || 1),
      amenities: propertyData.amenities || [],
      rules: propertyData.rules || [],
      preferredTenants: propertyData.preferredTenants,
      gender: propertyData.gender,
      occupancyType: propertyData.occupancyType,
      bathroomType: propertyData.bathroomType,
      furnishingStatus: propertyData.furnishingStatus,
      electricityCharges: propertyData.electricityCharges,
      imagesCount: propertyData.images?.length || 0,
      ownerId: user._id,
      ownerName: user.fullName,
      ownerPhone: user.phone,
      ownerEmail: user.email,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('✅ Mock property created successfully');

    return NextResponse.json({
      success: true,
      message: 'Property posted successfully!',
      data: {
        property: mockProperty,
        listingUrl: `/properties/${mockProperty.id}`,
        dashboardUrl: '/owner/properties'
      }
    });

  } catch (error) {
    console.error('Error posting property:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to post property: ' + error.message
    }, { status: 500 });
  }
}