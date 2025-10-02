import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No auth header' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    await connectDB();
    const user = await User.findById(decoded.userId);
    const verification = await Verification.findOne({ userId: user._id });

    return NextResponse.json({
      success: true,
      debug: {
        user: {
          id: user._id,
          email: user.email,
          isIdentityVerified: user.isIdentityVerified,
          identityVerificationRequired: user.identityVerificationRequired,
          identityVerificationSkipped: user.identityVerificationSkipped,
          role: user.role
        },
        verification: verification ? {
          id: verification._id,
          status: verification.status,
          documentsCount: verification.documents?.length || 0,
          selfieExists: !!verification.selfie?.fileUrl,
          stepsArray: verification.steps || [],
          completedAt: verification.completedAt
        } : null
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}