import { NextResponse } from 'next/server';
import { MOCK_DISPUTES } from '@/lib/mockData';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { senderId, senderName, senderRole, message, isArbitratorNote, attachments } = body;

    const ticket = MOCK_DISPUTES.find((d) => d.id === id || d.disputeRef === id);

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Dispute ticket not found' }, { status: 404 });
    }

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message text is required' }, { status: 400 });
    }

    const newMessage = {
      id: 'msg-d-' + Date.now(),
      disputeId: ticket.id,
      senderId: senderId || 'user-1',
      senderName: senderName || 'Arbitrator',
      senderRole: (senderRole as 'CUSTOMER' | 'COMPANION' | 'ADMIN') || 'ADMIN',
      message,
      isArbitratorNote: !!isArbitratorNote,
      attachments: attachments || [],
      sentAt: new Date().toISOString()
    };

    ticket.messages.push(newMessage);
    ticket.updatedAt = new Date().toISOString();
    if (ticket.status === 'OPEN_LODGED') {
      ticket.status = 'UNDER_ARBITRATION';
    }

    return NextResponse.json({
      success: true,
      message: 'Message added to arbitration log',
      disputeMessage: newMessage
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
