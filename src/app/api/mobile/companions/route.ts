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
  {
    id: 'comp_3',
    userId: 'u_103',
    name: 'Priya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Professional tour escort & wellness companion. Loving art galleries and peaceful cafes.',
    isVerified: true,
    rating: 5.0,
    reviewCount: 18,
    hourlyRate: 950.0,
    location: 'Noida',
    distanceKm: 8.3,
    languages: ['English', 'Malayalam', 'Hindi'],
    interests: ['Art', 'Yoga', 'Heritage'],
    services: ['City Sightseeing', 'Shopping Companion'],
    isAvailableToday: false,
    isFavorite: false,
  },
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
    const { action, companionId } = body;

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
