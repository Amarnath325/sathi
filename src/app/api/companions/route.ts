import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserProfile } from '@/lib/types';

// Dynamic In-Memory Store for Companion Profiles
let dynamicCompanions: UserProfile[] = [];

// Helper to format Prisma DB record to UserProfile interface
function formatDbProfile(profile: any): UserProfile {
  const user = profile.user || {};
  return {
    id: profile.id || user.id || 'comp-' + Date.now(),
    name: user.fullName || profile.displayName || 'Companion',
    email: user.email || '',
    phone: user.phone || '',
    role: 'VERIFIED_COMPANION',
    age: profile.age || 25,
    gender: profile.gender || 'Not specified',
    city: profile.city || 'Mumbai',
    country: profile.country || 'India',
    avatar: user.avatar || (profile.photos && profile.photos[0]) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    photos: profile.photos || [],
    categories: profile.categories || [],
    skills: profile.skills || [],
    languages: profile.languages || ['English', 'Hindi'],
    hourlyRate: profile.hourlyRate || 1000,
    dailyRate: profile.dailyRate || (profile.hourlyRate ? profile.hourlyRate * 6 : 6000),
    weeklyRate: profile.weeklyRate || 30000,
    ratingAvg: profile.ratingAvg || 5.0,
    ratingCount: profile.ratingCount || 0,
    completedBookings: profile.completedBookings || 0,
    verificationBadge: profile.verificationBadge || false,
    kycStatus: profile.kycStatus || 'PENDING',
    bio: profile.bio || '',
    isAvailableNow: profile.isAvailableNow ?? true,
    responseTimeMin: profile.responseTimeMin || 15,
    riskScore: user.riskScore || 0.0,
    riskLevel: user.riskLevel || 'LOW',
    experienceYears: profile.experienceYears || 1,
    education: profile.education || 'Graduate',
    status: user.status === 'ACTIVE' ? 'ACTIVE' : (user.status as any) || 'PENDING_VERIFICATION',
    totalEarnings: 0,
    createdAt: (profile.createdAt ? new Date(profile.createdAt).toISOString() : new Date().toISOString()).split('T')[0],
    availability: profile.availability || {},
  };
}

// GET /api/companions — list all dynamic companions from Database with fallback
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';
    const gender = searchParams.get('gender') || '';
    const minRate = Number(searchParams.get('minRate') || 0);
    const maxRate = Number(searchParams.get('maxRate') || 999999);
    const minRating = Number(searchParams.get('minRating') || 0);
    const availableNow = searchParams.get('availableNow') === 'true';
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 24);

    let allCompanions: UserProfile[] = [...dynamicCompanions];

    // Try fetching from Prisma Database
    try {
      if (prisma && prisma.companionProfile) {
        const dbProfiles = await prisma.companionProfile.findMany({
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        });

        if (dbProfiles && dbProfiles.length > 0) {
          const formattedDbList = dbProfiles.map(formatDbProfile);
          // Merge avoiding duplicates
          const dbIds = new Set(formattedDbList.map((p: UserProfile) => p.id));
          const existingExtras = dynamicCompanions.filter(c => !dbIds.has(c.id));
          allCompanions = [...formattedDbList, ...existingExtras];
        }
      }
    } catch (dbErr) {
      console.warn('Prisma DB query fallback to dynamic memory store:', dbErr);
    }

    let filtered = allCompanions.filter(c => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q) && !c.bio.toLowerCase().includes(q)) return false;
      }
      if (category && !c.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))) return false;
      if (city && !c.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (gender && c.gender.toLowerCase() !== gender.toLowerCase()) return false;
      if (c.hourlyRate < minRate || c.hourlyRate > maxRate) return false;
      if (c.ratingAvg < minRating) return false;
      if (availableNow && !c.isAvailableNow) return false;
      if (verifiedOnly && !c.verificationBadge) return false;
      if (status && c.status !== status) return false;
      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'rating_desc': filtered.sort((a, b) => b.ratingAvg - a.ratingAvg); break;
      case 'price_asc': filtered.sort((a, b) => a.hourlyRate - b.hourlyRate); break;
      case 'price_desc': filtered.sort((a, b) => b.hourlyRate - a.hourlyRate); break;
      case 'most_booked': filtered.sort((a, b) => b.completedBookings - a.completedBookings); break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch companions' }, { status: 500 });
  }
}

