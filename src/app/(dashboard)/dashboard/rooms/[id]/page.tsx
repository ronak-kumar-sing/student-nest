"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AMENITIES_LIST } from '@/utils/constants';
import {
  MapPin,
  Star,
  Users,
  Calendar,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Home,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Maximize,
  X,
  Clock,
  DollarSign,
  Zap,
  Award,
  ThumbsUp,
  Loader2,
} from 'lucide-react';

import apiClient from '@/lib/api';

// Types
interface NearbyUniversity {
  name: string;
  distance: string;
  commute: string;
}

interface NearbyFacility {
  name: string;
  distance: string;
}

interface Location {
  address: string;
  fullAddress?: string;
  city: string;
  state?: string;
  nearbyUniversities?: NearbyUniversity[];
  nearbyFacilities?: NearbyFacility[];
}

interface Features {
  area: number;
  floor: number;
  totalFloors: number;
  furnished: boolean;
  balcony?: boolean;
  attached_bathroom?: boolean;
}

interface Availability {
  isAvailable: boolean;
  availableFrom: string;
}

interface Owner {
  id?: string;
  _id?: string;
  name: string;
  rating: number;
  verified: boolean;
  responseRate?: number;
  responseTime?: string;
  joinedDate?: string;
}

interface Review {
  id: string | number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
  helpfulCount?: number;
  stayDuration?: string;
  categories?: {
    cleanliness?: number;
    location?: number;
    facilities?: number;
    owner?: number;
    value?: number;
  };
}

interface Room {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  price: number;
  location: Location;
  images?: string[];
  roomType: string;
  accommodationType?: string;
  maxSharingCapacity?: number;
  rating?: number;
  totalReviews?: number;
  amenities?: string[];
  detailedAmenities?: string[];
  features: Features;
  availability: Availability;
  owner: Owner;
  reviews?: Review[];
}

interface User {
  id?: string;
  _id?: string;
  fullName?: string;
  email: string;
  userType: string;
}

// Helper functions
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Room API service
const roomAPI = {
  async getRoomById(id: string): Promise<Room> {
    try {
      // Validate MongoDB ObjectId format (24 character hex string)
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        console.log('Invalid room ID format, using mock data');
        return await this.getMockRoom(id);
      }

      const response = await apiClient.getRoomById(id);
      if (response.success) {
        const roomData = response.data.data || response.data;
        return {
          ...roomData,
          reviews: roomData.reviews || [],
          owner: {
            ...roomData.owner,
            id: roomData.owner?.id || roomData.owner?._id
          }
        };
      }
      throw new Error(response.error || 'Failed to fetch room');
    } catch (error) {
      console.error('Error fetching room:', error);
      return await this.getMockRoom(id);
    }
  },

  async getMockRoom(id: string): Promise<Room> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockRoom: Room = {
      id: id,
      title: "Luxurious Private Room in Modern PG",
      description: "A beautiful and spacious room perfect for students. Located in a prime area with excellent connectivity.",
      fullDescription: "Experience comfort and convenience in this beautifully furnished private room. Perfect for students seeking a balance of study and relaxation. The room features modern amenities, high-speed internet, and is situated in a secure, well-maintained property with 24/7 support staff. Enjoy the perfect blend of privacy and community living.",
      price: 15000,
      location: {
        address: "Sector 15, Noida",
        fullAddress: "Block C, Sector 15, Noida, Uttar Pradesh 201301",
        city: "Noida",
        state: "Uttar Pradesh",
        nearbyUniversities: [
          { name: "Amity University", distance: "2.5", commute: "15" },
          { name: "Sharda University", distance: "8.2", commute: "25" },
          { name: "IIMT College", distance: "1.8", commute: "10" }
        ],
        nearbyFacilities: [
          { name: "Metro Station", distance: "500" },
          { name: "Shopping Mall", distance: "300" },
          { name: "Hospital", distance: "800" },
          { name: "Gym", distance: "200" },
          { name: "Restaurant", distance: "150" },
          { name: "Pharmacy", distance: "250" }
        ]
      },
      images: [
        "https://placehold.co/800x600/1e293b/60a5fa?text=Room+View+1",
        "https://placehold.co/800x600/1e293b/60a5fa?text=Room+View+2",
        "https://placehold.co/800x600/1e293b/60a5fa?text=Room+View+3",
        "https://placehold.co/800x600/1e293b/60a5fa?text=Common+Area",
        "https://placehold.co/800x600/1e293b/60a5fa?text=Exterior"
      ],
      roomType: "Single",
      accommodationType: "pg",
      maxSharingCapacity: 2,
      rating: 4.8,
      totalReviews: 124,
      amenities: ["wifi", "ac", "powerBackup", "security"],
      detailedAmenities: ["wifi", "ac", "powerBackup", "security", "housekeeping", "laundry", "parking", "gym"],
      features: {
        area: 120,
        floor: 3,
        totalFloors: 5,
        furnished: true,
        balcony: true,
        attached_bathroom: true
      },
      availability: {
        isAvailable: true,
        availableFrom: "2024-01-15"
      },
      owner: {
        id: "1",
        name: "Rajesh Kumar",
        rating: 4.9,
        verified: true,
        responseRate: 95,
        responseTime: "within 2 hours",
        joinedDate: "Joined in Jan 2020"
      },
      reviews: [
        {
          id: 1,
          userName: "Priya Sharma",
          rating: 5,
          comment: "Excellent room with all modern amenities. The owner is very responsive and helpful. Highly recommended for students!",
          date: "Dec 2023",
          verified: true,
          helpfulCount: 12,
          stayDuration: "8 months",
          categories: {
            cleanliness: 5,
            location: 5,
            facilities: 4,
            owner: 5,
            value: 4
          }
        },
        {
          id: 2,
          userName: "Amit Singh",
          rating: 4,
          comment: "Great location and clean room. WiFi speed is excellent and the area is very safe. Good value for money.",
          date: "Nov 2023",
          verified: true,
          helpfulCount: 8,
          stayDuration: "6 months",
          categories: {
            cleanliness: 4,
            location: 5,
            facilities: 4,
            owner: 4,
            value: 4
          }
        }
      ]
    };

    return mockRoom;
  }
};

