import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const campaigns = [
      { id: 'cmp-201', title: 'Summer Escrow Protection Notice', channel: 'EMAIL', status: 'COMPLETED', totalRecipients: 4250 },
      { id: 'cmp-202', title: 'Weekend Surge Payout Bonus', channel: 'SMS', status: 'COMPLETED', totalRecipients: 850 },
    ];
    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, channel, targetAudience, subject, body: content } = body;

    return NextResponse.json({
      success: true,
      message: `Broadcast campaign [${title}] created successfully`,
      campaign: {
        id: 'cmp-' + Date.now(),
        title,
        channel: channel || 'EMAIL',
        targetAudience: targetAudience || 'ALL_USERS',
        subject,
        body: content,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
