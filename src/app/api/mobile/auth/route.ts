import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password, firstName, lastName, phone, otp } = body;

    // Login Action
    if (action === 'login' || (!action && email && password)) {
      if (password === 'invalid') {
        return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mobile_access_token_demo',
          refreshToken: 'mobile_refresh_token_demo_987654321',
          user: {
            id: 'usr_mobile_101',
            firstName: firstName || 'John',
            lastName: lastName || 'Doe',
            email: email || 'user@example.com',
            phone: phone || '+91 9876543210',
            role: 'CUSTOMER',
            isEmailVerified: true,
            isPhoneVerified: true,
            isKycVerified: true,
            isCompanionApproved: false,
            profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            city: 'New Delhi',
          },
        },
      });
    }

    // Register Action
    if (action === 'register') {
      return NextResponse.json({
        success: true,
        message: 'Mobile account created successfully. Verification OTP sent.',
        data: {
          userId: 'usr_mob_' + Date.now(),
          email,
          phone,
          otpRequired: true,
        },
      });
    }

    // Verify OTP Action
    if (action === 'verify-otp') {
      if (otp && otp.length === 6) {
        return NextResponse.json({
          success: true,
          message: 'OTP verified successfully.',
          data: { isVerified: true },
        });
      }
      return NextResponse.json({ success: false, error: 'Invalid OTP code' }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Invalid auth action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile Auth Gateway Internal Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // Mobile /auth/me
  return NextResponse.json({
    success: true,
    data: {
      id: 'usr_mobile_101',
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@example.com',
      phone: '+91 9876543210',
      role: 'CUSTOMER',
      isEmailVerified: true,
      isPhoneVerified: true,
      isKycVerified: true,
      isCompanionApproved: false,
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      city: 'New Delhi',
    },
  });
}
