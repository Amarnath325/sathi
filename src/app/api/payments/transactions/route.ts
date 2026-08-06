import { NextResponse } from 'next/server';
import { INITIAL_TRANSACTIONS } from '@/lib/initialPayments';
import { FinancialTransaction } from '@/lib/types';

let inMemoryTransactions: FinancialTransaction[] = [...INITIAL_TRANSACTIONS];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const query = searchParams.get('q')?.toLowerCase();

    let list = [...inMemoryTransactions];

    if (type) {
      list = list.filter(t => t.type === type);
    }

    if (status) {
      list = list.filter(t => t.status === status);
    }

    if (paymentMethod) {
      list = list.filter(t => t.paymentMethod === paymentMethod);
    }

    if (query) {
      list = list.filter(t =>
        t.transactionRef.toLowerCase().includes(query) ||
        t.userName.toLowerCase().includes(query) ||
        (t.companionName && t.companionName.toLowerCase().includes(query)) ||
        (t.gatewayRef && t.gatewayRef.toLowerCase().includes(query))
      );
    }

    // Summary Analytics
    const totalVolume = list.reduce((acc, t) => acc + t.amount, 0);
    const escrowHeld = list.filter(t => t.status === 'HELD_IN_ESCROW').reduce((acc, t) => acc + t.amount, 0);
    const platformNetFees = list.reduce((acc, t) => acc + t.platformFee, 0);

    return NextResponse.json({
      success: true,
      count: list.length,
      metrics: {
        totalVolume,
        escrowHeld,
        platformNetFees
      },
      data: list
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial transactions', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, companionId, companionName, type, amount, paymentMethod, notes } = body;

    if (!userId || !userName || !type || amount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required financial fields (userId, userName, type, amount)' },
        { status: 400 }
      );
    }

    const platformFee = Math.round(amount * 0.10);
    const escrowFee = Math.round(amount * 0.02);
    const gstTax = Math.round(amount * 0.05);
    const netPayoutAmount = amount - (platformFee + escrowFee + gstTax);

    const newTxn: FinancialTransaction = {
      id: 'txn-' + Date.now(),
      transactionRef: 'TXN-2026-' + Math.floor(1000 + Math.random() * 9000),
      userId,
      userName,
      companionId,
      companionName,
      type,
      amount: Number(amount),
      platformFee,
      escrowFee,
      gstTax,
      netPayoutAmount,
      status: type === 'BOOKING_ESCROW_LOCK' ? 'HELD_IN_ESCROW' : 'COMPLETED',
      paymentMethod: paymentMethod || 'STRIPE',
      gatewayRef: 'ch_' + Math.random().toString(36).substring(2, 14),
      notes: notes || 'Direct API transaction entry',
      createdAt: new Date().toISOString()
    };

    inMemoryTransactions.unshift(newTxn);

    return NextResponse.json(
      { success: true, message: 'Transaction created successfully', data: newTxn },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to record transaction', details: error.message },
      { status: 500 }
    );
  }
}
