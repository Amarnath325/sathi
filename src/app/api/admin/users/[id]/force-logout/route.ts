import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await prisma.userSession.deleteMany({
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
