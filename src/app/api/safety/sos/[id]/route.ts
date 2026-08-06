import { NextRequest, NextResponse } from 'next/server';
import { useAdminStore } from '@/lib/adminStore';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const alert = useAdminStore.getState().sosAlerts.find(a => a.id === id);

    if (!alert) {
      return NextResponse.json({ success: false, error: 'SOS Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, alert });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch SOS alert' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { action, responderName, policeRef, notes, isFalseAlarm } = body;

    const alert = useAdminStore.getState().sosAlerts.find(a => a.id === id);
    if (!alert) {
      return NextResponse.json({ success: false, error: 'SOS Alert not found' }, { status: 404 });
    }

    if (action === 'DISPATCH') {
      if (!responderName) {
        return NextResponse.json({ success: false, error: 'responderName is required for dispatch action' }, { status: 400 });
      }
      useAdminStore.getState().dispatchResponders(id, responderName, policeRef);
      return NextResponse.json({ success: true, message: `Responders (${responderName}) dispatched to SOS location.` });
    }

    if (action === 'RESOLVE') {
      useAdminStore.getState().resolveSosAlert(id, notes, isFalseAlarm);
      return NextResponse.json({ success: true, message: 'SOS Alert marked as resolved.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action. Supported actions: DISPATCH, RESOLVE' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update SOS alert' }, { status: 500 });
  }
}
