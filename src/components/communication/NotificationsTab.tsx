'use client';

import React, { useState } from 'react';
import {
  Bell, BellOff, CheckCheck, CalendarCheck, CreditCard,
  Star, ShieldAlert, Tag, ChevronRight, Inbox
} from 'lucide-react';
import Link from 'next/link';
import { useCommunicationStore, NotificationItem } from '@/lib/communicationStore';

const TYPE_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  NEW_MESSAGE: {
    icon: <Bell className="w-4 h-4" />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  BOOKING_UPDATE: {
    icon: <CalendarCheck className="w-4 h-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  REVIEW_RECEIVED: {
    icon: <Star className="w-4 h-4" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  PAYMENT: {
    icon: <CreditCard className="w-4 h-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  KYC_STATUS: {
    icon: <CheckCheck className="w-4 h-4" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  SAFETY_ALERT: {
    icon: <ShieldAlert className="w-4 h-4" />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  PROMO: {
    icon: <Tag className="w-4 h-4" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
};

const FILTER_TYPES = ['ALL', 'NEW_MESSAGE', 'BOOKING_UPDATE', 'PAYMENT', 'SAFETY_ALERT', 'PROMO'];
const FILTER_LABELS: Record<string, string> = {
  ALL: 'All',
  NEW_MESSAGE: '💬 Messages',
  BOOKING_UPDATE: '📅 Bookings',
  PAYMENT: '💳 Payments',
  SAFETY_ALERT: '🛡️ Safety',
  PROMO: '🎉 Promos',
};

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsTab() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCommunicationStore();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = notifications.filter(n => {
    const typeMatch = activeFilter === 'ALL' || n.type === activeFilter;
    const unreadMatch = !showUnreadOnly || !n.isRead;
    return typeMatch && unreadMatch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" /> Notification Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUnreadOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showUnreadOnly ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {showUnreadOnly ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            {showUnreadOnly ? 'Unread Only' : 'All'}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition-all"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTER_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeFilter === type
                ? 'gradient-bg-primary text-white border-transparent shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {FILTER_LABELS[type] || type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3 bg-slate-900 rounded-3xl border border-slate-800">
            <Inbox className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-white">No notifications</h3>
            <p className="text-xs text-slate-500">Nothing to show for the selected filter.</p>
          </div>
        ) : (
          filtered.map(notif => {
            const meta = TYPE_META[notif.type] || TYPE_META['NEW_MESSAGE'];
            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:border-indigo-500/30 ${
                  notif.isRead
                    ? 'bg-slate-900/40 border-slate-800/60'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                {/* Icon / Avatar */}
                <div className={`relative w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
                  {notif.avatar ? (
                    <img src={notif.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    meta.icon
                  )}
                  {!notif.isRead && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-slate-950" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-bold ${notif.isRead ? 'text-slate-300' : 'text-white'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[9px] text-slate-500 shrink-0 font-mono" suppressHydrationWarning>
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                    {notif.body}
                  </p>
                  {notif.actionUrl && (
                    <Link
                      href={notif.actionUrl}
                      className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold ${meta.color} hover:underline`}
                    >
                      View Details <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
