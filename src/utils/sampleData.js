// Sample room data based on the RoomCard and RoomDetailsPage documentation structure
export const SAMPLE_ROOMS = [
  {
    id: "room-001",
    title: "Cozy Single Room Near DU",
    description: "A comfortable single occupancy room perfect for students, located in a safe and well-connected area near Delhi University.",
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "single",
    accommodationType: "room",
    location: {
      address: "North Campus, Delhi",
      city: "Delhi",
      coordinates: { lat: 28.6139, lng: 77.2090 },
      nearbyUniversities: [
        { name: "Delhi University", distance: 2.5, commute: 15 }
      ]
    },
    amenities: [
      "wifi", "parking", "security", "kitchen", "furnished-bed", "study-table",
      "chair", "wardrobe", "ac", "attached-bathroom", "geyser", "study-desk",
      "study-lighting", "cctv", "water-24x7", "power-backup", "laundry"
    ],
    rating: 4.2,
    totalReviews: 18,
    availability: {
      isAvailable: true,
      availableFrom: "2025-09-01"
    },
    owner: {
      id: "owner_001",
      name: "Rajesh Kumar",
      verified: true,
      rating: 4.5,
      email: "rajesh.kumar@gmail.com",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      responseRate: 92
    },
    features: {
      area: 150,
      furnished: true,
      floor: 2,
      totalFloors: 4
    }
  },
  {
    id: "room-002",
    title: "Modern PG for Girls Near IIT",
    description: "Safe and secure paying guest accommodation for female students with all modern amenities.",
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "shared",
    accommodationType: "pg",
    location: {
      address: "IIT Delhi Campus, Hauz Khas",
      city: "Delhi",
      coordinates: { lat: 28.5449, lng: 77.1929 },
      nearbyUniversities: [
        { name: "IIT Delhi", distance: 1.0, commute: 8 },
        { name: "Delhi University", distance: 8.5, commute: 35 }
      ]
    },
    amenities: [
      "wifi", "security", "mess", "laundry", "furnished-bed", "study-table",
      "chair", "wardrobe", "ac", "attached-bathroom", "geyser", "cctv",
      "water-24x7", "power-backup", "gym", "tv-lounge", "housekeeping"
    ],
    rating: 4.6,
    totalReviews: 42,
    availability: {
      isAvailable: true,
      availableFrom: "2025-09-15"
    },
    owner: {
      id: "owner_002",
      name: "Priya Sharma",
      verified: true,
      rating: 4.7,
      email: "priya.sharma@gmail.com",
      phone: "+91 98765 43211",
      whatsapp: "+91 98765 43211",
      responseRate: 95
    },
    features: {
      area: 120,
      furnished: true,
      floor: 3,
      totalFloors: 5
    }
  },
  {
    id: "room-003",
    title: "Luxury Studio Apartment",
    description: "Fully furnished studio apartment with modern amenities, perfect for working professionals and graduate students.",
    price: 18000,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560449752-64ac2e71bfb5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "studio",
    accommodationType: "room",
    location: {
      address: "Lajpat Nagar, New Delhi",
      city: "Delhi",
      coordinates: { lat: 28.5679, lng: 77.2430 },
      nearbyUniversities: [
        { name: "Jamia Millia Islamia", distance: 3.2, commute: 20 },
        { name: "Delhi University", distance: 12.5, commute: 45 }
      ]
    },
    amenities: [
      "wifi", "parking", "security", "kitchenette", "furnished-bed", "study-table",
      "chair", "wardrobe", "ac", "attached-bathroom", "geyser", "study-desk",
      "study-lighting", "cctv", "water-24x7", "power-backup", "gym", "swimming-pool",
      "housekeeping", "concierge"
    ],
    rating: 4.8,
    totalReviews: 26,
    availability: {
      isAvailable: false,
      availableFrom: "2025-10-01"
    },
    owner: {
      id: "owner_003",
      name: "Amit Singh",
      verified: true,
      rating: 4.9,
      email: "amit.singh@gmail.com",
      phone: "+91 98765 43212",
      whatsapp: "+91 98765 43212",
      responseRate: 98
    },
    features: {
      area: 280,
      furnished: true,
      floor: 5,
      totalFloors: 10
    }
  },
  {
    id: "room-004",
    title: "Budget-Friendly Shared Room",
    description: "Affordable shared accommodation near metro station with basic amenities for budget-conscious students.",
    price: 6500,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e1b2530ce3d8?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "shared",
    accommodationType: "room",
    location: {
      address: "Rajouri Garden, West Delhi",
      city: "Delhi",
      coordinates: { lat: 28.6464, lng: 77.1228 },
      nearbyUniversities: [
        { name: "Delhi University", distance: 15.2, commute: 50 },
        { name: "IGNOU", distance: 8.5, commute: 30 }
      ]
    },
    amenities: [
      "wifi", "security", "kitchen", "furnished-bed", "study-table",
      "chair", "shared-bathroom", "fan", "water-24x7", "nearby-transport"
    ],
    rating: 3.8,
    totalReviews: 15,
    availability: {
      isAvailable: true,
      availableFrom: "2025-09-10"
    },
    owner: {
      id: "owner_004",
      name: "Sunita Devi",
      verified: false,
      rating: 3.9,
      email: "sunita.devi@gmail.com",
      phone: "+91 98765 43213",
      whatsapp: "+91 98765 43213",
      responseRate: 75
    },
    features: {
      area: 100,
      furnished: true,
      floor: 1,
      totalFloors: 3
    }
  },
  {
    id: "room-005",
    title: "Premium PG with All Facilities",
    description: "High-end paying guest accommodation with premium amenities including gym, swimming pool, and 24/7 services.",
    price: 15000,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "single",
    accommodationType: "pg",
    location: {
      address: "Karol Bagh, Central Delhi",
      city: "Delhi",
      coordinates: { lat: 28.6519, lng: 77.1909 },
      nearbyUniversities: [
        { name: "Delhi University", distance: 6.5, commute: 25 },
        { name: "Lady Shri Ram College", distance: 4.2, commute: 18 }
      ]
    },
    amenities: [
      "wifi", "parking", "security", "mess", "laundry", "furnished-bed", "study-table",
      "chair", "wardrobe", "ac", "attached-bathroom", "geyser", "study-desk",
      "study-lighting", "cctv", "water-24x7", "power-backup", "gym", "swimming-pool",
      "tv-lounge", "recreation", "housekeeping", "concierge", "library"
    ],
    rating: 4.7,
    totalReviews: 58,
    availability: {
      isAvailable: true,
      availableFrom: "2025-09-05"
    },
    owner: {
      id: "owner_005",
      name: "Vikram Gupta",
      verified: true,
      rating: 4.8,
      email: "vikram.gupta@gmail.com",
      phone: "+91 98765 43214",
      whatsapp: "+91 98765 43214",
      responseRate: 96
    },
    features: {
      area: 180,
      furnished: true,
      floor: 4,
      totalFloors: 8
    }
  },
  {
    id: "room-006",
    title: "Hostel-Style Accommodation",
    description: "Traditional hostel accommodation with shared facilities, perfect for students seeking a community living experience.",
    price: 7500,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e1b2530ce3d8?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "shared",
    accommodationType: "hostel",
    location: {
      address: "Mukherjee Nagar, North Delhi",
      city: "Delhi",
      coordinates: { lat: 28.7041, lng: 77.2025 },
      nearbyUniversities: [
        { name: "Delhi University", distance: 8.5, commute: 30 },
        { name: "JNU", distance: 25.5, commute: 75 }
      ]
    },
    amenities: [
      "wifi", "security", "mess", "shared-bathroom", "study-table",
      "chair", "fan", "water-24x7", "laundry", "tv-lounge", "recreation",
      "library", "cctv", "nearby-transport"
    ],
    rating: 4.1,
    totalReviews: 34,
    availability: {
      isAvailable: true,
      availableFrom: "2025-09-20"
    },
    owner: {
      id: "owner_006",
      name: "Ramesh Chand",
      verified: true,
      rating: 4.2,
      email: "ramesh.chand@gmail.com",
      phone: "+91 98765 43215",
      whatsapp: "+91 98765 43215",
      responseRate: 88
    },
    features: {
      area: 80,
      furnished: true,
      floor: 2,
      totalFloors: 4
    }
  }
];

export default SAMPLE_ROOMS;
