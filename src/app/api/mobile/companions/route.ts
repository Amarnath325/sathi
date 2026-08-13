import { NextRequest, NextResponse } from 'next/server';

const MOCK_MOBILE_COMPANIONS = [
  {
    id: 'comp_1',
    userId: 'u_101',
    name: 'Aanya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bio: 'Friendly local guide & travel companion in Delhi NCR. Fluent in English & Hindi.',
    isVerified: true,
    rating: 4.9,
    reviewCount: 42,
    hourlyRate: 850.0,
    location: 'New Delhi',
    distanceKm: 2.4,
    languages: ['English', 'Hindi', 'French'],
    interests: ['Culture', 'Food', 'Photography'],
    services: ['City Sightseeing', 'Travel Partner', 'Food Tour'],
    isAvailableToday: true,
    isFavorite: true,
  },
  {
    id: 'comp_2',
    userId: 'u_102',
    name: 'Rohan Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Food explorer, event buddy & tech enthusiast. Safe & courteous escort.',
    isVerified: true,
    rating: 4.8,
    reviewCount: 29,
    hourlyRate: 700.0,
    location: 'Gurugram',
    distanceKm: 5.1,
    languages: ['English', 'Hindi', 'Punjabi'],
    interests: ['Music Festivals', 'Gaming', 'Culinary'],
    services: ['Event Buddy', 'Food Tour', 'Shopping Companion'],
    isAvailableToday: true,
    isFavorite: false,
  },
];

const PROHIBITED_SERVICES = [
  'adult_escort',
  'dating_romance',
  'medical_procedure',
  'illegal_activities',
  'intimate_services',
  'overnight_stay',
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';

  let list = MOCK_MOBILE_COMPANIONS.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search) && !c.location.toLowerCase().includes(search)) {
      return false;
    }
    if (category && category !== 'All' && !c.services.some((s) => s.toLowerCase().includes(category.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return NextResponse.json({
    success: true,
    data: list,
    meta: {
      total: list.length,
      page: 1,
      limit: 10,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, companionId, services, weeklySchedule, blockedDates, reason, description, targetType, targetId } = body;

    // 1. Become a Companion Application
    if (action === 'become-companion') {
      if (services && Array.isArray(services)) {
        for (const s of services) {
          if (PROHIBITED_SERVICES.includes(s.toLowerCase().replace(/\s+/g, '_'))) {
            return NextResponse.json(
              {
                success: false,
                error: 'This service is not available on Companion Connect.',
              },
              { status: 400 }
            );
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Companion application submitted successfully! Pending KYC & Verification review.',
        data: {
          companionId: 'comp_app_' + Date.now(),
          status: 'submitted',
          verificationStatus: 'under_review',
        },
      });
    }

    // 2. Manage Availability & Schedule
    if (action === 'update-availability') {
      return NextResponse.json({
        success: true,
        message: 'Availability schedule updated authoritatively.',
        data: {
          weeklySchedule: weeklySchedule || {},
          blockedDates: blockedDates || [],
        },
      });
    }

    // 3. Raise Dispute Flow
    if (action === 'dispute') {
      return NextResponse.json({
        success: true,
        message: 'Dispute ticket created successfully.',
        data: {
          caseId: 'DISP_CASE_' + Date.now(),
          status: 'Open',
          reason: reason || 'Booking Dispute',
          createdAt: new Date().toISOString(),
        },
      });
    }

    // 4. Report User/Booking/Message Modal
    if (action === 'report') {
      return NextResponse.json({
        success: true,
        message: 'Report submitted for safety review.',
        data: {
          reportId: 'REP_CASE_' + Date.now(),
          targetType: targetType || 'USER',
          targetId: targetId || '',
          reason: reason || 'Safety Policy Violation',
        },
      });
    }

    if (action === 'toggle-favorite') {
      return NextResponse.json({
        success: true,
        message: 'Favorite status updated',
        data: { companionId, isFavorite: true },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid companion action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile Companion API Error' }, { status: 500 });
  }
}
