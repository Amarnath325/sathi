import { NextRequest, NextResponse } from 'next/server';
import { useAdminStore } from '@/lib/adminStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const q = searchParams.get('q');

    let incidents = useAdminStore.getState().incidentReports;

    if (status && status !== 'ALL') {
      incidents = incidents.filter(i => i.status === status);
    }

    if (category && category !== 'ALL') {
      incidents = incidents.filter(i => i.category === category);
    }

    if (severity && severity !== 'ALL') {
      incidents = incidents.filter(i => i.severity === severity);
    }

    if (q && q.trim() !== '') {
      const query = q.toLowerCase().trim();
      incidents = incidents.filter(i =>
        i.incidentRef.toLowerCase().includes(query) ||
        i.reporterName.toLowerCase().includes(query) ||
        i.targetName.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch incident reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reporterId, reporterName, reporterRole, targetId, targetName, targetRole, bookingId, bookingNumber, category, severity, description, evidenceUrls } = body;

    if (!reporterId || !reporterName || !targetId || !targetName || !category || !description) {
      return NextResponse.json({ success: false, error: 'reporterId, reporterName, targetId, targetName, category, and description are required fields' }, { status: 400 });
    }

    const createIncidentReport = useAdminStore.getState().createIncidentReport;
    const newReport = createIncidentReport({
      reporterId,
      reporterName,
      reporterRole: reporterRole || 'CUSTOMER',
      targetId,
      targetName,
      targetRole: targetRole || 'COMPANION',
      bookingId,
      bookingNumber,
      category,
      severity: severity || 'MODERATE',
      description,
      evidenceUrls: evidenceUrls || [],
      disciplinaryAction: 'NONE'
    });

    return NextResponse.json({
      success: true,
      message: 'Safety Incident Ticket Filed Successfully.',
      incident: newReport
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to file incident report' }, { status: 500 });
  }
}
