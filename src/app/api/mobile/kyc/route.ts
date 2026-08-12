import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      id: 'kyc_mob_101',
      userId: 'usr_mobile_101',
      documentType: 'aadhaar',
      documentNumber: 'XXXX-XXXX-9012',
      documentFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400',
      selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      status: 'verified',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentType, documentNumber } = body;

    return NextResponse.json({
      success: true,
      message: 'KYC documents submitted successfully. Verification in progress.',
      data: {
        id: 'kyc_mob_' + Date.now(),
        userId: 'usr_mobile_101',
        documentType: documentType || 'aadhaar',
        documentNumber: documentNumber || '',
        status: 'submitted',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mobile KYC API Error' }, { status: 500 });
  }
}
