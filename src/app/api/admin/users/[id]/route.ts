import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/users/[id] - Get single user with full relation details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        kycDocuments: true,
        wallet: {
          include: {
            transactions: { take: 10, orderBy: { createdAt: 'desc' } }
          }
        },
        bookingsAsUser: { take: 5, orderBy: { createdAt: 'desc' } },
        bookingsAsCompanion: { take: 5, orderBy: { createdAt: 'desc' } },
        reportsAgainst: true,
        emergencyContacts: true,
        sessions: { take: 5, orderBy: { lastActive: 'desc' } },
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
    console.error(`Error fetching user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user details & profile
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      role,
      riskLevel,
      riskScore,
      city,
      country,
      hourlyRate,
      bio
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName: fullName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        role: role ? (role as any) : undefined,
        riskLevel: riskLevel ? (riskLevel as any) : undefined,
        riskScore: riskScore !== undefined ? Number(riskScore) : undefined,
        profile: (city || country || hourlyRate || bio)
          ? {
              upsert: {
                create: {
                  bio: bio || 'Companion Profile',
                  age: 25,
                  gender: 'Other',
                  city: city || 'New York',
                  country: country || 'USA',
                  hourlyRate: Number(hourlyRate) || 75,
                  categories: ['Event Companion'],
                  availability: {},
                },
                update: {
                  city: city || undefined,
                  country: country || undefined,
                  hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : undefined,
                  bio: bio || undefined,
                }
              }
            }
          : undefined
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.fullName} updated successfully`,
      data: updatedUser
    });
  } catch (error: any) {
    console.error(`Error updating user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user permanently
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: `User #${id} permanently deleted`
    });
  } catch (error: any) {
    console.error(`Error deleting user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
