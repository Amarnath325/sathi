import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/users/bulk-action - Execute batch operations (SUSPEND, BAN, RESTORE, DELETE, RESTRICT)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userIds = [], reason } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No user IDs provided for bulk action' },
        { status: 400 }
      );
    }

    let resultMessage = '';

    switch (action) {
      case 'SUSPEND':
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { accountFrozen: true }
        });
        resultMessage = `Bulk suspended ${userIds.length} users.`;
        break;

      case 'BAN':
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { accountFrozen: true, riskLevel: 'CRITICAL', riskScore: 1.0 }
        });
        resultMessage = `Bulk banned ${userIds.length} users.`;
        break;

      case 'RESTORE':
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { accountFrozen: false, riskLevel: 'LOW', riskScore: 0.05 }
        });
        resultMessage = `Bulk restored ${userIds.length} users to Active.`;
        break;

      case 'RESTRICT':
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { riskLevel: 'HIGH', riskScore: 0.8 }
        });
        resultMessage = `Bulk placed high risk restrictions on ${userIds.length} users.`;
        break;

      case 'DELETE':
        await prisma.user.deleteMany({
          where: { id: { in: userIds } }
        });
        resultMessage = `Bulk deleted ${userIds.length} users permanently.`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid bulk action type' },
          { status: 400 }
        );
    }

    try {
      await prisma.auditLog.create({
        data: {
          action: `ADMIN_BULK_${action}`,
          payload: { userIds, reason }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: resultMessage,
      count: userIds.length
    });
  } catch (error: any) {
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute bulk action' },
      { status: 500 }
    );
  }
}
