'use client';

import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle, Eye, Send, Shield, Zap } from 'lucide-react';
import { useNotificationEngineStore } from '@/lib/notificationEngineStore';

export function AnalyticsDashboard() {
  const { getAnalytics } = useNotificationEngineStore();
  const analytics = getAnalytics();

  const metrics = [
    {
      label: 'Total Dispatched',
      value: analytics.totalSent.toLocaleString(),
      sub: 'All multi-channel dispatches',
      icon: <Send className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-500/10',
    },
    {
      label: 'Delivery Success Rate',
      value: `${analytics.deliveryRatePercent}%`,
      sub: `${analytics.totalDelivered} delivered / ${analytics.totalFailed} failed`,
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/10',
    },
    {
      label: 'Notification Open Rate',
      value: `${analytics.openRatePercent}%`,
      sub: 'In-App read conversions',
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-500/10',
    },
    {
      label: 'Failed / Bounced',
      value: analytics.totalFailed,
      sub: 'Carrier errors or rate limits',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className={`p-5 rounded-3xl border ${m.color} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">{m.label}</span>
              {m.icon}
            </div>
            <div className="text-2xl font-extrabold text-white">{m.value}</div>
            <div className="text-[10px] text-slate-400 font-mono">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Channel Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Channel Volume Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { label: 'In-App SSE Broadcast', key: 'IN_APP', color: 'bg-indigo-500' },
              { label: 'Email Relay (SendGrid)', key: 'EMAIL', color: 'bg-emerald-500' },
              { label: 'Mobile Push (FCM)', key: 'PUSH', color: 'bg-cyan-500' },
              { label: 'SMS Carrier (Twilio)', key: 'SMS', color: 'bg-purple-500' },
            ].map((ch) => {
              const count = analytics.channelBreakdown[ch.key as keyof typeof analytics.channelBreakdown] || 0;
              const pct = analytics.totalSent > 0 ? Math.round((count / analytics.totalSent) * 100) : 25;
              return (
                <div key={ch.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{ch.label}</span>
                    <span className="text-slate-400 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full ${ch.color} rounded-full`} style={{ width: `${Math.max(pct, 5)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Notification Category Distribution
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(analytics.categoryBreakdown).map(([cat, count]) => (
              <div key={cat} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{cat}</span>
                <span className="text-xs font-mono font-extrabold text-indigo-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
