import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/users/[id]/reset-2fa - Reset 2FA security authentication
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.update({
      where: { id },
      data: { is2FAEnabled: false }
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_RESET_2FA_USER',
          payload: { userId: id }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `2FA security reset for ${user.fullName}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset 2FA' },
      { status: 500 }
    );
  }
}
