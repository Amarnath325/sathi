import { NextRequest, NextResponse } from 'next/server';
import { getCitiesByState, getAllCities } from '@/lib/locationService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateIdParam = searchParams.get('stateId');
    const search = searchParams.get('search')?.toLowerCase();

    let cities = stateIdParam
      ? getCitiesByState(parseInt(stateIdParam, 10))
      : getAllCities();

    if (search) {
      cities = cities.filter(c => c.name.toLowerCase().includes(search));
    }

    return NextResponse.json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
