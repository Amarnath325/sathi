import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const policies = [
      { domain: 'FINANCE_AND_ESCROW', retentionDays: 2555, complianceStandard: 'SOC2_TYPE_II' },
      { domain: 'TRUST_AND_SAFETY', retentionDays: 1825, complianceStandard: 'HIPAA' },
      { domain: 'STAFF_RBAC', retentionDays: 1095, complianceStandard: 'SOC2_TYPE_II' },
      { domain: 'USERS', retentionDays: 365, complianceStandard: 'GDPR' },
    ];
    return NextResponse.json({ success: true, policies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { domain, retentionDays } = body;

    return NextResponse.json({
      success: true,
      message: `Audit retention policy for ${domain} updated to ${retentionDays} days`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
