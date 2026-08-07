import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const action = searchParams.get('action');

    const logs = [
      {
        sequenceNumber: 1,
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: '0x3a4b99120a1122883377445566778899aabbccddeeff00112233445566778899',
        actorName: 'Alexander Vance',
        actorRole: 'SUPER_ADMIN',
        action: 'EXECUTE',
        resourceDomain: 'SYSTEM_CONFIG',
        resourceId: 'System#Genesis',
        ipAddress: '192.168.1.104',
        checksumStatus: 'VALID',
        timestamp: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      totalCount: logs.length,
      isChainValid: true,
      logs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actorName, action, resourceDomain, resourceId, payload } = body;

    if (!actorName || !action || !resourceDomain) {
      return NextResponse.json(
        { success: false, error: 'Missing required audit parameters: actorName, action, resourceDomain' },
        { status: 400 }
      );
    }

    const sequenceNumber = Math.floor(100 + Math.random() * 900);
    const mockLog = {
      id: 'aud-' + Date.now(),
      sequenceNumber,
      previousHash: '0x3a4b99120a1122883377445566778899aabbccddeeff00112233445566778899',
      currentHash: '0x8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677',
      actorName,
      action,
      resourceDomain,
      resourceId: resourceId || 'Resource#9901',
      payload: payload || {},
      ipAddress: '127.0.0.1',
      checksumStatus: 'VALID',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Immutable audit log entry cryptographically appended',
        auditLog: mockLog,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
