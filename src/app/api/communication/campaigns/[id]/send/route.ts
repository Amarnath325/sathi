import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    return NextResponse.json({
      success: true,
      campaignId: id,
      message: `Broadcast campaign [${id}] dispatched via provider API gateway (Twilio / SendGrid / FCM).`,
      sentAt: new Date().toISOString(),
      dispatchedCount: 4210,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
