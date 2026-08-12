import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: [
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
        basePrice: 2550.0,
        platformFee: 200.0,
        tax: 120.0,
        totalPrice: 2870.0,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, companionId, serviceName, durationHours, location, notes } = body;

    if (action === 'estimate-price') {
      const base = (durationHours || 2) * 850;
      const platformFee = Math.round(base * 0.1);
      const tax = Math.round(base * 0.05);
      return NextResponse.json({
        success: true,
        data: {
          basePrice: base,
          platformFee,
          tax,
          totalPrice: base + platformFee + tax,
        },
      });
    }

    // Default: Create Booking Request
    const newBooking = {
      id: 'bk_mob_' + Date.now(),
      companionId: companionId || 'comp_1',
      companionName: 'Aanya Sharma',
      companionAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      customerId: 'usr_mobile_101',
      customerName: 'John Doe',
      serviceName: serviceName || 'City Sightseeing',
      date: new Date().toISOString(),
      time: '10:00 AM',
      durationHours: durationHours || 2,
      location: location || 'Meeting Point',
      basePrice: (durationHours || 2) * 850,
      platformFee: 200,
      tax: 100,
      totalPrice: (durationHours || 2) * 850 + 300,
      status: 'pending_companion',
      notes,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Booking request sent successfully to companion.',
      data: newBooking,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile Booking API Error' }, { status: 500 });
  }
}
