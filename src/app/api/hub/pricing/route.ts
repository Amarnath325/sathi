import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_PRICING_PROFILES } from '@/lib/initialHubData';
import { PricingEngine } from '@/lib/serviceHubEngines';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_PRICING_PROFILES
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'CALCULATE') {
      const profile = body.profile || DEFAULT_PRICING_PROFILES[0];
      const duration = body.durationHours || 2;
      const travelKm = body.travelKm || 0;
      const breakdown = PricingEngine.calculatePrice(profile, duration, travelKm, body.options || {});

      return NextResponse.json({
        success: true,
        breakdown
      });
    }

    const newProfile = {
      ...body,
      id: 'pr-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newProfile
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
