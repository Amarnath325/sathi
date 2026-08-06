import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_BOOKINGS } from '@/lib/initialBookings';
import { BookingDetails } from '@/lib/types';

let bookingsStore: BookingDetails[] = [...INITIAL_BOOKINGS];

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/booking/[id] — Retrieve single booking by ID or reference number
export async function GET(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  const booking = bookingsStore.find(b => b.id === id || b.bookingNumber === id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: booking });
}

// PATCH /api/booking/[id] — Update booking status or details
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const updates = await req.json();
    const idx = bookingsStore.findIndex(b => b.id === id || b.bookingNumber === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    bookingsStore[idx] = {
      ...bookingsStore[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully.',
      data: bookingsStore[idx]
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
}

// DELETE /api/booking/[id] — Cancel booking and initiate refund
export async function DELETE(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  const idx = bookingsStore.findIndex(b => b.id === id || b.bookingNumber === id);

  if (idx === -1) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  bookingsStore[idx].status = 'CANCELLED';
  bookingsStore[idx].escrowStatus = 'REFUNDED_TO_USER';
  bookingsStore[idx].updatedAt = new Date().toISOString();

  return NextResponse.json({
    success: true,
    message: `Booking #${bookingsStore[idx].bookingNumber} has been cancelled and escrow refunded.`
  });
}
