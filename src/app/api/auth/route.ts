import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password, role, twoFACode } = body;

    if (action === 'login') {
      // Simulate JWT rotation & 2FA check
      if (email.includes('admin') && !twoFACode) {
        return NextResponse.json({
          requires2FA: true,
          message: 'Two-Factor Authentication Code Required'
        });
      }

      return NextResponse.json({
        success: true,
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFseGVyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        refreshToken: 'd39a8c1f9b32e01a88b7762c451f2210',
        user: {
          id: 'usr-101',
          email,
          fullName: 'Alex Mercer',
          role: role || (email.includes('admin') ? 'SUPER_ADMIN' : 'CUSTOMER'),
          isVerified: true
        }
      });
    }

    if (action === 'register') {
      return NextResponse.json({
        success: true,
        message: 'Account created successfully.',
        userId: 'usr-' + Math.floor(Math.random() * 1000)
      });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Authentication Gateway Internal Error' }, { status: 500 });
  }
}
