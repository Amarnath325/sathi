import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId') || 'conv_default';

  return NextResponse.json({
    success: true,
    data: [
      {
        id: 'msg_101',
        conversationId,
        senderId: 'comp_1',
        senderName: 'Aanya Sharma',
        text: 'Hi John! I am looking forward to our city tour tomorrow.',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'delivered',
      },
      {
        id: 'msg_102',
        conversationId,
        senderId: 'current_user',
        senderName: 'Me',
        text: 'Sounds great! I will meet you at Connaught Place.',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'read',
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, text, mediaUrl } = body;

    const newMessage = {
      id: 'msg_' + Date.now(),
      conversationId: conversationId || 'conv_default',
      senderId: 'current_user',
      senderName: 'Me',
      text: text || '',
      mediaUrl,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    return NextResponse.json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile Chat API Error' }, { status: 500 });
  }
}
