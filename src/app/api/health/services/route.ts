import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const services = [
      { serviceName: 'DATABASE_POSTGRES', status: 'HEALTHY', pingMs: 8, uptimePercent: 99.99 },
      { serviceName: 'REDIS_CACHE', status: 'HEALTHY', pingMs: 2, uptimePercent: 99.98 },
      { serviceName: 'WEBSOCKET_GATEWAY', status: 'HEALTHY', pingMs: 14, uptimePercent: 99.95 },
      { serviceName: 'PAYMENT_STRIPE', status: 'HEALTHY', pingMs: 120, uptimePercent: 100.0 },
      { serviceName: 'SMS_TWILIO', status: 'HEALTHY', pingMs: 85, uptimePercent: 99.92 },
      { serviceName: 'EMAIL_SENDGRID', status: 'HEALTHY', pingMs: 95, uptimePercent: 99.89 },
      { serviceName: 'STORAGE_S3', status: 'HEALTHY', pingMs: 44, uptimePercent: 99.99 },
    ];
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
