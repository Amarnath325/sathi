import { NextRequest, NextResponse } from 'next/server';
import { getStatesByCountry, getAllStates } from '@/lib/locationService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const countryIdParam = searchParams.get('countryId');
    const search = searchParams.get('search')?.toLowerCase();

    let states = countryIdParam
      ? getStatesByCountry(parseInt(countryIdParam, 10))
      : getAllStates();

    if (search) {
      states = states.filter(s => s.name.toLowerCase().includes(search));
    }

    return NextResponse.json({
      success: true,
      count: states.length,
      data: states
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch states' },
      { status: 500 }
    );
  }
}
