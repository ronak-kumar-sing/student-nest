import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Booking from '@/lib/models/Booking';
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

// GET: Get specific booking details
export async function GET(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const resolvedParams = await params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        error: 'Booking ID is required'
      }, { status: 400 });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('room', 'title location images price amenities features rules')
      .populate('student', 'fullName phone email profilePhoto college course')
      .populate('owner', 'fullName phone email profilePhoto businessName businessType');

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    // Verify user has permission to view this booking
    const isOwner = booking.owner._id.toString() === decoded.id;
    const isStudent = booking.student._id.toString() === decoded.id;

    if (!isOwner && !isStudent) {
      return NextResponse.json({
        success: false,
        error: 'You do not have permission to view this booking'
      }, { status: 403 });
    }

    // Format booking data
    const bookingData = {
      id: booking._id,
      status: booking.status,

      room: {
        id: booking.room._id,
        title: booking.room.title,
        location: booking.room.location,
        images: booking.room.images,
        price: booking.room.price,
        amenities: booking.room.amenities,
        features: booking.room.features,
        rules: booking.room.rules
      },

      student: {
        id: booking.student._id,
        name: booking.student.fullName,
        phone: booking.student.phone,
        email: booking.student.email,
        profilePhoto: booking.student.profilePhoto,
        college: booking.student.college,
        course: booking.student.course
      },

      owner: {
        id: booking.owner._id,
        name: booking.owner.fullName,
        businessName: booking.owner.businessName,
        businessType: booking.owner.businessType,
        phone: booking.owner.phone,
        email: booking.owner.email,
        profilePhoto: booking.owner.profilePhoto
      },

      schedule: {
        moveInDate: booking.moveInDate,
        moveOutDate: booking.moveOutDate,
        duration: booking.duration,
        agreementType: booking.agreementType
      },

      financial: {
        monthlyRent: booking.monthlyRent,
        securityDeposit: booking.securityDeposit,
        maintenanceCharges: booking.maintenanceCharges,
        totalAmount: booking.totalAmount,
        paymentDetails: booking.paymentDetails,
        paymentStatus: booking.paymentStatus
      },

      agreement: {
        document: booking.agreementDocument,
        type: booking.agreementType
      },

      notes: {
        student: booking.studentNotes,
        owner: booking.ownerNotes,
        admin: booking.adminNotes
      },

      checkIn: booking.checkInDetails,
      checkOut: booking.checkOutDetails,
      extensionRequests: booking.extensionRequests,

      cancellation: {
        reason: booking.cancellationReason,
        cancelledBy: booking.cancelledBy,
        cancelledAt: booking.cancelledAt,
        refundAmount: booking.refundAmount,
        refundStatus: booking.refundStatus
      },

      timeline: {
        createdAt: booking.createdAt,
        confirmedAt: booking.confirmedAt,
        rejectedAt: booking.rejectedAt,
        cancelledAt: booking.cancelledAt,
        completedAt: booking.completedAt,
        updatedAt: booking.updatedAt
      },

      reviews: {
        studentSubmitted: booking.studentReviewSubmitted,
        ownerSubmitted: booking.ownerReviewSubmitted
      },

      // Helper fields
      isActive: booking.isActive(),
      durationInDays: booking.durationInDays,
      totalContractValue: booking.totalContractValue,
      priority: booking.priority,
      isUrgent: booking.isUrgent,

      // User permissions
      permissions: {
        canConfirm: isOwner && booking.status === 'pending',
        canReject: isOwner && booking.status === 'pending',
        canCancel: (isOwner || isStudent) && ['pending', 'confirmed'].includes(booking.status),
        canComplete: (isOwner || isStudent) && booking.status === 'active',
        canAddNotes: isOwner || isStudent,
        canRequestExtension: isStudent && booking.status === 'active',
        canCheckIn: isOwner && booking.status === 'confirmed',
        canCheckOut: isOwner && booking.status === 'active',
        canSubmitReview: (isStudent && !booking.studentReviewSubmitted && booking.status === 'completed') ||
                        (isOwner && !booking.ownerReviewSubmitted && booking.status === 'completed')
      }
    };

    return NextResponse.json({
      success: true,
      data: bookingData
    });

  } catch (error) {
    console.error('Error fetching booking:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch booking'
    }, { status: 500 });
  }
}

