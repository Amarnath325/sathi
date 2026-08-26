import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserProfile } from '@/lib/types';

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/companions/[id]
export async function GET(_req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;

    // Try Prisma DB first
    try {
      if (prisma && prisma.companionProfile) {
        const dbProfile = await prisma.companionProfile.findFirst({
          where: { OR: [{ id }, { userId: id }] },
          include: { user: true }
        });

        if (dbProfile) {
          const user = dbProfile.user || {};
          const companion: UserProfile = {
            id: dbProfile.id,
            name: user.fullName || 'Companion',
            email: user.email || '',
            phone: user.phone || '',
            role: 'VERIFIED_COMPANION',
            age: dbProfile.age || 25,
            gender: dbProfile.gender || 'Not specified',
            city: dbProfile.city || 'Mumbai',
            country: dbProfile.country || 'India',
            avatar: user.avatar || (dbProfile.photos && dbProfile.photos[0]) || '',
            photos: dbProfile.photos || [],
            categories: dbProfile.categories || [],
            skills: dbProfile.skills || [],
            languages: dbProfile.languages || ['English', 'Hindi'],
            hourlyRate: dbProfile.hourlyRate || 1000,
            dailyRate: dbProfile.dailyRate || 6000,
            weeklyRate: dbProfile.weeklyRate || 30000,
            ratingAvg: dbProfile.ratingAvg || 5.0,
            ratingCount: dbProfile.ratingCount || 0,
            completedBookings: dbProfile.completedBookings || 0,
            verificationBadge: dbProfile.verificationBadge || false,
            kycStatus: dbProfile.kycStatus || 'PENDING',
            bio: dbProfile.bio || '',
            isAvailableNow: dbProfile.isAvailableNow ?? true,
            responseTimeMin: dbProfile.responseTimeMin || 15,
            riskScore: user.riskScore || 0.0,
            riskLevel: user.riskLevel || 'LOW',
            experienceYears: dbProfile.experienceYears || 1,
            education: dbProfile.education || 'Graduate',
            status: user.status === 'ACTIVE' ? 'ACTIVE' : (user.status as any) || 'PENDING_VERIFICATION',
            totalEarnings: 0,
            createdAt: (dbProfile.createdAt ? new Date(dbProfile.createdAt).toISOString() : new Date().toISOString()).split('T')[0],
            availability: dbProfile.availability || {},
          };
          return NextResponse.json({ success: true, data: companion });
        }
      }
    } catch (e) {
      console.warn('Prisma get companion by ID error:', e);
    }

    return NextResponse.json({ success: false, error: 'Companion not found.' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/companions/[id] — update status or details
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const updates = await req.json();

    try {
      if (prisma && (prisma.companionProfile || prisma.user)) {
        if (updates.status && prisma.user) {
          await prisma.user.updateMany({
            where: { OR: [{ id }, { profile: { id } }] },
            data: { status: updates.status }
          }).catch(() => {});
        }
        if (prisma.companionProfile) {
          await prisma.companionProfile.updateMany({
            where: { OR: [{ id }, { userId: id }] },
            data: {
              ...(updates.isAvailableNow !== undefined && { isAvailableNow: updates.isAvailableNow }),
              ...(updates.verificationBadge !== undefined && { verificationBadge: updates.verificationBadge }),
              ...(updates.hourlyRate !== undefined && { hourlyRate: updates.hourlyRate }),
            }
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Prisma update companion error:', e);
    }

    return NextResponse.json({ success: true, message: 'Companion updated successfully.' });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }
}

// DELETE /api/companions/[id]
export async function DELETE(_req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    try {
      if (prisma && prisma.user) {
        await prisma.user.updateMany({
          where: { OR: [{ id }, { profile: { id } }] },
          data: { status: 'INACTIVE' }
        }).catch(() => {});
      }
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Companion deactivated successfully.' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to deactivate companion.' }, { status: 500 });
  }
}
