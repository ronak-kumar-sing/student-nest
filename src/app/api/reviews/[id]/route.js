import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Review from '@/lib/models/Review';
import User from '@/lib/models/User';
import Room from '@/lib/models/Room';
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

// GET: Get specific review details
export async function GET(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const reviewId = resolvedParams.id;

    if (!reviewId) {
      return NextResponse.json({
        success: false,
        error: 'Review ID is required'
      }, { status: 400 });
    }

    // Find the review
    const review = await Review.findById(reviewId)
      .populate('student', 'fullName profilePhoto email')
      .populate('property', 'title location images owner')
      .populate('booking', 'moveInDate moveOutDate status');

    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    // Format review data
    const reviewData = {
      id: review._id,

      property: {
        id: review.property._id,
        title: review.property.title,
        location: review.property.location,
        images: review.property.images,
        ownerId: review.property.owner
      },

      student: {
        id: review.student._id,
        name: review.student.fullName,
        profilePhoto: review.student.profilePhoto,
        email: review.student.email
      },

      booking: review.booking ? {
        id: review.booking._id,
        moveInDate: review.booking.moveInDate,
        moveOutDate: review.booking.moveOutDate,
        status: review.booking.status
      } : null,

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
        isApproved: review.isApproved,
        moderationNotes: review.moderationNotes
      },

      interaction: {
        helpfulCount: review.helpfulCount,
        helpfulUsers: review.helpfulUsers,
        flaggedBy: review.flaggedBy
      },

      ownerResponse: review.ownerResponse,

      dates: {
        submitted: review.createdAt,
        formattedDate: review.formattedDate
      }
    };

    return NextResponse.json({
      success: true,
      data: reviewData
    });

  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch review'
    }, { status: 500 });
  }
}

// PUT: Update review (mark helpful, flag, owner response)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const reviewId = resolvedParams.id;
    const body = await request.json();

    if (!reviewId) {
      return NextResponse.json({
        success: false,
        error: 'Review ID is required'
      }, { status: 400 });
    }

    // Find the review
    const review = await Review.findById(reviewId)
      .populate('property', 'owner');

    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    const action = body.action;

    switch (action) {
      case 'mark_helpful':
        // Verify authentication for helpful marking
        const decoded = await verifyToken(request);

        if (review.helpfulUsers.includes(decoded.id)) {
          // Remove helpful mark
          await review.removeHelpful(decoded.id);
          return NextResponse.json({
            success: true,
            message: 'Helpful mark removed',
            data: {
              reviewId: review._id,
              helpfulCount: review.helpfulCount,
              userMarkedHelpful: false
            }
          });
        } else {
          // Add helpful mark
          await review.markHelpful(decoded.id);
          return NextResponse.json({
            success: true,
            message: 'Review marked as helpful',
            data: {
              reviewId: review._id,
              helpfulCount: review.helpfulCount,
              userMarkedHelpful: true
            }
          });
        }

      case 'flag_review':
        // Verify authentication for flagging
        const flaggingUser = await verifyToken(request);

        if (!body.reason) {
          return NextResponse.json({
            success: false,
            error: 'Flagging reason is required'
          }, { status: 400 });
        }

        // Check if user already flagged this review
        const existingFlag = review.flaggedBy.find(
          flag => flag.user.toString() === flaggingUser.id
        );

        if (existingFlag) {
          return NextResponse.json({
            success: false,
            error: 'You have already flagged this review'
          }, { status: 409 });
        }

        review.flaggedBy.push({
          user: flaggingUser.id,
          reason: body.reason,
          flaggedAt: new Date()
        });
        await review.save();

        return NextResponse.json({
          success: true,
          message: 'Review flagged for moderation',
          data: {
            reviewId: review._id,
            flagCount: review.flaggedBy.length
          }
        });

      case 'owner_response':
        // Verify user is the property owner
        const respondingUser = await verifyToken(request);

        if (review.property.owner.toString() !== respondingUser.id) {
          return NextResponse.json({
            success: false,
            error: 'Only the property owner can respond to reviews'
          }, { status: 403 });
        }

        if (!body.message || body.message.trim().length === 0) {
          return NextResponse.json({
            success: false,
            error: 'Response message is required'
          }, { status: 400 });
        }

        review.ownerResponse = {
          message: body.message.trim(),
          respondedAt: new Date()
        };
        await review.save();

        return NextResponse.json({
          success: true,
          message: 'Owner response added successfully',
          data: {
            reviewId: review._id,
            ownerResponse: review.ownerResponse
          }
        });

      case 'moderate_review':
        // This would be for admin users only
        const moderator = await verifyToken(request);
        const moderatorUser = await User.findById(moderator.id);

        if (moderatorUser.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Only administrators can moderate reviews'
          }, { status: 403 });
        }

        review.isApproved = body.approved;
        review.moderationNotes = body.notes;
        await review.save();

        return NextResponse.json({
          success: true,
          message: `Review ${body.approved ? 'approved' : 'rejected'} successfully`,
          data: {
            reviewId: review._id,
            isApproved: review.isApproved,
            moderationNotes: review.moderationNotes
          }
        });

      case 'verify_review':
        // This would verify a review as authentic
        const verifier = await verifyToken(request);
        const verifierUser = await User.findById(verifier.id);

        if (verifierUser.role !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Only administrators can verify reviews'
          }, { status: 403 });
        }

        review.isVerified = body.verified;
        await review.save();

        return NextResponse.json({
          success: true,
          message: `Review ${body.verified ? 'verified' : 'unverified'} successfully`,
          data: {
            reviewId: review._id,
            isVerified: review.isVerified
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating review:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update review'
    }, { status: 500 });
  }
}

// DELETE: Delete a review (only by the reviewer or admin)
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const resolvedParams = await params;
    const reviewId = resolvedParams.id;

    if (!reviewId) {
      return NextResponse.json({
        success: false,
        error: 'Review ID is required'
      }, { status: 400 });
    }

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 });
    }

    // Get user details
    const user = await User.findById(decoded.id);

    // Check if user has permission to delete
    const isReviewer = review.student.toString() === decoded.id;
    const isAdmin = user.role === 'admin';

    if (!isReviewer && !isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'You do not have permission to delete this review'
      }, { status: 403 });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Update property rating after review deletion
    const Room = require('@/lib/models/Room').default;
    const property = await Room.findById(review.property);
    if (property) {
      await property.updateRating();
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete review'
    }, { status: 500 });
  }
}