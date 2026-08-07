import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-001';
    const category = searchParams.get('category');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Mock response simulating DB fetch
    const mockNotifications = [
      {
        id: 'notif-1',
        userId,
        userName: 'Sophia Chen',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        title: 'New message from Sophia Chen',
        body: "I'll arrive 15 minutes early near the fountain entrance!",
        category: 'BOOKING',
        priority: 'HIGH',
        channels: ['IN_APP', 'EMAIL', 'PUSH'],
        isRead: false,
        isArchived: false,
        isPinned: true,
        actionUrl: '/chat',
        actionLabel: 'Open Chat',
        sentAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'notif-2',
        userId,
        userName: 'System Escrow',
        title: 'Booking Confirmed ✓',
        body: 'Your booking CC-2026-8812 with Sophia Chen has been accepted. Escrow is locked.',
        category: 'BOOKING',
        priority: 'HIGH',
        channels: ['IN_APP', 'EMAIL'],
        isRead: false,
        isArchived: false,
        isPinned: false,
        actionUrl: '/booking/CC-2026-8812',
        actionLabel: 'View Booking',
        sentAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ];

    let filtered = mockNotifications;
    if (category && category !== 'ALL') {
      filtered = filtered.filter(n => n.category === category);
    }
    if (unreadOnly) {
      filtered = filtered.filter(n => !n.isRead);
    }

    return NextResponse.json({
      success: true,
      totalCount: filtered.length,
      unreadCount: filtered.filter(n => !n.isRead).length,
      notifications: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title, body: notifBody, category, priority, channels, actionUrl, actionLabel } = body;

    if (!userId || !title || !notifBody) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, title, body' },
        { status: 400 }
      );
    }

    const newNotification = {
      id: 'notif-' + Date.now(),
      userId,
      title,
      body: notifBody,
      category: category || 'SYSTEM',
      priority: priority || 'MEDIUM',
      channels: channels || ['IN_APP'],
      isRead: false,
      isArchived: false,
      isPinned: false,
      actionUrl,
      actionLabel,
      sentAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Notification queued and dispatched across channels',
        notification: newNotification,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
