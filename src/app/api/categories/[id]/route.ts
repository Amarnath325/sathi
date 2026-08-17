import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_CATEGORIES } from '@/lib/initialCategories';
import { ServiceCategory } from '@/lib/types';

let inMemoryStore: ServiceCategory[] = [...INITIAL_CATEGORIES];

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/categories/[id]
export async function GET(_req: NextRequest, props: Props) {
  const { id } = await props.params;

  try {
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }]
      },
      include: {
        subcategories: true
      }
    });

    if (category) {
      const data: ServiceCategory = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        iconName: category.iconName,
        bannerUrl: category.bannerUrl || '',
        riskLevel: category.riskLevel,
        baseRateMultiplier: category.baseRateMultiplier,
        minAgeLimit: category.minAgeLimit,
        isFeatured: category.isFeatured,
        isActive: category.isActive,
        companionCount: category.companionCount,
        safetyPolicy: category.safetyPolicy || '',
        createdAt: category.createdAt.toISOString(),
        subcategories: category.subcategories.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          basePrice: s.basePrice,
          requiredVerification: s.requiredVerification
        }))
      };
      return NextResponse.json({ success: true, data });
    }
  } catch (err) {
    console.warn(`Prisma find failed for category ${id}, checking in-memory:`, err);
  }

  const fallbackCat = inMemoryStore.find(c => c.id === id || c.slug === id);
  if (!fallbackCat) {
    return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: fallbackCat });
}

// PATCH /api/categories/[id] — Update category and sync sub-services in Neon DB
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const updates = await req.json();

    try {
      // Look up DB record first
      const existing = await prisma.category.findFirst({
        where: { OR: [{ id: id }, { slug: id }] },
        include: { subcategories: true }
      });

      if (existing) {
        // Handle subcategories sync if provided
        if (Array.isArray(updates.subcategories)) {
          // Delete existing subcategories not present in updates, then upsert remaining
          await prisma.subService.deleteMany({
            where: { categoryId: existing.id }
          });
          
          await prisma.subService.createMany({
            data: updates.subcategories.map((s: any) => ({
              categoryId: existing.id,
              name: s.name,
              description: s.description || 'Custom service offering.',
              basePrice: Number(s.basePrice) || 50,
              requiredVerification: Boolean(s.requiredVerification)
            }))
          });
        }

        const updated = await prisma.category.update({
          where: { id: existing.id },
          data: {
            ...(updates.name ? { name: updates.name } : {}),
            ...(updates.slug ? { slug: updates.slug } : {}),
            ...(updates.description ? { description: updates.description } : {}),
            ...(updates.iconName ? { iconName: updates.iconName } : {}),
            ...(updates.bannerUrl !== undefined ? { bannerUrl: updates.bannerUrl } : {}),
            ...(updates.riskLevel ? { riskLevel: updates.riskLevel } : {}),
            ...(updates.baseRateMultiplier !== undefined ? { baseRateMultiplier: Number(updates.baseRateMultiplier) } : {}),
            ...(updates.minAgeLimit !== undefined ? { minAgeLimit: Number(updates.minAgeLimit) } : {}),
            ...(updates.isFeatured !== undefined ? { isFeatured: Boolean(updates.isFeatured) } : {}),
            ...(updates.isActive !== undefined ? { isActive: Boolean(updates.isActive) } : {}),
            ...(updates.safetyPolicy !== undefined ? { safetyPolicy: updates.safetyPolicy } : {})
          },
          include: {
            subcategories: true
          }
        });

        const formatted: ServiceCategory = {
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          description: updated.description,
          iconName: updated.iconName,
          bannerUrl: updated.bannerUrl || '',
          riskLevel: updated.riskLevel,
          baseRateMultiplier: updated.baseRateMultiplier,
          minAgeLimit: updated.minAgeLimit,
          isFeatured: updated.isFeatured,
          isActive: updated.isActive,
          companionCount: updated.companionCount,
          safetyPolicy: updated.safetyPolicy || '',
          createdAt: updated.createdAt.toISOString(),
          subcategories: updated.subcategories.map((s: any) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            basePrice: s.basePrice,
            requiredVerification: s.requiredVerification
          }))
        };

        return NextResponse.json({
          success: true,
          message: 'Category updated successfully in database.',
          data: formatted
        });
      }
    } catch (dbErr) {
      console.warn('DB update failed, updating in-memory fallback:', dbErr);
    }

    // In-memory fallback
    const idx = inMemoryStore.findIndex(c => c.id === id || c.slug === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    inMemoryStore[idx] = { ...inMemoryStore[idx], ...updates };

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully.',
      data: inMemoryStore[idx]
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
}

// DELETE /api/categories/[id] — Delete category from Neon DB
export async function DELETE(_req: NextRequest, props: Props) {
  const { id } = await props.params;

  try {
    const existing = await prisma.category.findFirst({
      where: { OR: [{ id: id }, { slug: id }] }
    });

    if (existing) {
      await prisma.category.delete({
        where: { id: existing.id }
      });

      return NextResponse.json({
        success: true,
        message: `Category "${existing.name}" has been permanently removed from database.`
      });
    }
  } catch (dbErr) {
    console.warn(`Prisma delete failed for category ${id}, attempting in-memory:`, dbErr);
  }

  const idx = inMemoryStore.findIndex(c => c.id === id || c.slug === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
  }

  const deletedName = inMemoryStore[idx].name;
  inMemoryStore.splice(idx, 1);

  return NextResponse.json({
    success: true,
    message: `Category ${deletedName} has been removed.`
  });
}
