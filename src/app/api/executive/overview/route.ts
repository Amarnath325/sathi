import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30D';
    const region = searchParams.get('region') || 'ALL';
    const tier = searchParams.get('tier') || 'ALL';

    // Calculation multipliers based on parameters
    let mult = 1;
    if (timeframe === 'TODAY') mult = 0.04;
    if (timeframe === '7D') mult = 0.25;
    if (timeframe === '30D') mult = 1.0;
    if (timeframe === '90D') mult = 2.85;
    if (timeframe === 'YTD') mult = 6.4;

    let regMult = 1.0;
    if (region === 'NORTH_AMERICA') regMult = 0.45;
    if (region === 'EUROPE') regMult = 0.30;
    if (region === 'ASIA_PACIFIC') regMult = 0.18;
    if (region === 'LATIN_AMERICA') regMult = 0.07;

    const baseGmv = 1248000 * mult * regMult;
    const escrowMargin = 18.5;
    const netRevenue = baseGmv * (escrowMargin / 100);

    return NextResponse.json({
      success: true,
      data: {
        timeframe,
        region,
        tier,
        metrics: {
          gmvAmount: Math.round(baseGmv),
          gmvGrowthPct: 14.8,
          netRevenue: Math.round(netRevenue),
          netRevenueGrowthPct: 18.2,
          escrowReserve: Math.round(baseGmv * 0.74),
          escrowReserveGrowthPct: 11.4,
          activeCompanions: Math.round(840 * regMult),
          companionRetentionPct: 94.6,
          systemSecurityScore: 98,
          clvToCacRatio: 4.8,
        },
        forecast: {
          nextQuarterProjectedGmv: Math.round(baseGmv * 1.28),
          projectedNetMargin: Math.round(netRevenue * 1.32),
          growthConfidence: '96.4%',
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch executive metrics' },
      { status: 500 }
    );
  }
}
