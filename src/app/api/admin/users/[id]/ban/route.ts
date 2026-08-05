import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/users/[id]/ban - Ban user permanently
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Permanent ban issued by administrator for Terms Violation.';

    const user = await prisma.user.update({
      where: { id },
      data: {
        accountFrozen: true,
        riskLevel: 'CRITICAL',
        riskScore: 1.0
      }
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_BAN_USER',
          payload: { userId: id, reason }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `User ${user.fullName} permanently banned`,
      data: user
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to ban user' },
      { status: 500 }
    );
  }
}
