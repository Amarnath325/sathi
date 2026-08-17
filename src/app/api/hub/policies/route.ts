import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_POLICIES } from '@/lib/initialHubData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_POLICIES
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newPolicy = {
      ...body,
      id: 'pol-' + Date.now(),
      version: 1,
      effective_from: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newPolicy
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
