'use client';

import React from 'react';
import { CalendarCheck, Shield, CreditCard, Tag, Settings, Bell, ArrowRight, Pin, Archive, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { NotificationRecord, NotificationCategory, NotificationPriority } from '@/lib/notificationEngineStore';

const CATEGORY_ICONS: Record<NotificationCategory, React.ReactNode> = {
  SYSTEM: <Settings className="w-4 h-4 text-cyan-400" />,
  BOOKING: <CalendarCheck className="w-4 h-4 text-emerald-400" />,
  SAFETY: <Shield className="w-4 h-4 text-rose-400" />,
  PAYMENT: <CreditCard className="w-4 h-4 text-emerald-400" />,
  KYC: <CheckCircle className="w-4 h-4 text-cyan-400" />,
  PROMO: <Tag className="w-4 h-4 text-purple-400" />,
  SECURITY: <Shield className="w-4 h-4 text-amber-400" />,
  COMMUNITY: <Bell className="w-4 h-4 text-indigo-400" />,
};

const PRIORITY_BADGES: Record<NotificationPriority, string> = {
  LOW: 'bg-slate-800 text-slate-400 border-slate-700',
  MEDIUM: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  URGENT: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
};

function timeAgo(dateStr: string) {
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  } catch {
    return dateStr;
  }
}

interface NotificationCardProps {
  notification: NotificationRecord;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  onArchive,
  onTogglePin,
}: NotificationCardProps) {
  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      className={`p-5 rounded-3xl border transition-all cursor-pointer relative group ${
        notification.isPinned
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border-indigo-500/40 shadow-xl'
          : !notification.isRead
          ? 'bg-slate-900/80 border-slate-700/80'
          : 'bg-slate-900/40 border-slate-800/60 opacity-80 hover:opacity-100'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5 shadow-md">
          {CATEGORY_ICONS[notification.category] || <Bell className="w-4 h-4 text-slate-400" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-xs font-bold ${!notification.isRead ? 'text-white font-extrabold' : 'text-slate-200'}`}>
                {notification.title}
              </h4>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${PRIORITY_BADGES[notification.priority]}`}>
                {notification.priority}
              </span>
              {notification.isPinned && (
                <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 flex items-center gap-0.5">
                  <Pin className="w-2.5 h-2.5" /> Pinned
                </span>
              )}
            </div>

            <span className="text-[10px] text-slate-500 font-mono shrink-0" suppressHydrationWarning>
              {timeAgo(notification.sentAt)}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mt-1.5">{notification.body}</p>

          {/* Action Link & Controls */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60">
            {notification.actionUrl ? (
              <Link
                href={notification.actionUrl}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {notification.actionLabel || 'View Details'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">System Notification</span>
            )}

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(notification.id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  notification.isPinned ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white'
                }`}
                title="Pin notification"
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(notification.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Archive"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
