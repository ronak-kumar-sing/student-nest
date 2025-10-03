import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Owner from '@/lib/models/Owner';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/verification?error=${encodeURIComponent('DigiLocker authentication failed')}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/verification?error=${encodeURIComponent('Invalid callback parameters')}`
      );
    }

    // Decode state to get user information
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    } catch (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/verification?error=${encodeURIComponent('Invalid state parameter')}`
      );
    }

    const { userId } = stateData;

    // Connect to database
    await connectDB();

    // Find the owner
    const owner = await Owner.findById(userId);
    if (!owner) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/verification?error=${encodeURIComponent('User not found')}`
      );
    }

    if (process.env.MOCK_VERIFICATION === 'true') {
      // Mock DigiLocker data
      const mockDigiLockerData = {
        name: owner.fullName,
        dob: '1990-01-01',
        gender: 'M',
        address: 'Mock Address, City, State - 123456',
        aadhaar: '1234-5678-9012' // Masked Aadhaar
      };

      // Update owner verification
      await owner.initiateVerification({
        digilockerLinked: true,
        digilockerData: mockDigiLockerData,
        aadhaarNumber: '123456789012', // Store full Aadhaar securely
        status: 'in-review'
      });

      // Auto-approve in mock mode
      setTimeout(async () => {
        try {
          const ownerToUpdate = await Owner.findById(userId);
          if (ownerToUpdate && ownerToUpdate.verification.status === 'in-review') {
            await ownerToUpdate.approveVerification();
            console.log(`✅ Mock DigiLocker verification approved for owner: ${ownerToUpdate.fullName}`);
          }
        } catch (error) {
          console.error('Error in mock auto-approval:', error);
        }
      }, 3000); // Auto-approve after 3 seconds

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/verification?success=${encodeURIComponent('DigiLocker verification initiated successfully')}`
      );
    }

    // In production, exchange code for access token and fetch user data
    // This is where you would implement the real DigiLocker API integration

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/verification?error=${encodeURIComponent('Real DigiLocker integration not implemented')}`
    );

  } catch (error) {
    console.error('DigiLocker callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/verification?error=${encodeURIComponent('DigiLocker verification failed')}`
    );
  }
}