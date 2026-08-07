import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const mockSettings = {
      general: { appName: 'Sathi ERP', supportEmail: 'support@sathi.io', defaultCurrency: 'USD' },
      finance: { commissionRatePercent: 12.5, minPayoutThresholdUsd: 50.0 },
      communication: { twilioSenderPhone: '+1 (800) 555-0199' },
      storage: { s3BucketName: 'sathi-production-us-west-2' },
      maintenance: { isMaintenanceActive: false },
      security: { rateLimitRequestsPerMin: 600 },
    };

    return NextResponse.json({
      success: true,
      category: category || 'ALL',
      settings: mockSettings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { category, updates } = body;

    return NextResponse.json({
      success: true,
      message: `System settings for category [${category || 'GENERAL'}] updated successfully`,
      updatedSettings: updates,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
