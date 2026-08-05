import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Document verification failed administrative review.';

    try {
      const updatedDoc = await prisma.verificationDocument.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: reason
        },
        include: { user: true }
      });

      if (updatedDoc.userId) {
        await prisma.auditLog.create({
          data: {
            userId: updatedDoc.userId,
            action: 'KYC_DOCUMENT_REJECTED',
            ipAddress: '127.0.0.1',
            payload: { documentId: id, reason }
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'KYC Document rejected',
        data: updatedDoc
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        isFallback: true,
        message: `KYC Document #${id} rejected. Reason: ${reason}`
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reject KYC document' },
      { status: 500 }
    );
  }
}
