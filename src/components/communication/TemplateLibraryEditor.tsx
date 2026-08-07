'use client';

import React, { useState } from 'react';
import { FileText, Plus, Save, Trash2, Code, Mail, MessageSquare, Bell, CheckCircle2 } from 'lucide-react';
import { useCommunicationStore, CommunicationTemplateRecord, CommChannel, CommTemplateCategory } from '@/lib/communicationStore';

export function TemplateLibraryEditor() {
  const { templates, saveTemplate, deleteTemplate } = useCommunicationStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [name, setName] = useState('');
  const [templateKey, setTemplateKey] = useState('');
  const [channel, setChannel] = useState<CommChannel>('EMAIL');
  const [category, setCategory] = useState<CommTemplateCategory>('TRANSACTIONAL');
  const [subject, setSubject] = useState('');
  const [bodyTemplate, setBodyTemplate] = useState('');

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === 'ALL' || t.category === selectedCategory
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !templateKey.trim() || !bodyTemplate.trim()) return;

    saveTemplate({
      name,
      templateKey: templateKey.toLowerCase().replace(/\s+/g, '_'),
      channel,
      category,
      subject,
      bodyTemplate,
      variables: ['user_name', 'booking_id', 'escrow_amount'],
      isSystemTemplate: false,
    });

    setName('');
    setTemplateKey('');
    setSubject('');
    setBodyTemplate('');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" /> Dynamic Message Templates Library
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage reusable SMS, Email, and Push templates with variable placeholders like <code>{`{{user_name}}`}</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'TRANSACTIONAL', 'MARKETING', 'SECURITY', 'SYSTEM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat ? 'gradient-bg-primary text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredTemplates.map((tmpl) => (
            <div key={tmpl.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-white">{tmpl.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      {tmpl.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      {tmpl.channel}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Key: {tmpl.templateKey}</span>
                </div>

                {!tmpl.isSystemTemplate && (
                  <button
                    onClick={() => deleteTemplate(tmpl.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {tmpl.subject && (
                <div className="text-xs font-bold text-slate-300 font-mono">Subject: {tmpl.subject}</div>
              )}

              <pre className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                {tmpl.bodyTemplate}
              </pre>

              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] text-slate-500 font-bold">Variables:</span>
                {tmpl.variables.map((v) => (
                  <span key={v} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 text-indigo-400 border border-slate-800">
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Create Template Form */}
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 h-fit">
          <h4 className="text-xs font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-emerald-400" /> Create Custom Message Template
          </h4>

          <div>
            <label className="text-xs font-bold text-slate-300">Template Display Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Escrow Refund Receipt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Unique Template Identifier Key</label>
            <input
              type="text"
              required
              placeholder="e.g. escrow_refund_receipt"
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-300">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as CommChannel)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="EMAIL">EMAIL</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">PUSH</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommTemplateCategory)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="TRANSACTIONAL">TRANSACTIONAL</option>
                <option value="MARKETING">MARKETING</option>
                <option value="SECURITY">SECURITY</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Subject Template (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Refund Receipt for {{booking_id}}"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Body Template</label>
            <textarea
              rows={4}
              required
              placeholder="Hi {{user_name}}, your refund of ${{escrow_amount}} has been issued..."
              value={bodyTemplate}
              onChange={(e) => setBodyTemplate(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:opacity-90 shadow-xl shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" /> Save Template to Library
          </button>
        </form>
      </div>
    </div>
  );
}
