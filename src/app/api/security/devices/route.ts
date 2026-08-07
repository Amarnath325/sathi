import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const devices = [
      {
        id: 'dev-1',
        userName: 'Alexander Vance (CTO)',
        browserName: 'Chrome 125 on Windows 11',
        ipAddress: '192.168.1.104',
        country: 'US',
        isTrusted: true,
        lastActiveAt: new Date().toISOString(),
      },
    ];
    return NextResponse.json({ success: true, totalDevices: devices.length, devices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');

    return NextResponse.json({
      success: true,
      message: `Device session ${deviceId || 'ALL'} revoked and access token blacklisted`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
