import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      alerts: [
        {
          id: 'alt-101',
          serviceName: 'DATABASE_POSTGRES',
          alertType: 'DB_POOL_EXHAUSTION',
          severity: 'HIGH',
          message: 'Active PostgreSQL pool connections reached 88% capacity during peak companion search',
          isResolved: false,
          triggeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { alertId } = body;

    return NextResponse.json({
      success: true,
      message: `System health alert [${alertId}] marked as resolved.`,
      resolvedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
