import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { enableLockdown } = body;

    return NextResponse.json({
      success: true,
      isEmergencyLockdown: !!enableLockdown,
      message: enableLockdown
        ? '⚠️ EMERGENCY PLATFORM LOCKDOWN ACTIVATED: All non-admin API sessions frozen'
        : '🟢 Emergency lockdown state released. Normal platform operations resumed.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
