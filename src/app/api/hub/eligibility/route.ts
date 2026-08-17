import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_ELIGIBILITY_PROFILES } from '@/lib/initialHubData';
import { CompanionEligibilityEvaluator } from '@/lib/serviceHubEngines';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_ELIGIBILITY_PROFILES
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'EVALUATE_COMPANION') {
      const companion = body.companion || {
        id: 'comp-mock-1',
        age: 23,
        ratingAvg: 4.8,
        completedBookings: 14,
        isSuspended: false,
        documents: { GOVERNMENT_ID: true, SELFIE_LIVE: true, EMERGENCY_CONTACT: true }
      };

      const profile = body.profile || DEFAULT_ELIGIBILITY_PROFILES[0];
      const result = CompanionEligibilityEvaluator.evaluate(companion, profile);

      return NextResponse.json({
        success: true,
        result
      });
    }

    return NextResponse.json({
      success: true,
      data: body
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
