'use client';

import React from 'react';
import { BarChart3, TrendingUp, Mail, MessageSquare, Bell, CheckCircle2, Eye, MousePointer } from 'lucide-react';
import { useCommunicationStore } from '@/lib/communicationStore';

export function CommunicationAnalyticsCharts() {
  const { campaigns } = useCommunicationStore();

  const channelStats = [
    { channel: 'Email Broadcasts (SendGrid)', sent: 4250, openPct: '42.8%', clickPct: '18.4%', deliveredPct: '99.1%', color: 'bg-emerald-500' },
    { channel: 'Carrier SMS (Twilio)', sent: 850, openPct: '98.2%', clickPct: '41.0%', deliveredPct: '99.0%', color: 'bg-cyan-500' },
    { channel: 'Mobile Push Alerts (FCM)', sent: 1420, openPct: '64.5%', clickPct: '28.1%', deliveredPct: '98.5%', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Multi-Channel Delivery & Open Rate Analytics
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-channel performance comparison across Email (SendGrid), Carrier SMS (Twilio), and Mobile Push (Firebase)
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channelStats.map((st) => (
          <div key={st.channel} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold text-white">{st.channel}</h4>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Delivery Rate
                </span>
                <span className="text-emerald-400">{st.deliveredPct}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full ${st.color}`} style={{ width: st.deliveredPct }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> Open / Read Rate
                </span>
                <span className="text-cyan-400">{st.openPct}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full ${st.color}`} style={{ width: st.openPct }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-purple-400" /> Click-Through Rate
                </span>
                <span className="text-purple-400">{st.clickPct}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full ${st.color}`} style={{ width: st.clickPct }} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
              Total Messages Dispatched: {st.sent.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
