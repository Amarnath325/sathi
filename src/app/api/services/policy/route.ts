import { NextResponse } from 'next/server';
import { MASTER_SERVICE_CATALOG, ServicePolicyEngine } from '@/lib/servicePolicyEngine';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      catalog: MASTER_SERVICE_CATALOG,
      totalServices: MASTER_SERVICE_CATALOG.length
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceName, description } = body;

    if (!serviceName) {
      return NextResponse.json({ success: false, error: 'serviceName is required' }, { status: 400 });
    }

    const evaluation = ServicePolicyEngine.evaluateServiceRequest(serviceName, description || '');

    return NextResponse.json({
      success: true,
      data: evaluation
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
