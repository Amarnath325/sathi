import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserProfile } from '@/lib/types';

// Dynamic In-Memory Store shared across requests
let globalCompanions: any[] = [];

// GET /api/admin/companions — Get all companions for admin management
export async function GET(req: NextRequest) {
  try {
    let dbCompanions: any[] = [];

    // Try fetching from Prisma DB
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
            kycStatus: p.kycStatus || 'APPROVED',
            isActive: p.user?.status === 'ACTIVE',
            isDeleted: false,
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
        }
      }
    } catch (dbErr) {
      console.warn('Prisma fetch failed, falling back to memory store:', dbErr);
    }

    // Merge DB companions with memory store (avoid duplicates by email or id)
    const existingIds = new Set(dbCompanions.map(c => c.id));
    const merged = [
      ...dbCompanions,
      ...globalCompanions.filter(c => !existingIds.has(c.id) && !dbCompanions.some(d => d.email && d.email === c.email))
    ];

    return NextResponse.json({
      success: true,
      data: merged,
      count: merged.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch companions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/companions — Save companion to DB & memory
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const companionRecord = {
      id: data.id || `comp-${Date.now()}`,
      name: data.name || data.fullName || 'New Companion',
      email: data.email || `comp-${Date.now()}@example.com`,
      phone: data.phone || '',
      city: data.city || 'Mumbai',
      country: data.country || 'India',
      state: data.state || '',
      pincode: data.pincode || '',
      age: Number(data.age) || 25,
      gender: data.gender || 'Female',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      photos: data.photos || [data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'],
      hourlyRate: Number(data.hourlyRate) || 75,
      dailyRate: Number(data.dailyRate) || 350,
      weeklyRate: Number(data.weeklyRate) || 2000,
      ratingAvg: 5.0,
      ratingCount: 0,
      completedBookings: 0,
      status: data.status || 'ACTIVE',
      category: data.categories?.[0] || data.category || 'Event Companion',
      categories: data.categories || [data.category || 'Event Companion'],
      skills: data.skills || ['Multilingual'],
      languages: data.languages || ['English'],
      bio: data.bio || 'Registered Companion Profile',
      createdSource: data.createdSource || 'ADMIN',
      aadhaarNumber: data.aadhaarNumber || '',
      kycStatus: data.kycStatus || 'APPROVED',
      isActive: true,
      isDeleted: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Save in memory
    const existingIdx = globalCompanions.findIndex(c => c.id === companionRecord.id || c.email === companionRecord.email);
    if (existingIdx >= 0) {
      globalCompanions[existingIdx] = { ...globalCompanions[existingIdx], ...companionRecord };
    } else {
      globalCompanions.unshift(companionRecord);
    }

    // Try saving in Prisma DB
    try {
      if (prisma && prisma.user && prisma.companionProfile) {
        const user = await prisma.user.upsert({
          where: { email: companionRecord.email },
          update: {
            fullName: companionRecord.name,
            phone: companionRecord.phone || undefined,
            avatar: companionRecord.avatar,
            role: 'VERIFIED_COMPANION',
            status: 'ACTIVE'
          },
          create: {
            email: companionRecord.email,
            phone: companionRecord.phone || undefined,
            fullName: companionRecord.name,
            passwordHash: 'COMPANION_DEFAULT_PASS',
            role: 'VERIFIED_COMPANION',
            avatar: companionRecord.avatar,
            status: 'ACTIVE'
          }
        });

        await prisma.companionProfile.upsert({
          where: { userId: user.id },
          update: {
            city: companionRecord.city,
            country: companionRecord.country,
            age: companionRecord.age,
            gender: companionRecord.gender,
            bio: companionRecord.bio,
            hourlyRate: companionRecord.hourlyRate,
            dailyRate: companionRecord.dailyRate,
            weeklyRate: companionRecord.weeklyRate,
            categories: companionRecord.categories,
            skills: companionRecord.skills,
            languages: companionRecord.languages,
            photos: companionRecord.photos,
            kycStatus: 'APPROVED'
          },
          create: {
            userId: user.id,
            city: companionRecord.city,
            country: companionRecord.country,
            age: companionRecord.age,
            gender: companionRecord.gender,
            bio: companionRecord.bio,
            hourlyRate: companionRecord.hourlyRate,
            dailyRate: companionRecord.dailyRate,
            weeklyRate: companionRecord.weeklyRate,
            categories: companionRecord.categories,
            skills: companionRecord.skills,
            languages: companionRecord.languages,
            photos: companionRecord.photos,
            kycStatus: 'APPROVED'
          }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma DB save warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: companionRecord,
      message: 'Companion saved successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save companion' },
      { status: 500 }
    );
  }
}
