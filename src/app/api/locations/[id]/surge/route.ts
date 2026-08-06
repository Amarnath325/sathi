import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_LOCATIONS } from '@/lib/initialLocations';
import { LocationItem } from '@/lib/types';

let locationsStore: LocationItem[] = [...INITIAL_LOCATIONS];

type Props = {
  params: Promise<{ id: string }>;
};

// POST /api/locations/[id]/surge — Adjust surge multiplier or add geofence zones
export async function POST(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const idx = locationsStore.findIndex(l => l.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
    }

    const loc = locationsStore[idx];

    if (body.surgePricingMultiplier !== undefined) {
      loc.surgePricingMultiplier = Number(body.surgePricingMultiplier);
    }

    if (body.newZone) {
      loc.geofencedZones.push({
        id: 'gz-' + Date.now(),
        name: body.newZone.name || 'New Geofenced Zone',
        radiusKm: Number(body.newZone.radiusKm) || 2.5,
        safetyScore: Number(body.newZone.safetyScore) || 90,
        venueTypes: body.newZone.venueTypes || ['Public Spaces']
      });
    }

    if (body.newVenue) {
      loc.popularVenues.push({
        id: 'pv-' + Date.now(),
        name: body.newVenue.name || 'New Verified Venue',
        address: body.newVenue.address || 'Central City Square',
        category: body.newVenue.category || 'Public Hub',
        safetyRating: Number(body.newVenue.safetyRating) || 4.8,
        isPartnerVenue: body.newVenue.isPartnerVenue !== false
      });
    }

    loc.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Surge multiplier and geofencing configuration updated for ${loc.name}.`,
      data: loc
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
}
