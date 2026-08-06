import { NextResponse } from 'next/server';
import { INITIAL_PROMOS } from '@/lib/initialPromos';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, bookingAmount, categoryId } = body;

    if (!code || bookingAmount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing code or bookingAmount parameters' },
        { status: 400 }
      );
    }

    const codeNormalized = code.trim().toUpperCase();
    const found = INITIAL_PROMOS.find(p => p.code.toUpperCase() === codeNormalized);

    if (!found) {
      return NextResponse.json({
        success: false,
        isValid: false,
        discountAmount: 0,
        finalAmount: Number(bookingAmount),
        error: `Coupon code "${codeNormalized}" is invalid or does not exist.`
      }, { status: 404 });
    }

    if (!found.isActive) {
      return NextResponse.json({
        success: false,
        isValid: false,
        discountAmount: 0,
        finalAmount: Number(bookingAmount),
        error: `Coupon code "${codeNormalized}" is currently deactivated.`
      }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    if (found.expiryDate && found.expiryDate < today) {
      return NextResponse.json({
        success: false,
        isValid: false,
        discountAmount: 0,
        finalAmount: Number(bookingAmount),
        error: `Coupon code "${codeNormalized}" expired on ${found.expiryDate}.`
      }, { status: 400 });
    }

    if (found.usageLimit && found.usageCount >= found.usageLimit) {
      return NextResponse.json({
        success: false,
        isValid: false,
        discountAmount: 0,
        finalAmount: Number(bookingAmount),
        error: `Coupon code "${codeNormalized}" redemption limit has been reached.`
      }, { status: 400 });
    }

    const amount = Number(bookingAmount);
    if (amount < found.minBookingAmount) {
      return NextResponse.json({
        success: false,
        isValid: false,
        discountAmount: 0,
        finalAmount: amount,
        error: `Minimum booking subtotal of $${found.minBookingAmount} required to apply this coupon.`
      }, { status: 400 });
    }

    let discount = 0;
    if (found.discountType === 'PERCENTAGE' || found.discountPercent) {
      const pct = found.discountValue || found.discountPercent || 0;
      discount = (amount * pct) / 100;
      if (found.maxDiscountLimit && discount > found.maxDiscountLimit) {
        discount = found.maxDiscountLimit;
      }
    } else {
      discount = found.discountValue || found.flatDiscount || 0;
    }

    discount = Math.min(discount, amount);
    const finalAmount = Math.max(0, amount - discount);

    return NextResponse.json({
      success: true,
      isValid: true,
      code: found.code,
      discountType: found.discountType,
      discountValue: found.discountValue,
      discountAmount: Math.round(discount),
      finalAmount: Math.round(finalAmount),
      promo: {
        id: found.id,
        code: found.code,
        title: found.title,
        description: found.description
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to validate promo code', details: error.message },
      { status: 500 }
    );
  }
}
