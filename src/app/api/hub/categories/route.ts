import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/lib/initialHubData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let list = INITIAL_CATEGORIES;
  if (status && status !== 'ALL') {
    list = list.filter(c => c.status === status);
  }

  return NextResponse.json({
    success: true,
    total: list.length,
    data: list
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.description) {
      return NextResponse.json({ success: false, error: 'Category name and description are required' }, { status: 400 });
    }

    const newCategory = {
      ...body,
      id: 'cat-' + Date.now(),
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      display_order: body.display_order || 1,
      status: body.status || 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
