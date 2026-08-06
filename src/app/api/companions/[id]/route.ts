import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { UserProfile } from '@/lib/types';

let companions: UserProfile[] = [...MOCK_COMPANIONS];

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/companions/[id]
export async function GET(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  const companion = companions.find(c => c.id === id);
  if (!companion) return NextResponse.json({ error: 'Companion not found.' }, { status: 404 });
  return NextResponse.json({ data: companion });
}

// PATCH /api/companions/[id]
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const updates = await req.json();
    const idx = companions.findIndex(c => c.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Companion not found.' }, { status: 404 });
    companions[idx] = { ...companions[idx], ...updates };
    return NextResponse.json({ data: companions[idx], message: 'Companion updated successfully.' });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

// DELETE /api/companions/[id]
export async function DELETE(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  const idx = companions.findIndex(c => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Companion not found.' }, { status: 404 });
  companions[idx] = { ...companions[idx], status: 'INACTIVE', isAvailableNow: false };
  return NextResponse.json({ message: 'Companion deactivated successfully.' });
}
