'use client';

import React, { useState, useMemo } from 'react';
import { MessageSquare, Bell, Megaphone, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useCommunicationStore } from '@/lib/communicationStore';
import ChatTab from '@/components/communication/ChatTab';
import NotificationsTab from '@/components/communication/NotificationsTab';
import AnnouncementsTab from '@/components/communication/AnnouncementsTab';

type ActiveTab = 'chat' | 'notifications' | 'announcements';

export default function CommunicationHub() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const { conversations, notifications, announcements } = useCommunicationStore();

  const totalUnreadChats = useMemo(
    () => conversations.filter(c => c.status !== 'ARCHIVED').reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );
  const totalUnreadNotifs = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);
  const totalUnreadAnn = useMemo(() => announcements.filter(a => !a.isRead).length, [announcements]);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge: number }[] = [
    { id: 'chat', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, badge: totalUnreadChats },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: totalUnreadNotifs },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" />, badge: totalUnreadAnn },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white">Communication Hub</h1>
                <p className="text-[10px] text-indigo-400 font-mono">E2E Encrypted · AES-256 Signal Protocol</p>
              </div>
            </div>
          </div>

          {/* Tab Pills */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-2xl border border-slate-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'gradient-bg-primary text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-t border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-all ${
                activeTab === tab.id ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge > 0 && (
                <span className="absolute top-1 right-1/4 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'announcements' && <AnnouncementsTab />}
      </main>
    </div>
  );
}
