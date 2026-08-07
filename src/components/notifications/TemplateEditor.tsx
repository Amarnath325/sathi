'use client';

import React, { useState } from 'react';
import { Plus, Code2, Trash2, Edit3, Check, ToggleLeft, ToggleRight, Sparkles, Key } from 'lucide-react';
import { useNotificationEngineStore, NotificationTemplateItem, NotificationCategory, NotificationPriority, NotificationChannel } from '@/lib/notificationEngineStore';

export function TemplateEditor() {
  const { templates, addTemplate, updateTemplate, toggleTemplate, deleteTemplate } = useNotificationEngineStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('SYSTEM');
  const [priority, setPriority] = useState<NotificationPriority>('MEDIUM');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title || !body) return;

    const variableKeys = Array.from(body.matchAll(/\{\{(\w+)\}\}/g)).map((m: any) => m[1]);

    addTemplate({
      code: code.toUpperCase().replace(/\s+/g, '_'),
      title,
      body,
      category,
      priority,
      channels: ['IN_APP', 'EMAIL', 'PUSH'],
      isActive: true,
      variableKeys,
    });

    setCode('');
    setTitle('');
    setBody('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" /> Reusable Notification Templates ({templates.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Define system notification templates with Handlebars variable interpolation e.g. <code className="text-indigo-400">{'{{userName}}'}</code>
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 shadow-lg"
        >
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className={`p-5 rounded-3xl border transition-all space-y-3 ${
              tpl.isActive
                ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {tpl.code}
                </span>
                <span className="ml-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {tpl.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleTemplate(tpl.id)}
                  className="text-slate-400 hover:text-white p-1"
                  title="Toggle active status"
                >
                  {tpl.isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-600" />}
                </button>
                <button
                  onClick={() => deleteTemplate(tpl.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h4 className="text-xs font-bold text-white">{tpl.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              {tpl.body}
            </p>

            {/* Variable Tokens */}
            {tpl.variableKeys.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Key className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 font-bold">Variables:</span>
                {tpl.variableKeys.map((v) => (
                  <span
                    key={v}
                    className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md"
                  >
                    {'{{' + v + '}}'}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Create Notification Template
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300">Template Code (Unique)</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PAYMENT_REFUND_SUCCESS"
                required
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Template Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Refund Issued: {{refundAmount}}"
                required
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Template Body (Use {'{{variable}}'})</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="e.g. Hi {{userName}}, your refund of ${{refundAmount}} for booking {{bookingRef}} has been processed."
                required
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NotificationCategory)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {['SYSTEM', 'BOOKING', 'SAFETY', 'PAYMENT', 'KYC', 'PROMO'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90"
              >
                Save Template
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
