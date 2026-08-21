import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ServiceCategory } from '@/lib/types';

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
    console.warn(`Prisma find failed for category ${id}:`, err);
  }

  return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
}

// PATCH /api/categories/[id] — Update category and sync sub-services in Neon DB
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const updates = await req.json();

    try {
      // Look up DB record by ID, slug, or name
      const existing = await prisma.category.findFirst({
        where: {
          OR: [
            { id: id },
            { slug: id },
            ...(updates.name ? [{ name: updates.name }] : []),
            ...(updates.slug ? [{ slug: updates.slug }] : [])
          ]
        },
        include: { subcategories: true }
      });

      if (existing) {
        // Handle subcategories sync if provided
        if (Array.isArray(updates.subcategories)) {
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
            ...(updates.name ? { name: updates.name.trim() } : {}),
            ...(updates.slug ? { slug: updates.slug.trim() } : {}),
            ...(updates.description ? { description: updates.description.trim() } : {}),
            ...(updates.iconName || updates.icon ? { iconName: updates.iconName || updates.icon } : {}),
            ...(updates.bannerUrl !== undefined || updates.image !== undefined ? { bannerUrl: updates.bannerUrl || updates.image } : {}),
            ...(updates.riskLevel ? { riskLevel: updates.riskLevel } : {}),
            ...(updates.baseRateMultiplier !== undefined ? { baseRateMultiplier: Number(updates.baseRateMultiplier) } : {}),
            ...(updates.minAgeLimit !== undefined || updates.minimum_age !== undefined ? { minAgeLimit: Number(updates.minAgeLimit || updates.minimum_age) } : {}),
            ...(updates.isFeatured !== undefined || updates.is_featured !== undefined ? { isFeatured: Boolean(updates.isFeatured ?? updates.is_featured) } : {}),
            ...(updates.isActive !== undefined || updates.status !== undefined ? { isActive: updates.isActive !== undefined ? Boolean(updates.isActive) : updates.status === 'ACTIVE' } : {}),
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
          message: `Category "${updated.name}" updated successfully in Neon DB.`,
          data: formatted
        });
      } else {
        // If not existing by ID, upsert by slug or name
        const slug = updates.slug || (updates.name ? updates.name.toLowerCase().replace(/\s+/g, '-') : id);
        const name = updates.name || id;

        const categoryData = {
          name,
          slug,
          description: updates.description || 'Category offering.',
          iconName: updates.iconName || updates.icon || 'Users',
          bannerUrl: updates.bannerUrl || updates.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
          riskLevel: (updates.riskLevel as any) || 'LOW',
          baseRateMultiplier: Number(updates.baseRateMultiplier) || 1.0,
          minAgeLimit: Number(updates.minAgeLimit || updates.minimum_age) || 18,
          isFeatured: Boolean(updates.isFeatured || updates.is_featured),
          isActive: updates.isActive !== undefined ? Boolean(updates.isActive) : updates.status === 'ACTIVE',
          safetyPolicy: updates.safetyPolicy || 'Standard safety policy applies.'
        };

        const upserted = await prisma.category.upsert({
          where: { slug: slug },
          update: categoryData,
          create: categoryData,
          include: { subcategories: true }
        });

        return NextResponse.json({
          success: true,
          message: `Category "${upserted.name}" created and updated in Neon DB.`,
          data: upserted
        });
      }
    } catch (dbErr) {
      console.error('Neon DB PATCH error:', dbErr);
      return NextResponse.json({ error: 'Failed to update category in Neon DB.' }, { status: 500 });
    }
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
        message: `Category "${existing.name}" has been permanently removed from Neon DB.`
      });
    }
    return NextResponse.json({ success: true, message: 'Category not found in DB.' });
  } catch (dbErr) {
    console.error(`Neon DB delete error for category ${id}:`, dbErr);
    return NextResponse.json({ error: 'Failed to delete category from DB.' }, { status: 500 });
  }
}
