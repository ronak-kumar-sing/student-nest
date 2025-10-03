import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import RoomShare from '@/lib/models/RoomShare';
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

// GET: Get specific room sharing details
export async function GET(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const shareId = resolvedParams.id;

    if (!shareId) {
      return NextResponse.json({
        success: false,
        error: 'Room sharing ID is required'
      }, { status: 400 });
    }

    // Find the room sharing
    const roomShare = await RoomShare.findById(shareId)
      .populate({
        path: 'property',
        select: 'title location images price amenities features rules',
        populate: {
          path: 'owner',
          select: 'fullName phone email profilePhoto'
        }
      })
      .populate('initiator', 'fullName profilePhoto email phone')
      .populate('currentParticipants.user', 'fullName profilePhoto email')
      .populate('applications.applicant', 'fullName profilePhoto email');

    if (!roomShare) {
      return NextResponse.json({
        success: false,
        error: 'Room sharing not found'
      }, { status: 404 });
    }

    // Increment views
    roomShare.views = (roomShare.views || 0) + 1;
    await roomShare.save();

    // Calculate availability
    const confirmedParticipants = roomShare.currentParticipants.filter(p => p.status === 'confirmed').length;
    const availableSlots = roomShare.maxParticipants - confirmedParticipants;

    // Format room sharing data
    const roomShareData = {
      id: roomShare._id,
      status: roomShare.status,

      property: {
        id: roomShare.property._id,
        title: roomShare.property.title,
        location: roomShare.property.location,
        images: roomShare.property.images,
        price: roomShare.property.price,
        amenities: roomShare.property.amenities,
        features: roomShare.property.features,
        rules: roomShare.property.rules,
        owner: {
          name: roomShare.property.owner.fullName,
          phone: roomShare.property.owner.phone,
          email: roomShare.property.owner.email,
          profilePhoto: roomShare.property.owner.profilePhoto
        }
      },

      initiator: {
        id: roomShare.initiator._id,
        name: roomShare.initiator.fullName,
        profilePhoto: roomShare.initiator.profilePhoto,
        email: roomShare.initiator.email,
        phone: roomShare.initiator.phone
      },

      sharing: {
        maxParticipants: roomShare.maxParticipants,
        currentParticipants: confirmedParticipants,
        availableSlots: availableSlots,
        isFull: availableSlots <= 0
      },

      participants: roomShare.currentParticipants.map(participant => ({
        id: participant.user._id,
        name: participant.user.fullName,
        profilePhoto: participant.user.profilePhoto,
        email: participant.user.email,
        joinedAt: participant.joinedAt,
        status: participant.status,
        sharedAmount: participant.sharedAmount
      })),

      cost: {
        monthlyRent: roomShare.costSharing.monthlyRent,
        rentPerPerson: roomShare.costSharing.rentPerPerson,
        securityDeposit: roomShare.costSharing.securityDeposit,
        depositPerPerson: roomShare.costSharing.depositPerPerson,
        maintenanceCharges: roomShare.costSharing.maintenanceCharges,
        maintenancePerPerson: roomShare.costSharing.maintenancePerPerson,
        utilitiesIncluded: roomShare.costSharing.utilitiesIncluded,
        utilitiesPerPerson: roomShare.costSharing.utilitiesPerPerson
      },

      requirements: roomShare.requirements,
      roomConfiguration: roomShare.roomConfiguration,

      timeline: {
        availableFrom: roomShare.availableFrom,
        availableTill: roomShare.availableTill,
        createdAt: roomShare.createdAt
      },

      description: roomShare.description,
      houseRules: roomShare.houseRules,

      compatibility: {
        questions: roomShare.compatibilityQuestions,
        isOpenToMeetup: roomShare.isOpenToMeetup,
        meetupPreferences: roomShare.meetupPreferences
      },

      applications: roomShare.applications.map(app => ({
        id: app._id,
        applicant: {
          id: app.applicant._id,
          name: app.applicant.fullName,
          profilePhoto: app.applicant.profilePhoto,
          email: app.applicant.email
        },
        appliedAt: app.appliedAt,
        status: app.status,
        message: app.message,
        compatibility: app.compatibility,
        initiatorResponse: app.initiatorResponse
      })),

      statistics: {
        views: roomShare.views || 0,
        applications: roomShare.applications.length,
        interestedCount: roomShare.interested.length
      },

      tags: roomShare.tags
    };

    return NextResponse.json({
      success: true,
      data: roomShareData
    });

  } catch (error) {
    console.error('Error fetching room sharing:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch room sharing details'
    }, { status: 500 });
  }
}

