import { NextResponse } from 'next/server';

// Sample room data with sharing capabilities
const rooms = [
  {
    id: 101,
    title: "Modern Studio Near IIT Delhi",
    location: "Hauz Khas, New Delhi",
    price: 12000,
    type: "Studio",
    amenities: ["WiFi", "AC", "Kitchen", "Security"],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],
    maxSharingCapacity: 2,
    ownerId: 3
  },
  {
    id: 102,
    title: "Spacious 2BHK in Student Hub",
    location: "Lajpat Nagar, New Delhi",
    price: 8000,
    type: "Shared",
    amenities: ["WiFi", "Kitchen", "Laundry", "Study Room"],
    images: ["https://images.unsplash.com/photo-1560448204-e1a3ecbdd543?w=400&h=300&fit=crop"],
    maxSharingCapacity: 3,
    ownerId: 3
  },
  {
    id: 103,
    title: "Premium Single Room",
    location: "CP, New Delhi",
    price: 15000,
    type: "Single",
    amenities: ["WiFi", "AC", "Kitchen", "Gym"],
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"],
    maxSharingCapacity: 1,
    ownerId: 5
  },
  {
    id: 104,
    title: "Cozy Studio in Munirka",
    location: "Munirka, New Delhi",
    price: 9500,
    type: "Studio",
    amenities: ["WiFi", "Kitchen", "Security", "Parking"],
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"],
    maxSharingCapacity: 2,
    ownerId: 6
  },
  {
    id: 105,
    title: "3BHK Apartment Near DU",
    location: "Kamla Nagar, New Delhi",
    price: 7000,
    type: "Shared",
    amenities: ["WiFi", "AC", "Kitchen", "Laundry", "Study Room"],
    images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"],
    maxSharingCapacity: 4,
    ownerId: 7
  },
  {
    id: 106,
    title: "Luxury PG in Greater Kailash",
    location: "Greater Kailash, New Delhi",
    price: 18000,
    type: "Single",
    amenities: ["WiFi", "AC", "Kitchen", "Gym", "Security", "Housekeeping"],
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop"],
    maxSharingCapacity: 1,
    ownerId: 8
  },
  {
    id: 107,
    title: "Budget Friendly Room in Rajouri Garden",
    location: "Rajouri Garden, New Delhi",
    price: 6500,
    type: "Shared",
    amenities: ["WiFi", "Kitchen", "Laundry"],
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"],
    maxSharingCapacity: 3,
    ownerId: 9
  },
  {
    id: 108,
    title: "Modern Apartment in Vasant Kunj",
    location: "Vasant Kunj, New Delhi",
    price: 13500,
    type: "Studio",
    amenities: ["WiFi", "AC", "Kitchen", "Gym", "Security", "Parking"],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],
    maxSharingCapacity: 2,
    ownerId: 10
  },
  {
    id: 109,
    title: "Student Housing Near AIIMS",
    location: "Ansari Nagar, New Delhi",
    price: 10500,
    type: "Shared",
    amenities: ["WiFi", "Kitchen", "Study Room", "Security"],
    images: ["https://images.unsplash.com/photo-1560448204-e1a3ecbdd543?w=400&h=300&fit=crop"],
    maxSharingCapacity: 3,
    ownerId: 11
  },
  {
    id: 110,
    title: "Premium Studio in Dwarka",
    location: "Dwarka, New Delhi",
    price: 11000,
    type: "Studio",
    amenities: ["WiFi", "AC", "Kitchen", "Gym", "Security"],
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"],
    maxSharingCapacity: 2,
    ownerId: 12
  }
];

