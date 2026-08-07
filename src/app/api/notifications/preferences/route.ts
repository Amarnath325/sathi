import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'user-001';

  return NextResponse.json({
    success: true,
    preferences: {
      userId,
      inAppEnabled: true,
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      dndEnabled: false,
      disabledCategories: [],
    },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences: body,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
