import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetRole, targetCity, targetSegment, title, body: notifBody, category, priority, channels } = body;

    if (!title || !notifBody) {
      return NextResponse.json(
        { success: false, error: 'Missing required broadcast fields: title, body' },
        { status: 400 }
      );
    }

    const broadcastId = 'bc-' + Date.now();
    const recipientCount = targetSegment === 'COMPANIONS' ? 142 : targetSegment === 'CUSTOMERS' ? 890 : 1032;

    return NextResponse.json(
      {
        success: true,
        broadcastId,
        message: `Broadcast successfully queued for ${recipientCount} recipients across [${(channels || ['IN_APP']).join(', ')}]`,
        recipientCount,
        targetedSegment: targetSegment || 'ALL_USERS',
        dispatchedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