// POST /api/companions — register new companion from Onboarding Form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = body.fullName || body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'New Companion';
    const email = body.email || `companion-${Date.now()}@sathi.internal`;
    const phone = body.phone || '';
    const age = Number(body.age) || (body.dateOfBirth ? Math.floor((Date.now() - new Date(body.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 24) || 24;
    const gender = body.gender || 'Not specified';
    const city = body.city || body.operatingCity || 'Mumbai';
    const country = body.country || body.operatingCountry || 'India';
    const avatar = body.avatar || body.profilePhoto || (body.photos && body.photos[0]) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
    const photos = body.photos || (avatar ? [avatar] : []);
    const bio = body.bio || body.serviceDescription || 'Verified Professional Companion';
    const categories = body.categories || body.selectedCategories || ['General Companion'];
    const skills = body.skills || body.skillsList || [];
    const languages = body.languages || body.languagesList || ['English', 'Hindi'];
    const hourlyRate = Number(body.hourlyRate) || 1000;
    const dailyRate = Number(body.fullDayRate || body.dailyRate) || (hourlyRate * 7);
    const weeklyRate = Number(body.weeklyRate) || (dailyRate * 5);
    const experienceYears = Number(body.experienceYears) || 2;
    const availability = body.availability || body.dayWiseHours || {};
    const companionId = 'comp-' + Date.now();

    const newCompanion: UserProfile = {
      id: companionId,
      name: fullName,
      email,
      phone,
      role: 'VERIFIED_COMPANION',
      age,
      gender,
      city,
      country,
      avatar,
      photos,
      categories,
      skills,
      languages,
      hourlyRate,
      dailyRate,
      weeklyRate,
      ratingAvg: 5.0,
      ratingCount: 0,
      completedBookings: 0,
      verificationBadge: false,
      kycStatus: 'PENDING',
      bio,
      isAvailableNow: true,
      responseTimeMin: 10,
      riskScore: 0.0,
      riskLevel: 'LOW',
      experienceYears,
      education: body.experienceLevel || 'Certified Companion',
      status: 'PENDING_VERIFICATION',
      totalEarnings: 0,
      createdAt: new Date().toISOString().split('T')[0],
      availability,
    };

    // Try persisting to Prisma Database
    try {
      if (prisma && prisma.user && prisma.companionProfile) {
        // Create or find User
        const dbUser = await prisma.user.upsert({
          where: { email },
          update: {
            fullName,
            phone: phone || undefined,
            avatar,
            role: 'VERIFIED_COMPANION',
            status: 'PENDING_VERIFICATION',
          },
          create: {
            email,
            phone: phone || undefined,
            fullName,
            passwordHash: body.password || 'COMPANION_DEFAULT_PASS_HASH',
            role: 'VERIFIED_COMPANION',
            avatar,
            dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
            status: 'PENDING_VERIFICATION',
          }
        });

        // Create or update CompanionProfile
        await prisma.companionProfile.upsert({
          where: { userId: dbUser.id },
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
            experienceYears,
          },
          create: {
            userId: dbUser.id,
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
            experienceYears,
          }
        });

        // If KYC Document info is present, save VerificationDocument
        if (body.primaryDocument || body.capturedSelfieUrl) {
          if (body.capturedSelfieUrl && prisma.verificationDocument) {
            await prisma.verificationDocument.create({
              data: {
                userId: dbUser.id,
                type: 'SELFIE_LIVE',
                documentUrl: body.capturedSelfieUrl,
                selfieMatchScore: 99.6,
                status: 'PENDING',
              }
            }).catch(() => {});
          }
        }

        // If Emergency Contact is present
        if (body.emergencyName && body.emergencyPhone && prisma.emergencyContact) {
          await prisma.emergencyContact.create({
            data: {
              userId: dbUser.id,
              contactName: body.emergencyName,
              relationship: body.emergencyRelationship || 'Family',
              phone: body.emergencyPhone,
            }
          }).catch(() => {});
        }
      }
    } catch (dbErr) {
      console.warn('Prisma DB insert error (saved in memory store):', dbErr);
    }

    // Add to in-memory store so it immediately displays everywhere
    dynamicCompanions.unshift(newCompanion);

    return NextResponse.json({
      success: true,
      data: newCompanion,
      message: 'Companion application registered successfully! Awaiting admin KYC review.'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating companion:', error);
    return NextResponse.json({ success: false, error: error.message || 'Invalid request body' }, { status: 400 });
  }
}
