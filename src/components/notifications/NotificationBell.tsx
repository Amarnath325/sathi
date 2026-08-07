'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, ArrowRight, Shield, CreditCard, CalendarCheck, Tag, Settings, Radio } from 'lucide-react';
import Link from 'next/link';
import { useNotificationEngineStore } from '@/lib/notificationEngineStore';
import { useNotificationStream } from '@/hooks/useNotificationStream';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  SYSTEM: <Settings className="w-3.5 h-3.5 text-cyan-400" />,
  BOOKING: <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />,
  SAFETY: <Shield className="w-3.5 h-3.5 text-rose-400" />,
  PAYMENT: <CreditCard className="w-3.5 h-3.5 text-emerald-400" />,
  PROMO: <Tag className="w-3.5 h-3.5 text-purple-400" />,
  SECURITY: <Shield className="w-3.5 h-3.5 text-amber-400" />,
  COMMUNITY: <Bell className="w-3.5 h-3.5 text-indigo-400" />,
};

function formatTimeShort(dateStr: string) {
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return '';
  }
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, markRead, markAllRead, deleteNotification } = useNotificationEngineStore();
  const { isConnected } = useNotificationStream();

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const recentNotifs = notifications.filter(n => !n.isArchived).slice(0, 5);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all"
        title="Notification Engine"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-bg-primary text-white text-[9px] font-extrabold flex items-center justify-center shadow-lg shadow-indigo-600/30 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold text-white">Notifications</h3>
              {isConnected ? (
                <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Radio className="w-2.5 h-2.5 animate-ping text-emerald-400" /> SSE Live
                </span>
              ) : (
                <span className="text-[9px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  Polling
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* Notification Items */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40">
            {recentNotifs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No notifications</div>
            ) : (
              recentNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-900/60 ${
                    !n.isRead ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {CATEGORY_ICONS[n.category] || <Bell className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0" suppressHydrationWarning>
                        {formatTimeShort(n.sentAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {n.body}
                    </p>
                    {n.actionUrl && (
                      <Link
                        href={n.actionUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[10px] text-indigo-400 font-bold hover:underline mt-1.5"
                      >
                        {n.actionLabel || 'View'} <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer link */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1"
            >
              Open Notification Center <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