let roomSharingPosts = [
  {
    id: 1,
    roomId: 101,
    studentId: 2,
    createdAt: '2024-09-14T10:00:00Z',
    maxParticipants: 2,
    currentParticipants: [
      {
        studentId: 2,
        joinedAt: '2024-09-14T10:00:00Z',
        isOriginalPoster: true
      }
    ],
    assessmentAnswers: {
      sleepSchedule: 'early',
      cleanliness: 'high',
      studyHabits: 'quiet',
      socialLevel: 'moderate',
      cookingFrequency: 'often',
      musicPreference: 'quiet',
      guestPolicy: 'occasional'
    },
    status: 'active'
  },
  {
    id: 2,
    roomId: 102,
    studentId: 4,
    createdAt: '2024-09-13T14:30:00Z',
    maxParticipants: 3,
    currentParticipants: [
      {
        studentId: 4,
        joinedAt: '2024-09-13T14:30:00Z',
        isOriginalPoster: true
      },
      {
        studentId: 5,
        joinedAt: '2024-09-14T09:15:00Z',
        isOriginalPoster: false
      }
    ],
    assessmentAnswers: {
      sleepSchedule: 'night',
      cleanliness: 'medium',
      studyHabits: 'music',
      socialLevel: 'social',
      cookingFrequency: 'rarely',
      musicPreference: 'loud',
      guestPolicy: 'frequent'
    },
    status: 'active'
  },
  {
    id: 3,
    roomId: 104,
    studentId: 6,
    createdAt: '2024-09-12T16:45:00Z',
    maxParticipants: 2,
    currentParticipants: [
      {
        studentId: 6,
        joinedAt: '2024-09-12T16:45:00Z',
        isOriginalPoster: true
      }
    ],
    assessmentAnswers: {
      sleepSchedule: 'early',
      cleanliness: 'high',
      studyHabits: 'quiet',
      socialLevel: 'introvert',
      cookingFrequency: 'often',
      musicPreference: 'quiet',
      guestPolicy: 'rare'
    },
    status: 'active'
  },
  {
    id: 4,
    roomId: 105,
    studentId: 7,
    createdAt: '2024-09-11T11:20:00Z',
    maxParticipants: 4,
    currentParticipants: [
      {
        studentId: 7,
        joinedAt: '2024-09-11T11:20:00Z',
        isOriginalPoster: true
      },
      {
        studentId: 8,
        joinedAt: '2024-09-12T13:30:00Z',
        isOriginalPoster: false
      },
      {
        studentId: 9,
        joinedAt: '2024-09-13T15:45:00Z',
        isOriginalPoster: false
      }
    ],
    assessmentAnswers: {
      sleepSchedule: 'night',
      cleanliness: 'medium',
      studyHabits: 'music',
      socialLevel: 'social',
      cookingFrequency: 'sometimes',
      musicPreference: 'moderate',
      guestPolicy: 'occasional'
    },
    status: 'active'
  },
  {
    id: 5,
    roomId: 107,
    studentId: 10,
    createdAt: '2024-09-10T08:15:00Z',
    maxParticipants: 3,
    currentParticipants: [
      {
        studentId: 10,
        joinedAt: '2024-09-10T08:15:00Z',
        isOriginalPoster: true
      }
    ],
    assessmentAnswers: {
      sleepSchedule: 'early',
      cleanliness: 'medium',
      studyHabits: 'quiet',
      socialLevel: 'moderate',
      cookingFrequency: 'rarely',
      musicPreference: 'quiet',
      guestPolicy: 'occasional'
    },
    status: 'active'
  },
  {
    id: 6,
    roomId: 108,
    studentId: 11,
    createdAt: '2024-09-09T19:30:00Z',
    maxParticipants: 2,
    currentParticipants: [
      {
        studentId: 11,
        joinedAt: '2024-09-09T19:30:00Z',
        isOriginalPoster: true
      },
      {
        studentId: 12,
        joinedAt: '2024-09-10T10:20:00Z',
        isOriginalPoster: false
      }
    ],
    assessmentAnswers: {
      sleepSchedule: 'night',
      cleanliness: 'high',
      studyHabits: 'music',
      socialLevel: 'social',
      cookingFrequency: 'often',
      musicPreference: 'moderate',
      guestPolicy: 'frequent'
    },
    status: 'active'
  },
  {
    id: 7,
    roomId: 109,
    studentId: 13,
    createdAt: '2024-09-08T12:00:00Z',
    maxParticipants: 3,
    currentParticipants: [
      {
        studentId: 13,
        joinedAt: '2024-09-08T12:00:00Z',
        isOriginalPoster: true
      },
      {
        studentId: 14,
        joinedAt: '2024-09-09T14:15:00Z',
        isOriginalPoster: false
      }
    ],
    assessmentAnswers: {
      sleepSchedule: 'early',
      cleanliness: 'high',
      studyHabits: 'quiet',
      socialLevel: 'introvert',
      cookingFrequency: 'sometimes',
      musicPreference: 'quiet',
      guestPolicy: 'rare'
    },
    status: 'active'
  },
  {
    id: 8,
    roomId: 110,
    studentId: 15,
    createdAt: '2024-09-07T17:45:00Z',
    maxParticipants: 2,
    currentParticipants: [
      {
        studentId: 15,
        joinedAt: '2024-09-07T17:45:00Z',
        isOriginalPoster: true
      }
    ],
    assessmentAnswers: {
      sleepSchedule: 'night',
      cleanliness: 'medium',
      studyHabits: 'music',
      socialLevel: 'moderate',
      cookingFrequency: 'often',
      musicPreference: 'loud',
      guestPolicy: 'occasional'
    },
    status: 'active'
  }
];

