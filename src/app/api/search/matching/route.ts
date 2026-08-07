import { NextResponse } from 'next/server';
import { MarketplaceMatchingEngine, CompanionCandidate, SearchCriteria } from '@/lib/matchingAlgorithm';

const MOCK_CANDIDATES: CompanionCandidate[] = [
  {
    id: 'comp-101',
    name: 'Aria Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    city: 'Raipur',
    distanceKm: 3.2,
    hourlyRate: 45,
    ratingAvg: 4.9,
    ratingCount: 48,
    completedBookings: 52,
    cancellationRatePercent: 1.5,
    responseTimeMin: 8,
    categories: ['Conversation', 'Travel Companion', 'Event Companion', 'Shopping Partner'],
    languages: ['English', 'Hindi'],
    skills: ['City Guide', 'Event Protocol', 'Photography'],
    verificationStatus: 'VERIFIED',
    isIdentityVerified: true,
    safetyRiskScore: 0.02,
    isAvailableForDate: true,
    isAvailableForTime: true
  },
  {
    id: 'comp-102',
    name: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    city: 'Raipur',
    distanceKm: 5.0,
    hourlyRate: 50,
    ratingAvg: 4.8,
    ratingCount: 34,
    completedBookings: 39,
    cancellationRatePercent: 2.0,
    responseTimeMin: 12,
    categories: ['Study Partner', 'Gaming Partner', 'Fitness Partner'],
    languages: ['English', 'Hindi', 'Gujarati'],
    skills: ['Coding', 'Chess', 'Personal Fitness'],
    verificationStatus: 'VERIFIED',
    isIdentityVerified: true,
    safetyRiskScore: 0.04,
    isAvailableForDate: true,
    isAvailableForTime: true
  },
  {
    id: 'comp-103',
    name: 'Unverified Candidate',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    city: 'Raipur',
    distanceKm: 1.2,
    hourlyRate: 20, // Very low price, but will fail safety gate
    ratingAvg: 4.5,
    ratingCount: 5,
    completedBookings: 3,
    cancellationRatePercent: 30.0, // High cancellation rate
    responseTimeMin: 60,
    categories: ['Conversation'],
    languages: ['Hindi'],
    skills: ['General Chat'],
    verificationStatus: 'PENDING',
    isIdentityVerified: false,
    safetyRiskScore: 0.45, // High risk
    isAvailableForDate: true,
    isAvailableForTime: true
  }
];

export async function POST(request: Request) {
  try {
    const criteria: SearchCriteria = await request.json();
    const rankedList = MarketplaceMatchingEngine.rankCandidates(MOCK_CANDIDATES, criteria);

    return NextResponse.json({
      success: true,
      criteria,
      totalCount: rankedList.length,
      data: rankedList
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
