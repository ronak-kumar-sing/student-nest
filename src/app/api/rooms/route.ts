import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Room from '@/lib/models/Room';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Sample rooms data for when database is empty
const sampleRooms = [
  {
    id: '1',
    title: 'Cozy Single Room near IIT Delhi',
    description: 'Perfect for students with all modern amenities and excellent connectivity.',
    price: 8000,
    images: ['/api/placeholder/800/600'],
    roomType: 'single',
    accommodationType: 'pg',
    rating: 4.5,
    totalReviews: 23,
    amenities: ['wifi', 'ac', 'powerBackup', 'security', 'laundry'],
    location: {
      address: 'Hauz Khas',
      city: 'Delhi',
      coordinates: { lat: 28.5494, lng: 77.1926 },
    },
    features: {
      area: 120,
      furnished: true,
      balcony: false,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date().toISOString().split('T')[0],
    },
    owner: {
      name: 'Rajesh Kumar',
      verified: true,
      rating: 4.7,
      responseRate: 95,
    },
    occupancyRate: 80,
    isAvailable: true,
  },
  {
    id: '2',
    title: 'Shared Room - Budget Friendly',
    description: 'Affordable shared accommodation with good facilities near metro station.',
    price: 6000,
    images: ['/api/placeholder/800/600'],
    roomType: 'shared',
    accommodationType: 'pg',
    rating: 4.2,
    totalReviews: 15,
    amenities: ['wifi', 'security', 'housekeeping', 'laundry'],
    location: {
      address: 'Mukherjee Nagar',
      city: 'Delhi',
      coordinates: { lat: 28.7041, lng: 77.2025 },
    },
    features: {
      area: 150,
      furnished: true,
      balcony: true,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date().toISOString().split('T')[0],
    },
    owner: {
      name: 'Priya Sharma',
      verified: true,
      rating: 4.5,
      responseRate: 88,
    },
    occupancyRate: 60,
    isAvailable: true,
  },
  {
    id: '3',
    title: 'Spacious Studio Apartment',
    description: 'Modern studio apartment with all amenities and 24/7 security.',
    price: 12000,
    images: ['/api/placeholder/800/600'],
    roomType: 'studio',
    accommodationType: 'apartment',
    rating: 4.8,
    totalReviews: 31,
    amenities: ['wifi', 'ac', 'powerBackup', 'security', 'gym', 'parking'],
    location: {
      address: 'Sector 62',
      city: 'Noida',
      coordinates: { lat: 28.6260, lng: 77.3631 },
    },
    features: {
      area: 250,
      furnished: true,
      balcony: true,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date().toISOString().split('T')[0],
    },
    owner: {
      name: 'Amit Patel',
      verified: true,
      rating: 4.9,
      responseRate: 98,
    },
    occupancyRate: 90,
    isAvailable: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    // City filter
    const city = searchParams.get('city');
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }

    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Room type filter
    const roomType = searchParams.get('roomType');
    if (roomType) {
      filter.roomType = roomType;
    }

    // Accommodation type filter
    const accommodationType = searchParams.get('accommodationType');
    if (accommodationType) {
      filter.accommodationType = accommodationType;
    }

    // Amenities filter
    const amenities = searchParams.get('amenities');
    if (amenities) {
      filter.amenities = { $in: amenities.split(',') };
    }

    // Rating filter
    const minRating = searchParams.get('minRating');
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Area filter
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    if (minArea || maxArea) {
      filter['features.area'] = {};
      if (minArea) filter['features.area'].$gte = parseInt(minArea);
      if (maxArea) filter['features.area'].$lte = parseInt(maxArea);
    }

    // Available from date filter
    const availableFrom = searchParams.get('availableFrom');
    if (availableFrom) {
      filter['availability.availableFrom'] = { $lte: new Date(availableFrom) };
    }

    // Gender preference filter
    const genderPreference = searchParams.get('genderPreference');
    if (genderPreference) {
      filter['rules.genderPreference'] = genderPreference;
    }

    // Furnished filter
    const furnished = searchParams.get('furnished');
    if (furnished === 'true' || furnished === 'false') {
      filter['features.furnished'] = furnished === 'true';
    }

    // Only show active and available rooms by default
    filter.status = 'active';
    filter['availability.isAvailable'] = true;

    // Search functionality
    const search = searchParams.get('search');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') },
      ];
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    const sortBy = searchParams.get('sortBy');
    if (sortBy === 'price_asc') {
      sort = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sort = { price: -1 };
    } else if (sortBy === 'rating') {
      sort = { rating: -1 };
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    }

    // Get total count
    const total = await Room.countDocuments(filter);

    // If no rooms found, return sample data
    if (total === 0) {
      return NextResponse.json({
        success: true,
        data: sampleRooms,
        pagination: {
          page,
          limit,
          total: sampleRooms.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
        filters: {
          city,
          minPrice,
          maxPrice,
          roomType,
          accommodationType,
          amenities: amenities?.split(','),
          minRating,
          minArea,
          maxArea,
          availableFrom,
          genderPreference,
          furnished,
          search,
          sortBy,
        },
      });
    }

    // Fetch rooms with owner information
    const rooms = await Room.find(filter)
      .populate('owner', 'fullName email phone profilePhoto isVerified averageRating responseRate')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Format response
    const formattedRooms = rooms.map((room: any) => ({
      id: room._id,
      title: room.title,
      description: room.description,
      price: room.price,
      images: room.images,
      roomType: room.roomType,
      accommodationType: room.accommodationType,
      rating: room.rating,
      totalReviews: room.totalReviews,
      amenities: room.amenities,
      location: {
        address: room.location.address,
        city: room.location.city,
        coordinates: room.location.coordinates,
      },
      features: room.features,
      availability: room.availability,
      owner: {
        name: room.owner?.fullName,
        verified: room.owner?.isVerified,
        rating: room.owner?.averageRating || 0,
        responseRate: room.owner?.responseRate || 0,
      },
      occupancyRate: Math.round((room.occupiedRooms / room.totalRooms) * 100) || 0,
      isAvailable: room.availability.isAvailable,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: formattedRooms,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        city,
        minPrice,
        maxPrice,
        roomType,
        accommodationType,
        amenities: amenities?.split(','),
        minRating,
        minArea,
        maxArea,
        availableFrom,
        genderPreference,
        furnished,
        search,
        sortBy,
      },
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch rooms',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = await verifyAccessToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'roomType', 'accommodationType', 'location', 'securityDeposit'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    // Verify owner exists and has owner role
    const owner = await User.findById(decoded.userId);
    if (!owner || owner.role !== 'owner') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only owners can create room listings',
        },
        { status: 403 }
      );
    }

    // Create room
    const room = await Room.create({
      ...body,
      owner: decoded.userId,
      status: 'active', // Auto-approve and activate for testing
    });

    // Update owner's property count (if owner type has properties field)
    if (owner.role === 'owner' && 'properties' in owner) {
      const ownerData = owner as any;
      ownerData.properties = ownerData.properties || [];
      if (room._id) {
        ownerData.properties.push(String(room._id));
      }
      await owner.save();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          roomId: room._id,
          status: room.status,
        },
        message: 'Room created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create room',
      },
      { status: 500 }
    );
  }
}
