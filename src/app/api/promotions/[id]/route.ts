import { NextResponse } from 'next/server';
import { INITIAL_PROMOS } from '@/lib/initialPromos';
import { PromoCodeItem } from '@/lib/types';

let inMemoryPromos: PromoCodeItem[] = [...INITIAL_PROMOS];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const promo = inMemoryPromos.find(p => p.id === id);
    if (!promo) {
      return NextResponse.json(
        { success: false, error: `Promotion #${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: promo });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotion detail', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = inMemoryPromos.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Promotion #${id} not found` },
        { status: 404 }
      );
    }

    inMemoryPromos[index] = {
      ...inMemoryPromos[index],
      ...body
    };

    return NextResponse.json({
      success: true,
      message: `Promotion "${inMemoryPromos[index].code}" updated successfully`,
      data: inMemoryPromos[index]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update promotion', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = inMemoryPromos.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Promotion #${id} not found` },
        { status: 404 }
      );
    }

    const removed = inMemoryPromos.splice(index, 1)[0];

    return NextResponse.json({
      success: true,
      message: `Promotion code "${removed.code}" deleted successfully`,
      data: removed
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete promotion', details: error.message },
      { status: 500 }
    );
  }
}
