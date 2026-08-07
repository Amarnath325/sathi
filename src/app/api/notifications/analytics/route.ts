import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    analytics: {
      totalSent: 34890,
      totalDelivered: 33812,
      totalFailed: 1078,
      deliveryRatePercent: 97,
      openRatePercent: 68,
      channelBreakdown: {
        IN_APP: 14230,
        EMAIL: 8450,
        PUSH: 11200,
        SMS: 1010,
      },
      categoryBreakdown: {
        SYSTEM: 4200,
        BOOKING: 15400,
        SAFETY: 3200,
        PAYMENT: 6800,
        KYC: 2100,
        PROMO: 1800,
        SECURITY: 890,
        COMMUNITY: 500,
      },
      timeSeries24h: [
        { hour: '00:00', count: 420 },
        { hour: '04:00', count: 180 },
        { hour: '08:00', count: 1250 },
        { hour: '12:00', count: 3400 },
        { hour: '16:00', count: 2900 },
        { hour: '20:00', count: 1800 },
      ],
    },
  });
}
