import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const logs = [
      { id: 'log-801', recipientEmail: 'client.vip@sathi.io', channel: 'EMAIL', status: 'OPENED', deliveredAt: new Date().toISOString() },
      { id: 'log-802', recipientEmail: 'user.john@gmail.com', channel: 'EMAIL', status: 'DELIVERED', deliveredAt: new Date().toISOString() },
      { id: 'log-803', recipientPhone: '+1 (555) 019-2831', channel: 'SMS', status: 'DELIVERED', deliveredAt: new Date().toISOString() },
    ];
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
