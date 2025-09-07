import { NextResponse } from 'next/server';

// In-memory user storage (replace with real database)
const users = [
  {
    id: 1,
    email: "admin@studentnest.com",
    username: "admin",
    password: "admin123", // In production, use bcrypt hash
    role: "admin",
    userType: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: "student@test.com",
    username: "student",
    password: "password123",
    role: "user",
    userType: "student",
    fullName: "Priya Sharma",
    collegeId: "CS2024001",
    collegeName: "Indian Institute of Technology, Delhi",
    phone: "+91 9876543210",
    dateOfBirth: "2002-06-15",
    gender: "female",
    city: "New Delhi",
    state: "Delhi",
    emergencyContact: {
      name: "Rajesh Sharma",
      relationship: "Father",
      phone: "+91 9876543211"
    },
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b000?w=150&h=150&fit=crop&crop=face",
    bio: "Computer Science student passionate about technology and innovation. Looking for comfortable accommodation near campus.",
    emailVerified: true,
    phoneVerified: true,
    aadhaarVerified: false,
    studentIdVerified: true,
    collegeVerified: true,
    profileCompletion: 85,
    roomTypePreference: ["single", "studio"],
    budgetMin: 8000,
    budgetMax: 15000,
    locationPreferences: ["Near Metro Station", "Close to College", "Market Area"],
    amenityPreferences: ["wifi", "ac", "laundry", "kitchen", "security"],
    savedProperties: 5,
    totalViews: 23,
    responseRate: 95,
    createdAt: "2024-01-15T08:30:00.000Z"
  },
  {
    id: 3,
    email: "owner@test.com",
    username: "owner",
    password: "password123",
    role: "owner",
    userType: "owner",
    fullName: "Vikram Patel",
    phone: "+91 8765432109",
    businessName: "Patel Properties & Accommodations",
    businessType: "Property Management Company",
    gstNumber: "29ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    experience: 8,
    businessDescription: "Leading property management company specializing in student accommodations across Delhi NCR. We provide safe, comfortable, and affordable housing solutions with modern amenities.",
    businessAddress: "Shop No. 15, Sector 18, Noida, Uttar Pradesh 201301",
    businessPhone: "+91 8765432108",
    businessEmail: "business@patelproperties.com",
    websiteUrl: "https://patelproperties.com",
    city: "Noida",
    state: "Uttar Pradesh",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    emailVerified: true,
    phoneVerified: true,
    aadhaarVerified: true,
    panVerified: true,
    businessVerified: true,
    gstVerified: true,
    propertyVerified: false,
    verificationStatus: "verified",
    profileCompletion: 92,
    totalProperties: 15,
    activeListings: 12,
    totalTenants: 45,
    averageRating: 4.3,
    totalBookings: 78,
    responseTime: "2 hours",
    socialMedia: {
      facebook: "https://facebook.com/patelproperties",
      instagram: "https://instagram.com/patelproperties",
      linkedin: "https://linkedin.com/company/patel-properties"
    },
    createdAt: "2023-08-10T10:15:00.000Z"
  },
  {
    id: 4,
    email: "student2@test.com",
    username: "student2",
    password: "password123",
    role: "user",
    userType: "student",
    fullName: "Arjun Kumar",
    collegeId: "ME2023015",
    collegeName: "Delhi Technological University",
    phone: "+91 9123456789",
    dateOfBirth: "2001-11-22",
    gender: "male",
    city: "Delhi",
    state: "Delhi",
    emergencyContact: {
      name: "Sunita Kumar",
      relationship: "Mother",
      phone: "+91 9123456788"
    },
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Mechanical Engineering student interested in robotics. Need shared accommodation with study-friendly environment.",
    emailVerified: true,
    phoneVerified: false,
    aadhaarVerified: false,
    studentIdVerified: false,
    collegeVerified: false,
    profileCompletion: 60,
    roomTypePreference: ["shared", "pg"],
    budgetMin: 5000,
    budgetMax: 10000,
    locationPreferences: ["Close to College", "Bus Stand Nearby", "Quiet Neighborhood"],
    amenityPreferences: ["wifi", "food", "laundry", "study_room"],
    savedProperties: 8,
    totalViews: 15,
    responseRate: 88,
    createdAt: "2024-02-20T14:45:00.000Z"
  },
  {
    id: 5,
    email: "owner2@test.com",
    username: "owner2",
    password: "password123",
    role: "owner",
    userType: "owner",
    fullName: "Meera Singh",
    phone: "+91 7654321098",
    businessName: "Singh Student Homes",
    businessType: "Individual Property Owner",
    experience: 5,
    businessDescription: "Family-owned business providing homely accommodation for students. We focus on creating a safe and comfortable environment for students away from home.",
    businessAddress: "H-45, Lajpat Nagar, New Delhi 110024",
    businessPhone: "+91 7654321097",
    businessEmail: "contact@singhstudenthouses.com",
    city: "New Delhi",
    state: "Delhi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    emailVerified: true,
    phoneVerified: true,
    aadhaarVerified: false,
    panVerified: false,
    businessVerified: false,
    gstVerified: false,
    propertyVerified: true,
    verificationStatus: "pending",
    profileCompletion: 70,
    totalProperties: 3,
    activeListings: 3,
    totalTenants: 12,
    averageRating: 4.7,
    totalBookings: 18,
    responseTime: "1 hour",
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: ""
    },
    createdAt: "2023-12-05T16:20:00.000Z"
  }
];

// POST /api/auth/login - User login
export async function POST(request) {
  try {
    const { identifier, password, userType } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // Find user by email or username
    const user = users.find(u =>
      (u.email === identifier || u.username === identifier) &&
      (userType ? u.userType === userType : true)
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, use bcrypt to compare passwords
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, generate and return JWT token
    const token = `fake-jwt-token-${user.id}`;

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: token
      },
      message: 'Login successful'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
