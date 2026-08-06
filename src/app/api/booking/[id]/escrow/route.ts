import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_BOOKINGS } from '@/lib/initialBookings';
import { BookingDetails } from '@/lib/types';

let bookingsStore: BookingDetails[] = [...INITIAL_BOOKINGS];

type Props = {
  params: Promise<{ id: string }>;
};

// POST /api/booking/[id]/escrow — Perform escrow lifecycle action ('release' | 'refund' | 'lock')
export async function POST(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { action, reason } = body;

    const idx = bookingsStore.findIndex(b => b.id === id || b.bookingNumber === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    const booking = bookingsStore[idx];

    if (action === 'release') {
      booking.status = 'COMPLETED';
      booking.escrowStatus = 'RELEASED_TO_COMPANION';
      booking.updatedAt = new Date().toISOString();
      return NextResponse.json({
        success: true,
        message: `Escrow funds of $${booking.totalAmount} successfully released to companion ${booking.companionName}.`,
        data: booking
      });
    }

    if (action === 'refund') {
      booking.status = 'CANCELLED';
      booking.escrowStatus = 'REFUNDED_TO_USER';
      booking.updatedAt = new Date().toISOString();
      return NextResponse.json({
        success: true,
        message: `Escrow funds of $${booking.totalAmount} refunded to client ${booking.userName}. Reason: ${reason || 'Admin Initiated Refund'}`,
        data: booking
      });
    }

    if (action === 'lock') {
      booking.status = 'ESCROW_LOCKED';
      booking.escrowStatus = 'HELD';
      booking.updatedAt = new Date().toISOString();
      return NextResponse.json({
        success: true,
        message: `Escrow funds of $${booking.totalAmount} locked in bank vault.`,
        data: booking
      });
    }

    return NextResponse.json({ error: 'Invalid escrow action. Allowed actions: release, refund, lock.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
