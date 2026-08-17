import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_VERIFICATION_PROFILES } from '@/lib/initialHubData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_VERIFICATION_PROFILES
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      data: body
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
