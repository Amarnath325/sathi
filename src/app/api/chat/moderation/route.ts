import { NextResponse } from 'next/server';
import { MessagingModerationEngine } from '@/lib/messagingModeration';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, isBookingConfirmed } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required.' }, { status: 400 });
    }

    const result = MessagingModerationEngine.moderateMessage(content, Boolean(isBookingConfirmed));

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
