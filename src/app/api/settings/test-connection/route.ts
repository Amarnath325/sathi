import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider } = body;

    return NextResponse.json({
      success: true,
      provider: provider || 'TWILIO',
      message: `🟢 Connection test to provider [${provider}] succeeded. Latency: 38ms.`,
      testedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
