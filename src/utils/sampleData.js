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
  },
  {
    id: "room-007",
    title: "Modern Studio Apartment in Munirka",
    description: "A fully furnished studio apartment perfect for graduate students, equipped with modern amenities and excellent connectivity.",
    price: 14000,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "studio",
    accommodationType: "apartment",
    location: {
      address: "Munirka Village, New Delhi",
      city: "Delhi",
      coordinates: { lat: 28.5598, lng: 77.1803 },
      nearbyUniversities: [
        { name: "IIT Delhi", distance: 3.0, commute: 20 },
        { name: "JNU", distance: 2.5, commute: 15 }
      ]
    },
    amenities: [
      "wifi", "parking", "security", "kitchen", "furnished-bed", "study-table",
      "chair", "wardrobe", "ac", "attached-bathroom", "geyser", "study-desk",
      "cctv", "water-24x7", "power-backup", "laundry", "gym", "elevator"
    ],
    rating: 4.6,
    totalReviews: 25,
    availability: {
      isAvailable: true,
      availableFrom: "2025-09-15"
    },
    owner: {
      id: "owner_007",
      name: "Priya Sharma",
      verified: true,
      rating: 4.7,
      email: "priya.sharma@gmail.com",
      phone: "+91 98765 43221",
      whatsapp: "+91 98765 43221",
      responseRate: 95
    },
    features: {
      area: 300,
      furnished: true,
      floor: 3,
      totalFloors: 5
    }
  },
  {
    id: "room-008",
    title: "Budget Shared Room in Kamla Nagar",
    description: "Affordable shared accommodation for students attending Delhi University and nearby colleges. Safe and friendly environment.",
    price: 6500,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e1a3ecbdd543?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "shared",
    accommodationType: "room",
    location: {
      address: "Kamla Nagar, Delhi",
      city: "Delhi",
      coordinates: { lat: 28.6817, lng: 77.2067 },
      nearbyUniversities: [
        { name: "Delhi University", distance: 1.5, commute: 10 },
        { name: "GTBIT", distance: 2.0, commute: 15 }
      ]
    },
    amenities: [
      "wifi", "security", "kitchen", "furnished-bed", "study-table",
      "chair", "wardrobe", "attached-bathroom", "geyser", "study-desk",
      "cctv", "water-24x7", "laundry"
    ],
    rating: 4.0,
    totalReviews: 22,
    availability: {
      isAvailable: true,
      availableFrom: "2025-08-20"
    },
    owner: {
      id: "owner_008",
      name: "Suresh Agarwal",
      verified: true,
      rating: 4.1,
      email: "suresh.agarwal@gmail.com",
      phone: "+91 98765 43222",
      whatsapp: "+91 98765 43222",
      responseRate: 85
    },
    features: {
      area: 120,
      furnished: true,
      floor: 1,
      totalFloors: 3
    }
  },
  {
    id: "room-009",
    title: "Premium PG in Greater Kailash",
    description: "Luxury paying guest accommodation with top-notch facilities including gym, recreation room, and 24/7 security.",
    price: 18500,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "single",
    accommodationType: "pg",
    location: {
      address: "Greater Kailash I, New Delhi",
      city: "Delhi",
      coordinates: { lat: 28.5494, lng: 77.2389 },
      nearbyUniversities: [
        { name: "Jamia Millia Islamia", distance: 5.0, commute: 25 },
        { name: "Shri Ram College", distance: 8.0, commute: 35 }
      ]
    },
    amenities: [
      "wifi", "parking", "security", "kitchen", "furnished-bed", "study-table",
      "chair", "wardrobe", "ac", "attached-bathroom", "geyser", "study-desk",
      "study-lighting", "cctv", "water-24x7", "power-backup", "laundry",
      "gym", "recreation-room", "housekeeping", "meals", "elevator"
    ],
    rating: 4.8,
    totalReviews: 35,
    availability: {
      isAvailable: true,
      availableFrom: "2025-09-01"
    },
    owner: {
      id: "owner_009",
      name: "Kavita Malhotra",
      verified: true,
      rating: 4.8,
      email: "kavita.malhotra@gmail.com",
      phone: "+91 98765 43223",
      whatsapp: "+91 98765 43223",
      responseRate: 98
    },
    features: {
      area: 200,
      furnished: true,
      floor: 4,
      totalFloors: 6
    }
  },
  {
    id: "room-010",
    title: "Cozy 1BHK Near AIIMS",
    description: "Perfect for medical students and professionals. Close to AIIMS with easy access to metro and excellent medical facilities nearby.",
    price: 16000,
    images: [
      "https://images.unsplash.com/photo-1560448204-e1a3ecbdd543?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "apartment",
    accommodationType: "apartment",
    location: {
      address: "Ansari Nagar, New Delhi",
      city: "Delhi",
      coordinates: { lat: 28.5672, lng: 77.2069 },
      nearbyUniversities: [
        { name: "AIIMS Delhi", distance: 0.5, commute: 5 },
        { name: "MAMC", distance: 2.0, commute: 15 }
      ]
    },
    amenities: [
      "wifi", "parking", "security", "kitchen", "furnished-bed", "study-table",
      "chair", "wardrobe", "ac", "attached-bathroom", "geyser", "study-desk",
      "study-lighting", "cctv", "water-24x7", "power-backup", "laundry"
    ],
    rating: 4.4,
    totalReviews: 28,
    availability: {
      isAvailable: true,
      availableFrom: "2025-08-25"
    },
    owner: {
      id: "owner_010",
      name: "Dr. Rajesh Gupta",
      verified: true,
      rating: 4.6,
      email: "dr.rajesh.gupta@gmail.com",
      phone: "+91 98765 43224",
      whatsapp: "+91 98765 43224",
      responseRate: 90
    },
    features: {
      area: 450,
      furnished: true,
      floor: 2,
      totalFloors: 4
    }
  },
  {
    id: "room-011",
    title: "Student Hostel in Dwarka",
    description: "Modern hostel facility with excellent connectivity to metro. Perfect for students attending colleges in Delhi and NCR.",
    price: 9500,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    roomType: "shared",
    accommodationType: "hostel",
    location: {
      address: "Dwarka Sector 12, New Delhi",
      city: "Delhi",
      coordinates: { lat: 28.5921, lng: 77.0460 },
      nearbyUniversities: [
        { name: "NSUT", distance: 3.5, commute: 20 },
        { name: "IGDTUW", distance: 4.0, commute: 25 }
      ]
    },
    amenities: [
      "wifi", "parking", "security", "kitchen", "furnished-bed", "study-table",
      "chair", "wardrobe", "attached-bathroom", "geyser", "study-desk",
      "cctv", "water-24x7", "power-backup", "laundry", "recreation-room", "meals"
    ],
    rating: 4.3,
    totalReviews: 45,
    availability: {
      isAvailable: true,
      availableFrom: "2025-09-10"
    },
    owner: {
      id: "owner_011",
      name: "Hostel Management Pvt Ltd",
      verified: true,
      rating: 4.4,
      email: "info@dwarkahostel.com",
      phone: "+91 98765 43225",
      whatsapp: "+91 98765 43225",
      responseRate: 87
    },
    features: {
      area: 100,
      furnished: true,
      floor: 3,
      totalFloors: 8
    }
  }
];

