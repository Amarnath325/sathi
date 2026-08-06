import { NextResponse } from 'next/server';
import { MOCK_DISPUTES } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = MOCK_DISPUTES.find((d) => d.id === id || d.disputeRef === id);

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Dispute ticket not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      dispute: ticket
    });
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
    const index = MOCK_DISPUTES.findIndex((d) => d.id === id || d.disputeRef === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Dispute ticket not found' }, { status: 404 });
    }

    MOCK_DISPUTES[index] = {
      ...MOCK_DISPUTES[index],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Dispute ticket updated successfully',
      dispute: MOCK_DISPUTES[index]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
