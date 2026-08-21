import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/hub/services/[id]
export async function GET(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  try {
    const service = await prisma.hubService.findFirst({
      where: { OR: [{ id: id }, { slug: id }] }
    });
    if (service) {
      return NextResponse.json({ success: true, data: service });
    }
  } catch (err) {
    console.warn(`Prisma find failed for hubService ${id}:`, err);
  }
  return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
}

// PATCH /api/hub/services/[id]
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const updates = await req.json();

    try {
      const existing = await prisma.hubService.findFirst({
        where: {
          OR: [
            { id: id },
            { slug: id },
            ...(updates.name ? [{ name: updates.name }] : []),
            ...(updates.slug ? [{ slug: updates.slug }] : [])
          ]
        }
      });

      if (existing) {
        const updated = await prisma.hubService.update({
          where: { id: existing.id },
          data: {
            ...(updates.name ? { name: updates.name.trim() } : {}),
            ...(updates.slug ? { slug: updates.slug.trim() } : {}),
            ...(updates.category_id ? { category_id: updates.category_id } : {}),
            ...(updates.short_description !== undefined ? { short_description: updates.short_description } : {}),
            ...(updates.description ? { description: updates.description } : {}),
            ...(updates.icon ? { icon: updates.icon } : {}),
            ...(updates.image !== undefined ? { image: updates.image } : {}),
            ...(updates.display_order !== undefined ? { display_order: Number(updates.display_order) } : {}),
            ...(updates.status ? { status: updates.status } : {}),
            ...(updates.is_featured !== undefined ? { is_featured: Boolean(updates.is_featured) } : {}),
            ...(updates.minimum_age !== undefined ? { minimum_age: Number(updates.minimum_age) } : {}),
            ...(updates.maximum_age !== undefined ? { maximum_age: Number(updates.maximum_age) } : {}),
            ...(updates.online_allowed !== undefined ? { online_allowed: Boolean(updates.online_allowed) } : {}),
            ...(updates.offline_allowed !== undefined ? { offline_allowed: Boolean(updates.offline_allowed) } : {}),
            ...(updates.location_required !== undefined ? { location_required: Boolean(updates.location_required) } : {}),
            ...(updates.duration_required !== undefined ? { duration_required: Boolean(updates.duration_required) } : {}),
            ...(updates.pricing_profile_id !== undefined ? { pricing_profile_id: updates.pricing_profile_id } : {}),
            ...(updates.rules_profile_id !== undefined ? { rules_profile_id: updates.rules_profile_id } : {}),
            ...(updates.policy_id !== undefined ? { policy_id: updates.policy_id } : {}),
            ...(updates.risk_level_id !== undefined ? { risk_level_id: updates.risk_level_id } : {}),
            ...(updates.verification_profile_id !== undefined ? { verification_profile_id: updates.verification_profile_id } : {}),
            ...(updates.safety_profile_id !== undefined ? { safety_profile_id: updates.safety_profile_id } : {}),
            ...(updates.booking_rule_id !== undefined ? { booking_rule_id: updates.booking_rule_id } : {}),
            ...(updates.eligibility_profile_id !== undefined ? { eligibility_profile_id: updates.eligibility_profile_id } : {})
          }
        });

        return NextResponse.json({
          success: true,
          message: `Service "${updated.name}" updated in Neon DB`,
          data: updated
        });
      } else {
        const name = updates.name || id;
        const slug = updates.slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const serviceData = {
          category_id: updates.category_id || 'cat-1',
          name,
          slug,
          short_description: updates.short_description || '',
          description: updates.description || '',
          icon: updates.icon || 'Sparkles',
          image: updates.image || '',
          display_order: Number(updates.display_order) || 0,
          status: (updates.status as any) || 'DRAFT',
          is_featured: Boolean(updates.is_featured),
          minimum_age: Number(updates.minimum_age) || 18,
          maximum_age: Number(updates.maximum_age) || 75,
          online_allowed: Boolean(updates.online_allowed),
          offline_allowed: Boolean(updates.offline_allowed),
          location_required: Boolean(updates.location_required),
          duration_required: Boolean(updates.duration_required)
        };

        const upserted = await prisma.hubService.upsert({
          where: { slug },
          update: serviceData,
          create: serviceData
        });

        return NextResponse.json({
          success: true,
          message: `Service "${upserted.name}" created and updated in Neon DB`,
          data: upserted
        });
      }
    } catch (err: any) {
      console.error('Neon DB PATCH hubService error:', err);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
}

// DELETE /api/hub/services/[id]
export async function DELETE(_req: NextRequest, props: Props) {
  const { id } = await props.params;

  try {
    const existing = await prisma.hubService.findFirst({
      where: { OR: [{ id: id }, { slug: id }] }
    });

    if (existing) {
      await prisma.hubService.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({
        success: true,
        message: `Service "${existing.name}" permanently deleted from Neon DB.`
      });
    }
    return NextResponse.json({ success: true, message: 'Service not found in DB.' });
  } catch (err: any) {
    console.error('Neon DB DELETE hubService error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
