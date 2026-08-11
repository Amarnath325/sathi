'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Copy, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Code, 
  CheckCircle2, 
  X, 
  Smartphone, 
  Monitor, 
  Tag, 
  Sliders, 
  MoveUp, 
  MoveDown,
  Layers,
  Palette,
  AlertCircle
} from 'lucide-react';
import { useEmailConfigStore, EmailTemplate, EmailTemplateSection } from '@/lib/emailConfigStore';

export function EmailTemplateModule() {
  const { 
    templates, 
    addTemplate, 
    updateTemplate, 
    deleteTemplate, 
    duplicateTemplate,
    reorderTemplateSections,
    addTemplateSection,
    deleteTemplateSection
  } = useEmailConfigStore();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Active Editor Modal State
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isNewTemplate, setIsNewTemplate] = useState(false);

  // Live Preview Modal State
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');

  // Custom Tag Input
  const [customVarInput, setCustomVarInput] = useState('');

  // Section Adder Form
  const [newSecTitle, setNewSecTitle] = useState('');
  const [newSecType, setNewSecType] = useState<EmailTemplateSection['type']>('BODY');
  const [newSecContent, setNewSecContent] = useState('');

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateNew = () => {
    const newTmpl: EmailTemplate = {
      id: `tmpl-${Date.now()}`,
      code: 'NEW_EMAIL_TRIGGER',
      title: 'New Dynamic Email Template',
      subject: 'Notification from Sathi {{company_name}}',
      category: 'Notifications' as any,
      status: 'DRAFT',
      updatedAt: new Date().toISOString(),
      variables: ['user_name', 'otp_code', 'booking_id', 'company_name', 'support_link'],
      bodyHtml: `
<div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 24px; color: #f8fafc; border-radius: 12px;">
  <h2 style="color: #6366f1;">Hello {{user_name}},</h2>
  <p style="color: #cbd5e1;">This is a customizable dynamic email message.</p>
</div>
      `.trim(),
      sections: [
        { id: `sec-${Date.now()}-1`, title: 'Header Title', type: 'HEADER', content: 'Hello {{user_name}}', order: 1 },
        { id: `sec-${Date.now()}-2`, title: 'Main Body Text', type: 'BODY', content: 'This is a customizable dynamic email message.', order: 2 }
      ]
    };
    setEditingTemplate(newTmpl);
    setIsNewTemplate(true);
  };

  const handleSaveEditingTemplate = () => {
    if (!editingTemplate) return;
    if (isNewTemplate) {
      addTemplate(editingTemplate);
    } else {
      updateTemplate(editingTemplate.id, editingTemplate);
    }
    setEditingTemplate(null);
  };

  // Helper to insert variable tag at cursor / end of bodyHtml or subject
  const insertVariableTag = (varName: string) => {
    if (!editingTemplate) return;
    const tag = `{{${varName}}}`;
    setEditingTemplate({
      ...editingTemplate,
      bodyHtml: editingTemplate.bodyHtml + ' ' + tag
    });
  };

  const handleAddCustomVariable = () => {
    if (!customVarInput || !editingTemplate) return;
    const cleanVar = customVarInput.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    if (!editingTemplate.variables.includes(cleanVar)) {
      setEditingTemplate({
        ...editingTemplate,
        variables: [...editingTemplate.variables, cleanVar]
      });
    }
    setCustomVarInput('');
  };

  // CKEditor Rich Text Formatting Wrappers
  const applyRichFormat = (command: string, value: string = '') => {
    if (!editingTemplate) return;
    let html = editingTemplate.bodyHtml;

    switch (command) {
      case 'bold':
        html += ` <strong>Bold Text</strong>`;
        break;
      case 'italic':
        html += ` <em>Italicized Text</em>`;
        break;
      case 'underline':
        html += ` <u>Underlined Text</u>`;
        break;
      case 'h1':
        html += ` <h1 style="color: #6366f1; margin: 12px 0;">Heading Level 1</h1>`;
        break;
      case 'h2':
        html += ` <h2 style="color: #10b981; margin: 10px 0;">Heading Level 2</h2>`;
        break;
      case 'h3':
        html += ` <h3 style="color: #f59e0b; margin: 8px 0;">Heading Level 3</h3>`;
        break;
      case 'bullet':
        html += ` <ul style="color: #cbd5e1;"><li>Item 1</li><li>Item 2</li></ul>`;
        break;
      case 'link':
        html += ` <a href="{{support_link}}" style="color: #818cf8; text-decoration: underline;">Clickable Link</a>`;
        break;
      case 'code':
        html += ` <code style="background-color: #0f172a; color: #fbbf24; padding: 4px 8px; border-radius: 6px;">{{otp_code}}</code>`;
        break;
      case 'color':
        html += ` <span style="color: ${value}; font-weight: bold;">Colored Highlight</span>`;
        break;
      case 'clear':
        html = editingTemplate.bodyHtml.replace(/<[^>]*>?/gm, '');
        break;
    }

    setEditingTemplate({
      ...editingTemplate,
      bodyHtml: html
    });
  };

  const resolvePreviewHtml = (html: string) => {
    return html
      .replace(/{{user_name}}/g, 'Alex Mercer')
      .replace(/{{user_email}}/g, 'alex.mercer@sathi.com')
      .replace(/{{otp_code}}/g, '849201')
      .replace(/{{companion_name}}/g, 'Sophia Chen')
      .replace(/{{booking_id}}/g, 'BK-882109')
      .replace(/{{booking_date}}/g, '15 Aug 2026, 06:00 PM')
      .replace(/{{amount}}/g, '1,499')
      .replace(/{{reset_link}}/g, 'https://sathi-connect.vercel.app/reset-password?token=8821')
      .replace(/{{support_link}}/g, 'https://sathi-connect.vercel.app/support')
      .replace(/{{company_name}}/g, 'Sathi Companion Connect Inc.');
  };

  const handleAddSection = () => {
    if (!editingTemplate || !newSecTitle) return;
    addTemplateSection(editingTemplate.id, {
      title: newSecTitle,
      type: newSecType,
      content: newSecContent || 'Default section body payload.'
    });
    // Refresh editing template state from store
    const updatedStore = useEmailConfigStore.getState().templates.find(t => t.id === editingTemplate.id);
    if (updatedStore) setEditingTemplate(updatedStore);
    setNewSecTitle('');
    setNewSecContent('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/90 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Dynamic Email Templates Builder
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {templates.length} TEMPLATES
                </span>
              </h2>
              <p className="text-xs text-slate-400">CKEditor-powered WYSIWYG editor with moveable field reordering and dynamic variable tags.</p>
            </div>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-5 py-3 rounded-2xl gradient-bg-primary text-white font-extrabold text-xs hover:opacity-95 shadow-xl shadow-indigo-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Email Template
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates by code, title, or subject..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white pl-10 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Authentication">Authentication</option>
              <option value="Bookings">Bookings</option>
              <option value="Escrow">Escrow</option>
              <option value="Security">Security</option>
              <option value="System">System</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE Only</option>
            <option value="DRAFT">DRAFT Only</option>
            <option value="INACTIVE">INACTIVE Only</option>
          </select>
        </div>
      </div>

      {/* Templates Table / Grid */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Trigger Code & Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Subject Line</th>
                <th className="p-4">Moveable Sections</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    No email templates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTemplates.map(tmpl => (
                  <tr key={tmpl.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-indigo-400 text-xs">{tmpl.code}</div>
                      <div className="font-bold text-white text-xs">{tmpl.title}</div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {tmpl.category}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs truncate text-slate-300 font-sans" title={tmpl.subject}>
                      {tmpl.subject}
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-slate-400 font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        {tmpl.sections ? tmpl.sections.length : 0} Blocks
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        tmpl.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : tmpl.status === 'DRAFT'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {tmpl.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => setPreviewTemplate(tmpl)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                        title="Live Preview"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      </button>

                      <button
                        onClick={() => { setEditingTemplate(tmpl); setIsNewTemplate(false); }}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                        title="Edit Template & Reorder Fields"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        onClick={() => duplicateTemplate(tmpl.id)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                        title="Duplicate Template"
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      </button>

                      <button
                        onClick={() => deleteTemplate(tmpl.id)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/50 text-slate-300 hover:text-rose-400 border border-slate-800"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RICH EDITOR MODAL WITH CKEDITOR TOOLBAR & MOVEABLE SECTION REORDERING */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in text-slate-100 my-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl gradient-bg-primary flex items-center justify-center shadow-lg">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {isNewTemplate ? 'Create New Email Template' : `Edit Template: ${editingTemplate.code}`}
                  </h3>
                  <p className="text-xs text-slate-400">CKEditor WYSIWYG formatting & dynamic section reordering.</p>
                </div>
              </div>

              <button 
                onClick={() => setEditingTemplate(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Trigger Code</label>
                  <input 
                    type="text"
                    required
                    value={editingTemplate.code}
                    onChange={e => setEditingTemplate({ ...editingTemplate, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Template Title</label>
                  <input 
                    type="text"
                    required
                    value={editingTemplate.title}
                    onChange={e => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category & Status</label>
                  <div className="flex gap-2">
                    <select
                      value={editingTemplate.category}
                      onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="Authentication">Authentication</option>
                      <option value="Bookings">Bookings</option>
                      <option value="Escrow">Escrow</option>
                      <option value="Security">Security</option>
                      <option value="System">System</option>
                    </select>

                    <select
                      value={editingTemplate.status}
                      onChange={e => setEditingTemplate({ ...editingTemplate, status: e.target.value as any })}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Subject Line with Tag Helper */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Subject Line</label>
                <input 
                  type="text"
                  required
                  value={editingTemplate.subject}
                  onChange={e => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  placeholder="e.g. Welcome {{user_name}}! Verification Code: {{otp_code}}"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Dynamic Variables Insertion Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-indigo-400" /> Click to Insert Dynamic Variables:</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {editingTemplate.variables.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariableTag(v)}
                      className="px-2.5 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-bold transition-all"
                    >
                      {`{{${v}}}`}
                    </button>
                  ))}
                </div>

                {/* Add Custom Variable Helper */}
                <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                  <input 
                    type="text"
                    value={customVarInput}
                    onChange={e => setCustomVarInput(e.target.value)}
                    placeholder="Add custom tag (e.g. refund_amount)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomVariable}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* CKEDITOR-STYLE WYSIWYG RICH TEXT TOOLBAR & HTML BODY */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Rich HTML Body & CKEditor Toolbar
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">HTML Source Supported</span>
                </div>

                {/* Toolbar buttons */}
                <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-1">
                  <button type="button" onClick={() => applyRichFormat('bold')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300" title="Bold"><Bold className="w-4 h-4" /></button>
                  <button type="button" onClick={() => applyRichFormat('italic')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300" title="Italic"><Italic className="w-4 h-4" /></button>
                  <button type="button" onClick={() => applyRichFormat('underline')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300" title="Underline"><Underline className="w-4 h-4" /></button>

                  <div className="h-5 w-[1px] bg-slate-800 mx-1" />

                  <button type="button" onClick={() => applyRichFormat('h1')} className="p-2 rounded-lg hover:bg-slate-800 text-indigo-400 font-bold" title="H1 Heading"><Heading1 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => applyRichFormat('h2')} className="p-2 rounded-lg hover:bg-slate-800 text-emerald-400 font-bold" title="H2 Heading"><Heading2 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => applyRichFormat('h3')} className="p-2 rounded-lg hover:bg-slate-800 text-amber-400 font-bold" title="H3 Heading"><Heading3 className="w-4 h-4" /></button>

                  <div className="h-5 w-[1px] bg-slate-800 mx-1" />

                  <button type="button" onClick={() => applyRichFormat('bullet')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300" title="Bullet List"><List className="w-4 h-4" /></button>
                  <button type="button" onClick={() => applyRichFormat('link')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300" title="Insert Link"><LinkIcon className="w-4 h-4" /></button>
                  <button type="button" onClick={() => applyRichFormat('code')} className="p-2 rounded-lg hover:bg-slate-800 text-amber-400" title="Code Block"><Code className="w-4 h-4" /></button>

                  <div className="h-5 w-[1px] bg-slate-800 mx-1" />

                  {/* Colors */}
                  <button type="button" onClick={() => applyRichFormat('color', '#6366f1')} className="w-5 h-5 rounded-full bg-indigo-500 border border-white/20" title="Indigo Color" />
                  <button type="button" onClick={() => applyRichFormat('color', '#10b981')} className="w-5 h-5 rounded-full bg-emerald-500 border border-white/20" title="Emerald Color" />
                  <button type="button" onClick={() => applyRichFormat('color', '#fbbf24')} className="w-5 h-5 rounded-full bg-amber-400 border border-white/20" title="Amber Color" />
                  <button type="button" onClick={() => applyRichFormat('color', '#f43f5e')} className="w-5 h-5 rounded-full bg-rose-500 border border-white/20" title="Rose Color" />
                </div>

                <textarea
                  rows={8}
                  value={editingTemplate.bodyHtml}
                  onChange={e => setEditingTemplate({ ...editingTemplate, bodyHtml: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* MOVEABLE DYNAMIC SECTIONS / REORDERABLE FIELDS ENGINE */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" /> Moveable Sections & Field Reorder Engine
                    </h4>
                    <p className="text-[11px] text-slate-400">Shift email sections up (▲) or down (▼) to dynamically reorder content structure.</p>
                  </div>
                </div>

                {/* Section List with Move Up / Move Down Controls */}
                <div className="space-y-2">
                  {editingTemplate.sections && editingTemplate.sections.length > 0 ? (
                    editingTemplate.sections.sort((a, b) => a.order - b.order).map((sec, idx) => (
                      <div key={sec.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px] font-bold flex items-center justify-center">
                            #{sec.order}
                          </span>
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-2">
                              {sec.title}
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                                {sec.type}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate max-w-md">{sec.content}</div>
                          </div>
                        </div>

                        {/* Move Up / Move Down Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              reorderTemplateSections(editingTemplate.id, sec.id, 'UP');
                              const refreshed = useEmailConfigStore.getState().templates.find(t => t.id === editingTemplate.id);
                              if (refreshed) setEditingTemplate(refreshed);
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 disabled:opacity-30 border border-slate-800"
                            title="Move Field Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={idx === editingTemplate.sections.length - 1}
                            onClick={() => {
                              reorderTemplateSections(editingTemplate.id, sec.id, 'DOWN');
                              const refreshed = useEmailConfigStore.getState().templates.find(t => t.id === editingTemplate.id);
                              if (refreshed) setEditingTemplate(refreshed);
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 disabled:opacity-30 border border-slate-800"
                            title="Move Field Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteTemplateSection(editingTemplate.id, sec.id);
                              const refreshed = useEmailConfigStore.getState().templates.find(t => t.id === editingTemplate.id);
                              if (refreshed) setEditingTemplate(refreshed);
                            }}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-rose-400 border border-slate-800"
                            title="Delete Section Block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs font-mono text-center">
                      No moveable sections configured. Add a section below.
                    </div>
                  )}
                </div>

                {/* Add New Moveable Section Block */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="text-xs font-bold text-slate-300">Add Custom Moveable Section</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input 
                      type="text"
                      placeholder="Section Title (e.g. Callout Box)"
                      value={newSecTitle}
                      onChange={e => setNewSecTitle(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />

                    <select
                      value={newSecType}
                      onChange={e => setNewSecType(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    >
                      <option value="HEADER">HEADER Block</option>
                      <option value="BODY">BODY Paragraph</option>
                      <option value="BUTTON">CALL-TO-ACTION Button</option>
                      <option value="CALLOUT">CALLOUT Highlight</option>
                      <option value="GRID">DATA Table/Grid</option>
                      <option value="FOOTER">FOOTER Links</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Moveable Block
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setPreviewTemplate(editingTemplate)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-indigo-400" /> Preview Live HTML
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveEditingTemplate}
                  className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Template Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* LIVE DESKTOP & MOBILE HTML PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className={`bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 animate-fade-in text-slate-100 ${
            previewDevice === 'DESKTOP' ? 'max-w-3xl w-full h-[85vh]' : 'max-w-sm w-full h-[750px]'
          }`}>
            
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-xs truncate max-w-xs">{previewTemplate.title}</h3>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('DESKTOP')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'DESKTOP' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDevice('MOBILE')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'MOBILE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subject Preview Banner */}
            <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 text-[11px] font-mono text-slate-300 truncate shrink-0">
              <span className="text-slate-500 font-bold">Subject:</span> {resolvePreviewHtml(previewTemplate.subject)}
            </div>

            {/* Rendered HTML Body Canvas */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-950">
              <div 
                className="prose prose-invert max-w-none text-slate-100 text-xs"
                dangerouslySetInnerHTML={{ __html: resolvePreviewHtml(previewTemplate.bodyHtml) }}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
