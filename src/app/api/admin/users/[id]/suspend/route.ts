import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/users/[id]/suspend - Suspend user account
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Account suspended by system administrator.';

    const user = await prisma.user.update({
      where: { id },
      data: { accountFrozen: true }
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_SUSPEND_USER',
          payload: { userId: id, reason }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `User ${user.fullName} (${user.email}) suspended successfully`,
      data: user
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to suspend user' },
      { status: 500 }
    );
  }
}
