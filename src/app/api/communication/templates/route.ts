import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const templates = [
      { templateKey: 'booking_confirmation', channel: 'EMAIL', name: 'Booking Confirmation Receipt' },
      { templateKey: 'kyc_verified_sms', channel: 'SMS', name: 'KYC Badge Verified SMS' },
      { templateKey: 'emergency_sos_push', channel: 'PUSH', name: 'Emergency SOS Safety Push Alert' },
    ];
    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, templateKey, channel, bodyTemplate } = body;

    return NextResponse.json({
      success: true,
      message: `Message template [${name}] saved successfully`,
      template: {
        id: 'tmpl-' + Date.now(),
        templateKey,
        channel,
        name,
        bodyTemplate,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
