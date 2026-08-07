import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationCategory = 'SYSTEM' | 'BOOKING' | 'SAFETY' | 'PAYMENT' | 'KYC' | 'PROMO' | 'SECURITY' | 'COMMUNITY';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'PUSH' | 'SMS';
export type DeliveryStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'QUEUED';

export interface NotificationRecord {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  isRead: boolean;
  isArchived: boolean;
  isPinned: boolean;
  actionUrl?: string;
  actionLabel?: string;
  sentAt: string;
  readAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationTemplateItem {
  id: string;
  code: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  isActive: boolean;
  variableKeys: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserNotificationPreference {
  userId: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  dndEnabled: boolean;
  disabledCategories: NotificationCategory[];
}

export interface ChannelProviderConfig {
  channel: NotificationChannel;
  providerName: string;
  isEnabled: boolean;
  environment: 'SANDBOX' | 'PRODUCTION';
  apiStatus: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  dailyQuota: number;
  dailySentCount: number;
  rateLimitPerSec: number;
}

export interface DeliveryAuditLog {
  id: string;
  notificationId: string;
  userId: string;
  userName: string;
  channel: NotificationChannel;
  status: DeliveryStatus;
  providerRef?: string;
  errorMessage?: string;
  sentAt: string;
  latencyMs: number;
}

export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRatePercent: number;
  openRatePercent: number;
  channelBreakdown: Record<NotificationChannel, number>;
  categoryBreakdown: Record<NotificationCategory, number>;
}

interface NotificationEngineStore {
  // State
  notifications: NotificationRecord[];
  templates: NotificationTemplateItem[];
  userPreferences: UserNotificationPreference;
  channelConfigs: ChannelProviderConfig[];
  deliveryLogs: DeliveryAuditLog[];
  currentUserId: string;

  // Actions - User Inbox
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  archiveNotification: (id: string) => void;
  togglePinNotification: (id: string) => void;
  clearAll: () => void;

  // Actions - Engine & Admin
  sendNotification: (payload: {
    userId: string;
    userName?: string;
    title: string;
    body: string;
    category: NotificationCategory;
    priority?: NotificationPriority;
    channels?: NotificationChannel[];
    actionUrl?: string;
    actionLabel?: string;
    metadata?: Record<string, any>;
  }) => NotificationRecord;

  bulkBroadcast: (payload: {
    targetRole?: string;
    targetCity?: string;
    targetSegment?: string;
    title: string;
    body: string;
    category: NotificationCategory;
    priority: NotificationPriority;
    channels: NotificationChannel[];
    actionUrl?: string;
    actionLabel?: string;
  }) => { broadcastId: string; recipientCount: number };

  // Template CRUD
  addTemplate: (template: Omit<NotificationTemplateItem, 'id' | 'createdAt' | 'updatedAt'>) => NotificationTemplateItem;
  updateTemplate: (id: string, updates: Partial<NotificationTemplateItem>) => void;
  toggleTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;

  // Channel Config
  toggleChannelConfig: (channel: NotificationChannel) => void;
  updateChannelConfig: (channel: NotificationChannel, updates: Partial<ChannelProviderConfig>) => void;

  // Preferences
  updatePreferences: (updates: Partial<UserNotificationPreference>) => void;

  // Audit Logs
  retryDeliveryLog: (logId: string) => void;