// Loading skeleton component
const RoomDetailsSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-96 bg-zinc-800 rounded-xl"></div>
          <div className="h-32 bg-zinc-800 rounded-xl"></div>
          <div className="h-48 bg-zinc-800 rounded-xl"></div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-zinc-800 rounded-xl"></div>
          <div className="h-48 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
);

// Image Gallery Component
const ImageGallery = ({ images, title }: { images: string[]; title: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={images[currentIndex]}
          alt={title}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all"
        >
          <Maximize className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex ? 'border-blue-500' : 'border-transparent'
                }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={images[currentIndex]}
            alt={title}
            className="max-w-full max-h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Price Negotiation Modal
const PriceNegotiationModal = ({ room, isOpen, onClose }: { room: Room | null; isOpen: boolean; onClose: () => void }) => {
  const [offerPrice, setOfferPrice] = useState(room?.price ? room.price * 0.9 : 0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !room) return null;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log('Negotiation submitted:', {
        roomId: room?.id,
        offerPrice,
        message,
        originalPrice: room?.price
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Price negotiation request sent to owner!');
      onClose();
    } catch (error) {
      console.error('Negotiation error:', error);
      alert('Failed to send negotiation request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Negotiate Price</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Current Price: ₹{room?.price.toLocaleString()}/month
            </label>
            <label className="block text-sm font-medium text-white mb-2">
              Your Offer
            </label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your offer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add a message to your offer..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Offer'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [hasExistingBooking, setHasExistingBooking] = useState(false);

  const handleBookNow = async () => {
    if (!currentUser) {
      alert('Please login to book this room');
      router.push('/student/login?redirect=' + encodeURIComponent(`/dashboard/rooms/${id}/book`));
      return;
    }

    if (currentUser.userType !== 'student') {
      alert('Only students can book rooms');
      return;
    }

    if (!room) return;

    try {
      setBookingLoading(true);

      const userId = currentUser._id || currentUser.id;
      if (!userId) {
        alert('Invalid user session. Please login again.');
        return;
      }

      // Validate booking eligibility
      const validationResponse = await apiClient.validateBookingEligibility(room.id, userId);

      if (validationResponse.success) {
        if (validationResponse.data.canBook) {
          router.push(`/dashboard/rooms/${id}/book`);
        } else {
          const reason = validationResponse.data.reason;
          let message = 'You are not eligible to book this room.';

          switch (reason) {
            case 'ACTIVE_BOOKING_EXISTS':
              message = 'You already have an active booking. Students can only book one room at a time. Please complete or cancel your current booking first.';
              setTimeout(() => {
                router.push('/dashboard/bookings');
              }, 2000);
              break;
            case 'ROOM_NOT_AVAILABLE':
              message = 'This room is currently not available for booking.';
              break;
            case 'DUPLICATE_ROOM_BOOKING':
              message = 'You already have a booking for this room.';
              setTimeout(() => {
                router.push('/dashboard/bookings');
              }, 2000);
              break;
          }

          alert(message);
        }
      } else {
        alert(validationResponse.error || 'Failed to validate booking eligibility');
      }
    } catch (error) {
      console.error('Booking validation error:', error);
      router.push(`/dashboard/rooms/${id}/book`);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSaveRoom = async () => {
    if (!currentUser) {
      alert('Please login to save rooms');
      return;
    }

    if (!room) return;

    try {
      let response;
      if (isFavorited) {
        response = await apiClient.unsaveRoom(room.id);
        if (response.success) {
          setIsFavorited(false);
          alert('Room removed from favorites');
        }
      } else {
        response = await apiClient.saveRoom(room.id);
        if (response.success) {
          setIsFavorited(true);
          alert('Room saved to your favorites!');
        }
      }

      if (!response.success) {
        alert(response.error || 'Failed to update saved room');
      }
    } catch (error) {
      console.error('Save room error:', error);
      alert('Failed to save room');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: room?.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setIsLoading(true);
        const roomData = await roomAPI.getRoomById(id as string);
        setRoom(roomData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  useEffect(() => {
    const checkRoomStatus = async () => {
      if (currentUser && room?.id) {
        try {
          const isSaved = await apiClient.isRoomSaved(room.id);
          setIsFavorited(isSaved);

          const bookingsResponse = await apiClient.getBookings();
          if (bookingsResponse.success) {
            const existingBooking = bookingsResponse.data?.bookings?.find((booking: any) =>
              (booking.room?.id === room.id || booking.roomId === room.id) &&
              booking.status?.toLowerCase() !== 'cancelled' &&
              booking.status?.toLowerCase() !== 'rejected'
            );
            setHasExistingBooking(!!existingBooking);
          }
        } catch (error) {
          console.error('Error checking room status:', error);
        }
      }
    };

    checkRoomStatus();
  }, [currentUser, room?.id]);

  if (isLoading) return <RoomDetailsSkeleton />;

  if (error || !room) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Room Not Found</h1>
          <p className="text-zinc-400 mb-6">The room you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ImageGallery images={room.images || []} title={room.title} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Room Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                {room.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>{room.location.fullAddress || room.location.address}</span>
                </div>
                {room.rating && (
                  <div className="flex items-center gap-2 bg-yellow-900/50 px-3 py-1 rounded-full border border-yellow-700">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">{room.rating}</span>
                    <span className="text-zinc-400">({room.totalReviews} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-blue-900/50 text-blue-400 border-blue-700">
                    {room.roomType} Room
                  </Badge>
                  {room.accommodationType && (
                    <Badge variant={room.accommodationType === 'pg' ? 'secondary' : 'outline'}>
                      {room.accommodationType === 'pg' ? 'PG Accommodation' : 'Private Room'}
                    </Badge>
                  )}
                  {hasExistingBooking && (
                    <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      You Have Booked This
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700">
                  <Maximize className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-white">{room.features.area} sq ft</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-700">
                  <Home className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-white">Floor {room.features.floor}/{room.features.totalFloors}</span>
                </div>
                {room.features.furnished && (
                  <div className="flex items-center gap-2 bg-green-900/50 text-green-400 px-3 py-2 rounded-lg border border-green-700">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">Fully Furnished</span>
                  </div>
                )}
                {room.availability.isAvailable && (
                  <div className="flex items-center gap-2 bg-green-900/50 text-green-400 px-3 py-2 rounded-lg border border-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Available Now</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold text-white">
                About This Place
              </h3>
              <p className="text-zinc-300 leading-relaxed text-lg">{room.fullDescription || room.description}</p>

              {/* Quick Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-900/50 rounded-xl border border-blue-800">
                  <div className="text-2xl font-bold text-blue-400">{room.features.area}</div>
                  <div className="text-sm text-blue-300">sq ft Area</div>
                </div>
                <div className="text-center p-4 bg-green-900/50 rounded-xl border border-green-800">
                  <div className="text-2xl font-bold text-green-400">{room.rating || 'N/A'}</div>
                  <div className="text-sm text-green-300">Rating</div>
                </div>
                <div className="text-center p-4 bg-purple-900/50 rounded-xl border border-purple-800">
                  <div className="text-2xl font-bold text-purple-400">₹{Math.round(room.price / room.features.area)}</div>
                  <div className="text-sm text-purple-300">Per sq ft</div>
                </div>
                <div className="text-center p-4 bg-orange-900/50 rounded-xl border border-orange-800">
                  <div className="text-2xl font-bold text-orange-400">
                    {room.location.nearbyUniversities?.[0]?.distance || 'N/A'}
                  </div>
                  <div className="text-sm text-orange-300">km to Uni</div>
                </div>
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold text-white">
                Amenities & Facilities
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(room.detailedAmenities || room.amenities || []).slice(0, 8).map((amenityId) => {
                  const amenity = AMENITIES_LIST[amenityId];
                  if (!amenity) return null;

                  const IconComponent = amenity.icon;
                  return (
                    <div
                      key={amenityId}
                      className="flex items-center gap-2 p-3 rounded-lg bg-green-900/20 border border-green-700/30 text-green-300 hover:bg-green-900/30 transition-colors"
                      title={amenity.description}
                    >
                      <IconComponent className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="font-medium text-sm truncate">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Location */}
            {room.location.nearbyUniversities && room.location.nearbyUniversities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-white">
                  Location & Nearby
                </h3>

                {/* Nearby Universities */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg text-white">
                    🏫 Nearby Universities
                  </h4>
                  <div className="space-y-3">
                    {room.location.nearbyUniversities.map((uni, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex justify-between items-center p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:shadow-md transition-shadow"
                      >
                        <div>
                          <div className="font-semibold text-white">{uni.name}</div>
                          <div className="text-sm text-zinc-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {uni.distance} km • {uni.commute} min by transport
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Get Directions
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Nearby Facilities */}
                {room.location.nearbyFacilities && room.location.nearbyFacilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg text-white">
                      🏪 Nearby Facilities
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {room.location.nearbyFacilities.map((facility, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                              <MapPin className="w-4 h-4 text-zinc-400" />
                            </div>
                            <span className="font-medium text-white">{facility.name}</span>
                          </div>
                          <span className="text-blue-400 font-medium">{facility.distance}m</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Reviews Section Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold text-white">
                Reviews ({room.totalReviews || 0})
              </h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                <p className="text-zinc-400">Reviews section coming soon...</p>
                <p className="text-sm text-zinc-500 mt-2">
                  Average rating: <span className="text-yellow-400 font-semibold">{room.rating || 'N/A'}</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="space-y-6">
            {/* Price & Booking Card */}
            <Card className="bg-zinc-900 border-zinc-800 sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div className="text-3xl font-bold text-white">
                    ₹{room.price.toLocaleString()}
                    <span className="text-lg font-normal text-zinc-400">/month</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-500">Best Price</div>
                    <div className="text-green-400 font-medium text-sm flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Great Deal
                    </div>
                  </div>
                </div>

                {room.rating && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-white">{room.rating}</span>
                    </div>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">{room.totalReviews} reviews</span>
                    <span className="text-zinc-500">•</span>
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Move-in Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={room.availability.availableFrom}
                      className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {hasExistingBooking ? (
                    <Button
                      onClick={() => router.push('/dashboard/bookings')}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-semibold"
                    >
                      View My Booking
                    </Button>
                  ) : (
                    <Button
                      onClick={handleBookNow}
                      disabled={bookingLoading || !selectedDate}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Book Now - Pay Later'
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={() => setShowNegotiationModal(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-semibold"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Negotiate Price
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full py-4 rounded-xl font-semibold border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Visit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleSaveRoom}
                    className={`w-full py-4 rounded-xl font-semibold ${isFavorited
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                        : 'border-zinc-600 text-zinc-300 hover:bg-zinc-800'
                      }`}
                  >
                    {isFavorited ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                    {isFavorited ? 'Saved' : 'Save for Later'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="w-full py-4 rounded-xl font-semibold border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Room
                  </Button>
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-zinc-700 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Monthly Rent</span>
                    <span className="font-medium text-white">₹{room.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Security Deposit</span>
                    <span className="font-medium text-white">₹{(room.price * 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-400">
                    <span>Maintenance</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold pt-3 border-t border-zinc-700 text-lg">
                    <span className="text-white">Total Initial Cost</span>
                    <span className="text-blue-400">₹{(room.price * 3).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-zinc-500 text-center">
                  No booking fees • Cancel anytime
                </div>
              </CardContent>
            </Card>

            {/* Owner Contact Card */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Property Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                    {getInitials(room.owner.name)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center gap-2">
                      {room.owner.name}
                      {room.owner.verified && (
                        <Badge variant="secondary" className="bg-green-900/50 text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-zinc-400">{room.owner.joinedDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{room.owner.rating}</span>
                    </div>
                  </div>
                </div>

                {room.owner.responseRate && room.owner.responseTime && (
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{room.owner.responseRate}%</span>
                      </div>
                      <div className="text-xs text-zinc-500">Response Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="font-semibold">{room.owner.responseTime}</span>
                      </div>
                      <div className="text-xs text-zinc-500">Response Time</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="w-full border-gray-600 hover:bg-gray-700">
                    <MessageCircle size={16} className="mr-2" />
                    Chat with Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Price Negotiation Modal */}
      <PriceNegotiationModal
        room={room}
        isOpen={showNegotiationModal}
        onClose={() => setShowNegotiationModal(false)}
      />
    </div>
  );
}
