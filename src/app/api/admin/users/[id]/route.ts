import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        kycDocuments: true,
        sessions: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fullName, phone, role, riskLevel, accountFrozen, bio, city, country, hourlyRate } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        phone,
        role,
        riskLevel,
        accountFrozen,
        profile: {
          upsert: {
            create: {
              bio: bio || '',
              age: 26,
              gender: 'Other',
              city: city || 'New York',
              country: country || 'USA',
              hourlyRate: Number(hourlyRate) || 75,
              categories: ['General'],
              availability: {},
            },
            update: {
              bio,
              city,
              country,
              hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : undefined,
            }
          }
        }
      },
      include: { profile: true }
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'User deleted permanently'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
