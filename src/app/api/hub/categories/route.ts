import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_CATEGORIES } from '@/lib/initialHubData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let dbCategories = await prisma.hubCategory.findMany({
      where: status && status !== 'ALL' ? { status } : {},
      orderBy: { display_order: 'asc' }
    });

    if (!dbCategories || dbCategories.length === 0) {
      dbCategories = INITIAL_CATEGORIES as any;
    }

    return NextResponse.json({
      success: true,
      source: 'Neon PostgreSQL DB',
      total: dbCategories.length,
      data: dbCategories
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      source: 'Fallback Initial Data',
      total: INITIAL_CATEGORIES.length,
      data: INITIAL_CATEGORIES
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.description) {
      return NextResponse.json({ success: false, error: 'Category name and description are required' }, { status: 400 });
    }

    const created = await prisma.hubCategory.create({
      data: {
        name: body.name.trim(),
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description.trim(),
        icon: body.icon || 'Users',
        minimum_age: body.minimum_age || 18,
        is_featured: body.is_featured || false,
        status: body.status || 'ACTIVE'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Category created in Neon PostgreSQL DB',
      data: created
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
