import { create } from 'zustand';

// ============================================================
// 📡 COMMUNICATION MODULE TYPES
// ============================================================

export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
export type MessageType = 'TEXT' | 'IMAGE' | 'VOICE_NOTE' | 'LOCATION' | 'BOOKING_CARD' | 'FILE' | 'EMOJI_REACTION';
export type ConversationStatus = 'ACTIVE' | 'ARCHIVED' | 'BLOCKED' | 'MUTED';
export type NotificationPref = 'ALL' | 'MENTIONS_ONLY' | 'MUTED';

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface FullChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  mediaType?: string;
  status: MessageStatus;
  isRead: boolean;
  encrypted: boolean;
  reactions: Reaction[];
  replyToId?: string;
  replyToContent?: string;
  replyToSenderName?: string;
  isEdited?: boolean;
  editedAt?: string;
  deletedForEveryone?: boolean;
  timestamp: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars: string[];
  lastMessage?: string;
  lastMessageAt: string;
  lastMessageSenderId?: string;
  unreadCount: number;
  status: ConversationStatus;
  isPinned: boolean;
  notificationPref: NotificationPref;
  isTyping?: boolean;
  isOnline?: boolean;
  bookingId?: string;
  bookingRef?: string;
  messages: FullChatMessage[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  category: 'SYSTEM' | 'BOOKING' | 'SAFETY' | 'PROMO' | 'KYC';
  sentAt: string;
  isRead: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationItem {
  id: string;
  type: 'BOOKING_UPDATE' | 'NEW_MESSAGE' | 'REVIEW_RECEIVED' | 'PAYMENT' | 'KYC_STATUS' | 'SAFETY_ALERT' | 'PROMO';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
  iconColor?: string;
  actionUrl?: string;
}

// ============================================================
// 🗄️ INITIAL MOCK DATA
// ============================================================

const CURRENT_USER_ID = 'curr-user';
const CURRENT_USER_NAME = 'Alex Thompson';
const CURRENT_USER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';

const makeMsg = (
  id: string, convId: string, senderId: string, senderName: string, senderAvatar: string,
  content: string, type: MessageType = 'TEXT', status: MessageStatus = 'READ',
  createdAt: string, reactions: Reaction[] = []
): FullChatMessage => ({
  id, conversationId: convId, senderId, senderName, senderAvatar,
  content, type, status, isRead: true, encrypted: true, reactions,
  timestamp: new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  createdAt
});

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: [CURRENT_USER_ID, 'comp-101'],
    participantNames: [CURRENT_USER_NAME, 'Sophia Chen'],
    participantAvatars: [CURRENT_USER_AVATAR, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'],
    lastMessage: "I'll arrive 15 minutes early near the fountain entrance!",
    lastMessageAt: '2026-08-07T12:35:00Z',
    lastMessageSenderId: 'comp-101',
    unreadCount: 2,
    status: 'ACTIVE',
    isPinned: true,
    notificationPref: 'ALL',
    isOnline: true,
    bookingId: 'bk-9001',
    bookingRef: 'CC-2026-8812',
    messages: [
      makeMsg('m1-1', 'conv-1', 'comp-101', 'Sophia Chen', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        "Hi Alex! Looking forward to the Tech Gala this evening. I've noted the venue and dress code.", 'TEXT', 'READ', '2026-08-07T12:30:00Z',
        [{ emoji: '👍', userId: CURRENT_USER_ID, userName: CURRENT_USER_NAME }]),
      makeMsg('m1-2', 'conv-1', CURRENT_USER_ID, CURRENT_USER_NAME, CURRENT_USER_AVATAR,
        "Great! The event starts at 6 PM at the Palace of Fine Arts. Formal black-tie required.", 'TEXT', 'READ', '2026-08-07T12:32:00Z', []),
      makeMsg('m1-3', 'conv-1', 'comp-101', 'Sophia Chen', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        "Perfect! I'll prepare accordingly. Should I meet you at the main entrance or lobby?", 'TEXT', 'READ', '2026-08-07T12:33:00Z', []),
      makeMsg('m1-4', 'conv-1', CURRENT_USER_ID, CURRENT_USER_NAME, CURRENT_USER_AVATAR,
        "Main entrance, please. I'll be in a navy tuxedo.", 'TEXT', 'READ', '2026-08-07T12:34:00Z', []),
      makeMsg('m1-5', 'conv-1', 'comp-101', 'Sophia Chen', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        "I'll arrive 15 minutes early near the fountain entrance!", 'TEXT', 'DELIVERED', '2026-08-07T12:35:00Z',
        [{ emoji: '❤️', userId: CURRENT_USER_ID, userName: CURRENT_USER_NAME }]),
    ]
  },
  {
    id: 'conv-2',
    participantIds: [CURRENT_USER_ID, 'comp-102'],
    participantNames: [CURRENT_USER_NAME, 'Alexander Wright'],
    participantAvatars: [CURRENT_USER_AVATAR, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'],
    lastMessage: "Morning workout session confirmed for 7 AM at Central Park.",
    lastMessageAt: '2026-08-07T08:10:00Z',
    lastMessageSenderId: 'comp-102',
    unreadCount: 0,
    status: 'ACTIVE',
    isPinned: false,
    notificationPref: 'ALL',
    isOnline: true,
    bookingId: 'bk-9002',
    bookingRef: 'CC-2026-9043',
    messages: [
      makeMsg('m2-1', 'conv-2', CURRENT_USER_ID, CURRENT_USER_NAME, CURRENT_USER_AVATAR,
        "Hi Alexander, I'm confirmed for the morning walk and park session tomorrow.", 'TEXT', 'READ', '2026-08-07T08:00:00Z', []),
      makeMsg('m2-2', 'conv-2', 'comp-102', 'Alexander Wright', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        "Morning workout session confirmed for 7 AM at Central Park.", 'TEXT', 'READ', '2026-08-07T08:10:00Z',
        [{ emoji: '💪', userId: CURRENT_USER_ID, userName: CURRENT_USER_NAME }]),
    ]
  },
  {
    id: 'conv-3',
    participantIds: [CURRENT_USER_ID, 'comp-105'],
    participantNames: [CURRENT_USER_NAME, 'Priya Nair'],
    participantAvatars: [CURRENT_USER_AVATAR, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80'],
    lastMessage: "Namaste! Ready for our yoga and city tour tomorrow morning 🙏",
    lastMessageAt: '2026-08-06T20:15:00Z',
    lastMessageSenderId: 'comp-105',
    unreadCount: 1,
    status: 'ACTIVE',
    isPinned: false,
    notificationPref: 'ALL',
    isOnline: false,
    messages: [
      makeMsg('m3-1', 'conv-3', 'comp-105', 'Priya Nair', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        "Namaste Alex! I have finalized the Mumbai heritage walking route. Excited to guide you!", 'TEXT', 'READ', '2026-08-06T20:00:00Z', []),
      makeMsg('m3-2', 'conv-3', CURRENT_USER_ID, CURRENT_USER_NAME, CURRENT_USER_AVATAR,
        "Looking forward to it! Can we also do a brief yoga session in the morning before the tour?", 'TEXT', 'READ', '2026-08-06T20:10:00Z', []),
      makeMsg('m3-3', 'conv-3', 'comp-105', 'Priya Nair', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        "Namaste! Ready for our yoga and city tour tomorrow morning 🙏", 'TEXT', 'DELIVERED', '2026-08-06T20:15:00Z', []),
    ]
  },
  {
    id: 'conv-4',
    participantIds: [CURRENT_USER_ID, 'comp-107'],
    participantNames: [CURRENT_USER_NAME, 'Isabella Moreau'],
    participantAvatars: [CURRENT_USER_AVATAR, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80'],
    lastMessage: "Bonjour! The Louvre private tour is confirmed. Dress elegantly 🎨",
    lastMessageAt: '2026-08-05T15:30:00Z',
    lastMessageSenderId: 'comp-107',
    unreadCount: 0,
    status: 'ACTIVE',
    isPinned: false,
    notificationPref: 'MUTED',
    isOnline: true,
    messages: [
      makeMsg('m4-1', 'conv-4', 'comp-107', 'Isabella Moreau', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
        "Bonjour! The Louvre private tour is confirmed. Dress elegantly 🎨", 'TEXT', 'READ', '2026-08-05T15:30:00Z', []),
    ]
  },
  {
    id: 'conv-5',
    participantIds: [CURRENT_USER_ID, 'comp-103'],
    participantNames: [CURRENT_USER_NAME, 'Elena Rostova'],
    participantAvatars: [CURRENT_USER_AVATAR, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80'],
    lastMessage: "Thanks for the great review! See you on the next adventure 🎮",
    lastMessageAt: '2026-08-04T18:00:00Z',
    lastMessageSenderId: 'comp-103',
    unreadCount: 0,
    status: 'ARCHIVED',
    isPinned: false,
    notificationPref: 'MENTIONS_ONLY',
    isOnline: false,
    messages: [
      makeMsg('m5-1', 'conv-5', 'comp-103', 'Elena Rostova', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
        "Thanks for the great review! See you on the next adventure 🎮", 'TEXT', 'READ', '2026-08-04T18:00:00Z', []),
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: '🔐 Platform Security Update',
    body: 'Sathi has upgraded end-to-end encryption from AES-128 to AES-256 Signal Protocol. All your messages and voice notes are now protected with military-grade security. No action required.',
    category: 'SYSTEM',
    sentAt: '2026-08-07T09:00:00Z',
    isRead: false,
    priority: 'HIGH',
  },
  {
    id: 'ann-2',
    title: '📅 Booking CC-2026-8812 Status Update',
    body: 'Your booking with Sophia Chen for the Tech Gala event tonight has been confirmed. Escrow of $207 is securely held. Have a wonderful evening!',
    category: 'BOOKING',
    sentAt: '2026-08-07T08:30:00Z',
    isRead: false,
    priority: 'MEDIUM',
    actionUrl: '/booking',
    actionLabel: 'View Booking',
  },
  {
    id: 'ann-3',
    title: '🛡️ Safety Reminder for Tonight',
    body: 'Your booking starts in 6 hours. Remember to share your live location with your emergency contact. The SOS button is always available in the safety menu.',
    category: 'SAFETY',
    sentAt: '2026-08-07T08:00:00Z',
    isRead: true,
    priority: 'MEDIUM',
    actionUrl: '/safety',
    actionLabel: 'Open Safety Center',
  },
  {
    id: 'ann-4',
    title: '🎉 15% Discount — Summer Companion Pass',
    body: 'Use promo code SUMMER15 before August 15 to get 15% off on all bookings above $100. Applicable on Event Companion, Travel, and Fitness categories.',
    category: 'PROMO',
    sentAt: '2026-08-06T12:00:00Z',
    isRead: true,
    priority: 'LOW',
    actionUrl: '/search',
    actionLabel: 'Book Now',
  },
  {
    id: 'ann-5',
    title: '✅ KYC Verification Approved',
    body: 'Your identity verification has been successfully completed. Your profile is now marked as Verified and you can access premium features.',
    category: 'KYC',
    sentAt: '2026-08-05T14:20:00Z',
    isRead: true,
    priority: 'HIGH',
    actionUrl: '/kyc',
    actionLabel: 'View KYC Status',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'NEW_MESSAGE',
    title: 'New message from Sophia Chen',
    body: "I'll arrive 15 minutes early near the fountain entrance!",
    isRead: false,
    createdAt: '2026-08-07T12:35:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    iconColor: 'text-indigo-400',
    actionUrl: '/chat',
  },
  {
    id: 'notif-2',
    type: 'BOOKING_UPDATE',
    title: 'Booking Confirmed ✅',
    body: 'Your booking CC-2026-8812 with Sophia Chen has been accepted. Escrow is locked.',
    isRead: false,
    createdAt: '2026-08-07T08:30:00Z',
    iconColor: 'text-emerald-400',
    actionUrl: '/booking',
  },
  {
    id: 'notif-3',
    type: 'NEW_MESSAGE',
    title: 'New message from Priya Nair',
    body: "Namaste! Ready for our yoga and city tour tomorrow morning 🙏",
    isRead: false,
    createdAt: '2026-08-06T20:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    iconColor: 'text-indigo-400',
    actionUrl: '/chat',
  },
  {
    id: 'notif-4',
    type: 'REVIEW_RECEIVED',
    title: 'New review on your profile',
    body: 'Michael Jordan left you a 5-star review: "Phenomenal experience at the gala!"',
    isRead: true,
    createdAt: '2026-08-06T10:00:00Z',
    iconColor: 'text-yellow-400',
    actionUrl: '/reviews',
  },
  {
    id: 'notif-5',
    type: 'PAYMENT',
    title: 'Payment Received: $207',
    body: 'Escrow payout for booking CC-2026-8812 has been released to your wallet.',
    isRead: true,
    createdAt: '2026-08-05T16:00:00Z',
    iconColor: 'text-emerald-400',
    actionUrl: '/wallet',
  },
  {
    id: 'notif-6',
    type: 'SAFETY_ALERT',
    title: '🛡️ Safety Check-In Reminder',
    body: 'You have an active booking. Remember to confirm your check-in and share your location.',
    isRead: true,
    createdAt: '2026-08-05T18:00:00Z',
    iconColor: 'text-rose-400',
    actionUrl: '/safety',
  },
  {
    id: 'notif-7',
    type: 'PROMO',
    title: '🎉 15% Summer Promo Live!',
    body: 'Use SUMMER15 before Aug 15 to save on your next booking.',
    isRead: true,
    createdAt: '2026-08-06T12:00:00Z',
    iconColor: 'text-purple-400',
    actionUrl: '/search',
  },
];

// ============================================================
// 🏪 ZUSTAND STORE
// ============================================================

interface CommunicationState {
  conversations: Conversation[];
  announcements: AnnouncementItem[];
  notifications: NotificationItem[];
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;

  sendMessage: (conversationId: string, content: string, type?: MessageType) => void;
  markConversationRead: (conversationId: string) => void;
  addReaction: (conversationId: string, messageId: string, emoji: string) => void;
  removeReaction: (conversationId: string, messageId: string, emoji: string) => void;
  deleteMessageForEveryone: (conversationId: string, messageId: string) => void;
  togglePinConversation: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  unarchiveConversation: (conversationId: string) => void;
  blockConversation: (conversationId: string) => void;
  setNotificationPref: (conversationId: string, pref: NotificationPref) => void;
  markAnnouncementRead: (announcementId: string) => void;
  markAllAnnouncementsRead: () => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
}

export const useCommunicationStore = create<CommunicationState>((set, get) => ({
  conversations: INITIAL_CONVERSATIONS,
  announcements: INITIAL_ANNOUNCEMENTS,
  notifications: INITIAL_NOTIFICATIONS,
  currentUserId: CURRENT_USER_ID,
  currentUserName: CURRENT_USER_NAME,
  currentUserAvatar: CURRENT_USER_AVATAR,

  sendMessage: (conversationId, content, type = 'TEXT') => {
    const { currentUserId, currentUserName, currentUserAvatar } = get();
    const newMsg: FullChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      content,
      type,
      status: 'SENDING',
      isRead: false,
      encrypted: true,
      reactions: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
    };

    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, newMsg], lastMessage: content, lastMessageAt: newMsg.createdAt, lastMessageSenderId: currentUserId }
          : conv
      )
    }));

    setTimeout(() => {
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, messages: conv.messages.map(m => m.id === newMsg.id ? { ...m, status: 'DELIVERED' as MessageStatus } : m) }
            : conv
        )
      }));
    }, 800);

    const conv = get().conversations.find(c => c.id === conversationId);
    if (conv) {
      const otherParticipantName = conv.participantNames.find(n => n !== currentUserName);
      const otherAvatar = conv.participantAvatars.find(a => a !== currentUserAvatar);
      const otherId = conv.participantIds.find(id => id !== currentUserId);

      const replies = [
        "Got it! I'll be ready on time.",
        "Perfect, sounds great! Looking forward to it 😊",
        "Understood! I've noted that down.",
        "Sure, that works perfectly for me.",
        "Great! See you then. Have a wonderful day!",
        "Noted. I'll make sure everything is prepared.",
      ];

      setTimeout(() => {
        const replyMsg: FullChatMessage = {
          id: `reply-${Date.now()}`,
          conversationId,
          senderId: otherId || 'comp-101',
          senderName: otherParticipantName || 'Companion',
          senderAvatar: otherAvatar,
          content: replies[Math.floor(Math.random() * replies.length)],
          type: 'TEXT',
          status: 'DELIVERED',
          isRead: false,
          encrypted: true,
          reactions: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === conversationId
              ? {
                ...c,
                messages: [...c.messages, replyMsg],
                lastMessage: replyMsg.content,
                lastMessageAt: replyMsg.createdAt,
                lastMessageSenderId: replyMsg.senderId,
                unreadCount: c.unreadCount + 1
              }
              : c
          )
        }));
      }, 2000 + Math.random() * 1500);
    }
  },

  markConversationRead: (conversationId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0, messages: conv.messages.map(m => ({ ...m, isRead: true, status: 'READ' as MessageStatus })) }
          : conv
      )
    }));
  },

  addReaction: (conversationId, messageId, emoji) => {
    const { currentUserId, currentUserName } = get();
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
            ...conv,
            messages: conv.messages.map(m =>
              m.id === messageId
                ? {
                  ...m,
                  reactions: m.reactions.find(r => r.userId === currentUserId && r.emoji === emoji)
                    ? m.reactions
                    : [...m.reactions, { emoji, userId: currentUserId, userName: currentUserName }]
                }
                : m
            )
          }
          : conv
      )
    }));
  },

  removeReaction: (conversationId, messageId, emoji) => {
    const { currentUserId } = get();
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
            ...conv,
            messages: conv.messages.map(m =>
              m.id === messageId
                ? { ...m, reactions: m.reactions.filter(r => !(r.userId === currentUserId && r.emoji === emoji)) }
                : m
            )
          }
          : conv
      )
    }));
  },

  deleteMessageForEveryone: (conversationId, messageId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
            ...conv,
            messages: conv.messages.map(m =>
              m.id === messageId
                ? { ...m, content: '🚫 This message was deleted.', deletedForEveryone: true }
                : m
            )
          }
          : conv
      )
    }));
  },

  togglePinConversation: (conversationId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    }));
  },

  archiveConversation: (conversationId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, status: 'ARCHIVED' } : conv
      )
    }));
  },

  unarchiveConversation: (conversationId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, status: 'ACTIVE' } : conv
      )
    }));
  },

  blockConversation: (conversationId) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, status: 'BLOCKED' } : conv
      )
    }));
  },

  setNotificationPref: (conversationId, pref) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, notificationPref: pref } : conv
      )
    }));
  },

  markAnnouncementRead: (announcementId) => {
    set(state => ({
      announcements: state.announcements.map(a => a.id === announcementId ? { ...a, isRead: true } : a)
    }));
  },

  markAllAnnouncementsRead: () => {
    set(state => ({ announcements: state.announcements.map(a => ({ ...a, isRead: true })) }));
  },

  markNotificationRead: (notifId) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n)
    }));
  },

  markAllNotificationsRead: () => {
    set(state => ({ notifications: state.notifications.map(n => ({ ...n, isRead: true })) }));
  },
}));
