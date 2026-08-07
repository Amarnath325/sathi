'use client';

import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Shield, Radio, Sparkles, Filter, Settings, SlidersHorizontal } from 'lucide-react';
import { useNotificationEngineStore, NotificationCategory } from '@/lib/notificationEngineStore';
import { useNotificationStream } from '@/hooks/useNotificationStream';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { PreferencesPanel } from '@/components/notifications/PreferencesPanel';

export default function UserNotificationCenterPage() {
  const { notifications, markRead, markAllRead, deleteNotification, archiveNotification, togglePinNotification, clearAll } =
    useNotificationEngineStore();
  const { isConnected, liveToast, dismissToast } = useNotificationStream();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Filtered Notifications List
  const filteredNotifications = notifications.filter((n) => {
    if (showArchived) return n.isArchived;
    if (n.isArchived) return false;
    if (activeCategory === 'UNREAD') return !n.isRead;
    if (activeCategory !== 'ALL') return n.category === activeCategory;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead && !n.isArchived).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Bell className="w-6 h-6 text-indigo-400" /> Notification Engine Hub
              </h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold gradient-bg-primary text-white shadow-lg">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Enterprise real-time notification stream for bookings, escrow payments, and safety dispatches
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Live SSE Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-ping' : 'text-slate-500'}`} />
              <span className={isConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {isConnected ? 'SSE Live Stream Active' : 'Polling Relay'}
              </span>
            </div>

            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className={`p-2.5 rounded-2xl border transition-all ${
                showPreferences
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live SSE Pop-in Toast Banner */}
        {liveToast && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border border-indigo-500/50 shadow-2xl flex items-center justify-between text-xs text-white animate-bounce">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-extrabold block">{liveToast.title}</span>
                <span className="text-slate-200">{liveToast.body}</span>
              </div>
            </div>
            <button onClick={dismissToast} className="text-slate-300 hover:text-white font-bold text-sm px-2">
              ✕
            </button>
          </div>
        )}

        {/* Preference Panel Modal Drawer */}
        {showPreferences ? (
          <PreferencesPanel />
        ) : (
          <>
            {/* Category Tabs & Bulk Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'UNREAD', label: `Unread (${unreadCount})` },
                  { id: 'BOOKING', label: 'Bookings' },
                  { id: 'SAFETY', label: 'Safety & SOS' },
                  { id: 'PAYMENT', label: 'Payments' },
                  { id: 'PROMO', label: 'Promos' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCategory(tab.id);
                      setShowArchived(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      !showArchived && activeCategory === tab.id
                        ? 'gradient-bg-primary text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    showArchived
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Archived
                </button>
              </div>

              {/* Bulk Toolbar */}
              <div className="flex items-center gap-2 shrink-0">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-indigo-400 hover:text-indigo-300 border border-slate-800 text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-rose-400 hover:text-rose-300 border border-slate-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              </div>
            </div>

            {/* Notification Stream */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-2">
                  <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-400">No notifications found</h3>
                  <p className="text-xs text-slate-500">
                    {showArchived
                      ? 'You have no archived notifications.'
                      : 'You are all caught up! New alerts will stream live automatically.'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markRead}
                    onDelete={deleteNotification}
                    onArchive={archiveNotification}
                    onTogglePin={togglePinNotification}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
