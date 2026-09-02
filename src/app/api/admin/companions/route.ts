import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserProfile } from '@/lib/types';

// Default availability schedule for Prisma JSON field
const DEFAULT_AVAILABILITY = {
  Mon: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Tue: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Wed: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Thu: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Fri: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Sat: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Sun: [10, 11, 12, 13, 14, 15, 16, 17, 18]
};

// GET /api/admin/companions — Get all companions from PostgreSQL DB
export async function GET(req: NextRequest) {
  try {
    let dbCompanions: any[] = [];

    // Fetch from Prisma DB
    try {
      if (prisma && prisma.companionProfile) {
        const profiles = await prisma.companionProfile.findMany({
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        });

        if (profiles && profiles.length > 0) {
          dbCompanions = profiles.map(p => ({
            id: p.id || p.userId,
            name: p.user?.fullName || p.displayName || 'Companion',
            email: p.user?.email || '',
            phone: p.user?.phone || '',
            city: p.city || 'Mumbai',
            country: p.country || 'India',
            state: (p as any).state || '',
            pincode: (p as any).pincode || '',
            age: p.age || 25,
            gender: p.gender || 'Female',
            avatar: p.user?.avatar || (p.photos && p.photos[0]) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            photos: p.photos || [],
            hourlyRate: p.hourlyRate || 75,
            dailyRate: p.dailyRate || 350,
            weeklyRate: p.weeklyRate || 2000,
            ratingAvg: p.ratingAvg || 5.0,
            ratingCount: p.ratingCount || 0,
            completedBookings: p.completedBookings || 0,
            status: p.user?.status || 'ACTIVE',
            category: p.categories?.[0] || 'Event Companion',
            categories: p.categories || ['Event Companion'],
            skills: p.skills || ['Multilingual'],
            languages: p.languages || ['English'],
            bio: p.bio || 'Registered Companion Profile',
            createdSource: 'ADMIN',
            aadhaarNumber: (p as any).aadhaarNumber || '',
            kycStatus: 'APPROVED',
            isActive: p.user?.status === 'ACTIVE',
            isDeleted: false,
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
        }
      }
    } catch (dbErr) {
      console.error('Prisma query error in GET /api/admin/companions:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: dbCompanions,
      count: dbCompanions.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch companions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/companions — Save single companion or bulk array to PostgreSQL DB
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const items: any[] = Array.isArray(payload) ? payload : (payload.companions && Array.isArray(payload.companions)) ? payload.companions : [payload];

    const savedRecords: any[] = [];
    const errors: any[] = [];

    for (const item of items) {
      if (!item) continue;

      const fullName = item.name || item.fullName || 'Registered Companion';
      const email = item.email || `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}@sathi.internal`;
      const phone = item.phone || null;
      const avatar = item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
      const city = item.city || 'Mumbai';
      const country = item.country || 'India';
      const age = Number(item.age) || 25;
      const gender = item.gender || 'Female';
      const bio = item.bio || 'Verified platform companion profile.';
      const hourlyRate = Number(item.hourlyRate) || 75;
      const dailyRate = Number(item.dailyRate) || (hourlyRate * 7);
      const weeklyRate = Number(item.weeklyRate) || (dailyRate * 5);
      const categories = Array.isArray(item.categories) ? item.categories : [item.category || 'Event Companion'];
      const skills = Array.isArray(item.skills) ? item.skills : ['Multilingual'];
      const languages = Array.isArray(item.languages) ? item.languages : ['English', 'Hindi'];
      const photos = Array.isArray(item.photos) && item.photos.length > 0 ? item.photos : [avatar];
      const availability = item.availability || DEFAULT_AVAILABILITY;

      try {
        if (prisma && prisma.user && prisma.companionProfile) {
          // 1. Upsert User in Postgres
          const user = await prisma.user.upsert({
            where: { email },
            update: {
              fullName,
              phone: phone || undefined,
              avatar,
              role: 'VERIFIED_COMPANION',
              status: item.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
              isDeleted: Boolean(item.isDeleted)
            },
            create: {
              email,
              phone: phone || undefined,
              fullName,
              passwordHash: 'COMPANION_DEFAULT_SECURE_HASH',
              role: 'VERIFIED_COMPANION',
              avatar,
              status: 'ACTIVE',
              isDeleted: false
            }
          });

          // 2. Upsert CompanionProfile in Postgres
          const profile = await prisma.companionProfile.upsert({
            where: { userId: user.id },
            update: {
              bio,
              age,
              gender,
              city,
              country,
              hourlyRate,
              dailyRate,
              weeklyRate,
              categories,
              skills,
              languages,
              photos,
              availability,
              verificationBadge: true,
              isAvailableNow: true
            },
            create: {
              userId: user.id,
              bio,
              age,
              gender,
              city,
              country,
              hourlyRate,
              dailyRate,
              weeklyRate,
              categories,
              skills,
              languages,
              photos,
              availability,
              verificationBadge: true,
              isAvailableNow: true
            }
          });

          savedRecords.push({
            id: profile.id,
            userId: user.id,
            name: fullName,
            email,
            phone,
            city,
            country,
            hourlyRate,
            status: user.status
          });
        }
      } catch (dbErr: any) {
        console.error(`Error upserting companion ${email}:`, dbErr);
        errors.push({ email, error: dbErr.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${savedRecords.length} companions with PostgreSQL Database`,
      savedCount: savedRecords.length,
      errors: errors.length > 0 ? errors : undefined,
      data: savedRecords
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync companions with database' },
      { status: 500 }
    );
  }
}
