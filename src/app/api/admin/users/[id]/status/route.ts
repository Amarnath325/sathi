import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, riskLevel, accountFrozen, reason } = await request.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        accountFrozen: accountFrozen !== undefined ? accountFrozen : status === 'SUSPENDED' || status === 'BANNED',
        riskLevel: riskLevel || (status === 'RESTRICTED' ? 'HIGH' : status === 'BANNED' ? 'CRITICAL' : undefined)
      }
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: id,
          action: `USER_STATUS_CHANGE_${status}`,
          ipAddress: '127.0.0.1',
          payload: { reason: reason || `Status changed to ${status}` }
        }
      });
    } catch (logErr) {
      // Audit log fallback
    }

    return NextResponse.json({
      success: true,
      message: `User status updated to ${status}`,
      data: user
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user status' },
      { status: 500 }
    );
  }
}
