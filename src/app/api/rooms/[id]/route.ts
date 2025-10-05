import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Room from '@/lib/models/Room';
import Review from '@/lib/models/Review';
import mongoose from 'mongoose';

// Sample room IDs (must match the ones in /api/rooms/route.ts)
const sampleRoomIds = [
  '507f1f77bcf86cd799439011',
  '507f1f77bcf86cd799439012',
  '507f1f77bcf86cd799439013',
];

// Sample room data for when database is empty
const getSampleRoomData = (id: string) => {
  const sampleRooms: any = {
    '507f1f77bcf86cd799439011': {
      id: '507f1f77bcf86cd799439011',
      _id: '507f1f77bcf86cd799439011',
      title: 'Cozy Single Room near IIT Delhi',
      description: 'Perfect for students with all modern amenities and excellent connectivity.',
      fullDescription: 'This well-maintained single room is ideal for students looking for a comfortable and secure accommodation near IIT Delhi. The room comes fully furnished with a bed, study table, chair, wardrobe, and AC. High-speed WiFi is available 24/7. The property has 24/7 security with CCTV surveillance. Regular housekeeping and laundry services are provided.',
      price: 8000,
      securityDeposit: 16000,
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      roomType: 'single',
      accommodationType: 'pg',
      maxSharingCapacity: 1,
      rating: 4.5,
      totalReviews: 23,
      amenities: ['wifi', 'ac', 'powerBackup', 'security', 'laundry', 'meals', 'cleaning'],
      detailedAmenities: ['WiFi', 'AC', 'Power Backup', '24/7 Security', 'Laundry', 'Meals', 'Daily Cleaning'],
      features: {
        area: 120,
        floor: 2,
        totalFloors: 3,
        furnished: true,
        balcony: false,
        attached_bathroom: true,
      },
      location: {
        address: 'Hauz Khas',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110016',
        fullAddress: 'House No. 123, Hauz Khas Village, South Delhi, Delhi 110016',
        coordinates: { lat: 28.5494, lng: 77.1926 },
        nearbyPlaces: [
          { name: 'IIT Delhi', distance: '2 km', type: 'university' },
          { name: 'Metro Station', distance: '500 m', type: 'transport' },
          { name: 'Big Bazaar', distance: '1 km', type: 'shopping' },
        ],
      },
      availability: {
        isAvailable: true,
        availableFrom: new Date().toISOString().split('T')[0],
        moveInFlexibility: 'flexible',
      },
      rules: {
        genderPreference: 'any',
        smokingAllowed: false,
        petsAllowed: false,
        guestsAllowed: true,
        quietHours: '10 PM - 7 AM',
      },
      owner: {
        id: 'owner-1',
        name: 'Rajesh Kumar',
        verified: true,
        joinDate: 'Jan 2023',
        totalProperties: 5,
        responseRate: 95,
        responseTime: '2 hours',
        contactInfo: { phone: '9876543210', email: 'rajesh@example.com' },
      },
      reviews: [
        {
          id: 'review-1',
          userName: 'Priya Sharma',
          userAvatar: '/api/placeholder/100/100',
          rating: 5,
          comment: 'Excellent accommodation! Very clean and well-maintained. The owner is very responsive and helpful.',
          date: 'Sep 2024',
          verified: true,
          helpfulCount: 12,
          stayDuration: '6 months',
          categories: { cleanliness: 5, communication: 5, location: 5, valueForMoney: 4 },
        },
        {
          id: 'review-2',
          userName: 'Rahul Verma',
          userAvatar: '/api/placeholder/100/100',
          rating: 4,
          comment: 'Good place to stay. Very close to IIT Delhi campus. Internet speed is great.',
          date: 'Aug 2024',
          verified: true,
          helpfulCount: 8,
          stayDuration: '1 year',
          categories: { cleanliness: 4, communication: 5, location: 5, valueForMoney: 4 },
        },
      ],
    },
    '507f1f77bcf86cd799439012': {
      id: '507f1f77bcf86cd799439012',
      _id: '507f1f77bcf86cd799439012',
      title: 'Shared Room - Budget Friendly',
      description: 'Affordable shared accommodation with good facilities near metro station.',
      fullDescription: 'Perfect for budget-conscious students. This shared room can accommodate 2 people comfortably. Each person gets their own bed, study table, and wardrobe space. The room is well-ventilated with attached bathroom. WiFi, laundry, and meal services are included in the rent.',
      price: 6000,
      securityDeposit: 12000,
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600'],
      roomType: 'shared',
      accommodationType: 'pg',
      maxSharingCapacity: 2,
      rating: 4.2,
      totalReviews: 15,
      amenities: ['wifi', 'security', 'housekeeping', 'laundry', 'meals'],
      detailedAmenities: ['WiFi', '24/7 Security', 'Housekeeping', 'Laundry', 'Meals (2 times)'],
      features: {
        area: 150,
        floor: 1,
        totalFloors: 4,
        furnished: true,
        balcony: true,
        attached_bathroom: false,
      },
      location: {
        address: 'Mukherjee Nagar',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110009',
        fullAddress: 'Plot No. 45, Mukherjee Nagar, North Delhi, Delhi 110009',
        coordinates: { lat: 28.7041, lng: 77.2025 },
        nearbyPlaces: [
          { name: 'Delhi University', distance: '3 km', type: 'university' },
          { name: 'Mukherjee Nagar Metro', distance: '200 m', type: 'transport' },
        ],
      },
      availability: {
        isAvailable: true,
        availableFrom: new Date().toISOString().split('T')[0],
        moveInFlexibility: 'flexible',
      },
      rules: {
        genderPreference: 'male',
        smokingAllowed: false,
        petsAllowed: false,
        guestsAllowed: false,
        quietHours: '11 PM - 6 AM',
      },
      owner: {
        id: 'owner-2',
        name: 'Priya Sharma',
        verified: true,
        joinDate: 'Mar 2023',
        totalProperties: 3,
        responseRate: 88,
        responseTime: '4 hours',
        contactInfo: { phone: '9876543211', email: 'priya@example.com' },
      },
      reviews: [],
    },
    '507f1f77bcf86cd799439013': {
      id: '507f1f77bcf86cd799439013',
      _id: '507f1f77bcf86cd799439013',
      title: 'Spacious Studio Apartment',
      description: 'Modern studio apartment with all amenities and 24/7 security.',
      fullDescription: 'Luxury studio apartment in a premium society with gym, parking, and elevator facilities. The apartment is fully furnished with modular kitchen, king-size bed, sofa, dining table, and smart TV. Located in a secure gated community with 24/7 security and CCTV surveillance.',
      price: 12000,
      securityDeposit: 24000,
      images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      roomType: 'studio',
      accommodationType: 'apartment',
      maxSharingCapacity: 1,
      rating: 4.8,
      totalReviews: 31,
      amenities: ['wifi', 'ac', 'powerBackup', 'security', 'gym', 'parking', 'elevator', 'cctv'],
      detailedAmenities: ['High-Speed WiFi', 'AC', 'Power Backup', '24/7 Security', 'Gym', 'Car Parking', 'Elevator', 'CCTV'],
      features: {
        area: 250,
        floor: 5,
        totalFloors: 10,
        furnished: true,
        balcony: true,
        attached_bathroom: true,
      },
      location: {
        address: 'Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        fullAddress: 'Tower A, Galaxy Apartments, Sector 62, Noida, UP 201301',
        coordinates: { lat: 28.6260, lng: 77.3631 },
        nearbyPlaces: [
          { name: 'Amity University', distance: '1.5 km', type: 'university' },
          { name: 'Sector 62 Metro', distance: '800 m', type: 'transport' },
          { name: 'Wave Mall', distance: '1.2 km', type: 'shopping' },
        ],
      },
      availability: {
        isAvailable: true,
        availableFrom: new Date().toISOString().split('T')[0],
        moveInFlexibility: 'flexible',
      },
      rules: {
        genderPreference: 'any',
        smokingAllowed: false,
        petsAllowed: true,
        guestsAllowed: true,
        quietHours: 'None',
      },
      owner: {
        id: 'owner-3',
        name: 'Amit Patel',
        verified: true,
        joinDate: 'Jan 2022',
        totalProperties: 8,
        responseRate: 98,
        responseTime: '1 hour',
        contactInfo: { phone: '9876543212', email: 'amit@example.com' },
      },
      reviews: [
        {
          id: 'review-3',
          userName: 'Anjali Singh',
          userAvatar: '/api/placeholder/100/100',
          rating: 5,
          comment: 'Amazing apartment! Very spacious and modern. The gym and parking facilities are excellent.',
          date: 'Oct 2024',
          verified: true,
          helpfulCount: 15,
          stayDuration: '3 months',
          categories: { cleanliness: 5, communication: 5, location: 5, valueForMoney: 5 },
        },
      ],
    },
  };

  return sampleRooms[id] || null;
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Room ID is required',
        },
        { status: 400 }
      );
    }

    // Check if it's a sample room ID
    if (sampleRoomIds.includes(id)) {
      const sampleRoom = getSampleRoomData(id);
      if (sampleRoom) {
        return NextResponse.json({
          success: true,
          data: sampleRoom,
        });
      }
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid room ID format',
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find room and populate owner information
    const room = await Room.findById(id).populate('owner', 'fullName email phone profilePhoto isVerified createdAt');

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          error: 'Room not found',
        },
        { status: 404 }
      );
    }

    // Get reviews for this room
    const reviews = await Review.find({ property: id })
      .populate('student', 'fullName profilePhoto')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Format reviews to match frontend expectations
    const formattedReviews = reviews.map((review: any) => ({
      id: review._id,
      userName: review.student?.fullName || 'Anonymous',
      userAvatar: review.student?.profilePhoto,
      rating: review.overallRating,
      comment: review.comment,
      date: new Date(review.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      verified: review.isVerified,
      helpfulCount: review.helpfulCount,
      stayDuration: review.stayDuration,
      categories: review.categories,
    }));

    // Calculate owner response metrics
    const ownerJoinDate = new Date((room.owner as any).createdAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    // Format response to match frontend expectations exactly
    const roomData = {
      id: room._id,
      title: room.title,
      description: room.description,
      fullDescription: room.fullDescription || room.description,
      price: room.price,
      images: room.images || ['/api/placeholder/800/600'],
      roomType: room.roomType || 'single',
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
        attached_bathroom: room.features?.attached_bathroom || true,
      },

      location: {
        address: room.location?.address,
        fullAddress: room.location?.fullAddress,
        city: room.location?.city,
        coordinates: room.location?.coordinates || { lat: 28.6139, lng: 77.209 },
        nearbyUniversities: room.location?.nearbyUniversities || [
          {
            name: 'Nearby University',
            distance: '2.5',
            commute: '15',
          },
        ],
        nearbyFacilities: room.location?.nearbyFacilities || [
          { name: 'Metro Station', distance: '500' },
          { name: 'Shopping Mall', distance: '300' },
          { name: 'Hospital', distance: '800' },
        ],
      },

      availability: {
        isAvailable: room.availability?.isAvailable ?? true,
        availableFrom: room.availability?.availableFrom || new Date().toISOString().split('T')[0],
      },

      owner: {
        id: (room.owner as any)._id,
        name: (room.owner as any).fullName,
        rating: (room.owner as any).averageRating || 4.5,
        verified: (room.owner as any).isVerified || false,
        responseRate: (room.owner as any).responseRate || 95,
        responseTime: (room.owner as any).responseTime || 'within 2 hours',
        joinedDate: `Joined in ${ownerJoinDate}`,
        email: (room.owner as any).email,
        phone: (room.owner as any).phone,
      },

      reviews: formattedReviews,
    };

    return NextResponse.json({
      success: true,
      data: roomData,
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch room details',
      },
      { status: 500 }
    );
  }
}
