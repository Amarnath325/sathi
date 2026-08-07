'use client';

import React from 'react';
import { Radio, Mail, BellRing, MessageSquare, ToggleLeft, ToggleRight, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { useNotificationEngineStore, NotificationChannel } from '@/lib/notificationEngineStore';

const CHANNEL_ICONS: Record<NotificationChannel, React.ReactNode> = {
  IN_APP: <Radio className="w-5 h-5 text-indigo-400" />,
  EMAIL: <Mail className="w-5 h-5 text-emerald-400" />,
  PUSH: <BellRing className="w-5 h-5 text-cyan-400" />,
  SMS: <MessageSquare className="w-5 h-5 text-purple-400" />,
};

export function ChannelConfig() {
  const { channelConfigs, toggleChannelConfig, updateChannelConfig } = useNotificationEngineStore();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> Multi-Channel Carrier Configuration & Quotas
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage API gateways, sandbox/production environments, and rate limits for notification relays
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channelConfigs.map((cfg) => (
          <div
            key={cfg.channel}
            className={`p-6 rounded-3xl border transition-all space-y-4 ${
              cfg.isEnabled
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-slate-950 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                  {CHANNEL_ICONS[cfg.channel]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{cfg.channel} Gateway</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{cfg.providerName}</p>
                </div>
              </div>

              <button
                onClick={() => toggleChannelConfig(cfg.channel)}
                className="text-slate-400 hover:text-white"
              >
                {cfg.isEnabled ? (
                  <ToggleRight className="w-7 h-7 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                )}
              </button>
            </div>

            {/* Provider Details */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">ENVIRONMENT</span>
                <button
                  onClick={() =>
                    updateChannelConfig(cfg.channel, {
                      environment: cfg.environment === 'PRODUCTION' ? 'SANDBOX' : 'PRODUCTION',
                    })
                  }
                  className={`mt-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                    cfg.environment === 'PRODUCTION'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {cfg.environment}
                </button>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block">GATEWAY HEALTH</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> {cfg.apiStatus}
                </span>
              </div>
            </div>

            {/* Quota Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400">
                <span>Daily Quota</span>
                <span>
                  {cfg.dailySentCount.toLocaleString()} / {cfg.dailyQuota.toLocaleString()} sent
                </span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${(cfg.dailySentCount / cfg.dailyQuota) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
