import { NextRequest, NextResponse } from 'next/server';
import { useAdminStore } from '@/lib/adminStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const q = searchParams.get('q');

    let alerts = useAdminStore.getState().sosAlerts;

    if (status && status !== 'ALL') {
      alerts = alerts.filter(a => a.status === status);
    }

    if (severity && severity !== 'ALL') {
      alerts = alerts.filter(a => a.severity === severity);
    }

    if (q && q.trim() !== '') {
      const query = q.toLowerCase().trim();
      alerts = alerts.filter(a =>
        a.alertRef.toLowerCase().includes(query) ||
        a.userName.toLowerCase().includes(query) ||
        (a.companionName && a.companionName.toLowerCase().includes(query)) ||
        a.locationName.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch SOS alerts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userPhone, companionId, companionName, companionPhone, bookingId, bookingNumber, locationName, coordinates, severity, notes, safeWordTriggered } = body;

    if (!userId || !userName || !locationName) {
      return NextResponse.json({ success: false, error: 'userId, userName, and locationName are required fields' }, { status: 400 });
    }

    const triggerSosAlert = useAdminStore.getState().triggerSosAlert;
    const newAlert = triggerSosAlert({
      userId,
      userName,
      userPhone,
      companionId,
      companionName,
      companionPhone,
      bookingId,
      bookingNumber,
      locationName,
      coordinates: coordinates || { lat: 28.6139, lng: 77.209 },
      severity: severity || 'CRITICAL_EMERGENCY',
      notes,
      liveAudioFeedActive: true,
      safeWordTriggered
    });

    return NextResponse.json({
      success: true,
      message: 'Emergency SOS Alert Triggered. Rapid Response Network Dispatched.',
      alert: newAlert
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to trigger SOS alert' }, { status: 500 });
  }
}
