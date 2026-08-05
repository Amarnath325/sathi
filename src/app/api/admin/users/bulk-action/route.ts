import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { action, userIds, reason } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one user ID must be selected' },
        { status: 400 }
      );
    }

    let updateData: any = {};
    let logMessage = '';

    switch (action) {
      case 'SUSPEND':
        updateData = { accountFrozen: true };
        logMessage = 'Bulk suspended accounts';
        break;

      case 'BAN':
        updateData = { accountFrozen: true, riskLevel: 'CRITICAL' };
        logMessage = 'Bulk banned accounts';
        break;

      case 'RESTRICT':
        updateData = { riskLevel: 'HIGH' };
        logMessage = 'Bulk restricted accounts';
        break;

      case 'RESTORE':
        updateData = { accountFrozen: false, riskLevel: 'LOW' };
        logMessage = 'Bulk restored accounts';
        break;

      case 'FORCE_LOGOUT':
        await prisma.userSession.deleteMany({
          where: { userId: { in: userIds } }
        });
        logMessage = 'Bulk forced logout user sessions';
        break;

      case 'RESET_2FA':
        updateData = { twoFactorSecret: null };
        logMessage = 'Bulk reset 2FA settings';
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid bulk action type' },
          { status: 400 }
        );
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: updateData
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully executed ${action} on ${userIds.length} users`,
      affectedCount: userIds.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}
