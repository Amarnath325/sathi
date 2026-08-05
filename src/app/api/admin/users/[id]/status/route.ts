import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/users/[id]/status - Quick status transitions (Suspend, Restrict, Ban, Activate, Verify)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, reason } = body; // action: 'SUSPEND' | 'UNSUSPEND' | 'RESTRICT' | 'BAN' | 'ACTIVATE' | 'VERIFY_EMAIL'

    let updateData: any = {};

    switch (action) {
      case 'SUSPEND':
        updateData = { accountFrozen: true };
        break;
      case 'UNSUSPEND':
      case 'ACTIVATE':
        updateData = { accountFrozen: false, riskLevel: 'LOW' };
        break;
      case 'RESTRICT':
        updateData = { riskLevel: 'HIGH', riskScore: 0.8 };
        break;
      case 'BAN':
        updateData = { accountFrozen: true, riskLevel: 'CRITICAL', riskScore: 1.0 };
        break;
      case 'VERIFY_EMAIL':
        updateData = { isEmailVerified: true, isPhoneVerified: true };
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid status action' },
          { status: 400 }
        );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        accountFrozen: true,
        riskLevel: true,
        riskScore: true,
        isEmailVerified: true,
      }
    });

    // Create Audit Log entry
    try {
      await prisma.auditLog.create({
        data: {
          action: `USER_STATUS_CHANGE_${action}`,
          payload: { userId: id, reason, updatedState: updateData }
        }
      });
    } catch (auditError) {
      console.warn('Audit log write skipped:', auditError);
    }

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.fullName} status updated via ${action}`,
      data: updatedUser
    });
  } catch (error: any) {
    console.error(`Error updating user status ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user status' },
      { status: 500 }
    );
  }
}