  // Analytics Computation
  getAnalytics: () => NotificationAnalytics;
}

const INITIAL_TEMPLATES: NotificationTemplateItem[] = [
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
  {
    id: 'tpl-3',
    code: 'KYC_VERIFIED_SUCCESS',
    title: 'Identity Verification Approved ✅',
    body: 'Congratulations {{userName}}, your KYC badge is now ACTIVE! You can now accept high-tier companion bookings.',
    category: 'KYC',
    priority: 'MEDIUM',
    channels: ['IN_APP', 'EMAIL'],
    isActive: true,
    variableKeys: ['userName'],
    createdAt: '2026-08-02T00:00:00Z',
    updatedAt: '2026-08-02T00:00:00Z',
  },
  {
    id: 'tpl-4',
    code: 'PAYMENT_PAYOUT_RELEASED',
    title: 'Escrow Payout Released 💳',
    body: 'Your earnings of ${{amount}} for booking {{bookingRef}} have been transferred to your bank account.',
    category: 'PAYMENT',
    priority: 'HIGH',
    channels: ['IN_APP', 'EMAIL', 'SMS'],
    isActive: true,
    variableKeys: ['amount', 'bookingRef'],
    createdAt: '2026-08-03T00:00:00Z',
    updatedAt: '2026-08-03T00:00:00Z',
  },
  {
    id: 'tpl-5',
    code: 'PROMO_SUMMER_PASS',
    title: '🎉 15% OFF Summer Pass Unlocked!',
    body: 'Use code {{promoCode}} for 15% off your next event companion booking before August 15th.',
    category: 'PROMO',
    priority: 'LOW',
    channels: ['IN_APP', 'PUSH'],
    isActive: true,
    variableKeys: ['promoCode'],
    createdAt: '2026-08-04T00:00:00Z',
    updatedAt: '2026-08-04T00:00:00Z',
  },
];

const INITIAL_CHANNEL_CONFIGS: ChannelProviderConfig[] = [
  {
    channel: 'IN_APP',
    providerName: 'Internal SSE Broadcast',
    isEnabled: true,
    environment: 'PRODUCTION',
    apiStatus: 'HEALTHY',
    dailyQuota: 500000,
    dailySentCount: 14230,
    rateLimitPerSec: 1000,
  },
  {
    channel: 'EMAIL',
    providerName: 'SendGrid V3 Relay',
    isEnabled: true,
    environment: 'PRODUCTION',
    apiStatus: 'HEALTHY',
    dailyQuota: 100000,
    dailySentCount: 8450,
    rateLimitPerSec: 100,
  },
  {
    channel: 'PUSH',
    providerName: 'Firebase Cloud Messaging (FCM)',
    isEnabled: true,
    environment: 'PRODUCTION',
    apiStatus: 'HEALTHY',
    dailyQuota: 250000,
    dailySentCount: 11200,
    rateLimitPerSec: 500,
  },
  {
    channel: 'SMS',
    providerName: 'Twilio Programmable SMS',
    isEnabled: true,
    environment: 'SANDBOX',
    apiStatus: 'HEALTHY',
    dailyQuota: 10000,
    dailySentCount: 1250,
    rateLimitPerSec: 20,
  },
];

const INITIAL_DELIVERY_LOGS: DeliveryAuditLog[] = [
  {
    id: 'log-101',
    notificationId: 'notif-1',
    userId: 'user-001',
    userName: 'Alex Thompson',
    channel: 'IN_APP',
    status: 'DELIVERED',
    providerRef: 'SSE-EVT-9041',
    sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    latencyMs: 42,
  },
  {
    id: 'log-102',
    notificationId: 'notif-1',
    userId: 'user-001',
    userName: 'Alex Thompson',
    channel: 'EMAIL',
    status: 'DELIVERED',
    providerRef: 'SG.msg.9481.042',
    sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    latencyMs: 230,
  },
  {
    id: 'log-103',
    notificationId: 'notif-2',
    userId: 'user-001',
    userName: 'Alex Thompson',
    channel: 'PUSH',
    status: 'DELIVERED',
    providerRef: 'FCM-TOKEN-3019',
    sentAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    latencyMs: 88,
  },
  {
    id: 'log-104',
    notificationId: 'notif-3',
    userId: 'user-002',
    userName: 'Sophia Chen',
    channel: 'SMS',
    status: 'FAILED',
    errorMessage: 'Carrier rate limit exceeded (HTTP 429)',
    providerRef: 'TW-SMS-ERR-429',
    sentAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    latencyMs: 1450,
  },
  {
    id: 'log-105',
    notificationId: 'notif-4',
    userId: 'user-003',
    userName: 'Priya Nair',
    channel: 'EMAIL',
    status: 'DELIVERED',
    providerRef: 'SG.msg.7712.991',
    sentAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    latencyMs: 310,
  },
];

const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    userId: 'user-001',
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
    userId: 'user-001',
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
  {
    id: 'notif-3',
    userId: 'user-001',
    userName: 'Review System',
    title: 'New review on your profile',
    body: 'Michael Jordan left you a 5-star review: "Phenomenal experience at the gala!"',
    category: 'COMMUNITY',
    priority: 'MEDIUM',
    channels: ['IN_APP'],
    isRead: true,
    isArchived: false,
    isPinned: false,
    actionUrl: '/reviews',
    actionLabel: 'View Review',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'notif-4',
    userId: 'user-001',
    userName: 'Finance Desk',
    title: 'Payment Received: $207.00',
    body: 'Escrow payout for booking CC-2026-8812 has been released to your wallet.',
    category: 'PAYMENT',
    priority: 'HIGH',
    channels: ['IN_APP', 'EMAIL', 'SMS'],
    isRead: true,
    isArchived: false,
    isPinned: false,
    actionUrl: '/wallet',
    actionLabel: 'Check Wallet',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'notif-5',
    userId: 'user-001',
    userName: 'Trust & Safety',
    title: '🛡️ Safety Check-In Reminder',
    body: 'Your companion booking starts in 2 hours. Ensure your live location sharing is active.',
    category: 'SAFETY',
    priority: 'URGENT',
    channels: ['IN_APP', 'PUSH', 'SMS'],
    isRead: false,
    isArchived: false,
    isPinned: true,
    actionUrl: '/safety',
    actionLabel: 'Open Safety Desk',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export const useNotificationEngineStore = create<NotificationEngineStore>()(
  persist(
    (set, get) => ({
      notifications: INITIAL_NOTIFICATIONS,
      templates: INITIAL_TEMPLATES,
      channelConfigs: INITIAL_CHANNEL_CONFIGS,
      deliveryLogs: INITIAL_DELIVERY_LOGS,
      currentUserId: 'user-001',
      userPreferences: {
        userId: 'user-001',
        inAppEnabled: true,
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        dndEnabled: false,
        disabledCategories: [],
      },

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
            readAt: n.readAt || new Date().toISOString(),
          })),
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      archiveNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isArchived: !n.isArchived } : n
          ),
        })),

      togglePinNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isPinned: !n.isPinned } : n
          ),
        })),

      clearAll: () =>
        set(() => ({
          notifications: [],
        })),

      sendNotification: (payload) => {
        const id = 'notif-' + Date.now();
        const newNotif: NotificationRecord = {
          id,
          userId: payload.userId,
          userName: payload.userName || 'System Broadcast',
          title: payload.title,
          body: payload.body,
          category: payload.category,
          priority: payload.priority || 'MEDIUM',
          channels: payload.channels || ['IN_APP'],
          isRead: false,
          isArchived: false,
          isPinned: false,
          actionUrl: payload.actionUrl,
          actionLabel: payload.actionLabel,
          sentAt: new Date().toISOString(),
          metadata: payload.metadata,
        };

        // Create log entries
        const newLogs: DeliveryAuditLog[] = (payload.channels || ['IN_APP']).map((ch) => ({
          id: 'log-' + Math.floor(100000 + Math.random() * 900000),
          notificationId: id,
          userId: payload.userId,
          userName: payload.userName || 'Alex Thompson',
          channel: ch,
          status: 'DELIVERED',
          providerRef: `${ch}-REF-${Math.floor(1000 + Math.random() * 9000)}`,
          sentAt: new Date().toISOString(),
          latencyMs: Math.floor(20 + Math.random() * 200),
        }));

        set((state) => ({
          notifications: [newNotif, ...state.notifications],
          deliveryLogs: [...newLogs, ...state.deliveryLogs],
        }));

        return newNotif;
      },

      bulkBroadcast: (payload) => {
        const broadcastId = 'bc-' + Date.now();
        const recipientCount = payload.targetSegment === 'COMPANIONS' ? 142 : payload.targetSegment === 'CUSTOMERS' ? 890 : 1032;

        const newNotif: NotificationRecord = {
          id: 'notif-' + Date.now(),
          userId: 'user-001',
          userName: `Admin Broadcast (${payload.targetRole || 'ALL USERS'})`,
          title: payload.title,
          body: payload.body,
          category: payload.category,
          priority: payload.priority,
          channels: payload.channels,
          isRead: false,
          isArchived: false,
          isPinned: true,
          actionUrl: payload.actionUrl,
          actionLabel: payload.actionLabel,
          sentAt: new Date().toISOString(),
        };

        const newLogs: DeliveryAuditLog[] = payload.channels.map((ch) => ({
          id: 'log-' + Math.floor(100000 + Math.random() * 900000),
          notificationId: newNotif.id,
          userId: 'user-001',
          userName: 'Alex Thompson (Broadcast Recipient)',
          channel: ch,
          status: 'DELIVERED',
          providerRef: `${ch}-BC-${Math.floor(1000 + Math.random() * 9000)}`,
          sentAt: new Date().toISOString(),
          latencyMs: Math.floor(30 + Math.random() * 150),
        }));

        set((state) => ({
          notifications: [newNotif, ...state.notifications],
          deliveryLogs: [...newLogs, ...state.deliveryLogs],
        }));

        return { broadcastId, recipientCount };
      },

      addTemplate: (templateData) => {
        const newTemplate: NotificationTemplateItem = {
          ...templateData,
          id: 'tpl-' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ templates: [newTemplate, ...state.templates] }));
        return newTemplate;
      },

      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      toggleTemplate: (id) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, isActive: !t.isActive, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      toggleChannelConfig: (channel) =>
        set((state) => ({
          channelConfigs: state.channelConfigs.map((c) =>
            c.channel === channel ? { ...c, isEnabled: !c.isEnabled } : c
          ),
        })),

      updateChannelConfig: (channel, updates) =>
        set((state) => ({
          channelConfigs: state.channelConfigs.map((c) =>
            c.channel === channel ? { ...c, ...updates } : c
          ),
        })),

      updatePreferences: (updates) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...updates },
        })),

      retryDeliveryLog: (logId) =>
        set((state) => ({
          deliveryLogs: state.deliveryLogs.map((l) =>
            l.id === logId
              ? {
                  ...l,
                  status: 'DELIVERED',
                  errorMessage: undefined,
                  sentAt: new Date().toISOString(),
                  latencyMs: Math.floor(40 + Math.random() * 100),
                }
              : l
          ),
        })),

      getAnalytics: () => {
        const logs = get().deliveryLogs;
        const totalSent = logs.length;
        const totalDelivered = logs.filter((l) => l.status === 'DELIVERED').length;
        const totalFailed = logs.filter((l) => l.status === 'FAILED').length;
        const deliveryRatePercent = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 100;

        const notifs = get().notifications;
        const readCount = notifs.filter((n) => n.isRead).length;
        const openRatePercent = notifs.length > 0 ? Math.round((readCount / notifs.length) * 100) : 0;

        const channelBreakdown: Record<NotificationChannel, number> = {
          IN_APP: logs.filter((l) => l.channel === 'IN_APP').length,
          EMAIL: logs.filter((l) => l.channel === 'EMAIL').length,
          PUSH: logs.filter((l) => l.channel === 'PUSH').length,
          SMS: logs.filter((l) => l.channel === 'SMS').length,
        };

        const categoryBreakdown: Record<NotificationCategory, number> = {
          SYSTEM: notifs.filter((n) => n.category === 'SYSTEM').length,
          BOOKING: notifs.filter((n) => n.category === 'BOOKING').length,
          SAFETY: notifs.filter((n) => n.category === 'SAFETY').length,
          PAYMENT: notifs.filter((n) => n.category === 'PAYMENT').length,
          KYC: notifs.filter((n) => n.category === 'KYC').length,
          PROMO: notifs.filter((n) => n.category === 'PROMO').length,
          SECURITY: notifs.filter((n) => n.category === 'SECURITY').length,
          COMMUNITY: notifs.filter((n) => n.category === 'COMMUNITY').length,
        };

        return {
          totalSent,
          totalDelivered,
          totalFailed,
          deliveryRatePercent,
          openRatePercent,
          channelBreakdown,
          categoryBreakdown,
        };
      },
    }),
    {
      name: 'companion-notification-engine-store',
    }
  )
);
