'use client';

import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Bell, Plus, CheckCircle2, Clock, Play, Users } from 'lucide-react';
import { useCommunicationStore, CommunicationCampaignRecord, CommChannel } from '@/lib/communicationStore';

const CHANNEL_ICONS: Record<CommChannel, React.ReactNode> = {
  EMAIL: <Mail className="w-4 h-4 text-emerald-400" />,
  SMS: <MessageSquare className="w-4 h-4 text-cyan-400" />,
  PUSH: <Bell className="w-4 h-4 text-purple-400" />,
  IN_APP_BANNER: <Send className="w-4 h-4 text-amber-400" />,
};

interface CampaignListManagerProps {
  onOpenNewModal: () => void;
}

export function CampaignListManager({ onOpenNewModal }: CampaignListManagerProps) {
  const { campaigns, dispatchCampaign } = useCommunicationStore();
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  const handleDispatch = async (id: string) => {
    setDispatchingId(id);
    await dispatchCampaign(id);
    setDispatchingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" /> Multi-Channel Broadcast Campaigns
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage and dispatch bulk SMS, Email, Push Notifications, and In-App Banner broadcasts across audience segments
          </p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Broadcast Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((cmp) => {
          const icon = CHANNEL_ICONS[cmp.channel] || <Mail className="w-4 h-4 text-indigo-400" />;
          const isCompleted = cmp.status === 'COMPLETED';
          const isSending = cmp.status === 'SENDING' || dispatchingId === cmp.id;
          const reachPct = cmp.totalRecipients > 0 ? ((cmp.successCount / cmp.totalRecipients) * 100).toFixed(1) : '0.0';

          return (
            <div key={cmp.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{cmp.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        {cmp.channel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" /> {cmp.targetAudience}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {isSending ? 'SENDING...' : cmp.status}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono line-clamp-2">
                {cmp.subject && <span className="font-bold text-white block mb-1">Subject: {cmp.subject}</span>}
                {cmp.body}
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 block font-sans font-bold">Total Reach</span>
                  <span className="text-xs font-extrabold text-white">{cmp.totalRecipients.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block font-sans font-bold">Delivered</span>
                  <span className="text-xs font-extrabold text-emerald-400">{cmp.successCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block font-sans font-bold">Success Rate</span>
                  <span className="text-xs font-extrabold text-indigo-400">{reachPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono">Created by: {cmp.createdBy}</span>

                {cmp.status === 'DRAFT' && (
                  <button
                    disabled={isSending}
                    onClick={() => handleDispatch(cmp.id)}
                    className="px-3.5 py-1.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-1.5 hover:opacity-90 shadow-lg shadow-indigo-600/30"
                  >
                    <Play className="w-3.5 h-3.5" /> {isSending ? 'Sending Broadcast...' : 'Dispatch Broadcast'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