// PUT: Update room sharing (apply, respond to applications, etc.)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const resolvedParams = await params;
    const shareId = resolvedParams.id;
    const body = await request.json();

    if (!shareId) {
      return NextResponse.json({
        success: false,
        error: 'Room sharing ID is required'
      }, { status: 400 });
    }

    // Find the room sharing
    const roomShare = await RoomShare.findById(shareId)
      .populate('initiator', 'fullName')
      .populate('property', 'title');

    if (!roomShare) {
      return NextResponse.json({
        success: false,
        error: 'Room sharing not found'
      }, { status: 404 });
    }

    const action = body.action;

    switch (action) {
      case 'apply':
        // Student applying to join room sharing
        if (!body.message) {
          return NextResponse.json({
            success: false,
            error: 'Application message is required'
          }, { status: 400 });
        }

        // Check if user is the initiator
        if (roomShare.initiator._id.toString() === decoded.id) {
          return NextResponse.json({
            success: false,
            error: 'You cannot apply to your own room sharing'
          }, { status: 409 });
        }

        // Check if room sharing is full
        if (roomShare.isFull) {
          return NextResponse.json({
            success: false,
            error: 'Room sharing is already full'
          }, { status: 409 });
        }

        await roomShare.addApplication(decoded.id, body.message);

        return NextResponse.json({
          success: true,
          message: 'Application submitted successfully',
          data: {
            shareId: roomShare._id,
            applicationId: roomShare.applications[roomShare.applications.length - 1]._id
          }
        });

      case 'respond_application':
        // Initiator responding to an application
        if (roomShare.initiator._id.toString() !== decoded.id) {
          return NextResponse.json({
            success: false,
            error: 'Only the initiator can respond to applications'
          }, { status: 403 });
        }

        const { applicationId, status, responseMessage } = body;

        if (!applicationId || !status) {
          return NextResponse.json({
            success: false,
            error: 'Application ID and status are required'
          }, { status: 400 });
        }

        await roomShare.respondToApplication(applicationId, status, responseMessage);

        return NextResponse.json({
          success: true,
          message: `Application ${status} successfully`,
          data: {
            shareId: roomShare._id,
            applicationId: applicationId,
            status: status
          }
        });

      case 'leave_sharing':
        // Participant leaving the room sharing
        await roomShare.removeParticipant(decoded.id);

        return NextResponse.json({
          success: true,
          message: 'Successfully left the room sharing',
          data: {
            shareId: roomShare._id,
            availableSlots: roomShare.availableSlots
          }
        });

      case 'mark_interested':
        // Mark as interested (for compatibility matching)
        const existingInterest = roomShare.interested.find(
          interest => interest.user.toString() === decoded.id
        );

        if (existingInterest) {
          // Remove interest
          roomShare.interested = roomShare.interested.filter(
            interest => interest.user.toString() !== decoded.id
          );
        } else {
          // Add interest
          roomShare.interested.push({
            user: decoded.id,
            interestedAt: new Date()
          });
        }

        await roomShare.save();

        return NextResponse.json({
          success: true,
          message: existingInterest ? 'Interest removed' : 'Marked as interested',
          data: {
            shareId: roomShare._id,
            isInterested: !existingInterest,
            interestCount: roomShare.interested.length
          }
        });

      case 'calculate_compatibility':
        // Calculate compatibility score
        if (!body.userPreferences) {
          return NextResponse.json({
            success: false,
            error: 'User preferences are required for compatibility calculation'
          }, { status: 400 });
        }

        const compatibilityScore = roomShare.calculateCompatibility(body.userPreferences);

        return NextResponse.json({
          success: true,
          data: {
            shareId: roomShare._id,
            compatibilityScore: compatibilityScore,
            recommendation: compatibilityScore >= 70 ? 'highly_compatible' :
                          compatibilityScore >= 50 ? 'moderately_compatible' : 'low_compatibility'
          }
        });

      case 'update_status':
        // Update room sharing status (initiator only)
        if (roomShare.initiator._id.toString() !== decoded.id) {
          return NextResponse.json({
            success: false,
            error: 'Only the initiator can update status'
          }, { status: 403 });
        }

        const { newStatus } = body;
        if (!['active', 'inactive', 'cancelled', 'completed'].includes(newStatus)) {
          return NextResponse.json({
            success: false,
            error: 'Invalid status'
          }, { status: 400 });
        }

        roomShare.status = newStatus;
        if (newStatus === 'completed' || newStatus === 'cancelled') {
          roomShare.completedAt = new Date();
          roomShare.completionReason = body.reason || newStatus;
        }

        await roomShare.save();

        return NextResponse.json({
          success: true,
          message: `Room sharing ${newStatus} successfully`,
          data: {
            shareId: roomShare._id,
            status: roomShare.status
          }
        });

      case 'add_house_rules':
        // Add or update house rules (initiator only)
        if (roomShare.initiator._id.toString() !== decoded.id) {
          return NextResponse.json({
            success: false,
            error: 'Only the initiator can add house rules'
          }, { status: 403 });
        }

        roomShare.houseRules = body.houseRules || [];
        await roomShare.save();

        return NextResponse.json({
          success: true,
          message: 'House rules updated successfully',
          data: {
            shareId: roomShare._id,
            houseRules: roomShare.houseRules
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating room sharing:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update room sharing'
    }, { status: 500 });
  }
}

// DELETE: Delete room sharing (initiator only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const resolvedParams = await params;
    const shareId = resolvedParams.id;

    if (!shareId) {
      return NextResponse.json({
        success: false,
        error: 'Room sharing ID is required'
      }, { status: 400 });
    }

    // Find the room sharing
    const roomShare = await RoomShare.findById(shareId);
    if (!roomShare) {
      return NextResponse.json({
        success: false,
        error: 'Room sharing not found'
      }, { status: 404 });
    }

    // Check if user is the initiator
    if (roomShare.initiator.toString() !== decoded.id) {
      return NextResponse.json({
        success: false,
        error: 'Only the initiator can delete room sharing'
      }, { status: 403 });
    }

    // Check if there are confirmed participants (other than initiator)
    const otherParticipants = roomShare.currentParticipants.filter(
      p => p.user.toString() !== decoded.id && p.status === 'confirmed'
    );

    if (otherParticipants.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete room sharing with active participants. Please remove all participants first.'
      }, { status: 409 });
    }

    // Delete the room sharing
    await RoomShare.findByIdAndDelete(shareId);

    return NextResponse.json({
      success: true,
      message: 'Room sharing deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting room sharing:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete room sharing'
    }, { status: 500 });
  }
}