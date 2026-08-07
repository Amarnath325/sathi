import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const threats = [
      {
        id: 'th-101',
        ipAddress: '185.220.101.4',
        category: 'BRUTE_FORCE',
        targetResource: '/api/auth/login',
        riskLevel: 'CRITICAL',
        isBlocked: true,
        detectedAt: new Date().toISOString(),
      },
    ];
    return NextResponse.json({ success: true, totalThreats: threats.length, threats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ipAddress, action } = body;

    return NextResponse.json({
      success: true,
      message: `IP ${ipAddress} ${action === 'UNBLOCK' ? 'unblocked' : 'blacklisted'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
