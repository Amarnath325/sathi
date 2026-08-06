import { NextResponse } from 'next/server';
import { MOCK_DISPUTES } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const query = searchParams.get('query')?.toLowerCase();

    let list = [...MOCK_DISPUTES];

    if (status && status !== 'all') {
      list = list.filter((d) => d.status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'ALL') {
      list = list.filter((d) => d.category === category);
    }

    if (query) {
      list = list.filter(
        (d) =>
          d.disputeRef.toLowerCase().includes(query) ||
          d.customerName.toLowerCase().includes(query) ||
          d.companionName.toLowerCase().includes(query) ||
          d.bookingNumber.toLowerCase().includes(query) ||
          d.reason.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      totalCount: list.length,
      disputes: list
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, bookingNumber, customerId, customerName, customerEmail, companionId, companionName, companionEmail, category, reason, detailedDescription, disputedAmount } = body;

    if (!bookingId || !customerId || !companionId || !reason || !detailedDescription) {
      return NextResponse.json({ success: false, error: 'Missing required dispute parameters' }, { status: 400 });
    }

    const newTicket = {
      id: 'disp-' + Date.now(),
      disputeRef: 'DSP-2026-' + Math.floor(1000 + Math.random() * 9000),
      bookingId,
      bookingNumber: bookingNumber || 'CC-2026-' + Math.floor(1000 + Math.random() * 9000),
      customerId,
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'customer@sathi.com',
      companionId,
      companionName: companionName || 'Companion Partner',
      companionEmail: companionEmail || 'companion@sathi.com',
      disputedAmount: disputedAmount || 150,
      escrowStatus: 'FROZEN' as const,
      category: category || 'OTHER',
      reason,
      detailedDescription,
      status: 'OPEN_LODGED' as const,
      evidence: [],
      messages: [],
      filedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MOCK_DISPUTES.unshift(newTicket);

    return NextResponse.json({
      success: true,
      message: 'Dispute ticket filed successfully. Escrow funds locked.',
      dispute: newTicket
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
