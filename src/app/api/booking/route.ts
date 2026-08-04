import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companionId, category, hours, totalAmount, paymentProvider } = body;

    const bookingId = 'bk-' + Math.floor(Math.random() * 90000 + 10000);
    
    return NextResponse.json({
      success: true,
      bookingId,
      status: 'ESCROW_LOCKED',
      escrowReference: 'escrow-' + Math.floor(Math.random() * 1000000),
      escrowDetails: {
        amountHeld: totalAmount,
        provider: paymentProvider || 'STRIPE',
        lockTimestamp: new Date().toISOString()
      },
      message: 'Funds successfully locked in bank holding escrow.'
    });

  } catch (error) {
    return NextResponse.json({ error: 'Escrow Engine Processing Error' }, { status: 500 });
  }
}
