'use client';

import React, { useState } from 'react';
import { Send, FileText, BarChart3, Radio, Bot, Mail, MessageSquare, Bell, Plus, CheckCircle2, Zap } from 'lucide-react';
import { CampaignListManager } from '@/components/communication/CampaignListManager';
import { NewCampaignModal } from '@/components/communication/NewCampaignModal';
import { TemplateLibraryEditor } from '@/components/communication/TemplateLibraryEditor';
import { CommunicationAnalyticsCharts } from '@/components/communication/CommunicationAnalyticsCharts';
import { DeliveryLogStreamTable } from '@/components/communication/DeliveryLogStreamTable';
import { useCommunicationStore } from '@/lib/communicationStore';
import { AdminAuthGuard } from '@/components/auth/AdminAuthGuard';

export default function AdminCommunicationPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'analytics' | 'logs' | 'triggers'>('campaigns');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { campaigns, templates, deliveryLogs, eventTriggers, toggleEventTrigger } = useCommunicationStore();

  const totalReach = campaigns.reduce((acc, c) => acc + c.totalRecipients, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.successCount, 0);

  return (
    <AdminAuthGuard>
    <div className="w-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Send className="w-6 h-6 text-emerald-400" /> Communication Hub & Broadcast Engine
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Multi-Channel Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bulk SMS, Email, Push Notifications, In-App System Banners, dynamic templates, and real-time delivery webhooks
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30 shrink-0"
          >
            <Plus className="w-4 h-4" /> Compose Broadcast
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Total Audience Reach</span>
              <Send className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{totalReach.toLocaleString()} Recipients</div>
            <div className="text-[10px] text-slate-500 font-mono">Delivered: {totalDelivered.toLocaleString()}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Active Broadcast Campaigns</span>
              <Mail className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">{campaigns.length} Campaigns</div>
            <div className="text-[10px] text-slate-500 font-mono">SMS, Email, Push & Banners</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Message Templates</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-purple-400 font-mono">{templates.length} Templates</div>
            <div className="text-[10px] text-slate-500 font-mono">Dynamic variables enabled</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Automated Triggers</span>
              <Bot className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">{eventTriggers.length} Event Rules</div>
            <div className="text-[10px] text-slate-500 font-mono">Booking, KYC & SOS triggers</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          {[
            { id: 'campaigns', label: '📢 Broadcast Campaigns', icon: <Send className="w-4 h-4" /> },
            { id: 'templates', label: '📜 Templates Library', icon: <FileText className="w-4 h-4" /> },
            { id: 'analytics', label: '📊 Channel Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'logs', label: '📨 Delivery Webhook Stream', icon: <Radio className="w-4 h-4" /> },
            { id: 'triggers', label: '🤖 Event Triggers', icon: <Bot className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'campaigns' && <CampaignListManager onOpenNewModal={() => setIsModalOpen(true)} />}
          {activeTab === 'templates' && <TemplateLibraryEditor />}
          {activeTab === 'analytics' && <CommunicationAnalyticsCharts />}
          {activeTab === 'logs' && <DeliveryLogStreamTable />}

          {activeTab === 'triggers' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-amber-400" /> Event-Driven Automated Communication Triggers
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automatically dispatch transactional SMS, Email, or Push notifications when platform events occur
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {eventTriggers.map((trg) => (
                  <div key={trg.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-white font-mono">{trg.eventName}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Template: {trg.templateKey}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{trg.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {trg.channels.map((ch) => (
                          <span key={ch} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 text-indigo-400 border border-slate-800">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleEventTrigger(trg.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 ${
                        trg.isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {trg.isActive ? 'Active Trigger 🟢' : 'Disabled 🔴'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compose Modal */}
        <NewCampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
    </AdminAuthGuard>
  );
}
