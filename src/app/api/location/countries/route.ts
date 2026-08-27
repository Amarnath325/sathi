import { NextResponse } from 'next/server';
import { getCountries } from '@/lib/locationService';

export async function GET() {
  try {
    const countries = getCountries();
    return NextResponse.json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
