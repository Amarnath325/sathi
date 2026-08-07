import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const risk = searchParams.get('risk');

    const logs = [
      {
        id: 'log-sec-101',
        staffName: 'Alexander Vance',
        action: 'PERMISSION_MATRIX_UPDATED',
        resource: 'Role#MODERATOR',
        ipAddress: '192.168.1.104',
        riskLevel: 'MEDIUM',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'log-sec-102',
        staffName: 'Priya Sharma',
        action: 'EMERGENCY_SOS_DISPATCHED',
        resource: 'SosAlert#SOS-2026-9912',
        ipAddress: '10.0.4.12',
        riskLevel: 'HIGH',
        timestamp: new Date().toISOString(),
      },
    ];

    let filtered = logs;
    if (risk && risk !== 'ALL') {
      filtered = filtered.filter((l) => l.riskLevel === risk);
    }

    return NextResponse.json({ success: true, totalLogs: filtered.length, logs: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
