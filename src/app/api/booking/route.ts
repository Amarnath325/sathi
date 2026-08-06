import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_BOOKINGS } from '@/lib/initialBookings';
import { BookingDetails } from '@/lib/types';

let bookingsStore: BookingDetails[] = [...INITIAL_BOOKINGS];

// GET /api/booking — List all bookings with optional filters (status, search, userId, companionId)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const escrowStatus = searchParams.get('escrowStatus');
  const query = searchParams.get('q')?.toLowerCase();
  const userId = searchParams.get('userId');
  const companionId = searchParams.get('companionId');

  let list = [...bookingsStore];

  if (status) {
    list = list.filter(b => b.status === status);
  }

  if (escrowStatus) {
    list = list.filter(b => b.escrowStatus === escrowStatus);
  }

  if (userId) {
    list = list.filter(b => b.userId === userId);
  }

  if (companionId) {
    list = list.filter(b => b.companionId === companionId);
  }

  if (query) {
    list = list.filter(b =>
      b.bookingNumber.toLowerCase().includes(query) ||
      b.userName.toLowerCase().includes(query) ||
      b.companionName.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    total: list.length,
    data: list
  });
}

// POST /api/booking — Create new booking with escrow allocation calculation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.userId || !body.companionId || !body.category || !body.hourlyRate) {
      return NextResponse.json({ error: 'Missing required booking fields (userId, companionId, category, hourlyRate).' }, { status: 400 });
    }

    const duration = Number(body.durationHours) || 2;
    const hourlyRate = Number(body.hourlyRate) || 45;
    const baseAmount = hourlyRate * duration;
    const platformFee = Math.round(baseAmount * 0.1); // 10%
    const escrowFee = Math.round(baseAmount * 0.05); // 5%
    const totalAmount = baseAmount + platformFee + escrowFee;

    const id = 'bk-' + Date.now();
    const bookingNumber = 'CC-2026-' + Math.floor(1000 + Math.random() * 9000);
    const createdAt = new Date().toISOString();

    const newBooking: BookingDetails = {
      id,
      bookingNumber,
      userId: body.userId,
      userName: body.userName || 'Verified Client',
      userAvatar: body.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
      companionId: body.companionId,
      companionName: body.companionName || 'Companion Host',
      companionAvatar: body.companionAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      category: body.category,
      subCategory: body.subCategory || '',
      date: body.date || createdAt.split('T')[0],
      startTime: body.startTime || createdAt,
      endTime: body.endTime || createdAt,
      durationHours: duration,
      locationName: body.locationName || 'Selected Venue',
      locationAddress: body.locationAddress || 'Standard Meeting Point',
      specialNotes: body.specialNotes || '',
      hourlyRate,
      baseAmount,
      subtotal: baseAmount,
      platformFee,
      escrowFee,
      totalAmount,
      status: 'ESCROW_LOCKED',
      paymentMethod: body.paymentMethod || 'STRIPE',
      escrowStatus: 'HELD',
      createdAt,
      updatedAt: createdAt
    };

    bookingsStore.unshift(newBooking);

    return NextResponse.json({
      success: true,
      message: 'Booking created and escrow funds locked successfully.',
      data: newBooking
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
}
