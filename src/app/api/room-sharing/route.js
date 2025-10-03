import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import RoomShare from '@/lib/models/RoomShare';
import Room from '@/lib/models/Room';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
async function verifyToken(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// POST: Create a new room sharing request
export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['propertyId', 'maxParticipants', 'description', 'costSharing'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Verify student exists
    const student = await User.findById(decoded.userId || decoded.id);
    if (!student || (student.role !== 'student' && student.role !== 'Student')) {
      return NextResponse.json({
        success: false,
        error: 'Only students can create room sharing requests'
      }, { status: 403 });
    }

    // Verify property exists
    const property = await Room.findById(body.propertyId).populate('owner');
    if (!property) {
      return NextResponse.json({
        success: false,
        error: 'Property not found'
      }, { status: 404 });
    }

    // Check if student already has an active room sharing for this property
    const existingShare = await RoomShare.findOne({
      property: body.propertyId,
      initiator: decoded.userId || decoded.id,
      status: { $in: ['active', 'full'] }
    });

    if (existingShare) {
      return NextResponse.json({
        success: false,
        error: 'You already have an active room sharing for this property'
      }, { status: 409 });
    }

    // Validate cost sharing
    const { costSharing } = body;
    if (!costSharing.monthlyRent || !costSharing.securityDeposit) {
      return NextResponse.json({
        success: false,
        error: 'Monthly rent and security deposit are required in cost sharing'
      }, { status: 400 });
    }

    // Create room sharing data
    const roomShareData = {
      property: body.propertyId,
      initiator: decoded.userId || decoded.id,
      maxParticipants: Math.min(Math.max(body.maxParticipants, 2), 6), // Between 2-6

      requirements: {
        gender: body.requirements?.gender || 'any',
        ageRange: {
          min: body.requirements?.ageRange?.min || 18,
          max: body.requirements?.ageRange?.max || 30
        },
        preferences: body.requirements?.preferences || [],
        lifestyle: body.requirements?.lifestyle || []
      },

      costSharing: {
        monthlyRent: costSharing.monthlyRent,
        rentPerPerson: Math.round(costSharing.monthlyRent / Math.min(Math.max(body.maxParticipants, 2), 6)),
        securityDeposit: costSharing.securityDeposit,
        depositPerPerson: Math.round(costSharing.securityDeposit / Math.min(Math.max(body.maxParticipants, 2), 6)),
        maintenanceCharges: costSharing.maintenanceCharges || 0,
        maintenancePerPerson: Math.round((costSharing.maintenanceCharges || 0) / Math.min(Math.max(body.maxParticipants, 2), 6)),
        utilitiesIncluded: costSharing.utilitiesIncluded ?? true,
        utilitiesPerPerson: costSharing.utilitiesPerPerson || 0
      },

      roomConfiguration: {
        totalBeds: body.roomConfiguration?.totalBeds || 2,
        bedsAvailable: body.roomConfiguration?.bedsAvailable || 1,
        hasPrivateBathroom: body.roomConfiguration?.hasPrivateBathroom || false,
        hasSharedKitchen: body.roomConfiguration?.hasSharedKitchen || true,
        hasStudyArea: body.roomConfiguration?.hasStudyArea || true,
        hasStorage: body.roomConfiguration?.hasStorage || true
      },

      description: body.description.trim(),
      availableFrom: new Date(body.availableFrom || Date.now()),
      availableTill: body.availableTill ? new Date(body.availableTill) : null,

      houseRules: body.houseRules || [],
      compatibilityQuestions: body.compatibilityQuestions || [],

      isOpenToMeetup: body.isOpenToMeetup ?? true,
      meetupPreferences: body.meetupPreferences || ['coffee_chat'],

      tags: body.tags || []
    };

    // Add initiator as first participant
    roomShareData.currentParticipants = [{
      user: decoded.userId || decoded.id,
      joinedAt: new Date(),
      status: 'confirmed',
      sharedAmount: roomShareData.costSharing.rentPerPerson
    }];

    // Create the room sharing
    const roomShare = new RoomShare(roomShareData);
    await roomShare.save();

    // Populate for response
    await roomShare.populate([
      {
        path: 'property',
        select: 'title location images price amenities features',
        populate: {
          path: 'owner',
          select: 'fullName phone email'
        }
      },
      {
        path: 'initiator',
        select: 'fullName profilePhoto'
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Room sharing request created successfully',
      data: {
        roomShareId: roomShare._id,
        status: roomShare.status,
        property: {
          title: roomShare.property.title,
          location: roomShare.property.location,
          images: roomShare.property.images
        },
        sharing: {
          maxParticipants: roomShare.maxParticipants,
          availableSlots: roomShare.availableSlots,
          costPerPerson: roomShare.costSharing.rentPerPerson
        },
        timeline: {
          availableFrom: roomShare.availableFrom,
          availableTill: roomShare.availableTill
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating room sharing:', error);

    // Log validation errors in detail
    if (error.name === 'ValidationError') {
      console.error('Validation Error Details:', JSON.stringify(error.errors, null, 2));
    }

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Return validation error details for debugging
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create room sharing request'
    }, { status: 500 });
  }
}

// GET: Fetch room sharing opportunities
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Build filters
    const filters = { status: 'active' };

    // Location filter
    const city = searchParams.get('city');
    if (city) {
      // We need to populate property to filter by city
      // For now, we'll handle this in the aggregation
    }

    // Budget filter
    const maxBudget = searchParams.get('maxBudget');
    if (maxBudget) {
      filters['costSharing.rentPerPerson'] = { $lte: parseInt(maxBudget) };
    }

    // Gender preference filter
    const gender = searchParams.get('gender');
    if (gender && gender !== 'any') {
      filters['requirements.gender'] = { $in: ['any', gender] };
    }

    // Available slots filter
    const minSlots = searchParams.get('minSlots');

    // Lifestyle preferences
    const lifestyle = searchParams.get('lifestyle');
    if (lifestyle) {
      const lifestyleArray = lifestyle.split(',');
      filters['requirements.lifestyle'] = { $in: lifestyleArray };
    }

    // Move-in date filter
    const moveInDate = searchParams.get('moveInDate');
    if (moveInDate) {
      filters.availableFrom = { $lte: new Date(moveInDate) };
    }

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { 'costSharing.rentPerPerson': 1 };
        break;
      case 'price_desc':
        sortOptions = { 'costSharing.rentPerPerson': -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'slots':
        sortOptions = { maxParticipants: -1 };
        break;
      default:
        sortOptions = { [sortBy]: sortOrder };
    }

    // Use aggregation for complex filtering with populated fields
    let pipeline = [
      { $match: filters },
      {
        $lookup: {
          from: 'rooms',
          localField: 'property',
          foreignField: '_id',
          as: 'property'
        }
      },
      { $unwind: '$property' },
      {
        $lookup: {
          from: 'users',
          localField: 'initiator',
          foreignField: '_id',
          as: 'initiator'
        }
      },
      { $unwind: '$initiator' }
    ];

    // Add city filter if specified
    if (city) {
      pipeline.push({
        $match: {
          'property.location.city': new RegExp(city, 'i')
        }
      });
    }

    // Add available slots filter
    if (minSlots) {
      pipeline.push({
        $addFields: {
          availableSlots: {
            $subtract: [
              '$maxParticipants',
              { $size: { $filter: { input: '$currentParticipants', cond: { $eq: ['$$this.status', 'confirmed'] } } } }
            ]
          }
        }
      });
      pipeline.push({
        $match: {
          availableSlots: { $gte: parseInt(minSlots) }
        }
      });
    }

    // Add sorting and pagination
    pipeline.push({ $sort: sortOptions });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Execute aggregation
    const [roomShares, totalCount] = await Promise.all([
      RoomShare.aggregate(pipeline),
      RoomShare.countDocuments(filters)
    ]);

    // Format room shares
    const formattedShares = roomShares.map(share => {
      const confirmedParticipants = share.currentParticipants.filter(p => p.status === 'confirmed').length;
      const availableSlots = share.maxParticipants - confirmedParticipants;

      return {
        id: share._id,
        status: share.status,

        property: {
          id: share.property._id,
          title: share.property.title,
          location: share.property.location,
          images: share.property.images,
          amenities: share.property.amenities,
          features: share.property.features
        },

        initiator: {
          id: share.initiator._id,
          name: share.initiator.fullName,
          profilePhoto: share.initiator.profilePhoto
        },

        sharing: {
          maxParticipants: share.maxParticipants,
          currentParticipants: confirmedParticipants,
          availableSlots: availableSlots,
          isFull: availableSlots <= 0
        },

        cost: {
          rentPerPerson: share.costSharing.rentPerPerson,
          depositPerPerson: share.costSharing.depositPerPerson,
          maintenancePerPerson: share.costSharing.maintenancePerPerson,
          utilitiesIncluded: share.costSharing.utilitiesIncluded
        },

        requirements: share.requirements,
        roomConfig: share.roomConfiguration,

        timeline: {
          availableFrom: share.availableFrom,
          availableTill: share.availableTill
        },

        description: share.description,
        houseRules: share.houseRules,

        interaction: {
          views: share.views || 0,
          applications: share.applications?.length || 0,
          isOpenToMeetup: share.isOpenToMeetup
        },

        createdAt: share.createdAt
      };
    });

    // Pagination info
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        roomShares: formattedShares,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        },
        filters: {
          city,
          maxBudget,
          gender,
          lifestyle: lifestyle ? lifestyle.split(',') : null,
          moveInDate
        }
      }
    });

  } catch (error) {
    console.error('Error fetching room shares:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch room sharing opportunities'
    }, { status: 500 });
  }
}