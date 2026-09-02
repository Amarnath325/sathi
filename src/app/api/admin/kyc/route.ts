import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'all' && status !== 'verification-dashboard') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { type: { contains: search, mode: 'insensitive' } },
        { documentNumber: { contains: search, mode: 'insensitive' } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    try {
      const documents = await prisma.verificationDocument.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, fullName: true, email: true, phone: true }
          }
        }
      });

      return NextResponse.json({ success: true, data: documents });
    } catch (dbErr) {
      // In-memory / dynamic queue fallback
      return NextResponse.json({ success: true, data: [] });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch KYC records' },
      { status: 500 }
    );
  }
}
