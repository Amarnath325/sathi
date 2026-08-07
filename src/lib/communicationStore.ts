import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User Chat & Notification Types
export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ';
export type ConversationType = 'DIRECT' | 'SUPPORT' | 'SYSTEM';
export type ConversationStatus = 'ACTIVE' | 'ARCHIVED' | 'BLOCKED';

export interface FullChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'LOCATION' | 'FILE';
  mediaUrl?: string;
  status: MessageStatus;
  reactions?: { emoji: string; userId: string }[];
  timestamp: string;
  isDeleted?: boolean;
  deletedForEveryone?: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: string;
  participantNames?: string[];
  participantAvatars?: string[];
  participantIds?: string[];
  type: ConversationType;
  status: ConversationStatus;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageAt?: string;
  isPinned?: boolean;
  isMuted?: boolean;
  isOnline?: boolean;
  notificationPref?: string;
  bookingRef?: string;
  messages: FullChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  message?: string;
  type: string;
  avatar?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body?: string;
  content?: string;
  category?: string;
  priority?: string;
  author?: string;
  sentAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  createdAt: string;
}

// Enterprise Broadcast & Campaign Types
export type CommChannel = 'SMS' | 'EMAIL' | 'PUSH' | 'IN_APP_BANNER';
export type CommAudience = 'ALL_USERS' | 'VERIFIED_COMPANIONS' | 'PREMIUM_CLIENTS' | 'STAFF_ONLY';
export type CommCampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED';
export type CommTemplateCategory = 'TRANSACTIONAL' | 'MARKETING' | 'SECURITY' | 'SYSTEM';
export type CommDeliveryStatus = 'QUEUED' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED';

export interface CommunicationCampaignRecord {
  id: string;
  title: string;
  channel: CommChannel;
  targetAudience: CommAudience;
  subject?: string;
  body: string;
  status: CommCampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  totalRecipients: number;
  successCount: number;
  failedCount: number;
  createdBy: string;
  createdAt: string;
}

export interface CommunicationTemplateRecord {
  id: string;
  templateKey: string;
  channel: CommChannel;
  name: string;
  subject: string;
  bodyTemplate: string;
  variables: string[];
  category: CommTemplateCategory;
  isSystemTemplate: boolean;
  updatedAt: string;
}

export interface CommunicationDeliveryLogRecord {
  id: string;
  campaignId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: CommChannel;
  status: CommDeliveryStatus;
  providerMessageId: string;
  errorMessage?: string;
  deliveredAt: string;
}

export interface EventTriggerRule {
  id: string;
  eventName: string;
  description: string;
  channels: CommChannel[];
  templateKey: string;
  isActive: boolean;
}

interface CommunicationStore {
  // User Chat & Notification state
  currentUserId: string;
  currentUserName: string;
  conversations: Conversation[];
  notifications: NotificationItem[];
  announcements: AnnouncementItem[];

  // Admin ERP Broadcast state
  campaigns: CommunicationCampaignRecord[];
  templates: CommunicationTemplateRecord[];
  deliveryLogs: CommunicationDeliveryLogRecord[];
  eventTriggers: EventTriggerRule[];

