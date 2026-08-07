'use client';

import React, { useState } from 'react';
import { X, Send, Mail, MessageSquare, Bell, Users, Sparkles } from 'lucide-react';
import { useCommunicationStore, CommChannel, CommAudience } from '@/lib/communicationStore';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AUDIENCE_COUNTS: Record<CommAudience, number> = {
  ALL_USERS: 4250,
  VERIFIED_COMPANIONS: 850,
  PREMIUM_CLIENTS: 320,
  STAFF_ONLY: 45,
};

export function NewCampaignModal({ isOpen, onClose }: NewCampaignModalProps) {
  const { createCampaign, dispatchCampaign } = useCommunicationStore();

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<CommChannel>('EMAIL');
  const [targetAudience, setTargetAudience] = useState<CommAudience>('ALL_USERS');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [dispatchNow, setDispatchNow] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const campaignId = createCampaign({
      title,
      channel,
      targetAudience,
      subject: channel === 'EMAIL' || channel === 'PUSH' ? subject : undefined,
      body,
      scheduledAt: null,
      createdBy: 'Alexander Vance (CTO)',
    });

    if (dispatchNow) {
      await dispatchCampaign(campaignId);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" /> Compose Multi-Channel Broadcast Campaign
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300">Campaign Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Escrow Security Protection Feature Announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300">Broadcast Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as CommChannel)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
              >
                <option value="EMAIL">Email Campaign (SendGrid)</option>
                <option value="SMS">Carrier SMS (Twilio)</option>
                <option value="PUSH">Mobile Push Alert (Firebase FCM)</option>
                <option value="IN_APP_BANNER">In-App System Announcement</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Target Audience Segment</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as CommAudience)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
              >
                <option value="ALL_USERS">All Registered Platform Users ({AUDIENCE_COUNTS.ALL_USERS})</option>
                <option value="VERIFIED_COMPANIONS">Verified Companions Only ({AUDIENCE_COUNTS.VERIFIED_COMPANIONS})</option>
                <option value="PREMIUM_CLIENTS">Premium Client Accounts ({AUDIENCE_COUNTS.PREMIUM_CLIENTS})</option>
                <option value="STAFF_ONLY">Internal Staff & Admins ({AUDIENCE_COUNTS.STAFF_ONLY})</option>
              </select>
            </div>
          </div>

          {(channel === 'EMAIL' || channel === 'PUSH') && (
            <div>
              <label className="text-xs font-bold text-slate-300">Subject / Alert Header</label>
              <input
                type="text"
                placeholder="e.g. 🛡️ Important Security Update for your Escrow Account"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300">Message Body Content</label>
            <textarea
              rows={4}
              required
              placeholder="Use variable placeholders like {{user_name}}, {{booking_id}}, {{escrow_amount}}..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">Estimated Audience Reach:</span>
            <span className="font-mono font-extrabold text-emerald-400">{AUDIENCE_COUNTS[targetAudience].toLocaleString()} Recipients</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={dispatchNow}
                onChange={(e) => setDispatchNow(e.target.checked)}
                className="accent-indigo-500 rounded cursor-pointer"
              />
              Dispatch immediately to API Providers
            </label>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" /> {dispatchNow ? 'Publish & Send Broadcast' : 'Save Campaign Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