const users = [
  {
    id: 2,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b000?w=150&h=150&fit=crop&crop=face",
    collegeName: "Indian Institute of Technology, Delhi"
  },
  {
    id: 4,
    userType: "student",
    emailVerified: true,
    phoneVerified: false,
    studentIdVerified: false,
    collegeVerified: false,
    fullName: "Arjun Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    collegeName: "Delhi Technological University"
  },
  {
    id: 5,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Anjali Singh",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    collegeName: "Delhi University"
  },
  {
    id: 6,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Rahul Gupta",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    collegeName: "Jamia Millia Islamia"
  },
  {
    id: 7,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Sneha Patel",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    collegeName: "Indraprastha Institute of Information Technology"
  },
  {
    id: 8,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: false,
    collegeVerified: true,
    fullName: "Vikram Yadav",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    collegeName: "Netaji Subhas University of Technology"
  },
  {
    id: 9,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Kavya Reddy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    collegeName: "All India Institute of Medical Sciences"
  },
  {
    id: 10,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: false,
    fullName: "Mohit Jain",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    collegeName: "Guru Gobind Singh Indraprastha University"
  },
  {
    id: 11,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Isha Agarwal",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    collegeName: "Lady Shri Ram College"
  },
  {
    id: 12,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Karan Malhotra",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    collegeName: "Indian Institute of Technology, Delhi"
  },
  {
    id: 13,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Pooja Sharma",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    collegeName: "All India Institute of Medical Sciences"
  },
  {
    id: 14,
    userType: "student",
    emailVerified: true,
    phoneVerified: false,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Amit Verma",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    collegeName: "Delhi School of Economics"
  },
  {
    id: 15,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true,
    fullName: "Riya Kapoor",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    collegeName: "Shri Ram College of Commerce"
  }
];

let assessments = [
  {
    studentId: 2,
    answers: {
      sleepSchedule: 'early',
      cleanliness: 'high',
      studyHabits: 'quiet',
      socialLevel: 'moderate',
      cookingFrequency: 'often',
      musicPreference: 'quiet',
      guestPolicy: 'occasional'
    },
    createdAt: '2024-09-14T10:00:00Z'
  },
  {
    studentId: 4,
    answers: {
      sleepSchedule: 'night',
      cleanliness: 'medium',
      studyHabits: 'music',
      socialLevel: 'social',
      cookingFrequency: 'rarely',
      musicPreference: 'loud',
      guestPolicy: 'frequent'
    },
    createdAt: '2024-09-13T14:30:00Z'
  },
  {
    studentId: 5,
    answers: {
      sleepSchedule: 'night',
      cleanliness: 'high',
      studyHabits: 'music',
      socialLevel: 'social',
      cookingFrequency: 'sometimes',
      musicPreference: 'moderate',
      guestPolicy: 'occasional'
    },
    createdAt: '2024-09-14T09:15:00Z'
  },
  {
    studentId: 6,
    answers: {
      sleepSchedule: 'early',
      cleanliness: 'high',
      studyHabits: 'quiet',
      socialLevel: 'introvert',
      cookingFrequency: 'often',
      musicPreference: 'quiet',
      guestPolicy: 'rare'
    },
    createdAt: '2024-09-12T16:45:00Z'
  },
  {
    studentId: 7,
    answers: {
      sleepSchedule: 'night',
      cleanliness: 'medium',
      studyHabits: 'music',
      socialLevel: 'social',
      cookingFrequency: 'sometimes',
      musicPreference: 'moderate',
      guestPolicy: 'occasional'
    },
    createdAt: '2024-09-11T11:20:00Z'
  },
  {
    studentId: 8,
    answers: {
      sleepSchedule: 'night',
      cleanliness: 'low',
      studyHabits: 'music',
      socialLevel: 'social',
      cookingFrequency: 'rarely',
      musicPreference: 'loud',
      guestPolicy: 'frequent'
    },
    createdAt: '2024-09-12T13:30:00Z'
  },
  {
    studentId: 9,
    answers: {
      sleepSchedule: 'moderate',
      cleanliness: 'medium',
      studyHabits: 'quiet',
      socialLevel: 'moderate',
      cookingFrequency: 'sometimes',
      musicPreference: 'moderate',
      guestPolicy: 'occasional'
    },
    createdAt: '2024-09-13T15:45:00Z'
  },
  {
    studentId: 10,
    answers: {
      sleepSchedule: 'early',
      cleanliness: 'medium',
      studyHabits: 'quiet',
      socialLevel: 'moderate',
      cookingFrequency: 'rarely',
      musicPreference: 'quiet',
      guestPolicy: 'occasional'
    },
    createdAt: '2024-09-10T08:15:00Z'
  },
  {
    studentId: 11,
    answers: {
      sleepSchedule: 'night',
      cleanliness: 'high',
      studyHabits: 'music',
      socialLevel: 'social',
      cookingFrequency: 'often',
      musicPreference: 'moderate',
      guestPolicy: 'frequent'
    },
    createdAt: '2024-09-09T19:30:00Z'
  },
  {
    studentId: 12,
    answers: {
      sleepSchedule: 'moderate',
      cleanliness: 'high',
      studyHabits: 'quiet',
      socialLevel: 'social',
      cookingFrequency: 'often',
      musicPreference: 'quiet',
      guestPolicy: 'occasional'
    },
    createdAt: '2024-09-10T10:20:00Z'
  },
  {
    studentId: 13,
    answers: {
      sleepSchedule: 'early',
      cleanliness: 'high',
      studyHabits: 'quiet',
      socialLevel: 'introvert',
      cookingFrequency: 'sometimes',
      musicPreference: 'quiet',
      guestPolicy: 'rare'
    },
    createdAt: '2024-09-08T12:00:00Z'
  },
  {
    studentId: 14,
    answers: {
      sleepSchedule: 'early',
      cleanliness: 'medium',
      studyHabits: 'quiet',
      socialLevel: 'moderate',
      cookingFrequency: 'sometimes',
      musicPreference: 'quiet',
      guestPolicy: 'rare'
    },
    createdAt: '2024-09-09T14:15:00Z'
  },
  {
    studentId: 15,
    answers: {
      sleepSchedule: 'night',
      cleanliness: 'medium',
      studyHabits: 'music',
      socialLevel: 'moderate',
      cookingFrequency: 'often',
      musicPreference: 'loud',
      guestPolicy: 'occasional'
    },
    createdAt: '2024-09-07T17:45:00Z'
  }
];

