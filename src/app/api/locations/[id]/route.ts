import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_LOCATIONS } from '@/lib/initialLocations';
import { LocationItem } from '@/lib/types';

let locationsStore: LocationItem[] = [...INITIAL_LOCATIONS];

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/locations/[id] — Retrieve single location by ID
export async function GET(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  const location = locationsStore.find(l => l.id === id);
  if (!location) {
    return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: location });
}

// PATCH /api/locations/[id] — Update location properties
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const updates = await req.json();
    const idx = locationsStore.findIndex(l => l.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
    }

    locationsStore[idx] = {
      ...locationsStore[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: `Location ${locationsStore[idx].name} updated successfully.`,
      data: locationsStore[idx]
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
}

// DELETE /api/locations/[id] — Deactivate or remove location
export async function DELETE(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  const idx = locationsStore.findIndex(l => l.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
  }

  const removed = locationsStore[idx];
  locationsStore.splice(idx, 1);

  return NextResponse.json({
    success: true,
    message: `Operational location ${removed.name} has been deactivated and removed.`
  });
}
