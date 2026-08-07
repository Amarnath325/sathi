import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      isMaintenanceActive: false,
      outageMessage: 'Platform operational. No active maintenance window.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { isMaintenanceActive, outageMessage } = body;

    return NextResponse.json({
      success: true,
      isMaintenanceActive: !!isMaintenanceActive,
      outageMessage: outageMessage || 'Scheduled platform maintenance active.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
