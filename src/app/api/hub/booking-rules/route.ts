import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BOOKING_RULES } from '@/lib/initialHubData';
import { CancellationCalculator } from '@/lib/serviceHubEngines';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_BOOKING_RULES
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'CALCULATE_REFUND') {
      const calculation = CancellationCalculator.calculateRefund(
        body.paidAmount || 1000,
        body.hoursUntilBooking || 18,
        body.bookingRule || DEFAULT_BOOKING_RULES[0]
      );
      return NextResponse.json({
        success: true,
        calculation
      });
    }

    return NextResponse.json({
      success: true,
      data: body
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
