import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Room from '@/lib/models/Room';
import Review from '@/lib/models/Review';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Room ID is required'
      }, { status: 400 });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid room ID format'
      }, { status: 400 });
    }

    await connectDB();

    // Find room and populate owner information
    const room = await Room.findById(id).populate('owner', 'fullName email phone profilePhoto isVerified createdAt');

    if (!room) {
      return NextResponse.json({
        success: false,
        error: 'Room not found'
      }, { status: 404 });
    }

    // Get reviews for this room
    const reviews = await Review.find({ property: id })
      .populate('student', 'fullName profilePhoto')
      .sort({ createdAt: -1 })
      .limit(10);

    // Format reviews to match frontend expectations
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      userName: review.student.fullName,
      userAvatar: review.student.profilePhoto,
      rating: review.overallRating,
      comment: review.comment,
      date: new Date(review.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      }),
      verified: review.isVerified,
      helpfulCount: review.helpfulCount,
      stayDuration: review.stayDuration,
      categories: review.categories
    }));

    // Calculate owner response metrics
    const ownerJoinDate = new Date(room.owner.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });

    // Format response to match frontend expectations exactly
    const roomData = {
      id: room._id,
      title: room.title,
      description: room.description,
      fullDescription: room.fullDescription || room.description,
      price: room.price,
      images: room.images || ['/api/placeholder/800/600'],
      roomType: room.roomType || 'Single',
      accommodationType: room.accommodationType || 'pg',
      maxSharingCapacity: room.maxSharingCapacity || 2,
      rating: room.rating || 0,
      totalReviews: room.totalReviews || 0,
      amenities: room.amenities || [],
      detailedAmenities: room.detailedAmenities || room.amenities || [],

      features: {
        area: room.features?.area || 120,
        floor: room.features?.floor || 2,
        totalFloors: room.features?.totalFloors || 4,
        furnished: room.features?.furnished || true,
        balcony: room.features?.balcony || false,
        attached_bathroom: room.features?.attached_bathroom || true
      },

      location: {
        address: room.location?.address || room.address,
        fullAddress: room.location?.fullAddress || room.address,
        city: room.location?.city || room.city,
        coordinates: room.location?.coordinates || { lat: 28.6139, lng: 77.2090 },
        nearbyUniversities: room.location?.nearbyUniversities || [
          {
            name: "Nearby University",
            distance: "2.5",
            commute: "15"
          }
        ],
        nearbyFacilities: room.location?.nearbyFacilities || [
          { name: "Metro Station", distance: "500" },
          { name: "Shopping Mall", distance: "300" },
          { name: "Hospital", distance: "800" }
        ]
      },

      availability: {
        isAvailable: room.availability?.isAvailable ?? true,
        availableFrom: room.availability?.availableFrom || new Date().toISOString().split('T')[0]
      },

      owner: {
        id: room.owner._id,
        name: room.owner.fullName,
        rating: room.owner.averageRating || 4.5,
        verified: room.owner.isVerified || false,
        responseRate: room.owner.responseRate || 95,
        responseTime: room.owner.responseTime || "within 2 hours",
        joinedDate: `Joined in ${ownerJoinDate}`,
        email: room.owner.email,
        phone: room.owner.phone
      },

      reviews: formattedReviews
    };

    return NextResponse.json({
      success: true,
      data: roomData
    });

  } catch (error) {
    console.error('Error fetching room details:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch room details'
    }, { status: 500 });
  }
}