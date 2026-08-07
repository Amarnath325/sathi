import { NextResponse } from 'next/server';

const MOCK_TEMPLATES = [
  {
    id: 'tpl-1',
    code: 'BOOKING_CONFIRMED',
    title: 'Booking Confirmed: {{bookingRef}}',
    body: 'Your booking with {{companionName}} on {{bookingDate}} has been accepted! Escrow of ${{amount}} is secured.',
    category: 'BOOKING',
    priority: 'HIGH',
    channels: ['IN_APP', 'EMAIL', 'PUSH'],
    isActive: true,
    variableKeys: ['bookingRef', 'companionName', 'bookingDate', 'amount'],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'tpl-2',
    code: 'SOS_EMERGENCY_DISPATCH',
    title: '⚠️ Emergency Dispatch Triggered',
    body: 'SOS Alert {{alertRef}} for {{userName}} at {{location}}. Local responders and emergency contacts notified.',
    category: 'SAFETY',
    priority: 'URGENT',
    channels: ['IN_APP', 'EMAIL', 'PUSH', 'SMS'],
    isActive: true,
    variableKeys: ['alertRef', 'userName', 'location'],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    totalTemplates: MOCK_TEMPLATES.length,
    templates: MOCK_TEMPLATES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, title, body: templateBody, category, priority, channels } = body;

    if (!code || !title || !templateBody) {
      return NextResponse.json(
        { success: false, error: 'Missing required template fields: code, title, body' },
        { status: 400 }
      );
    }

    const newTemplate = {
      id: 'tpl-' + Date.now(),
      code: code.toUpperCase().replace(/\s+/g, '_'),
      title,
      body: templateBody,
      category: category || 'SYSTEM',
      priority: priority || 'MEDIUM',
      channels: channels || ['IN_APP'],
      isActive: true,
      variableKeys: Array.from(templateBody.matchAll(/\{\{(\w+)\}\}/g)).map((m: any) => m[1]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Notification template created successfully',
        template: newTemplate,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
