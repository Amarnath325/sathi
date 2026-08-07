import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || 'OVERVIEW';
    const timeframe = searchParams.get('timeframe') || '30D';
    const compareMode = searchParams.get('compareMode') || 'PREVIOUS_PERIOD';

    let tfMult = 1.0;
    if (timeframe === '7D') tfMult = 0.25;
    if (timeframe === '90D') tfMult = 2.8;
    if (timeframe === '1Y') tfMult = 11.2;

    return NextResponse.json({
      success: true,
      data: {
        domain,
        timeframe,
        compareMode,
        metrics: {
          gmvAmount: Math.round(1248000 * tfMult),
          gmvGrowthPct: compareMode === 'PREVIOUS_YEAR' ? 24.5 : 14.8,
          netRevenue: Math.round(230880 * tfMult),
          netRevenueGrowthPct: 18.2,
          escrowVault: Math.round(923520 * tfMult),
          activeCompanions: 840,
          fulfillmentRate: '98.4%',
          trustSafetyScore: '99.2 / 100',
        },
        categoryBreakdown: [
          { category: 'VIP High-End Escort', percentage: 50, revenue: 624000 },
          { category: 'Executive Concierge', percentage: 25, revenue: 312000 },
          { category: 'Event & Gala Escort', percentage: 15, revenue: 187200 },
          { category: 'Luxury Travel Companion', percentage: 10, revenue: 124800 },
        ],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics metrics' },
      { status: 500 }
    );
  }
}
