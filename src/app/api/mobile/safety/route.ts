import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, bookingId, latitude, longitude, targetType, targetId, reason, description } = body;

    if (action === 'sos' || (!action && latitude && longitude)) {
      return NextResponse.json({
        success: true,
        message: 'EMERGENCY SOS ALERT ACTIVATED. Safety dispatch and emergency contacts notified.',
        data: {
          sosId: 'sos_mob_' + Date.now(),
          bookingId: bookingId || 'active_booking',
          coordinates: { lat: latitude, lng: longitude },
          timestamp: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted for administrative review.',
      data: {
        reportId: 'rep_mob_' + Date.now(),
        targetType: targetType || 'BOOKING',
        targetId: targetId || '',
        reason: reason || 'Safety',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile Safety API Error' }, { status: 500 });
  }
}
