import { NextResponse } from 'next/server';
import { INITIAL_PROMOS } from '@/lib/initialPromos';
import { PromoCodeItem } from '@/lib/types';

let inMemoryPromos: PromoCodeItem[] = [...INITIAL_PROMOS];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active');
    const discountType = searchParams.get('type');
    const query = searchParams.get('q')?.toLowerCase();

    let list = [...inMemoryPromos];

    if (activeOnly === 'true') {
      const today = new Date().toISOString().split('T')[0];
      list = list.filter(p => p.isActive && (!p.expiryDate || p.expiryDate >= today));
    }

    if (discountType) {
      list = list.filter(p => p.discountType === discountType);
    }

    if (query) {
      list = list.filter(p =>
        p.code.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      metrics: {
        totalPromos: inMemoryPromos.length,
        activePromos: inMemoryPromos.filter(p => p.isActive).length,
        totalRedemptions: inMemoryPromos.reduce((acc, p) => acc + p.usageCount, 0)
      },
      data: list
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotions list', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, title, discountType, discountValue, minBookingAmount, usageLimit, expiryDate, applicableCategories, description } = body;

    if (!code || !title || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required promotional fields (code, title, discountType, discountValue)' },
        { status: 400 }
      );
    }

    const codeNormalized = code.trim().toUpperCase();
    if (inMemoryPromos.some(p => p.code === codeNormalized)) {
      return NextResponse.json(
        { success: false, error: `Promo code "${codeNormalized}" already exists!` },
        { status: 400 }
      );
    }

    const newPromo: PromoCodeItem = {
      id: 'p-' + Date.now(),
      code: codeNormalized,
      title,
      description: description || '',
      discountType,
      discountValue: Number(discountValue),
      discountPercent: discountType === 'PERCENTAGE' ? Number(discountValue) : 0,
      flatDiscount: discountType === 'FLAT_AMOUNT' ? Number(discountValue) : 0,
      minBookingAmount: Number(minBookingAmount || 0),
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usageCount: 0,
      expiryDate: expiryDate || '2026-12-31',
      applicableCategories: applicableCategories || ['All Categories'],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    inMemoryPromos.unshift(newPromo);

    return NextResponse.json(
      { success: true, message: 'Promotion campaign created successfully', data: newPromo },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to create promotion campaign', details: error.message },
      { status: 500 }
    );
  }
}
