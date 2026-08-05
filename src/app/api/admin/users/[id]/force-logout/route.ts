import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/users/[id]/force-logout - Revoke all active login sessions
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete or invalidate user sessions
    try {
      await prisma.session.deleteMany({
        where: { userId: id }
      });
    } catch (e) {}

    try {
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_FORCE_LOGOUT_USER',
          payload: { userId: id }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `All active sessions revoked for user #${id}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to force logout user' },
      { status: 500 }
    );
  }
}
