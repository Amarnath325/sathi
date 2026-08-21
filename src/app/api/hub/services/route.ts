import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_SERVICES } from '@/lib/initialHubData';
import { ServiceReadinessEngine } from '@/lib/serviceHubEngines';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category_id');
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (categoryId && categoryId !== 'ALL') whereClause.category_id = categoryId;
    if (status && status !== 'ALL') whereClause.status = status;

    let dbServices = await prisma.hubService.findMany({
      where: whereClause,
      orderBy: { display_order: 'asc' }
    });

    if (!dbServices || dbServices.length === 0) {
      return NextResponse.json({
        success: true,
        source: 'Initial Hub Data',
        total: INITIAL_SERVICES.length,
        data: INITIAL_SERVICES
      });
    }

    return NextResponse.json({
      success: true,
      source: 'Neon PostgreSQL DB',
      total: dbServices.length,
      data: dbServices
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      source: 'Fallback Initial Data',
      total: INITIAL_SERVICES.length,
      data: INITIAL_SERVICES
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === 'PUBLISH_READINESS') {
      const readiness = ServiceReadinessEngine.checkReadiness(body.service);
      return NextResponse.json({
        success: true,
        readiness
      });
    }

    if (!body.name || !body.category_id) {
      return NextResponse.json({ success: false, error: 'Service name and category_id are required' }, { status: 400 });
    }

    const name = body.name.trim();
    const slug = body.slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const serviceData = {
      category_id: body.category_id,
      name,
      slug,
      short_description: body.short_description || body.description || '',
      description: body.description || '',
      icon: body.icon || 'Sparkles',
      image: body.image || '',
      display_order: Number(body.display_order) || 0,
      status: (body.status as any) || 'DRAFT',
      is_featured: Boolean(body.is_featured),
      minimum_age: Number(body.minimum_age) || 18,
      maximum_age: Number(body.maximum_age) || 75,
      online_allowed: Boolean(body.online_allowed),
      offline_allowed: Boolean(body.offline_allowed),
      location_required: Boolean(body.location_required),
      duration_required: Boolean(body.duration_required),
      pricing_profile_id: body.pricing_profile_id || null,
      rules_profile_id: body.rules_profile_id || null,
      policy_id: body.policy_id || null,
      risk_level_id: body.risk_level_id || null,
      verification_profile_id: body.verification_profile_id || null,
      safety_profile_id: body.safety_profile_id || null,
      booking_rule_id: body.booking_rule_id || null,
      eligibility_profile_id: body.eligibility_profile_id || null
    };

    try {
      const upserted = await prisma.hubService.upsert({
        where: { slug },
        update: serviceData,
        create: serviceData
      });

      return NextResponse.json({
        success: true,
        message: `Service "${upserted.name}" saved in Neon PostgreSQL DB`,
        data: upserted
      }, { status: 201 });
    } catch (dbErr: any) {
      console.error('Neon DB hubService upsert error:', dbErr);
      return NextResponse.json({ success: false, error: dbErr.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
