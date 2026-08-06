import { NextResponse } from 'next/server';
import { INITIAL_PAYOUTS } from '@/lib/initialPayments';
import { PayoutRecord } from '@/lib/types';

let inMemoryPayouts: PayoutRecord[] = [...INITIAL_PAYOUTS];

export async function GET() {
  try {
    const totalPayoutsAmount = inMemoryPayouts
      .filter(p => p.status === 'PAID')
      .reduce((acc, p) => acc + p.amount, 0);

    return NextResponse.json({
      success: true,
      count: inMemoryPayouts.length,
      metrics: {
        totalPayoutsAmount,
        pendingPayoutsCount: inMemoryPayouts.filter(p => p.status === 'PROCESSING').length
      },
      data: inMemoryPayouts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch companion payout records', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companionId, companionName, bankName, accountNumberMasked, amount } = body;

    if (!companionId || !companionName || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required payout fields (companionId, companionName, amount)' },
        { status: 400 }
      );
    }

    const newPayout: PayoutRecord = {
      id: 'po-' + Date.now(),
      payoutRef: 'PO-2026-' + Math.floor(1000 + Math.random() * 9000),
      companionId,
      companionName,
      bankName: bankName || 'Partner Clearing Bank',
      accountNumberMasked: accountNumberMasked || '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
      amount: Number(amount),
      status: 'PAID',
      processedAt: new Date().toISOString()
    };

    inMemoryPayouts.unshift(newPayout);

    return NextResponse.json(
      { success: true, message: 'Payout dispatched successfully to companion bank vault', data: newPayout },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch payout', details: error.message },
      { status: 500 }
    );
  }
}
