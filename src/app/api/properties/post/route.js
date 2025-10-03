import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Room from '@/lib/models/Room';
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

    await connectDB();

    // Validate required fields
    const requiredFields = ['title', 'address', 'city', 'monthlyRent'];
    const missingFields = requiredFields.filter(field => !propertyData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Create new room/property
    const newRoom = new Room({
      title: propertyData.title,
      description: propertyData.description || '',
      price: parseFloat(propertyData.monthlyRent),
      securityDeposit: parseFloat(propertyData.securityDeposit || 0),
      roomType: propertyData.occupancyType || 'single',
      accommodationType: propertyData.propertyType || 'pg',

      location: {
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state || '',
        pincode: propertyData.pincode || '',
        landmark: propertyData.landmark || '',
        fullAddress: `${propertyData.address}, ${propertyData.city}${propertyData.state ? ', ' + propertyData.state : ''}`,
        coordinates: {
          lat: 0, // TODO: Get coordinates from address
          lng: 0
        }
      },

      amenities: propertyData.amenities || [],

      features: {
        area: parseInt(propertyData.roomSize || 100),
        floor: 1,
        totalFloors: 3,
        furnished: propertyData.furnishingStatus !== 'unfurnished',
        balcony: false,
        attached_bathroom: propertyData.bathroomType === 'attached'
      },

      images: propertyData.images || [],

      availability: {
        isAvailable: true,
        availableFrom: propertyData.availableFrom ? new Date(propertyData.availableFrom) : new Date(),
        maxOccupancy: parseInt(propertyData.totalRooms || 1)
      },

      totalRooms: parseInt(propertyData.totalRooms || 1),
      occupiedRooms: 0,

      owner: user._id,
      status: 'active',

      // Additional metadata
      rules: propertyData.rules || [],
      preferredTenants: propertyData.preferredTenants || 'any',
      gender: propertyData.gender || 'any',

      // Contact details
      contact: {
        name: propertyData.contactName || user.fullName,
        phone: propertyData.contactPhone || user.phone,
        email: propertyData.contactEmail || user.email
      }
    });

    const savedRoom = await newRoom.save();

    console.log('✅ Property created successfully:', {
      id: savedRoom._id,
      title: savedRoom.title,
      city: savedRoom.location.city,
      rent: savedRoom.price
    });

    return NextResponse.json({
      success: true,
      message: 'Property posted successfully! Your listing is now live.',
      data: {
        property: {
          _id: savedRoom._id,
          title: savedRoom.title,
          description: savedRoom.description,
          price: savedRoom.price,
          location: savedRoom.location,
          roomType: savedRoom.roomType,
          accommodationType: savedRoom.accommodationType,
          amenities: savedRoom.amenities,
          images: savedRoom.images,
          availability: savedRoom.availability,
          status: savedRoom.status,
          createdAt: savedRoom.createdAt
        },
        listingUrl: `/rooms/${savedRoom._id}`,
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