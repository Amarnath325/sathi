import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_SAFETY_PROFILES } from '@/lib/initialHubData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_SAFETY_PROFILES
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'LOG_EVENT') {
      const eventLog = {
        id: 'evt-' + Date.now(),
        type: body.eventType || 'SOS_TRIGGERED',
        bookingId: body.bookingId || 'bk-mock-101',
        serviceId: body.serviceId || 'srv-101',
        timestamp: new Date().toISOString(),
        status: 'AUDITED'
      };

      return NextResponse.json({
        success: true,
        eventLog
      });
    }

    return NextResponse.json({
      success: true,
      data: body
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
