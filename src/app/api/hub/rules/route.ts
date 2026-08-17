import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_RULES_PROFILES } from '@/lib/initialHubData';
import { RulesEngine } from '@/lib/serviceHubEngines';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_RULES_PROFILES
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'EVALUATE') {
      const rule = body.rule;
      const context = body.context || {};
      const evaluation = RulesEngine.evaluateRule(rule, context);

      return NextResponse.json({
        success: true,
        evaluation
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
