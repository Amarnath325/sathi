import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const policy = {
      policyName: 'SATHI_ENTERPRISE_CORE_POLICY',
      whitelistedIpRanges: ['192.168.1.0/24', '10.0.0.0/16'],
      blacklistedIps: ['185.220.101.4', '45.154.255.8'],
      maxFailedLogins: 5,
      sessionTimeoutMinutes: 30,
      passwordExpiryDays: 90,
      isEmergencyLockdown: false,
    };
    return NextResponse.json({ success: true, policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Platform security policy updated',
      updatedPolicy: body,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
