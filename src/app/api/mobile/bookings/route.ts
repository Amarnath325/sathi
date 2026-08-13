import { NextRequest, NextResponse } from 'next/server';

// Mock in-memory database store for demo sessions
const mockBookings: any[] = [
  {
    id: 'bk_mob_101',
    companionId: 'comp_1',
    companionName: 'Aanya Sharma',
    companionAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    customerId: 'usr_mobile_101',
    customerName: 'John Doe',
    serviceName: 'City Sightseeing',
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '02:00 PM',
    durationHours: 3,
    location: 'Connaught Place, New Delhi',
    purpose: 'Sightseeing & Local Food Tour',
    notes: 'Please meet near Central Park metro exit 2.',
    basePrice: 2550.0,
    platformFee: 250.0,
    tax: 120.0,
    discount: 50.0,
    totalPrice: 2870.0,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'bk_mob_102',
    companionId: 'comp_2',
    companionName: 'Rohan Verma',
    companionAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    customerId: 'usr_mobile_101',
    customerName: 'John Doe',
    serviceName: 'Travel Partner',
    date: new Date(Date.now() + 172800000).toISOString(),
    time: '10:00 AM',
    durationHours: 4,
    location: 'Terminal 3, IGI Airport',
    purpose: 'Airport Transfer & Guide',
    notes: 'Will have 2 small bags.',
    basePrice: 3800.0,
    platformFee: 380.0,
    tax: 190.0,
    discount: 0.0,
    totalPrice: 4370.0,
    status: 'accepted',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusTab = searchParams.get('statusTab');
  const bookingId = searchParams.get('id');

  if (bookingId) {
    const found = mockBookings.find((b) => b.id === bookingId);
    if (found) {
      return NextResponse.json({ success: true, data: found });
    }
  }

  let filtered = [...mockBookings];

  if (statusTab === 'upcoming') {
    filtered = mockBookings.filter((b) => ['pendingCompanion', 'accepted', 'paymentPending', 'confirmed'].includes(b.status));
  } else if (statusTab === 'active') {
    filtered = mockBookings.filter((b) => b.status === 'inProgress');
  } else if (statusTab === 'completed') {
    filtered = mockBookings.filter((b) => b.status === 'completed');
  } else if (statusTab === 'cancelled') {
    filtered = mockBookings.filter((b) => ['cancelled', 'expired'].includes(b.status));
  } else if (statusTab === 'disputed') {
    filtered = mockBookings.filter((b) => ['disputed', 'refundPending', 'refunded'].includes(b.status));
  }

  return NextResponse.json({
    success: true,
    data: filtered,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, companionId, serviceName, durationHours, location, purpose, notes, bookingId, paymentMethod } = body;

    // 1. Authoritative Price Calculation
    if (action === 'estimate-price') {
      const hourlyRate = 850;
      const hours = durationHours || 2;
      const basePrice = hours * hourlyRate;
      const platformFee = Math.round(basePrice * 0.1); // 10%
      const tax = Math.round(basePrice * 0.05); // 5% GST
      const discount = hours >= 4 ? 100 : 0; // Bulk duration discount
      const totalPrice = basePrice + platformFee + tax - discount;

      return NextResponse.json({
        success: true,
        data: {
          basePrice,
          platformFee,
          tax,
          discount,
          totalPrice,
          currency: 'INR',
        },
      });
    }

    // 2. Update Booking Status (Accept, Cancel, Complete, Dispute)
    if (action === 'update-status') {
      const { newStatus } = body;
      const item = mockBookings.find((b) => b.id === bookingId);
      if (item) {
        item.status = newStatus;
        return NextResponse.json({
          success: true,
          message: `Booking status updated to ${newStatus}`,
          data: item,
        });
      }
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    // 3. Create Payment Intent / Session
    if (action === 'create-payment') {
      return NextResponse.json({
        success: true,
        data: {
          paymentSessionId: 'pay_sess_' + Date.now(),
          clientSecret: 'pi_secret_demo_' + Date.now(),
          amount: 287000, // in paise
          currency: 'INR',
          gateway: paymentMethod || 'razorpay',
        },
      });
    }

    // 4. Verify Payment Signature & Confirm Booking Authoritatively
    if (action === 'verify-payment') {
      const { paymentSessionId } = body;
      const item = mockBookings.find((b) => b.id === bookingId) || mockBookings[0];
      if (item) {
        item.status = 'confirmed';
        item.paymentStatus = 'paid';
        item.transactionId = paymentSessionId || 'txn_' + Date.now();
      }
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully. Booking is now confirmed!',
        data: item,
      });
    }

    // 5. Create Booking Request (Default Submission)
    const hours = durationHours || 2;
    const basePrice = hours * 850;
    const platformFee = Math.round(basePrice * 0.1);
    const tax = Math.round(basePrice * 0.05);
    const discount = hours >= 4 ? 100 : 0;
    const totalPrice = basePrice + platformFee + tax - discount;

    const newBooking = {
      id: 'bk_mob_' + Date.now(),
      companionId: companionId || 'comp_1',
      companionName: 'Aanya Sharma',
      companionAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      customerId: 'usr_mobile_101',
      customerName: 'John Doe',
      serviceName: serviceName || 'City Sightseeing',
      date: body.date || new Date().toISOString(),
      time: body.time || '10:00 AM',
      durationHours: hours,
      location: location || 'Meeting Location',
      purpose: purpose || 'General Companionship',
      notes: notes || '',
      basePrice,
      platformFee,
      tax,
      discount,
      totalPrice,
      status: 'pendingCompanion',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    mockBookings.unshift(newBooking);

    return NextResponse.json({
      success: true,
      message: 'Booking request sent successfully. Waiting for companion response.',
      data: newBooking,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile Booking API Error' }, { status: 500 });
  }
}
