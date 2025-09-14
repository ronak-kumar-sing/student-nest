import { NextResponse } from 'next/server';

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

// POST /api/room-sharing/assessment - Submit or update student assessment
export async function POST(request) {
  try {
    const { studentId, answers } = await request.json();

    if (!studentId || !answers) {
      return NextResponse.json(
        { success: false, error: 'Student ID and assessment answers are required' },
        { status: 400 }
      );
    }

    // Verify student exists and is a student
    const student = users.find(u => u.id === studentId && u.userType === 'student');
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Validate assessment answers
    const requiredFields = [
      'sleepSchedule', 'cleanliness', 'studyHabits', 'socialLevel',
      'cookingFrequency', 'musicPreference', 'guestPolicy'
    ];

    const missingFields = requiredFields.filter(field => !answers[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Update or create assessment
    const existingIndex = assessments.findIndex(a => a.studentId === studentId);

    if (existingIndex >= 0) {
      assessments[existingIndex] = {
        ...assessments[existingIndex],
        answers,
        updatedAt: new Date().toISOString()
      };
    } else {
      assessments.push({
        studentId,
        answers,
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      data: assessments[existingIndex >= 0 ? existingIndex : assessments.length - 1],
      message: 'Assessment saved successfully'
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}

// GET /api/room-sharing/assessment - Get student's assessment
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

    const assessment = assessments.find(a => a.studentId === studentId);

    if (!assessment) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No assessment found for this student'
      });
    }

    return NextResponse.json({
      success: true,
      data: assessment
    });

  } catch (error) {
    console.error('Get assessment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get assessment' },
      { status: 500 }
    );
  }
}