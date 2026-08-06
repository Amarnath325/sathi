import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/lib/initialCategories';
import { ServiceCategory } from '@/lib/types';


let categoriesStore: ServiceCategory[] = [...INITIAL_CATEGORIES];

// GET /api/categories — list all categories with optional search, riskLevel, and active filter
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();
  const risk = searchParams.get('risk')?.toUpperCase();
  const featured = searchParams.get('featured');
  const activeOnly = searchParams.get('active');

  let list = [...categoriesStore];

  if (query) {
    list = list.filter(c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query));
  }

  if (risk) {
    list = list.filter(c => c.riskLevel === risk);
  }

  if (featured === 'true') {
    list = list.filter(c => c.isFeatured);
  }

  if (activeOnly === 'true') {
    list = list.filter(c => c.isActive);
  }

  return NextResponse.json({
    success: true,
    total: list.length,
    data: list
  });
}

// POST /api/categories — create new category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.description) {
      return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 });
    }

    const newCategory: ServiceCategory = {
      id: 'c-' + Date.now(),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description,
      iconName: body.iconName || 'Users',
      bannerUrl: body.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      riskLevel: body.riskLevel || 'LOW',
      baseRateMultiplier: Number(body.baseRateMultiplier) || 1.0,
      minAgeLimit: Number(body.minAgeLimit) || 18,
      isFeatured: Boolean(body.isFeatured),
      isActive: true,
      companionCount: 0,
      subcategories: body.subcategories || [],
      safetyPolicy: body.safetyPolicy || 'Standard safety policy applies.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    categoriesStore.push(newCategory);

    return NextResponse.json({
      success: true,
      message: 'Category created successfully.',
      data: newCategory
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
}
