import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_RISK_LEVELS } from '@/lib/initialHubData';
import { RiskEngine } from '@/lib/serviceHubEngines';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_RISK_LEVELS
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'CALCULATE_SCORE') {
      const calculation = RiskEngine.calculateRiskScore(body.context || {});
      return NextResponse.json({
        success: true,
        calculation
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
