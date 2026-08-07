import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const backupCodes = Array.from({ length: 6 }, () =>
      Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000)
    );

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SathiERP:user@sathi.io?secret=${secret}&issuer=SathiERP`;

    return NextResponse.json({
      success: true,
      secret,
      qrCodeUrl,
      backupCodes,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method } = body;

    return NextResponse.json({
      success: true,
      message: `2FA setup initiated for method: ${method || 'TOTP_AUTHENTICATOR'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
