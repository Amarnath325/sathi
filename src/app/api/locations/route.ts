import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_LOCATIONS } from '@/lib/initialLocations';
import { LocationItem } from '@/lib/types';

let locationsStore: LocationItem[] = [...INITIAL_LOCATIONS];

// GET /api/locations — List operational locations with optional query parameters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get('active') === 'true';
  const tier = searchParams.get('tier');
  const country = searchParams.get('country');
  const query = searchParams.get('q')?.toLowerCase();

  let list = [...locationsStore];

  if (activeOnly) {
    list = list.filter(l => l.isActive);
  }

  if (tier) {
    list = list.filter(l => l.tier === tier);
  }

  if (country) {
    list = list.filter(l => l.country.toLowerCase() === country.toLowerCase());
  }

  if (query) {
    list = list.filter(l =>
      l.name.toLowerCase().includes(query) ||
      l.country.toLowerCase().includes(query) ||
      (l.state && l.state.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    success: true,
    total: list.length,
    data: list
  });
}

// POST /api/locations — Create a new operational location
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.country) {
      return NextResponse.json({ error: 'City name and country are required.' }, { status: 400 });
    }

    const id = 'loc-' + Date.now();
    const createdAt = new Date().toISOString();

    const newLocation: LocationItem = {
      id,
      name: body.name,
      state: body.state || '',
      country: body.country,
      countryCode: body.countryCode || 'US',
      tier: body.tier || 'TIER_1_METRO',
      riskTier: body.riskTier || 'LOW',
      surgePricingMultiplier: Number(body.surgePricingMultiplier) || 1.0,
      isActive: body.isActive !== false,
      companionCount: Number(body.companionCount) || 0,
      coordinates: body.coordinates || { lat: 0, lng: 0 },
      coverImageUrl: body.coverImageUrl || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80',
      geofencedZones: body.geofencedZones || [],
      popularVenues: body.popularVenues || [],
      emergencyContactPhone: body.emergencyContactPhone || '112 / Emergency SOS',
      policeHelpline: body.policeHelpline || 'Local Police Station',
      safetyProtocolNotes: body.safetyProtocolNotes || 'Standard live GPS tracking policy enabled.',
      createdAt,
      updatedAt: createdAt
    };

    locationsStore.unshift(newLocation);

    return NextResponse.json({
      success: true,
      message: `Operational location ${newLocation.name}, ${newLocation.country} created successfully.`,
      data: newLocation
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
}
