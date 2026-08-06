import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPANIONS } from '@/lib/mockData';
import { UserProfile, CompanionFilter } from '@/lib/types';

// In-memory store (shared reference for mock CRUD)
let companions: UserProfile[] = [...MOCK_COMPANIONS];

// GET /api/companions — list with filters, search, sort, pagination
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const gender = searchParams.get('gender') || '';
  const minRate = Number(searchParams.get('minRate') || 0);
  const maxRate = Number(searchParams.get('maxRate') || 9999);
  const minRating = Number(searchParams.get('minRating') || 0);
  const availableNow = searchParams.get('availableNow') === 'true';
  const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
  const status = searchParams.get('status') || '';
  const sortBy = searchParams.get('sortBy') || 'rating_desc';
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 12);

  let filtered = companions.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q) && !c.bio.toLowerCase().includes(q)) return false;
    }
    if (category && !c.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))) return false;
    if (city && !c.city.toLowerCase().includes(city.toLowerCase())) return false;
    if (gender && c.gender !== gender) return false;
    if (c.hourlyRate < minRate || c.hourlyRate > maxRate) return false;
    if (c.ratingAvg < minRating) return false;
    if (availableNow && !c.isAvailableNow) return false;
    if (verifiedOnly && !c.verificationBadge) return false;
    if (status && c.status !== status) return false;
    return true;
  });

  // Sort
  switch (sortBy) {
    case 'rating_desc': filtered.sort((a, b) => b.ratingAvg - a.ratingAvg); break;
    case 'price_asc': filtered.sort((a, b) => a.hourlyRate - b.hourlyRate); break;
    case 'price_desc': filtered.sort((a, b) => b.hourlyRate - a.hourlyRate); break;
    case 'most_booked': filtered.sort((a, b) => b.completedBookings - a.completedBookings); break;
    case 'newest': filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()); break;
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data: paginated,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  });
}

// POST /api/companions — create new companion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCompanion: UserProfile = {
      ...body,
      id: 'comp-' + Date.now(),
      role: 'VERIFIED_COMPANION',
      ratingAvg: 5.0,
      ratingCount: 0,
      completedBookings: 0,
      verificationBadge: false,
      kycStatus: 'PENDING',
      isAvailableNow: true,
      responseTimeMin: 15,
      riskScore: 0.0,
      riskLevel: 'LOW',
      status: 'PENDING_VERIFICATION',
      totalEarnings: 0,
      createdAt: new Date().toISOString().split('T')[0],
      availability: body.availability || {},
    };
    companions.push(newCompanion);
    return NextResponse.json({ data: newCompanion, message: 'Companion created successfully.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
