import { NextResponse } from 'next/server';
import { MOCK_DISPUTES } from '@/lib/mockData';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { outcome, refundAmount, penaltyAmount, adminNotes } = body;

    const ticket = MOCK_DISPUTES.find((d) => d.id === id || d.disputeRef === id);

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Dispute ticket not found' }, { status: 404 });
    }

    if (!outcome) {
      return NextResponse.json({ success: false, error: 'Resolution outcome is required' }, { status: 400 });
    }

    const isRefund = outcome === 'FULL_REFUND_CUSTOMER' || outcome === 'PARTIAL_REFUND';

    ticket.status = isRefund ? 'RESOLVED_REFUNDED' : 'RESOLVED_DISMISSED';
    ticket.resolutionOutcome = outcome;
    ticket.refundAmountIssued = refundAmount || 0;
    ticket.penaltyDeducted = penaltyAmount || 0;
    ticket.escrowStatus = isRefund ? 'REFUNDED' : 'RELEASED';
    ticket.adminNotes = adminNotes ? `${ticket.adminNotes || ''} | ${adminNotes}` : ticket.adminNotes;
    ticket.resolvedAt = new Date().toISOString();
    ticket.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Dispute resolved with outcome: ${outcome}. Escrow updated to ${ticket.escrowStatus}.`,
      dispute: ticket
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
