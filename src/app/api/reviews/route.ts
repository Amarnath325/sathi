import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '@/lib/mockData';
import { ReviewStatus, ReviewSentiment } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const companionId = searchParams.get('companionId');
    const rating = searchParams.get('rating');
    const query = searchParams.get('query')?.toLowerCase();

    let list = [...MOCK_REVIEWS];

    if (status && status !== 'ALL') {
      list = list.filter((r) => r.status === status as ReviewStatus);
    }

    if (companionId) {
      list = list.filter((r) => r.companionId === companionId);
    }

    if (rating) {
      list = list.filter((r) => r.rating === Number(rating));
    }

    if (query) {
      list = list.filter(
        (r) =>
          r.authorName.toLowerCase().includes(query) ||
          (r.companionName && r.companionName.toLowerCase().includes(query)) ||
          r.comment.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      totalCount: list.length,
      reviews: list
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authorName, authorAvatar, companionId, companionName, rating, subRatings, category, comment, bookingId, bookingNumber } = body;

    if (!authorName || !companionId || !rating || !comment) {
      return NextResponse.json({ success: false, error: 'Missing required review fields' }, { status: 400 });
    }

    const text = comment.toLowerCase();
    const containsSpam = text.includes('http://') || text.includes('https://') || text.includes('call me') || text.includes('fake') || text.includes('casino');
    const status: ReviewStatus = containsSpam ? 'FLAGGED' : 'PENDING_APPROVAL';
    const sentiment: ReviewSentiment = containsSpam ? 'SUSPICIOUS' : rating >= 4 ? 'POSITIVE' : rating === 3 ? 'NEUTRAL' : 'NEGATIVE';

    const newReview = {
      id: 'rev-' + Date.now(),
      reviewRef: 'REV-2026-' + Math.floor(1000 + Math.random() * 9000),
      bookingId: bookingId || 'bk-' + Math.floor(1000 + Math.random() * 9000),
      bookingNumber: bookingNumber || 'CC-2026-' + Math.floor(1000 + Math.random() * 9000),
      authorName,
      authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      companionId,
      companionName: companionName || 'Companion Partner',
      rating: Number(rating),
      subRatings: subRatings || { punctuality: rating, behavior: rating, communication: rating, authenticity: rating },
      category: category || 'General Companion',
      comment,
      helpfulVotes: 0,
      date: new Date().toISOString(),
      verifiedBooking: true,
      sentimentScore: rating / 5,
      sentiment,
      status,
      flaggedReason: containsSpam ? 'Automated spam/link detection rule triggered' : undefined,
      flaggedBy: containsSpam ? ('AUTOMATED_PROFANITY_FILTER' as const) : undefined
    };

    MOCK_REVIEWS.unshift(newReview);

    return NextResponse.json({
      success: true,
      message: containsSpam ? 'Review submitted and flagged for automated safety check.' : 'Review submitted successfully pending approval.',
      review: newReview
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
