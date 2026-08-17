import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_CATEGORIES } from '@/lib/initialCategories';
import { ServiceCategory } from '@/lib/types';

let inMemoryStore: ServiceCategory[] = [...INITIAL_CATEGORIES];

// Helper to seed initial categories into DB if DB is connected
async function seedInitialCategoriesIfEmpty() {
  try {
    for (const cat of INITIAL_CATEGORIES) {
      const existing = await prisma.category.findFirst({
        where: { OR: [{ id: cat.id }, { name: cat.name }] },
        include: { subcategories: true }
      });

      if (!existing) {
        await prisma.category.create({
          data: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
            description: cat.description,
            iconName: cat.iconName || 'Users',
            bannerUrl: cat.bannerUrl || null,
            riskLevel: cat.riskLevel || 'LOW',
            baseRateMultiplier: cat.baseRateMultiplier || 1.0,
            minAgeLimit: cat.minAgeLimit || 18,
            isFeatured: cat.isFeatured || false,
            isActive: cat.isActive ?? true,
            companionCount: cat.companionCount || 0,
            safetyPolicy: cat.safetyPolicy || null,
            subcategories: {
              create: (cat.subcategories || []).map((s: any) => ({
                id: s.id.startsWith('sub-') ? s.id : undefined,
                name: s.name,
                description: s.description,
                basePrice: s.basePrice,
                requiredVerification: s.requiredVerification,
              }))
            }
          }
        });
      } else {
        // Sync any missing subcategories into DB
        for (const sub of cat.subcategories || []) {
          const subExists = existing.subcategories.some((s: any) => s.name.toLowerCase() === sub.name.toLowerCase());
          if (!subExists) {
            await prisma.subService.create({
              data: {
                name: sub.name,
                description: sub.description,
                basePrice: sub.basePrice,
                requiredVerification: sub.requiredVerification,
                categoryId: existing.id
              }
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('Prisma DB auto-seed skipped or failed:', err);
  }
}

// GET /api/categories — list all categories with optional search, riskLevel, and active filter
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();
  const risk = searchParams.get('risk')?.toUpperCase();
  const featured = searchParams.get('featured');
  const activeOnly = searchParams.get('active');

  try {
    await seedInitialCategoriesIfEmpty();

    const dbCategories = await prisma.category.findMany({
      include: {
        subcategories: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    let list: ServiceCategory[] = dbCategories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      iconName: c.iconName,
      bannerUrl: c.bannerUrl || '',
      riskLevel: c.riskLevel,
      baseRateMultiplier: c.baseRateMultiplier,
      minAgeLimit: c.minAgeLimit,
      isFeatured: c.isFeatured,
      isActive: c.isActive,
      companionCount: c.companionCount,
      safetyPolicy: c.safetyPolicy || '',
      createdAt: c.createdAt.toISOString(),
      subcategories: c.subcategories.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        basePrice: s.basePrice,
        requiredVerification: s.requiredVerification
      }))
    }));

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
      data: list,
      source: 'database'
    });
  } catch (err) {
    console.error('Error fetching categories from Neon DB, falling back to memory:', err);
    let list = [...inMemoryStore];
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
      data: list,
      source: 'fallback'
    });
  }
}

// POST /api/categories — create new category in Neon DB
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.description) {
      return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 });
    }

    const categoryData = {
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
      safetyPolicy: body.safetyPolicy || 'Standard safety policy applies.',
    };

    const subcats = Array.isArray(body.subcategories) ? body.subcategories : [];

    try {
      const created = await prisma.category.create({
        data: {
          ...categoryData,
          subcategories: {
            create: subcats.map((s: any) => ({
              name: s.name,
              description: s.description || 'Custom service offering.',
              basePrice: Number(s.basePrice) || 50,
              requiredVerification: Boolean(s.requiredVerification)
            }))
          }
        },
        include: {
          subcategories: true
        }
      });

      const formatted: ServiceCategory = {
        id: created.id,
        name: created.name,
        slug: created.slug,
        description: created.description,
        iconName: created.iconName,
        bannerUrl: created.bannerUrl || '',
        riskLevel: created.riskLevel,
        baseRateMultiplier: created.baseRateMultiplier,
        minAgeLimit: created.minAgeLimit,
        isFeatured: created.isFeatured,
        isActive: created.isActive,
        companionCount: created.companionCount,
        safetyPolicy: created.safetyPolicy || '',
        createdAt: created.createdAt.toISOString(),
        subcategories: created.subcategories.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          basePrice: s.basePrice,
          requiredVerification: s.requiredVerification
        }))
      };

      inMemoryStore.push(formatted);

      return NextResponse.json({
        success: true,
        message: 'Category created successfully in database.',
        data: formatted
      }, { status: 201 });
    } catch (dbErr) {
      console.warn('DB creation failed, saving to in-memory fallback:', dbErr);
      const newCategory: ServiceCategory = {
        id: 'c-' + Date.now(),
        ...categoryData,
        companionCount: 0,
        subcategories: subcats,
        createdAt: new Date().toISOString()
      };
      inMemoryStore.push(newCategory);
      return NextResponse.json({
        success: true,
        message: 'Category created successfully.',
        data: newCategory
      }, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
}