  // User Chat Actions
  sendMessage: (conversationId: string, content: string, type?: string, mediaUrl?: string) => void;
  reactToMessage: (conversationId: string, messageId: string, emoji: string) => void;
  addReaction: (conversationId: string, messageId: string, emoji: string) => void;
  removeReaction: (conversationId: string, messageId: string, emoji: string) => void;
  deleteMessageForEveryone: (conversationId: string, messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  markConversationRead: (conversationId: string) => void;
  togglePinConversation: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  unarchiveConversation: (conversationId: string) => void;
  blockConversation: (conversationId: string) => void;
  setNotificationPref: (conversationId: string, pref: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markAnnouncementRead: (id: string) => void;
  markAllAnnouncementsRead: () => void;

  // Admin ERP Actions
  createCampaign: (campaign: Omit<CommunicationCampaignRecord, 'id' | 'status' | 'sentAt' | 'successCount' | 'failedCount' | 'totalRecipients' | 'createdAt'>) => string;
  dispatchCampaign: (campaignId: string) => Promise<void>;
  saveTemplate: (template: Omit<CommunicationTemplateRecord, 'id' | 'updatedAt'> & { id?: string }) => void;
  deleteTemplate: (templateId: string) => void;
  toggleEventTrigger: (triggerId: string) => void;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'usr-companion-1',
    participantName: 'Elena Rostova',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    participantRole: 'Verified VIP Companion',
    type: 'DIRECT',
    status: 'ACTIVE',
    unreadCount: 1,
    lastMessage: 'I have arrived at the venue lobby.',
    lastMessageTime: new Date(Date.now() - 300000).toISOString(),
    lastMessageAt: new Date(Date.now() - 300000).toISOString(),
    isPinned: true,
    isOnline: true,
    bookingRef: '#BKG-9921',
    messages: [
      {
        id: 'msg-101',
        senderId: 'usr-companion-1',
        senderName: 'Elena Rostova',
        content: 'I have arrived at the venue lobby.',
        type: 'TEXT',
        status: 'DELIVERED',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Escrow Payment Released',
    body: 'Payment of $450 released for companion booking #BKG-9921',
    message: 'Payment of $450 released for companion booking #BKG-9921',
    type: 'PAYMENT',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Platform Security Optimization Scheduled',
    body: 'Scheduled database & escrow optimization window on Sunday 02:00 UTC.',
    content: 'Scheduled database & escrow optimization window on Sunday 02:00 UTC.',
    category: 'SYSTEM',
    priority: 'MEDIUM',
    author: 'System Admin',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_CAMPAIGNS: CommunicationCampaignRecord[] = [
  {
    id: 'cmp-201',
    title: 'Summer Escrow Protection & Safety Upgrade Announcement',
    channel: 'EMAIL',
    targetAudience: 'ALL_USERS',
    subject: '🛡️ Important Security Notice: Sathi Escrow Protection Upgrades',
    body: 'Dear {{user_name}}, we have upgraded our platform escrow protection rules to ensure 100% money-back guarantee on all companion bookings.',
    status: 'COMPLETED',
    scheduledAt: null,
    sentAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    totalRecipients: 4250,
    successCount: 4210,
    failedCount: 40,
    createdBy: 'Alexander Vance (CTO)',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'cmp-202',
    title: 'Weekend Surge Payout Bonus for Verified Companions',
    channel: 'SMS',
    targetAudience: 'VERIFIED_COMPANIONS',
    subject: '🔥 Earn 20% Extra Weekend Bonus',
    body: 'Sathi Alert: Complete 3 companion bookings this weekend to receive an instant $100 escrow payout bonus! Click to opt in.',
    status: 'COMPLETED',
    scheduledAt: null,
    sentAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    totalRecipients: 850,
    successCount: 842,
    failedCount: 8,
    createdBy: 'Samantha Reed (Head of Operations)',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

const INITIAL_TEMPLATES: CommunicationTemplateRecord[] = [
  {
    id: 'tmpl-01',
    templateKey: 'booking_confirmation',
    channel: 'EMAIL',
    name: 'Booking Confirmation Receipt',
    subject: 'Booking Confirmed: {{booking_id}} with {{companion_name}}',
    bodyTemplate: 'Hi {{user_name}},\n\nYour companion booking #{{booking_id}} for {{booking_date}} has been confirmed. Escrow amount of ${{escrow_amount}} is held securely.',
    variables: ['user_name', 'booking_id', 'companion_name', 'booking_date', 'escrow_amount'],
    category: 'TRANSACTIONAL',
    isSystemTemplate: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-02',
    templateKey: 'kyc_verified_sms',
    channel: 'SMS',
    name: 'KYC Badge Verified SMS',
    subject: '',
    bodyTemplate: 'Sathi Security: Congratulations {{user_name}}! Your identity document has been verified. Your profile now features the Verified Companion Shield.',
    variables: ['user_name'],
    category: 'SECURITY',
    isSystemTemplate: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl-03',
    templateKey: 'emergency_sos_push',
    channel: 'PUSH',
    name: 'Emergency SOS Safety Push Alert',
    subject: '🚨 Emergency SOS Triggered',
    bodyTemplate: 'URGENT: Companion {{companion_name}} triggered SOS alert at {{location_coords}}. Dispatch team notified.',
    variables: ['companion_name', 'location_coords'],
    category: 'SYSTEM',
    isSystemTemplate: true,
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_DELIVERY_LOGS: CommunicationDeliveryLogRecord[] = [
  {
    id: 'log-801',
    campaignId: 'cmp-201',
    recipientEmail: 'client.vip@sathi.io',
    channel: 'EMAIL',
    status: 'OPENED',
    providerMessageId: 'sg_msg_9018441920412',
    deliveredAt: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
  {
    id: 'log-802',
    campaignId: 'cmp-201',
    recipientEmail: 'user.john@gmail.com',
    channel: 'EMAIL',
    status: 'DELIVERED',
    providerMessageId: 'sg_msg_9018441920413',
    deliveredAt: new Date(Date.now() - 3600000 * 23).toISOString(),
  },
  {
    id: 'log-803',
    campaignId: 'cmp-202',
    recipientPhone: '+1 (555) 019-2831',
    channel: 'SMS',
    status: 'DELIVERED',
    providerMessageId: 'tw_msg_SM990141209124',
    deliveredAt: new Date(Date.now() - 3600000 * 11).toISOString(),
  },
  {
    id: 'log-804',
    campaignId: 'cmp-202',
    recipientPhone: '+1 (555) 019-9988',
    channel: 'SMS',
    status: 'FAILED',
    providerMessageId: 'tw_msg_SM990141209125',
    errorMessage: 'Carrier unreachable or invalid phone number formatting',
    deliveredAt: new Date(Date.now() - 3600000 * 11).toISOString(),
  },
];

const INITIAL_TRIGGERS: EventTriggerRule[] = [
  {
    id: 'trg-1',
    eventName: 'BOOKING_CONFIRMED',
    description: 'Triggered when client locks escrow payment for companion booking',
    channels: ['EMAIL', 'SMS', 'PUSH'],
    templateKey: 'booking_confirmation',
    isActive: true,
  },
  {
    id: 'trg-2',
    eventName: 'KYC_VERIFIED',
    description: 'Triggered when admin approves companion identity verification documents',
    channels: ['SMS', 'PUSH'],
    templateKey: 'kyc_verified_sms',
    isActive: true,
  },
  {
    id: 'trg-3',
    eventName: 'EMERGENCY_SOS_PANIC',
    description: 'Triggered when companion presses live SOS button during active booking',
    channels: ['SMS', 'PUSH', 'IN_APP_BANNER'],
    templateKey: 'emergency_sos_push',
    isActive: true,
  },
];

export const useCommunicationStore = create<CommunicationStore>()(
  persist(
    (set, get) => ({
      currentUserId: 'usr-me',
      currentUserName: 'Alex Thompson',
      conversations: INITIAL_CONVERSATIONS,
      notifications: INITIAL_NOTIFICATIONS,
      announcements: INITIAL_ANNOUNCEMENTS,

      campaigns: INITIAL_CAMPAIGNS,
      templates: INITIAL_TEMPLATES,
      deliveryLogs: INITIAL_DELIVERY_LOGS,
      eventTriggers: INITIAL_TRIGGERS,

      sendMessage: (conversationId, content, type = 'TEXT', mediaUrl) => {
        const newMsg: FullChatMessage = {
          id: 'msg-' + Date.now(),
          senderId: get().currentUserId,
          senderName: get().currentUserName,
          content,
          type: type as any,
          mediaUrl,
          status: 'SENT',
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: content,
                  lastMessageTime: newMsg.timestamp,
                  lastMessageAt: newMsg.timestamp,
                  messages: [...c.messages, newMsg],
                }
              : c
          ),
        }));
      },

      reactToMessage: (conversationId, messageId, emoji) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) => {
                    if (m.id !== messageId) return m;
                    const rx = m.reactions || [];
                    const userId = state.currentUserId;
                    const exists = rx.some((r) => r.emoji === emoji && r.userId === userId);
                    const next = exists
                      ? rx.filter((r) => !(r.emoji === emoji && r.userId === userId))
                      : [...rx, { emoji, userId }];
                    return { ...m, reactions: next };
                  }),
                }
              : c
          ),
        }));
      },

      addReaction: (conversationId, messageId, emoji) => {
        get().reactToMessage(conversationId, messageId, emoji);
      },

      removeReaction: (conversationId, messageId, emoji) => {
        get().reactToMessage(conversationId, messageId, emoji);
      },

      deleteMessageForEveryone: (conversationId, messageId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, isDeleted: true, deletedForEveryone: true, content: 'This message was deleted' } : m
                  ),
                }
              : c
          ),
        }));
      },

      markConversationAsRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
        }));
      },

      markConversationRead: (conversationId) => {
        get().markConversationAsRead(conversationId);
      },

      togglePinConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, isPinned: !c.isPinned } : c
          ),
        }));
      },

      archiveConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, status: 'ARCHIVED' } : c
          ),
        }));
      },

      unarchiveConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, status: 'ACTIVE' } : c
          ),
        }));
      },

      blockConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, status: 'BLOCKED' } : c
          ),
        }));
      },

      setNotificationPref: (conversationId, pref) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, notificationPref: pref } : c
          ),
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      markAnnouncementRead: (id) => {
        set((state) => ({
          announcements: state.announcements.map((a) => (a.id === id ? { ...a, isRead: true } : a)),
        }));
      },

      markAllAnnouncementsRead: () => {
        set((state) => ({
          announcements: state.announcements.map((a) => ({ ...a, isRead: true })),
        }));
      },

      createCampaign: (data) => {
        const id = 'cmp-' + Date.now();
        const recipientCountMap: Record<CommAudience, number> = {
          ALL_USERS: 4250,
          VERIFIED_COMPANIONS: 850,
          PREMIUM_CLIENTS: 320,
          STAFF_ONLY: 45,
        };

        const newCampaign: CommunicationCampaignRecord = {
          ...data,
          id,
          status: 'DRAFT',
          sentAt: null,
          totalRecipients: recipientCountMap[data.targetAudience] || 100,
          successCount: 0,
          failedCount: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ campaigns: [newCampaign, ...state.campaigns] }));
        return id;
      },

      dispatchCampaign: async (campaignId) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId ? { ...c, status: 'SENDING' } : c
          ),
        }));

        await new Promise((res) => setTimeout(res, 1200));

        set((state) => ({
          campaigns: state.campaigns.map((c) => {
            if (c.id !== campaignId) return c;
            const successCount = Math.floor(c.totalRecipients * 0.98);
            const failedCount = c.totalRecipients - successCount;
            return {
              ...c,
              status: 'COMPLETED',
              sentAt: new Date().toISOString(),
              successCount,
              failedCount,
            };
          }),
        }));
      },

      saveTemplate: (data) => {
        set((state) => {
          if (data.id) {
            return {
              templates: state.templates.map((t) =>
                t.id === data.id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
              ),
            };
          }
          const id = 'tmpl-' + Date.now();
          return {
            templates: [
              {
                ...data,
                id,
                updatedAt: new Date().toISOString(),
              },
              ...state.templates,
            ],
          };
        });
      },

      deleteTemplate: (templateId) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== templateId),
        }));
      },

      toggleEventTrigger: (triggerId) => {
        set((state) => ({
          eventTriggers: state.eventTriggers.map((trg) =>
            trg.id === triggerId ? { ...trg, isActive: !trg.isActive } : trg
          ),
        }));
      },
    }),
    {
      name: 'companion-communication-store',
    }
  )
);