function calculateCompatibility(answers1, answers2) {
  if (!answers1 || !answers2) return 0;

  const keys = Object.keys(answers1);
  let matches = 0;

  keys.forEach(key => {
    if (answers1[key] === answers2[key]) {
      matches++;
    }
  });

  return Math.round((matches / keys.length) * 100);
}

function isStudentVerified(studentId) {
  const student = users.find(u => u.id === studentId && u.userType === 'student');
  return student && student.emailVerified && student.phoneVerified &&
         student.studentIdVerified && student.collegeVerified;
}

function getStudentInfo(studentId) {
  return users.find(u => u.id === studentId && u.userType === 'student');
}

// GET /api/room-sharing/list - List all active room sharing posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentStudentId = parseInt(searchParams.get('studentId'));
    const location = searchParams.get('location');
    const minPrice = parseInt(searchParams.get('minPrice')) || 0;
    const maxPrice = parseInt(searchParams.get('maxPrice')) || 999999;
    const roomType = searchParams.get('roomType');

    // Get active room sharing posts with room details
    let sharingPosts = roomSharingPosts
      .filter(post => post.status === 'active')
      .map(post => {
        const room = rooms.find(r => r.id === post.roomId);
        if (!room) return null;

        // Add participant details with compatibility scores
        const participantsWithDetails = post.currentParticipants.map(participant => {
          const student = getStudentInfo(participant.studentId);
          const studentAssessment = assessments.find(a => a.studentId === participant.studentId);

          let compatibilityScore = 0;
          if (currentStudentId && studentAssessment) {
            const currentStudentAssessment = assessments.find(a => a.studentId === currentStudentId);
            if (currentStudentAssessment) {
              compatibilityScore = calculateCompatibility(
                studentAssessment.answers,
                currentStudentAssessment.answers
              );
            }
          }

          return {
            ...participant,
            student: student ? {
              id: student.id,
              fullName: student.fullName,
              avatar: student.avatar,
              collegeName: student.collegeName,
              isVerified: isStudentVerified(student.id)
            } : null,
            compatibilityScore
          };
        });

        const availableSlots = post.maxParticipants - post.currentParticipants.length;

        return {
          ...post,
          room,
          participants: participantsWithDetails,
          availableSlots,
          canJoin: availableSlots > 0 &&
                   currentStudentId &&
                   !post.currentParticipants.some(p => p.studentId === currentStudentId) &&
                   isStudentVerified(currentStudentId)
        };
      })
      .filter(post => post !== null);

    // Apply filters
    if (location) {
      sharingPosts = sharingPosts.filter(post =>
        post.room.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice || maxPrice) {
      sharingPosts = sharingPosts.filter(post =>
        post.room.price >= minPrice && post.room.price <= maxPrice
      );
    }

    if (roomType) {
      sharingPosts = sharingPosts.filter(post =>
        post.room.type.toLowerCase() === roomType.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: sharingPosts,
      totalCount: sharingPosts.length
    });

  } catch (error) {
    console.error('List room sharing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get room sharing list' },
      { status: 500 }
    );
  }
}