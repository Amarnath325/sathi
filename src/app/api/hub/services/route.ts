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
      dbServices = INITIAL_SERVICES as any;
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

    const created = await prisma.hubService.create({
      data: {
        category_id: body.category_id,
        name: body.name.trim(),
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description || '',
        status: body.status || 'DRAFT',
        minimum_age: body.minimum_age || 18,
        maximum_age: body.maximum_age || 75
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Service created in Neon PostgreSQL DB',
      data: created
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
