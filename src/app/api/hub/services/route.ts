import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SERVICES } from '@/lib/initialHubData';
import { ServiceReadinessEngine } from '@/lib/serviceHubEngines';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('category_id');
  const status = searchParams.get('status');

  let list = INITIAL_SERVICES;
  if (categoryId && categoryId !== 'ALL') {
    list = list.filter(s => s.category_id === categoryId);
  }
  if (status && status !== 'ALL') {
    list = list.filter(s => s.status === status);
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

    const newService = {
      ...body,
      id: 'srv-' + Date.now(),
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      status: body.status || 'DRAFT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: newService
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
