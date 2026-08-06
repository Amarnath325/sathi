import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { UserProfile, AvailabilityGrid } from '@/lib/types';

let companions: UserProfile[] = [...MOCK_COMPANIONS];

// GET /api/companions/[id]/availability
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const companion = companions.find(c => c.id === params.id);
  if (!companion) return NextResponse.json({ error: 'Companion not found.' }, { status: 404 });
  return NextResponse.json({ data: companion.availability || {} });
}

// PATCH /api/companions/[id]/availability
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { availability } = await req.json() as { availability: AvailabilityGrid };
    const idx = companions.findIndex(c => c.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Companion not found.' }, { status: 404 });
    companions[idx] = { ...companions[idx], availability };
    return NextResponse.json({ data: companions[idx].availability, message: 'Availability updated.' });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