// Sample user data for authentication and profile demonstration
export const sampleUsers = [
  {
    id: "user_001",
    email: "john.doe@du.ac.in",
    password: "password123", // In real app, this would be hashed
    role: "student",
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    college: "Delhi University",
    yearOfStudy: "3rd",
    course: "Computer Science",
    savedProperties: 5,
    meetingRequests: 3,
    profileCompleteness: 85,
    verification: {
      email: true,
      phone: true,
      collegeId: "verified"
    },
    profile: {
      bio: "Computer Science student at Delhi University looking for accommodation near campus.",
      preferences: {
        roomType: ["single", "shared"],
        budgetRange: [8000, 15000],
        location: ["North Campus", "Central Delhi"],
        amenities: ["wifi", "parking", "security"]
      }
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-20T08:30:00Z"
  },
  {
    id: "user_002",
    email: "priya.sharma@student.jnu.ac.in",
    password: "securepass456",
    role: "student",
    firstName: "Priya",
    lastName: "Sharma",
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true,
    emailVerified: true,
    phoneVerified: false,
    college: "Jawaharlal Nehru University",
    yearOfStudy: "2nd",
    course: "International Relations",
    savedProperties: 8,
    meetingRequests: 2,
    profileCompleteness: 75,
    verification: {
      email: true,
      phone: false,
      collegeId: "pending"
    },
    profile: {
      bio: "International Relations student seeking a quiet place to study and live.",
      preferences: {
        roomType: ["single"],
        budgetRange: [12000, 20000],
        location: ["South Delhi", "Central Delhi"],
        amenities: ["wifi", "study_room", "library_access"]
      }
    },
    createdAt: "2024-02-10T14:20:00Z",
    updatedAt: "2024-12-18T16:45:00Z"
  },
  {
    id: "user_003",
    email: "rajesh.property@gmail.com",
    password: "owner123secure",
    role: "owner",
    firstName: "Rajesh",
    lastName: "Kumar",
    name: "Rajesh Kumar",
    phone: "+91 99887 76655",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    businessName: "Kumar Properties",
    businessType: "individual",
    experience: 8,
    totalProperties: 12,
    totalBookings: 156,
    averageRating: 4.3,
    responseTime: 2,
    verification: {
      email: true,
      phone: true,
      aadhaar: "verified",
      pan: "verified",
      digilocker: true
    },
    profile: {
      bio: "Experienced property owner providing quality accommodation for students in Delhi.",
      businessDetails: {
        gstNumber: "07AAAAA0000A1Z5",
        businessAddress: "Karol Bagh, New Delhi",
        specializations: ["student_housing", "pg_accommodation"]
      }
    },
    createdAt: "2023-08-05T09:15:00Z",
    updatedAt: "2024-12-21T11:20:00Z"
  },
  {
    id: "user_004",
    email: "sarah.wilson@student.iitd.ac.in",
    password: "iitdstudent789",
    role: "student",
    firstName: "Sarah",
    lastName: "Wilson",
    name: "Sarah Wilson",
    phone: "+91 76543 21098",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    college: "Indian Institute of Technology Delhi",
    yearOfStudy: "1st",
    course: "Mechanical Engineering",
    savedProperties: 3,
    meetingRequests: 1,
    profileCompleteness: 90,
    verification: {
      email: true,
      phone: true,
      collegeId: "verified"
    },
    profile: {
      bio: "First-year Mechanical Engineering student at IIT Delhi looking for accommodation.",
      preferences: {
        roomType: ["single"],
        budgetRange: [15000, 25000],
        location: ["Hauz Khas", "South Delhi"],
        amenities: ["wifi", "gym", "security", "parking"]
      }
    },
    createdAt: "2024-07-01T12:30:00Z",
    updatedAt: "2024-12-19T14:15:00Z"
  },
  {
    id: "user_005",
    email: "anita.homes@business.com",
    password: "business2024",
    role: "owner",
    firstName: "Anita",
    lastName: "Singh",
    name: "Anita Singh",
    phone: "+91 88776 65544",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    businessName: "Anita Student Homes",
    businessType: "company",
    experience: 5,
    totalProperties: 8,
    totalBookings: 89,
    averageRating: 4.1,
    responseTime: 3,
    verification: {
      email: true,
      phone: true,
      aadhaar: "in_review",
      pan: "verified",
      digilocker: false
    },
    profile: {
      bio: "Dedicated to providing safe and comfortable housing solutions for female students.",
      businessDetails: {
        gstNumber: "07BBBBB1111B2Z6",
        businessAddress: "Lajpat Nagar, New Delhi",
        specializations: ["female_only", "secure_accommodation"]
      }
    },
    createdAt: "2023-11-20T16:45:00Z",
    updatedAt: "2024-12-20T10:00:00Z"
  }
];

export default SAMPLE_ROOMS;
