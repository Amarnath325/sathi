import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { UserProfile, CompanionStatus } from '@/lib/types';

let companions: UserProfile[] = [...MOCK_COMPANIONS];

// PATCH /api/companions/[id]/status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, suspendedReason } = await req.json() as { status: CompanionStatus; suspendedReason?: string };
    const idx = companions.findIndex(c => c.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Companion not found.' }, { status: 404 });

    companions[idx] = {
      ...companions[idx],
      status,
      isAvailableNow: status === 'ACTIVE',
      verificationBadge: status === 'ACTIVE' ? companions[idx].verificationBadge : false,
      suspendedReason: status === 'SUSPENDED' ? (suspendedReason || 'Policy violation') : undefined,
    };
    return NextResponse.json({ data: companions[idx], message: `Status updated to ${status}.` });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
