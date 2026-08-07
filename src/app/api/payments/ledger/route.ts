import { NextResponse } from 'next/server';
import { StripeProvider, RazorpayProvider, FinancialLedgerService } from '@/lib/paymentArchitecture';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, bookingId, userId, companionId, amount, provider } = body;

    const selectedProvider = provider === 'RAZORPAY' ? new RazorpayProvider() : new StripeProvider();

    if (action === 'CREATE_PAYMENT') {
      const paymentRes = await selectedProvider.createPayment(bookingId, amount);
      const ledgerEntries = FinancialLedgerService.processBookingFinancialSplit({
        bookingId,
        userId: userId || 'usr-client-8812',
        companionId: companionId || 'usr-companion-101',
        grossAmount: amount,
        platformCommissionPercent: 15.0,
        provider: provider === 'RAZORPAY' ? 'RAZORPAY' : 'STRIPE',
        transactionId: paymentRes.transactionId
      });

      return NextResponse.json({
        success: true,
        paymentResult: paymentRes,
        ledgerEntries
      });
    }

    if (action === 'CREATE_PAYOUT') {
      const payoutRes = await selectedProvider.createPayout(companionId, amount, 'ACC_BANK_WIRE_9901');
      return NextResponse.json({
        success: true,
        payoutResult: payoutRes
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action requested' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
