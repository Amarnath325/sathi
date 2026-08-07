import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category } = body;

    return NextResponse.json({
      success: true,
      message: `System settings for category [${category || 'ALL'}] reset to enterprise defaults`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
