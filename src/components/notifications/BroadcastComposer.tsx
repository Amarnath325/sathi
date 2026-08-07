'use client';

import React, { useState } from 'react';
import { Send, Users, Shield, Radio, CheckCircle2, Sparkles, Filter, AlertCircle } from 'lucide-react';
import { useNotificationEngineStore, NotificationCategory, NotificationPriority, NotificationChannel } from '@/lib/notificationEngineStore';

export function BroadcastComposer() {
  const { bulkBroadcast, templates } = useNotificationEngineStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('SYSTEM');
  const [priority, setPriority] = useState<NotificationPriority>('MEDIUM');
  const [targetSegment, setTargetSegment] = useState('ALL_USERS');
  const [targetRole, setTargetRole] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(['IN_APP', 'EMAIL']);
  const [actionUrl, setActionUrl] = useState('');
  const [actionLabel, setActionLabel] = useState('');
  const [sentSuccess, setSentSuccess] = useState<{ broadcastId: string; recipientCount: number } | null>(null);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    if (tpl) {
      setTitle(tpl.title);
      setBody(tpl.body);
      setCategory(tpl.category);
      setPriority(tpl.priority);
      setSelectedChannels(tpl.channels);
    }
  };

  const toggleChannel = (ch: NotificationChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const res = bulkBroadcast({
      targetRole: targetRole || undefined,
      targetCity: targetCity || undefined,
      targetSegment,
      title,
      body,
      category,
      priority,
      channels: selectedChannels,
      actionUrl: actionUrl || undefined,
      actionLabel: actionLabel || undefined,
    });

    setSentSuccess(res);
    setTimeout(() => setSentSuccess(null), 6000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Broadcast Form */}
      <form onSubmit={handleSendBroadcast} className="lg:col-span-2 space-y-5 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" /> Dispatch Platform Broadcast
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Target registered users, companions, or staff with multi-channel push & notifications
            </p>
          </div>

          {/* Quick Template Picker */}
          <select
            value={selectedTemplateId}
            onChange={(e) => handleSelectTemplate(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-indigo-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
          >
            <option value="">Load Template...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code} ({t.category})
              </option>
            ))}
          </select>
        </div>

        {sentSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              Broadcast dispatched successfully! ID: <span className="font-mono text-white">{sentSuccess.broadcastId}</span> to{' '}
              <span className="text-white">{sentSuccess.recipientCount} recipients</span>.
            </div>
          </div>
        )}

        {/* Target Audience Filter */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Target Segment
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ALL_USERS', label: '👥 All Users (1,032)' },
              { id: 'CUSTOMERS', label: '👤 Customers (890)' },
              { id: 'COMPANIONS', label: '⭐ Companions (142)' },
            ].map((seg) => (
              <button
                type="button"
                key={seg.id}
                onClick={() => setTargetSegment(seg.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  targetSegment === seg.id
                    ? 'gradient-bg-primary text-white border-indigo-500 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold">Role Filter</label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. VERIFIED_COMPANION"
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold">City Geo-Fence</label>
              <input
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Message Title & Body */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300">Notification Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Platform System Maintenance Notice"
              required
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Message Body *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Enter message details. Supports handlebars {{userName}}, {{date}}..."
              required
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NotificationCategory)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {['SYSTEM', 'BOOKING', 'SAFETY', 'PAYMENT', 'KYC', 'PROMO', 'SECURITY', 'COMMUNITY'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as NotificationPriority)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="LOW">LOW — Standard info</option>
              <option value="MEDIUM">MEDIUM — Normal priority</option>
              <option value="HIGH">HIGH — Urgent alert</option>
              <option value="URGENT">URGENT — Emergency / SOS broadcast</option>
            </select>
          </div>
        </div>

        {/* Multi-Channel Checkboxes */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">Delivery Channels</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'IN_APP', label: '📱 In-App SSE' },
              { id: 'EMAIL', label: '📧 Email Relay' },
              { id: 'PUSH', label: '🔔 Mobile FCM Push' },
              { id: 'SMS', label: '💬 Twilio SMS' },
            ].map((ch) => {
              const active = selectedChannels.includes(ch.id as NotificationChannel);
              return (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => toggleChannel(ch.id as NotificationChannel)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    active
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {ch.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Link (Optional) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300">Action URL (Optional)</label>
            <input
              value={actionUrl}
              onChange={(e) => setActionUrl(e.target.value)}
              placeholder="e.g. /booking/CC-2026-8812"
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300">Action Label (Optional)</label>
            <input
              value={actionLabel}
              onChange={(e) => setActionLabel(e.target.value)}
              placeholder="e.g. View Booking Details"
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" /> Send Multi-Channel Broadcast
        </button>
      </form>

      {/* Live Card Preview Side */}
      <div className="space-y-4">
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live End-User Preview
          </h4>

          {/* Render Mock Notification Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {category}
              </span>
              <span className="text-[9px] text-slate-500 font-mono">Just now</span>
            </div>
            <h5 className="text-xs font-bold text-white">{title || 'Notification Title Preview'}</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {body || 'Your notification content preview will render here live as you type...'}
            </p>
            {actionUrl && (
              <span className="inline-block text-[10px] font-bold text-indigo-400 underline">
                {actionLabel || 'Action Link'}
              </span>
            )}
          </div>
        </div>

        {/* Audience Count Summary */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Estimated Reach
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Target Segment:</span>
              <span className="font-bold text-white">{targetSegment}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Selected Channels:</span>
              <span className="font-bold text-indigo-400">{selectedChannels.join(', ')}</span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
              <span>Estimated Recipients:</span>
              <span className="font-extrabold text-emerald-400">
                {targetSegment === 'COMPANIONS' ? '142' : targetSegment === 'CUSTOMERS' ? '890' : '1,032'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
