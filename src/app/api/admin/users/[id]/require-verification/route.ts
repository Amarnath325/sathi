import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/users/[id]/require-verification - Flag account to require fresh KYC verification
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.update({
      where: { id },
      data: { isEmailVerified: false, isPhoneVerified: false }
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_REQUIRE_VERIFICATION_USER',
          payload: { userId: id }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Fresh verification flagged for ${user.fullName}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to require verification' },
      { status: 500 }
    );
  }
}
