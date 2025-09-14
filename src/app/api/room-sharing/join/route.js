import { NextResponse } from 'next/server';

// Import shared data (in real app, this would be from database)
// For demo purposes, we'll use the same in-memory storage structure

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
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b000?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    userType: "student",
    emailVerified: true,
    phoneVerified: false,
    studentIdVerified: false,
    collegeVerified: false,
    fullName: "Arjun Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  }
];

function isStudentVerified(studentId) {
  const student = users.find(u => u.id === studentId && u.userType === 'student');
  return student && student.emailVerified && student.phoneVerified &&
         student.studentIdVerified && student.collegeVerified;
}

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

// POST /api/room-sharing/join - Join an existing room sharing post
export async function POST(request) {
  try {
    const { roomSharingId, studentId, assessmentAnswers } = await request.json();

    if (!roomSharingId || !studentId || !assessmentAnswers) {
      return NextResponse.json(
        { success: false, error: 'Room sharing ID, student ID, and assessment answers are required' },
        { status: 400 }
      );
    }

    // Verify student
    if (!isStudentVerified(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Student must be verified to join room sharing' },
        { status: 403 }
      );
    }

    // Find the room sharing post
    const post = roomSharingPosts.find(p => p.id === roomSharingId && p.status === 'active');
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Room sharing post not found or inactive' },
        { status: 404 }
      );
    }

    // Check if student already joined
    const alreadyJoined = post.currentParticipants.some(p => p.studentId === studentId);
    if (alreadyJoined) {
      return NextResponse.json(
        { success: false, error: 'You have already joined this room sharing' },
        { status: 409 }
      );
    }

    // Check capacity
    if (post.currentParticipants.length >= post.maxParticipants) {
      return NextResponse.json(
        { success: false, error: 'This room sharing is already at maximum capacity' },
        { status: 409 }
      );
    }

    // Add student to participants
    post.currentParticipants.push({
      studentId,
      joinedAt: new Date().toISOString(),
      isOriginalPoster: false
    });

    // Store/update assessment
    const existingAssessment = assessments.find(a => a.studentId === studentId);
    if (existingAssessment) {
      existingAssessment.answers = assessmentAnswers;
      existingAssessment.updatedAt = new Date().toISOString();
    } else {
      assessments.push({
        studentId,
        answers: assessmentAnswers,
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Successfully joined room sharing'
    });

  } catch (error) {
    console.error('Join room sharing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to join room sharing' },
      { status: 500 }
    );
  }
}