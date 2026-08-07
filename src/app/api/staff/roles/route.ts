import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const roles = [
      { role: 'SUPER_ADMIN', title: 'Super Administrator', permissionsCount: 25 },
      { role: 'ADMIN', title: 'Platform Administrator', permissionsCount: 17 },
      { role: 'MODERATOR', title: 'Content & Review Moderator', permissionsCount: 5 },
      { role: 'SUPPORT_TEAM', title: 'Customer Support Lead', permissionsCount: 5 },
      { role: 'VERIFICATION_TEAM', title: 'KYC & Verification Specialist', permissionsCount: 2 },
    ];

    return NextResponse.json({ success: true, roles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, permissions } = body;

    return NextResponse.json({
      success: true,
      message: `Permission matrix for role ${role} updated`,
      updatedRole: role,
      grantedPermissionsCount: permissions?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
