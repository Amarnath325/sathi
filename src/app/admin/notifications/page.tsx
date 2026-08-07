'use client';

import React, { useState } from 'react';
import { Radio, BarChart3, Code2, ScrollText, Settings2, ShieldCheck, Zap } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/notifications/AnalyticsDashboard';
import { BroadcastComposer } from '@/components/notifications/BroadcastComposer';
import { TemplateEditor } from '@/components/notifications/TemplateEditor';
import { DeliveryLogs } from '@/components/notifications/DeliveryLogs';
import { ChannelConfig } from '@/components/notifications/ChannelConfig';

export default function AdminNotificationEnginePage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'broadcast' | 'templates' | 'logs' | 'channels'>('analytics');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Radio className="w-6 h-6 text-indigo-400" /> Sathi Enterprise Notification Engine
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v2.4 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Control center for multi-channel dispatches, SSE streaming, handlebars templates, carrier gateways, and audit logs
            </p>
          </div>
        </div>

        {/* 5-Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          {[
            { id: 'analytics', label: '📊 Analytics & Metrics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'broadcast', label: '📨 Broadcast Composer', icon: <Zap className="w-4 h-4" /> },
            { id: 'templates', label: '📋 Templates Library', icon: <Code2 className="w-4 h-4" /> },
            { id: 'logs', label: '📜 Delivery Audit Logs', icon: <ScrollText className="w-4 h-4" /> },
            { id: 'channels', label: '⚙️ Gateway Config', icon: <Settings2 className="w-4 h-4" /> },
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
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'broadcast' && <BroadcastComposer />}
          {activeTab === 'templates' && <TemplateEditor />}
          {activeTab === 'logs' && <DeliveryLogs />}
          {activeTab === 'channels' && <ChannelConfig />}
        </div>
      </div>
    </div>
  );
}
