import { NextRequest, NextResponse } from 'next/server';
import { useAdminStore } from '@/lib/adminStore';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const incident = useAdminStore.getState().incidentReports.find(i => i.id === id);

    if (!incident) {
      return NextResponse.json({ success: false, error: 'Incident report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, incident });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch incident report' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, disciplinaryAction, adminNotes } = body;

    const incident = useAdminStore.getState().incidentReports.find(i => i.id === id);
    if (!incident) {
      return NextResponse.json({ success: false, error: 'Incident report not found' }, { status: 404 });
    }

    if (disciplinaryAction) {
      useAdminStore.getState().applySafetyDisciplinaryAction(id, disciplinaryAction, adminNotes);
    } else if (status) {
      useAdminStore.getState().updateIncidentStatus(id, status, adminNotes);
    }

    const updatedIncident = useAdminStore.getState().incidentReports.find(i => i.id === id);

    return NextResponse.json({
      success: true,
      message: 'Safety incident ticket updated successfully.',
      incident: updatedIncident
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update incident report' }, { status: 500 });
  }
}
