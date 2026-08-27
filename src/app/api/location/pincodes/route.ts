import { NextRequest, NextResponse } from 'next/server';
import { getPincodes } from '@/lib/locationService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || undefined;
    const state = searchParams.get('state') || undefined;
    const search = searchParams.get('search') || searchParams.get('query') || undefined;

    const pincodes = getPincodes(city, state, search);

    return NextResponse.json({
      success: true,
      count: pincodes.length,
      data: pincodes
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pincodes' },
      { status: 500 }
    );
  }
}
