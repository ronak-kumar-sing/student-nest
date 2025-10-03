import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Review from '@/lib/models/Review';
import Room from '@/lib/models/Room';
import User from '@/lib/models/User';
import Booking from '@/lib/models/Booking';
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

// POST: Submit a new review
export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['propertyId', 'overallRating', 'categories', 'stayDuration'];
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
        error: 'Only students can submit reviews'
      }, { status: 403 });
    }

    // Verify property exists
    const property = await Room.findById(body.propertyId);
    if (!property) {
      return NextResponse.json({
        success: false,
        error: 'Property not found'
      }, { status: 404 });
    }

    // Check if student has a completed booking for this property
    let booking = null;
    if (body.bookingId) {
      booking = await Booking.findOne({
        _id: body.bookingId,
        student: decoded.userId || decoded.id,
        room: body.propertyId,
        status: 'completed'
      });
    } else {
      // Find any completed booking for this property by the student
      booking = await Booking.findOne({
        student: decoded.userId || decoded.id,
        room: body.propertyId,
        status: 'completed'
      });
    }

    // For now, allow reviews without completed bookings (for demo purposes)
    // In production, you might want to enforce this requirement

    // Check if student has already reviewed this property
    let existingReview;
    if (booking) {
      existingReview = await Review.findOne({
        property: body.propertyId,
        student: decoded.userId || decoded.id,
        booking: booking._id
      });
    } else {
      existingReview = await Review.findOne({
        property: body.propertyId,
        student: decoded.userId || decoded.id
      });
    }

    if (existingReview) {
      return NextResponse.json({
        success: false,
        error: 'You have already reviewed this property'
      }, { status: 409 });
    }

    // Validate rating values
    const { categories } = body;
    const ratingFields = ['cleanliness', 'location', 'facilities', 'owner', 'value'];

    for (const field of ratingFields) {
      if (!categories[field] || categories[field] < 1 || categories[field] > 5) {
        return NextResponse.json({
          success: false,
          error: `Invalid ${field} rating. Must be between 1 and 5`
        }, { status: 400 });
      }
    }

    if (body.overallRating < 1 || body.overallRating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Overall rating must be between 1 and 5'
      }, { status: 400 });
    }

    // Create review data
    const reviewData = {
      property: body.propertyId,
      student: decoded.userId || decoded.id,
      booking: booking?._id,
      overallRating: body.overallRating,
      categories: {
        cleanliness: categories.cleanliness,
        location: categories.location,
        facilities: categories.facilities,
        owner: categories.owner,
        value: categories.value
      },
      comment: body.comment ? body.comment.trim() : '',
      stayDuration: body.stayDuration,
      images: body.images || [],
      isVerified: booking ? true : false // Verified if there's a completed booking
    };

    // Create the review
    const review = new Review(reviewData);
    await review.save();

    // Update booking to mark review as submitted
    if (booking) {
      booking.studentReviewSubmitted = true;
      await booking.save();
    }

    // Populate review for response
    await review.populate([
      {
        path: 'student',
        select: 'fullName profilePhoto'
      },
      {
        path: 'property',
        select: 'title location'
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        reviewId: review._id,
        property: {
          title: review.property.title,
          location: review.property.location
        },
        rating: review.overallRating,
        categories: review.categories,
        isVerified: review.isVerified,
        submittedAt: review.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting review:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to submit review'
    }, { status: 500 });
  }
}

// GET: Fetch reviews (for a property or by a user)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const propertyId = searchParams.get('propertyId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isApproved: true }; // Only show approved reviews

    if (propertyId) {
      query.property = propertyId;
    }

    if (userId) {
      query.student = userId;
    }

    // Rating filter
    const minRating = searchParams.get('minRating');
    if (minRating) {
      query.overallRating = { $gte: parseInt(minRating) };
    }

    // Verified filter
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      query.isVerified = true;
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { overallRating: sortOrder, createdAt: -1 };
        break;
      case 'helpful':
        sortOptions = { helpfulCount: sortOrder, createdAt: -1 };
        break;
      default:
        sortOptions = { [sortBy]: sortOrder };
    }

    // Execute query
    const [reviews, totalCount] = await Promise.all([
      Review.find(query)
        .populate('student', 'fullName profilePhoto')
        .populate('property', 'title location images')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Review.countDocuments(query)
    ]);

    // Format reviews
    const formattedReviews = reviews.map(review => ({
      id: review._id,

      property: propertyId ? undefined : {
        id: review.property._id,
        title: review.property.title,
        location: review.property.location,
        images: review.property.images
      },

      student: {
        id: review.student._id,
        name: review.student.fullName,
        avatar: review.student.profilePhoto
      },

      rating: {
        overall: review.overallRating,
        categories: review.categories
      },

      content: {
        comment: review.comment,
        images: review.images,
        stayDuration: review.stayDuration
      },

      verification: {
        isVerified: review.isVerified,
        hasBooking: !!review.booking
      },

      interaction: {
        helpfulCount: review.helpfulCount,
        flaggedCount: review.flaggedBy?.length || 0
      },

      ownerResponse: review.ownerResponse,

      dates: {
        submitted: review.createdAt,
        formattedDate: review.formattedDate
      }
    }));

    // Calculate statistics if for a property
    let statistics = null;
    if (propertyId) {
      const stats = await Review.aggregate([
        { $match: { property: propertyId, isApproved: true } },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: '$overallRating' },
            averageCleanliness: { $avg: '$categories.cleanliness' },
            averageLocation: { $avg: '$categories.location' },
            averageFacilities: { $avg: '$categories.facilities' },
            averageOwner: { $avg: '$categories.owner' },
            averageValue: { $avg: '$categories.value' },
            ratingDistribution: {
              $push: '$overallRating'
            }
          }
        }
      ]);

      if (stats.length > 0) {
        const stat = stats[0];

        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        stat.ratingDistribution.forEach(rating => {
          distribution[rating] = (distribution[rating] || 0) + 1;
        });

        statistics = {
          totalReviews: stat.totalReviews,
          averageRating: Math.round(stat.averageRating * 10) / 10,
          categoryAverages: {
            cleanliness: Math.round(stat.averageCleanliness * 10) / 10,
            location: Math.round(stat.averageLocation * 10) / 10,
            facilities: Math.round(stat.averageFacilities * 10) / 10,
            owner: Math.round(stat.averageOwner * 10) / 10,
            value: Math.round(stat.averageValue * 10) / 10
          },
          ratingDistribution: distribution
        };
      }
    }

    // Pagination info
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        reviews: formattedReviews,
        statistics,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reviews'
    }, { status: 500 });
  }
}