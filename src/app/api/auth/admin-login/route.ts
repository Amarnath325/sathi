import { NextResponse } from 'next/server';
import { useAdminAuthStore } from '@/lib/adminAuthStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, secretKey } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Admin Email and Password are required.' },
        { status: 400 }
      );
    }

    // Authenticate strictly against dedicated `adminsTable`
    const { verifyAdminAccount } = useAdminAuthStore.getState();
    const result = verifyAdminAccount(email, password, secretKey);

    if (!result.success || !result.admin) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message || 'Invalid Admin Credentials in Admins Table.' 
        },
        { status: 401 }
      );
    }

    const admin = result.admin;

    // Generate JWT Session for Super Admin
    const adminUser = {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      isVerified: true,
      lastLogin: new Date().toISOString()
    };

    const mockAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${admin.id}_token_2026`;

    const response = NextResponse.json({
      success: true,
      message: 'Super Admin Authentication Successful.',
      token: mockAccessToken,
      user: adminUser
    });

    response.cookies.set('adminToken', mockAccessToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error during Admin Authentication' },
      { status: 500 }
    );
  }
}
