import { NextResponse } from 'next/server';

// In-memory storage for room sharing posts (replace with real database)
let roomSharingPosts = [
  {
    id: 1,
    roomId: 101,
    studentId: 2, // student@test.com
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

// Mock room data
const rooms = [
  { id: 101, maxSharingCapacity: 2, ownerId: 3 },
  { id: 102, maxSharingCapacity: 3, ownerId: 3 },
  { id: 103, maxSharingCapacity: 1, ownerId: 5 }
];

// Mock users for verification check
const users = [
  {
    id: 2,
    userType: "student",
    emailVerified: true,
    phoneVerified: true,
    studentIdVerified: true,
    collegeVerified: true
  },
  {
    id: 4,
    userType: "student",
    emailVerified: true,
    phoneVerified: false,
    studentIdVerified: false,
    collegeVerified: false
  }
];

function isStudentVerified(studentId) {
  const student = users.find(u => u.id === studentId && u.userType === 'student');
  return student && student.emailVerified && student.phoneVerified &&
         student.studentIdVerified && student.collegeVerified;
}

function getRoom(roomId) {
  return rooms.find(r => r.id === roomId);
}

// POST /api/room-sharing/post - Create a room sharing post
export async function POST(request) {
  try {
    const { roomId, studentId, assessmentAnswers } = await request.json();

    if (!roomId || !studentId || !assessmentAnswers) {
      return NextResponse.json(
        { success: false, error: 'Room ID, student ID, and assessment answers are required' },
        { status: 400 }
      );
    }

    // Verify student
    if (!isStudentVerified(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Student must be verified to post room sharing' },
        { status: 403 }
      );
    }

    // Check if room exists
    const room = getRoom(roomId);
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if student already posted for this room
    const existingPost = roomSharingPosts.find(p =>
      p.roomId === roomId &&
      p.currentParticipants.some(pp => pp.studentId === studentId)
    );

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'You have already posted or joined sharing for this room' },
        { status: 409 }
      );
    }

    // Check if room already has sharing post at capacity
    const roomPost = roomSharingPosts.find(p => p.roomId === roomId && p.status === 'active');
    if (roomPost && roomPost.currentParticipants.length >= room.maxSharingCapacity) {
      return NextResponse.json(
        { success: false, error: 'This room is already at maximum sharing capacity' },
        { status: 409 }
      );
    }

    if (roomPost) {
      // Add to existing post
      roomPost.currentParticipants.push({
        studentId,
        joinedAt: new Date().toISOString(),
        isOriginalPoster: false
      });

      // Store assessment
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
        data: roomPost,
        message: 'Successfully joined room sharing'
      });
    } else {
      // Create new sharing post
      const newPost = {
        id: roomSharingPosts.length + 1,
        roomId,
        studentId,
        createdAt: new Date().toISOString(),
        maxParticipants: room.maxSharingCapacity,
        currentParticipants: [{
          studentId,
          joinedAt: new Date().toISOString(),
          isOriginalPoster: true
        }],
        assessmentAnswers,
        status: 'active'
      };

      roomSharingPosts.push(newPost);

      // Store assessment
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
        data: newPost,
        message: 'Room sharing post created successfully'
      });
    }
  } catch (error) {
    console.error('Room sharing post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create room sharing post' },
      { status: 500 }
    );
  }
}

// GET /api/room-sharing/post - Get student's room sharing posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = parseInt(searchParams.get('studentId'));

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const studentPosts = roomSharingPosts.filter(p =>
      p.currentParticipants.some(pp => pp.studentId === studentId)
    );

    return NextResponse.json({
      success: true,
      data: studentPosts
    });
  } catch (error) {
    console.error('Get room sharing posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get room sharing posts' },
      { status: 500 }
    );
  }
}