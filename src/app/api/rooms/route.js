import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Room from '@/lib/models/Room';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Build filter query
    const filters = { status: 'active', 'availability.isAvailable': true };

    // Location filters
    const city = searchParams.get('city');
    if (city) {
      filters['location.city'] = new RegExp(city, 'i');
    }

    // Price filters
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }

    // Room type filter
    const roomType = searchParams.get('roomType');
    if (roomType) {
      filters.roomType = roomType;
    }

    // Accommodation type filter
    const accommodationType = searchParams.get('accommodationType');
    if (accommodationType) {
      filters.accommodationType = accommodationType;
    }

    // Amenities filter
    const amenities = searchParams.get('amenities');
    if (amenities) {
      const amenityList = amenities.split(',');
      filters.amenities = { $in: amenityList };
    }

    // Rating filter
    const minRating = searchParams.get('rating');
    if (minRating) {
      filters.rating = { $gte: parseFloat(minRating) };
    }

    // Area filter
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    if (minArea || maxArea) {
      filters['features.area'] = {};
      if (minArea) filters['features.area'].$gte = parseInt(minArea);
      if (maxArea) filters['features.area'].$lte = parseInt(maxArea);
    }

    // Availability date filter
    const availableFrom = searchParams.get('availableFrom');
    if (availableFrom) {
      filters['availability.availableFrom'] = { $lte: new Date(availableFrom) };
    }

    // Gender preference filter
    const genderPreference = searchParams.get('genderPreference');
    if (genderPreference) {
      filters['rules.genderPreference'] = { $in: ['any', genderPreference] };
    }

    // Furnished filter
    const furnished = searchParams.get('furnished');
    if (furnished === 'true') {
      filters['features.furnished'] = true;
    } else if (furnished === 'false') {
      filters['features.furnished'] = false;
    }

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, totalReviews: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { [sortBy]: sortOrder };
    }

    // Search by text
    const search = searchParams.get('search');
    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    // Execute query
    const [rooms, totalCount] = await Promise.all([
      Room.find(filters)
        .populate('owner', 'fullName isVerified averageRating responseRate')
        .select('-ownerNotes -adminNotes')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Room.countDocuments(filters)
    ]);

    // Format response
    const formattedRooms = rooms.map(room => ({
      id: room._id,
      title: room.title,
      description: room.description,
      price: room.price,
      images: room.images || ['/api/placeholder/400/300'],
      roomType: room.roomType,
      accommodationType: room.accommodationType,
      rating: room.rating || 0,
      totalReviews: room.totalReviews || 0,
      amenities: room.amenities || [],
      location: {
        address: room.location?.address,
        city: room.location?.city,
        coordinates: room.location?.coordinates
      },
      features: {
        area: room.features?.area,
        furnished: room.features?.furnished,
        balcony: room.features?.balcony
      },
      availability: room.availability,
      owner: {
        name: room.owner?.fullName,
        verified: room.owner?.isVerified || false,
        rating: room.owner?.averageRating || 0,
        responseRate: room.owner?.responseRate || 0
      },
      occupancyRate: Math.round((room.occupiedRooms / room.totalRooms) * 100) || 0,
      isAvailable: room.availability?.isAvailable && room.occupiedRooms < room.totalRooms
    }));

    // Pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        rooms: formattedRooms,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        },
        filters: {
          city,
          minPrice,
          maxPrice,
          roomType,
          accommodationType,
          amenities: amenities ? amenities.split(',') : [],
          minRating,
          search
        }
      }
    });

  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch rooms'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'roomType', 'accommodationType', 'location', 'owner'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Verify owner exists and is an owner
    const owner = await User.findById(body.owner);
    if (!owner) {
      return NextResponse.json({
        success: false,
        error: 'Owner not found'
      }, { status: 404 });
    }

    if (owner.role !== 'owner' && owner.role !== 'Owner') {
      return NextResponse.json({
        success: false,
        error: 'User is not an owner'
      }, { status: 403 });
    }

    // Create room data
    const roomData = {
      title: body.title,
      description: body.description,
      fullDescription: body.fullDescription,
      price: body.price,
      images: body.images || [],
      roomType: body.roomType,
      accommodationType: body.accommodationType,
      maxSharingCapacity: body.maxSharingCapacity || 1,

      features: {
        area: body.features?.area || 100,
        floor: body.features?.floor || 1,
        totalFloors: body.features?.totalFloors || 3,
        furnished: body.features?.furnished ?? true,
        balcony: body.features?.balcony ?? false,
        attached_bathroom: body.features?.attached_bathroom ?? true
      },

      location: {
        address: body.location.address,
        fullAddress: body.location.fullAddress || body.location.address,
        city: body.location.city,
        state: body.location.state || '',
        pincode: body.location.pincode || '',
        coordinates: body.location.coordinates || { lat: 0, lng: 0 },
        nearbyUniversities: body.location.nearbyUniversities || [],
        nearbyFacilities: body.location.nearbyFacilities || []
      },

      amenities: body.amenities || [],
      detailedAmenities: body.detailedAmenities || body.amenities || [],

      availability: {
        isAvailable: body.availability?.isAvailable ?? true,
        availableFrom: body.availability?.availableFrom || new Date()
      },

      owner: body.owner,

      securityDeposit: body.securityDeposit || body.price,
      maintenanceCharges: body.maintenanceCharges || 0,
      electricityCharges: body.electricityCharges || 'included',

      rules: {
        guestsAllowed: body.rules?.guestsAllowed ?? true,
        smokingAllowed: body.rules?.smokingAllowed ?? false,
        alcoholAllowed: body.rules?.alcoholAllowed ?? false,
        petsAllowed: body.rules?.petsAllowed ?? false,
        genderPreference: body.rules?.genderPreference || 'any',
        curfewTime: body.rules?.curfewTime || 'No Curfew'
      },

      totalRooms: body.totalRooms || 1,
      tags: body.tags || [],

      status: 'pending' // Admin approval required
    };

    // Create room
    const room = new Room(roomData);
    await room.save();

    // Update owner's property count
    await User.findByIdAndUpdate(body.owner, {
      $inc: { 'totalProperties': 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Room created successfully and is pending approval',
      data: {
        roomId: room._id,
        status: room.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create room'
    }, { status: 500 });
  }
}