// PUT: Update booking (confirm, cancel, etc.)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const resolvedParams = await params;
    const bookingId = resolvedParams.id;
    const body = await request.json();

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        error: 'Booking ID is required'
      }, { status: 400 });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('room', 'title')
      .populate('student', 'fullName')
      .populate('owner', 'fullName');

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    // Verify user has permission to modify this booking
    const isOwner = booking.owner._id.toString() === decoded.id;
    const isStudent = booking.student._id.toString() === decoded.id;

    if (!isOwner && !isStudent) {
      return NextResponse.json({
        success: false,
        error: 'You do not have permission to modify this booking'
      }, { status: 403 });
    }

    const action = body.action;

    switch (action) {
      case 'confirm':
        if (!isOwner) {
          return NextResponse.json({
            success: false,
            error: 'Only the owner can confirm bookings'
          }, { status: 403 });
        }

        await booking.confirmBooking();

        return NextResponse.json({
          success: true,
          message: 'Booking confirmed successfully',
          data: {
            bookingId: booking._id,
            status: booking.status,
            confirmedAt: booking.confirmedAt
          }
        });

      case 'reject':
        if (!isOwner) {
          return NextResponse.json({
            success: false,
            error: 'Only the owner can reject bookings'
          }, { status: 403 });
        }

        booking.status = 'rejected';
        booking.rejectedAt = new Date();
        booking.ownerNotes = body.rejectionReason || booking.ownerNotes;
        await booking.save();

        return NextResponse.json({
          success: true,
          message: 'Booking rejected successfully',
          data: {
            bookingId: booking._id,
            status: booking.status,
            rejectedAt: booking.rejectedAt
          }
        });

      case 'cancel':
        if (!body.reason) {
          return NextResponse.json({
            success: false,
            error: 'Cancellation reason is required'
          }, { status: 400 });
        }

        await booking.cancelBooking(body.reason, decoded.id);

        return NextResponse.json({
          success: true,
          message: 'Booking cancelled successfully',
          data: {
            bookingId: booking._id,
            status: booking.status,
            cancellationReason: booking.cancellationReason,
            refundAmount: body.refundAmount || 0
          }
        });

      case 'complete':
        await booking.completeBooking();

        return NextResponse.json({
          success: true,
          message: 'Booking completed successfully',
          data: {
            bookingId: booking._id,
            status: booking.status,
            completedAt: booking.completedAt
          }
        });

      case 'check_in':
        if (!isOwner) {
          return NextResponse.json({
            success: false,
            error: 'Only the owner can process check-in'
          }, { status: 403 });
        }

        booking.checkInDetails = {
          checkInDate: new Date(),
          checkInTime: body.checkInTime,
          checkInPhotos: body.checkInPhotos || [],
          checkInNotes: body.checkInNotes,
          verifiedBy: decoded.id
        };
        booking.status = 'active';
        await booking.save();

        return NextResponse.json({
          success: true,
          message: 'Check-in processed successfully',
          data: {
            bookingId: booking._id,
            status: booking.status,
            checkInDetails: booking.checkInDetails
          }
        });

      case 'check_out':
        if (!isOwner) {
          return NextResponse.json({
            success: false,
            error: 'Only the owner can process check-out'
          }, { status: 403 });
        }

        booking.checkOutDetails = {
          checkOutDate: new Date(),
          checkOutTime: body.checkOutTime,
          checkOutPhotos: body.checkOutPhotos || [],
          checkOutNotes: body.checkOutNotes,
          damageAssessment: body.damageAssessment || [],
          finalRefundAmount: body.finalRefundAmount || 0,
          verifiedBy: decoded.id
        };
        await booking.completeBooking();

        return NextResponse.json({
          success: true,
          message: 'Check-out processed successfully',
          data: {
            bookingId: booking._id,
            status: booking.status,
            checkOutDetails: booking.checkOutDetails
          }
        });

      case 'request_extension':
        if (!isStudent) {
          return NextResponse.json({
            success: false,
            error: 'Only students can request extensions'
          }, { status: 403 });
        }

        booking.extensionRequests.push({
          requestedDuration: body.requestedDuration,
          requestedAt: new Date(),
          status: 'pending'
        });
        await booking.save();

        return NextResponse.json({
          success: true,
          message: 'Extension request submitted successfully',
          data: {
            bookingId: booking._id,
            extensionRequest: booking.extensionRequests[booking.extensionRequests.length - 1]
          }
        });

      case 'respond_extension':
        if (!isOwner) {
          return NextResponse.json({
            success: false,
            error: 'Only the owner can respond to extension requests'
          }, { status: 403 });
        }

        const extensionId = body.extensionId;
        const extension = booking.extensionRequests.id(extensionId);
        if (!extension) {
          return NextResponse.json({
            success: false,
            error: 'Extension request not found'
          }, { status: 404 });
        }

        extension.status = body.extensionStatus; // 'approved' or 'rejected'
        extension.ownerResponse = body.ownerResponse;
        extension.responseAt = new Date();

        // If approved, update the booking duration
        if (body.extensionStatus === 'approved') {
          booking.duration += extension.requestedDuration;
          const newMoveOutDate = new Date(booking.moveInDate);
          newMoveOutDate.setMonth(newMoveOutDate.getMonth() + booking.duration);
          booking.moveOutDate = newMoveOutDate;
        }

        await booking.save();

        return NextResponse.json({
          success: true,
          message: `Extension request ${body.extensionStatus} successfully`,
          data: {
            bookingId: booking._id,
            extension: extension,
            newMoveOutDate: booking.moveOutDate
          }
        });

      case 'add_notes':
        if (isOwner) {
          booking.ownerNotes = body.notes;
        } else if (isStudent) {
          booking.studentNotes = body.notes;
        }

        await booking.save();

        return NextResponse.json({
          success: true,
          message: 'Notes added successfully',
          data: {
            bookingId: booking._id,
            notes: {
              student: booking.studentNotes,
              owner: booking.ownerNotes
            }
          }
        });

      case 'update_payment':
        booking.paymentDetails.totalPaid = body.amountPaid;
        booking.paymentDetails.paymentMethod = body.paymentMethod;
        booking.paymentDetails.transactionId = body.transactionId;
        booking.paymentDetails.paymentDate = new Date();

        // Update payment status
        if (booking.paymentDetails.totalPaid >= booking.totalAmount) {
          booking.paymentStatus = 'paid';
        } else if (booking.paymentDetails.totalPaid > 0) {
          booking.paymentStatus = 'partial';
        }

        await booking.save();

        return NextResponse.json({
          success: true,
          message: 'Payment updated successfully',
          data: {
            bookingId: booking._id,
            paymentStatus: booking.paymentStatus,
            paymentDetails: booking.paymentDetails
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating booking:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update booking'
    }, { status: 500 });
  }
}