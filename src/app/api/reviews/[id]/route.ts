import { NextResponse } from 'next/server';
import { MOCK_REVIEWS } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = MOCK_REVIEWS.find((r) => r.id === id || r.reviewRef === id);

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = MOCK_REVIEWS.findIndex((r) => r.id === id || r.reviewRef === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Review record not found' }, { status: 404 });
    }

    MOCK_REVIEWS[index] = {
      ...MOCK_REVIEWS[index],
      ...body,
      moderatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review: MOCK_REVIEWS[index]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = MOCK_REVIEWS.findIndex((r) => r.id === id || r.reviewRef === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Review record not found' }, { status: 404 });
    }

    const removed = MOCK_REVIEWS.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
      review: removed[0]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
