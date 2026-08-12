import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, bookingId, provider, paymentId } = body;

    if (action === 'create-session' || (!action && bookingId)) {
      return NextResponse.json({
        success: true,
        message: 'Payment session created',
        data: {
          sessionId: 'sess_mob_' + Date.now(),
          paymentId: 'pay_mob_' + Math.floor(Math.random() * 1000000),
          provider: provider || 'stripe',
          clientSecret: 'pi_demo_secret_key_123',
          amount: 2870,
          currency: 'INR',
        },
      });
    }

    if (action === 'verify') {
      return NextResponse.json({
        success: true,
        message: 'Payment verified and booking confirmed',
        data: {
          verified: true,
          status: 'confirmed',
          paymentId: paymentId || 'pay_mob_123',
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid payment request' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile Payment API Error' }, { status: 500 });
  }
}
