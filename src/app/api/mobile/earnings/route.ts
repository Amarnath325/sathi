import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      todayEarnings: 1700.0,
      weekEarnings: 8500.0,
      monthEarnings: 32000.0,
      totalEarnings: 94000.0,
      grossEarnings: 110000.0,
      platformFees: 16000.0,
      netEarnings: 94000.0,
      pendingPayout: 2550.0,
      availablePayout: 5950.0,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;

    return NextResponse.json({
      success: true,
      message: `Payout request of ₹${amount || 5950} submitted successfully.`,
      data: {
        payoutId: 'po_mob_' + Date.now(),
        amount: amount || 5950.0,
        status: 'processing',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile Earnings API Error' }, { status: 500 });
  }
}
