import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '@/lib/mockData';
import { ReviewStatus } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reason, adminNotes } = body;

    const review = MOCK_REVIEWS.find((r) => r.id === id || r.reviewRef === id);

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    if (!action) {
      return NextResponse.json({ success: false, error: 'Moderation action is required' }, { status: 400 });
    }

    let status: ReviewStatus = 'APPROVED';

    switch (action) {
      case 'APPROVE':
        status = 'APPROVED';
        break;
      case 'FLAG':
        status = 'FLAGGED';
        review.flaggedReason = reason || 'Flagged by admin auditor';
        review.sentiment = 'SUSPICIOUS';
        break;
      case 'REJECT':
        status = 'REJECTED';
        break;
      case 'HIDE':
        status = 'HIDDEN';
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid moderation action' }, { status: 400 });
    }

    review.status = status;
    if (adminNotes) {
      review.adminNotes = review.adminNotes ? `${review.adminNotes} | ${adminNotes}` : adminNotes;
    }
    review.moderatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Review #${review.reviewRef} moderated: status updated to ${status}`,
      review
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
