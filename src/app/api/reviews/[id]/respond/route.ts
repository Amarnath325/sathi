import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '@/lib/mockData';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { adminResponse } = body;

    const review = MOCK_REVIEWS.find((r) => r.id === id || r.reviewRef === id);

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    if (!adminResponse) {
      return NextResponse.json({ success: false, error: 'Response content is required' }, { status: 400 });
    }

    review.adminResponse = adminResponse;
    review.moderatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Official response attached to review',
      review
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
