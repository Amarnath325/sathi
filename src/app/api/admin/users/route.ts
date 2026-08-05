import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role && role !== 'ALL') where.role = role;
    if (status && status !== 'ALL') {
      if (status === 'SUSPENDED' || status === 'BANNED') {
        where.accountFrozen = true;
      } else if (status === 'RESTRICTED') {
        where.riskLevel = 'HIGH';
      } else if (status === 'PENDING') {
        where.isEmailVerified = false;
      }
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          kycDocuments: { take: 1, orderBy: { createdAt: 'desc' } }
        }
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, password, role, city, country, hourlyRate } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone: phone || undefined }] }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email or phone already exists' },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        passwordHash: password || 'default_hashed_password_123',
        role: role || 'CUSTOMER',
        isEmailVerified: true,
        isPhoneVerified: Boolean(phone),
        profile: (role === 'VERIFIED_COMPANION' || hourlyRate) ? {
          create: {
            bio: 'Registered Companion Account',
            age: 26,
            gender: 'Other',
            city: city || 'New York',
            country: country || 'USA',
            hourlyRate: Number(hourlyRate) || 75,
            categories: ['Event Companion'],
            availability: {},
          }
        } : undefined
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json(
      { success: true, message: 'User created successfully', data: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
