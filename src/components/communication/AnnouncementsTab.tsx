'use client';

import React, { useState } from 'react';
import {
  Megaphone, CheckCheck, Shield, Tag, CalendarCheck,
  Settings, AlertTriangle, ChevronRight, Inbox, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useCommunicationStore, AnnouncementItem } from '@/lib/communicationStore';

const CAT_META: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  SYSTEM: {
    icon: <Settings className="w-4 h-4" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
    label: 'System',
  },
  BOOKING: {
    icon: <CalendarCheck className="w-4 h-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    label: 'Booking',
  },
  SAFETY: {
    icon: <Shield className="w-4 h-4" />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
    label: 'Safety',
  },
  PROMO: {
    icon: <Tag className="w-4 h-4" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    label: 'Promo',
  },
  KYC: {
    icon: <CheckCheck className="w-4 h-4" />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
    label: 'KYC',
  },
};

const PRIORITY_BADGE: Record<string, string> = {
  LOW: 'bg-slate-700 text-slate-300',
  MEDIUM: 'bg-amber-500/20 text-amber-400',
  HIGH: 'bg-rose-500/20 text-rose-400',
  URGENT: 'bg-rose-600 text-white animate-pulse',
};

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function AnnouncementsTab() {
  const { announcements, markAnnouncementRead, markAllAnnouncementsRead } = useCommunicationStore();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = announcements.filter(
    a => activeFilter === 'ALL' || a.category === activeFilter
  );

  const unreadCount = announcements.filter(a => !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple-400" /> Platform Announcements
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Official broadcasts, policy updates & booking alerts from Sathi
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <>
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                {unreadCount} Unread
              </span>
              <button
                onClick={markAllAnnouncementsRead}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition-all"
              >
                Mark All Read
              </button>
            </>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['ALL', 'SYSTEM', 'BOOKING', 'SAFETY', 'PROMO', 'KYC'].map(cat => {
          const meta = CAT_META[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                activeFilter === cat
                  ? 'gradient-bg-primary text-white border-transparent shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {meta && <span className={meta.color}>{meta.icon}</span>}
              {meta ? meta.label : 'All'}
            </button>
          );
        })}
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3 bg-slate-900 rounded-3xl border border-slate-800">
            <Inbox className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-white">No announcements</h3>
            <p className="text-xs text-slate-500">No announcements in this category.</p>
          </div>
        ) : (
          filtered.map(ann => {
            const meta = CAT_META[ann.category];
            const isExpanded = expandedId === ann.id;
            return (
              <div
                key={ann.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  ann.isRead
                    ? 'bg-slate-900/40 border-slate-800/60'
                    : 'bg-slate-900 border-slate-700 shadow-lg shadow-slate-900/40'
                }`}
              >
                {/* Priority bar */}
                {ann.priority === 'HIGH' || ann.priority === 'URGENT' ? (
                  <div className={`h-0.5 w-full ${ann.priority === 'URGENT' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                ) : null}

                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${PRIORITY_BADGE[ann.priority]}`}>
                            {ann.priority}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${meta.bg} ${meta.color}`}>
                            {meta.label}
                          </span>
                          {!ann.isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono shrink-0">{timeAgo(ann.sentAt)}</span>
                      </div>

                      <h3 className={`text-xs font-bold mt-1.5 ${ann.isRead ? 'text-slate-300' : 'text-white'}`}>
                        {ann.title}
                      </h3>

                      <p className={`text-[11px] text-slate-400 mt-1 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {ann.body}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => {
                            setExpandedId(isExpanded ? null : ann.id);
                            if (!ann.isRead) markAnnouncementRead(ann.id);
                          }}
                          className={`text-[10px] font-bold ${meta.color} hover:underline`}
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </button>

                        {ann.actionUrl && ann.actionLabel && (
                          <Link
                            href={ann.actionUrl}
                            onClick={() => markAnnouncementRead(ann.id)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold ${meta.color} hover:underline`}
                          >
                            {ann.actionLabel} <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}

                        {!ann.isRead && (
                          <button
                            onClick={() => markAnnouncementRead(ann.id)}
                            className="text-[10px] font-bold text-slate-500 hover:text-emerald-400 transition-colors ml-auto"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Footer */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Announcements come directly from Sathi's platform team. We will never ask for your password, OTP, or payment credentials via announcements. Stay safe and report suspicious messages.
        </p>
      </div>
    </div>
  );
}
