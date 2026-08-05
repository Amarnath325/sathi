import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const reports = await prisma.incidentReport.findMany({
        where: {
          OR: [{ reporterId: id }, { reportedUserId: id }]
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ success: true, data: reports });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        isFallback: true,
        data: []
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user reports' },
      { status: 500 }
    );
  }
}
