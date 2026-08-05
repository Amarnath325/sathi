import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, reason, isEmailVerified, isPhoneVerified } = body;

    let accountFrozen: boolean | undefined = undefined;
    let riskLevel: any = undefined;
    let riskScore: number | undefined = undefined;

    if (status === 'SUSPENDED') {
      accountFrozen = true;
    } else if (status === 'BANNED') {
      accountFrozen = true;
      riskLevel = 'CRITICAL';
      riskScore = 1.0;
    } else if (status === 'RESTRICTED') {
      riskLevel = 'HIGH';
      riskScore = 0.8;
    } else if (status === 'ACTIVE') {
      accountFrozen = false;
      riskLevel = 'LOW';
      riskScore = 0.05;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        accountFrozen,
        riskLevel,
        riskScore,
        isEmailVerified: isEmailVerified !== undefined ? Boolean(isEmailVerified) : undefined,
        isPhoneVerified: isPhoneVerified !== undefined ? Boolean(isPhoneVerified) : undefined,
      }
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: `ADMIN_USER_STATUS_CHANGE_${status}`,
          payload: {
            userId: id,
            status,
            reason: reason || 'Admin panel status update'
          }
        }
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `User status changed to ${status}`,
      data: updatedUser
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user status' },
      { status: 500 }
    );
  }
}
