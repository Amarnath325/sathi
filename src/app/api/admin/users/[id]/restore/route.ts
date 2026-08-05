import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.update({
      where: { id },
      data: {
        accountFrozen: false,
        riskLevel: 'LOW',
        riskScore: 0.05
      }
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_RESTORE_USER',
          payload: { userId: id }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `User ${user.fullName} successfully restored to ACTIVE status`,
      data: user
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to restore user' },
      { status: 500 }
    );
  }
}
