import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Account features restricted due to safety risk alert.';

    const user = await prisma.user.update({
      where: { id },
      data: {
        riskLevel: 'HIGH',
        riskScore: 0.85
      }
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_RESTRICT_USER',
          payload: { userId: id, reason }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Restrictions applied to ${user.fullName}`,
      data: user
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to restrict user' },
      { status: 500 }
    );
  }
}
