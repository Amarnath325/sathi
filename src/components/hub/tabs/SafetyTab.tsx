'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  ShieldCheck, Shield, Search, Plus, X, Edit2, Trash2, Copy, Power,
  CheckCircle2, AlertTriangle, Layers, Clock, PhoneCall, Radio, Download,
  MapPin, Bell, MessageSquare, AlertOctagon, Lock, Eye, FileText, CheckSquare, Sparkles
} from 'lucide-react';
import { SafetyProfileItem, SafetyControlState } from '@/lib/types/serviceHub';

export function SafetyTab() {
  const {
    safetyProfiles,
    categories,
    services,
    auditLogs,
    addSafetyProfile,
    updateSafetyProfile,
    deleteSafetyProfile,
    toggleSafetyProfileStatus,
    duplicateSafetyProfile,
    searchQuery: globalSearch
  } = useServiceHubStore();

  const [selectedProfId, setSelectedProfId] = useState<string>(safetyProfiles[0]?.id || '');
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'CONTROLS' | 'AUTOMATION' | 'EMERGENCY' | 'AUDIT'>('CONTROLS');
  const [editingProfile, setEditingProfile] = useState<SafetyProfileItem | null>(null);
  const [deleteConfirmProf, setDeleteConfirmProf] = useState<SafetyProfileItem | null>(null);

  // Form Fields State
  // 1. Identity & Scope
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [scopeType, setScopeType] = useState<'GLOBAL' | 'CATEGORY' | 'SERVICE'>('GLOBAL');
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');

  // 1. Safety Controls
  const [controls, setControls] = useState<SafetyProfileItem['controls']>({
    sos: 'REQUIRED',
    emergency_contact: 'REQUIRED',
    live_location: 'REQUIRED',
    periodic_checkin: 'REQUIRED',
    booking_start_checkin: 'REQUIRED',
    booking_end_checkout: 'REQUIRED',
    safe_location_requirement: 'REQUIRED',
    public_place_requirement: 'REQUIRED',
    location_monitoring: 'REQUIRED'
  });

  // 2. Safety Automation
  const [automation, setAutomation] = useState<SafetyProfileItem['automation']>({
    geofence: 'REQUIRED',
    emergency_notification: 'REQUIRED',
    admin_emergency_escalation: 'REQUIRED',
    incident_reporting: 'REQUIRED',
    chat_monitoring: 'REQUIRED'
  });

  // 3. Emergency & Incident Protocols
  const [sosDispatchMode, setSosDispatchMode] = useState<'AUTO_POLICE_AND_CONTACTS' | 'OPS_DESK_REVIEW' | 'CONTACTS_ONLY'>('AUTO_POLICE_AND_CONTACTS');
  const [emergencyEscalationQueue, setEmergencyEscalationQueue] = useState<'SAFETY_DESK' | 'OPS_MANAGER' | 'POLICE_HOTLINE'>('SAFETY_DESK');
  const [incidentResponseSlaMins, setIncidentResponseSlaMins] = useState(5);
  const [autoContactDispatchDelaySeconds, setAutoContactDispatchDelaySeconds] = useState(30);
  const [responseRulesMatrixText, setResponseRulesMatrixText] = useState('Instant SMS alert to 2 primary contacts, live GPS link broadcast, and emergency desk pop-up.');

  // 4. Security & Audit Settings
  const [logAllEvents, setLogAllEvents] = useState(true);
  const [exportLogsEnabled, setExportLogsEnabled] = useState(true);
  const [retentionDays, setRetentionDays] = useState(90);

  // Filtered Profiles
  const searchTerm = localSearch || globalSearch;
  const filteredProfiles = useMemo(() => {
    return safetyProfiles.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'ALL' || p.category_id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [safetyProfiles, searchTerm, categoryFilter]);

  const activeProfile = safetyProfiles.find(p => p.id === selectedProfId) || safetyProfiles[0];

  // Export Audit Logs Handler
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `safety_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handlers
  const handleOpenCreate = () => {
    setEditingProfile(null);
    setCode(`SAF-STD-${Date.now().toString().slice(-4)}`);
    setName('Standard Safety & Trust Profile');
    setDescription('Full active safety controls including panic SOS, live GPS tracking, 30-min check-in, and auto-dispatch.');
    setStatus('ACTIVE');
    setScopeType('GLOBAL');
    setCategoryId('');
    setServiceId('');

    setControls({
      sos: 'REQUIRED',
      emergency_contact: 'REQUIRED',
      live_location: 'REQUIRED',
      periodic_checkin: 'REQUIRED',
      booking_start_checkin: 'REQUIRED',
      booking_end_checkout: 'REQUIRED',
      safe_location_requirement: 'REQUIRED',
      public_place_requirement: 'REQUIRED',
      location_monitoring: 'REQUIRED'
    });

    setAutomation({
      geofence: 'REQUIRED',
      emergency_notification: 'REQUIRED',
      admin_emergency_escalation: 'REQUIRED',
      incident_reporting: 'REQUIRED',
      chat_monitoring: 'REQUIRED'
    });

    setSosDispatchMode('AUTO_POLICE_AND_CONTACTS');
    setEmergencyEscalationQueue('SAFETY_DESK');
    setIncidentResponseSlaMins(5);
    setAutoContactDispatchDelaySeconds(30);
    setResponseRulesMatrixText('Instant SMS alert to 2 primary contacts, live GPS link broadcast, and emergency desk pop-up.');

    setLogAllEvents(true);
    setExportLogsEnabled(true);
    setRetentionDays(90);

    setActiveModalTab('CONTROLS');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prof: SafetyProfileItem) => {
    setEditingProfile(prof);
    setCode(prof.code || `SAF-${prof.id.slice(-4)}`);
    setName(prof.name);
    setDescription(prof.description);
    setStatus(prof.status);
    setScopeType(prof.scope_type || 'GLOBAL');
    setCategoryId(prof.category_id || '');
    setServiceId(prof.service_id || '');

    if (prof.controls) setControls(prof.controls);
    if (prof.automation) setAutomation(prof.automation);

    if (prof.emergency_protocols) {
      setSosDispatchMode(prof.emergency_protocols.sos_dispatch_mode);
      setEmergencyEscalationQueue(prof.emergency_protocols.emergency_escalation_queue);
      setIncidentResponseSlaMins(prof.emergency_protocols.incident_response_sla_mins);
      setAutoContactDispatchDelaySeconds(prof.emergency_protocols.auto_contact_dispatch_delay_seconds);
      setResponseRulesMatrixText(prof.emergency_protocols.response_rules_matrix_text);
    }

    if (prof.audit_settings) {
      setLogAllEvents(prof.audit_settings.log_all_events);
      setExportLogsEnabled(prof.audit_settings.export_logs_enabled);
      setRetentionDays(prof.audit_settings.retention_days);
    }

    setActiveModalTab('CONTROLS');
    setIsModalOpen(true);
  };

  const handleControlStateChange = (group: 'controls' | 'automation', key: string, state: SafetyControlState) => {
    if (group === 'controls') {
      setControls(prev => ({ ...prev, [key]: state }));
    } else {
      setAutomation(prev => ({ ...prev, [key]: state }));
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<SafetyProfileItem, 'id' | 'createdAt' | 'updatedAt'> = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      status,
      scope_type: scopeType,
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name,
      service_id: serviceId,
      service_name: services.find(s => s.id === serviceId)?.name,

      controls,
      automation,

      emergency_protocols: {
        sos_dispatch_mode: sosDispatchMode,
        emergency_escalation_queue: emergencyEscalationQueue,
        incident_response_sla_mins: Number(incidentResponseSlaMins),
        auto_contact_dispatch_delay_seconds: Number(autoContactDispatchDelaySeconds),
        response_rules_matrix_text: responseRulesMatrixText.trim()
      },

      audit_settings: {
        log_all_events: logAllEvents,
        export_logs_enabled: exportLogsEnabled,
        retention_days: Number(retentionDays)
      }
    };

    if (editingProfile) {
      updateSafetyProfile(editingProfile.id, payload);
    } else {
      addSafetyProfile(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3.5 w-full">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search safety profiles by code, controls, or emergency SLA..."
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-purple-500 shadow-2xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border border-slate-200 flex items-center gap-1.5 transition-all shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export Audit Logs
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-2xs flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Safety Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Section 1 & 2: Configured Safety Profiles Grid */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Safety Controls & Automation Framework
              <span className="ml-1.5 text-slate-500 text-[10px] font-normal">({filteredProfiles.length} active profiles)</span>
            </h4>
          </div>

          {filteredProfiles.length > 0 ? (
            <div className="space-y-2.5">
              {filteredProfiles.map(prof => {
                const isSelected = selectedProfId === prof.id;

                return (
                  <div
                    key={prof.id}
                    className={`p-3.5 rounded-2xl bg-white border transition-all space-y-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-purple-500 shadow-2xs ring-1 ring-purple-500/20'
                        : 'border-slate-200/90 shadow-2xs hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedProfId(prof.id)}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-purple-300 font-mono font-bold text-[10px]">
                          {prof.code || `SAF-${prof.id.slice(-4)}`}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">{prof.name}</h5>
                        <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${
                          prof.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {prof.status}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSafetyProfileStatus(prof.id); }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            prof.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title="Toggle Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateSafetyProfile(prof.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Duplicate Profile"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(prof); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmProf(prof); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{prof.description}</p>

                    {/* Category & Service Relational Mapping */}
                    <div className="flex items-center gap-2 text-[10px] pt-0.5">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-purple-600" /> Relational Scope:
                      </span>
                      <span className="px-2 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-bold text-[9px]">
                        {prof.category_name || 'Global (All Categories & Services)'}
                      </span>
                      {prof.service_name && (
                        <span className="px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[9px]">
                          Service: {prof.service_name}
                        </span>
                      )}
                    </div>

                    {/* Section 1 & 2: Active Controls Matrix Pills */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Active Controls & Automation Matrix:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[9px] border border-rose-200">SOS Panic Button</span>
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[9px] border border-purple-200">Live GPS Streaming</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[9px] border border-indigo-200">Check-In / Out Pulse</span>
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[9px] border border-amber-200">3D Geofencing</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[9px] border border-blue-200">Public Place Only</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px] border border-emerald-200">Chat Moderation</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No safety profiles match your search.
            </div>
          )}
        </div>

        {/* Section 3 & 4: Emergency Protocols & Audit Log Stream */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Emergency Protocol & Live Audit
            </span>
            {activeProfile && <span className="text-[10px] font-mono text-purple-600 font-bold">{activeProfile.code || 'SAF-STD-01'}</span>}
          </h4>

          {activeProfile ? (
            <div className="space-y-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200 font-mono text-[10px] space-y-1">
                <p className="font-bold text-rose-900">SOS Dispatch: {activeProfile.emergency_protocols?.sos_dispatch_mode || 'AUTO_POLICE_AND_CONTACTS'}</p>
                <p className="text-slate-700">Response SLA: <strong className="text-slate-900">{activeProfile.emergency_protocols?.incident_response_sla_mins || 5} Mins</strong></p>
                <p className="text-purple-800 font-bold">Escalation Queue: {activeProfile.emergency_protocols?.emergency_escalation_queue || 'SAFETY_DESK'}</p>
              </div>

              {/* Live Safety Audit Log Stream */}
              <div className="space-y-2">
                <h5 className="font-extrabold text-slate-700 text-[11px] flex justify-between items-center">
                  <span>Recent Security & Audit Logs:</span>
                  <button onClick={handleExportLogs} className="text-purple-600 hover:underline text-[10px] font-bold">Export</button>
                </h5>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {auditLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] space-y-0.5 font-mono">
                      <div className="flex justify-between items-center text-slate-400 text-[9px]">
                        <span>{log.module} • {log.action}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-800 font-bold truncate">Item #{log.entity_id || log.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic">Select a safety profile to inspect emergency response rules.</p>
          )}
        </div>
      </div>

      {/* Complete Multi-Section Create / Edit Safety Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  {editingProfile ? `Edit Safety Profile: ${editingProfile.code || editingProfile.name}` : 'Configure Safety & Trust Profile'}
                </h4>
                <p className="text-[11px] text-slate-400">Safety Controls, Automation, Emergency Protocols & Audit Settings</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Section Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'CONTROLS', label: '1. Safety Controls' },
                { id: 'AUTOMATION', label: '2. Automation Rules' },
                { id: 'EMERGENCY', label: '3. Emergency Protocols' },
                { id: 'AUDIT', label: '4. Security & Audit' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveModalTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 transition-all ${
                    activeModalTab === t.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-[11px]">
              {/* TAB 1: SAFETY CONTROLS & SCOPE */}
              {activeModalTab === 'CONTROLS' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Profile Code *</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="SAF-STD-01"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-purple-400 font-mono font-bold outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Profile Name *</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Standard Companion Safety Profile"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Scope Mapping</label>
                      <select value={scopeType} onChange={e => setScopeType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="GLOBAL">Global (All Categories)</option>
                        <option value="CATEGORY">Category Specific</option>
                        <option value="SERVICE">Service Specific</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Status</label>
                      <select value={status} onChange={e => setStatus(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>

                  {scopeType === 'CATEGORY' && (
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Target Category Relation</label>
                      <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="">Select Category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    <p className="text-slate-400 font-bold">Safety Controls State Configuration:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'sos', label: 'SOS Panic Button' },
                        { key: 'live_location', label: 'Live Location GPS' },
                        { key: 'periodic_checkin', label: 'Periodic Check-In' },
                        { key: 'public_place_requirement', label: 'Public Place Mandatory' },
                      ].map(ctrl => (
                        <div key={ctrl.key} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-300 font-bold">{ctrl.label}</span>
                          <select
                            value={(controls as any)[ctrl.key] || 'REQUIRED'}
                            onChange={e => handleControlStateChange('controls', ctrl.key, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-purple-400 font-bold text-[10px]"
                          >
                            <option value="REQUIRED">REQUIRED</option>
                            <option value="RECOMMENDED">RECOMMENDED</option>
                            <option value="OPTIONAL">OPTIONAL</option>
                            <option value="DISABLED">DISABLED</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AUTOMATION RULES */}
              {activeModalTab === 'AUTOMATION' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-slate-400 font-bold">Safety Automation Rules:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'geofence', label: '3D Geofence Restrictions' },
                        { key: 'emergency_notification', label: 'Emergency Notification Broadcast' },
                        { key: 'admin_emergency_escalation', label: 'Admin Emergency Escalation' },
                        { key: 'chat_monitoring', label: 'In-App Chat Monitoring' },
                      ].map(auto => (
                        <div key={auto.key} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-300 font-bold">{auto.label}</span>
                          <select
                            value={(automation as any)[auto.key] || 'REQUIRED'}
                            onChange={e => handleControlStateChange('automation', auto.key, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-purple-400 font-bold text-[10px]"
                          >
                            <option value="REQUIRED">REQUIRED</option>
                            <option value="RECOMMENDED">RECOMMENDED</option>
                            <option value="OPTIONAL">OPTIONAL</option>
                            <option value="DISABLED">DISABLED</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EMERGENCY PROTOCOLS */}
              {activeModalTab === 'EMERGENCY' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">SOS Dispatch Mode</label>
                      <select value={sosDispatchMode} onChange={e => setSosDispatchMode(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-rose-400 font-bold outline-none focus:border-purple-500 text-[11px]">
                        <option value="AUTO_POLICE_AND_CONTACTS">AUTO_POLICE_AND_CONTACTS</option>
                        <option value="OPS_DESK_REVIEW">OPS_DESK_REVIEW</option>
                        <option value="CONTACTS_ONLY">CONTACTS_ONLY</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Emergency Escalation Queue</label>
                      <select value={emergencyEscalationQueue} onChange={e => setEmergencyEscalationQueue(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="SAFETY_DESK">SAFETY_DESK</option>
                        <option value="OPS_MANAGER">OPS_MANAGER</option>
                        <option value="POLICE_HOTLINE">POLICE_HOTLINE</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Incident Response SLA (Mins)</label>
                      <input type="number" value={incidentResponseSlaMins} onChange={e => setIncidentResponseSlaMins(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Auto-Contact Delay (Secs)</label>
                      <input type="number" value={autoContactDispatchDelaySeconds} onChange={e => setAutoContactDispatchDelaySeconds(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Response Rules Matrix Text</label>
                    <textarea rows={2} value={responseRulesMatrixText} onChange={e => setResponseRulesMatrixText(e.target.value)} placeholder="Specify emergency dispatch protocol..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-rose-300 outline-none focus:border-purple-500 text-[11px]" />
                  </div>
                </div>
              )}

              {/* TAB 4: SECURITY & AUDIT SETTINGS */}
              {activeModalTab === 'AUDIT' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={logAllEvents} onChange={e => setLogAllEvents(e.target.checked)} className="accent-purple-500 rounded w-4 h-4" />
                      <span>Log All Safety Events Stream</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={exportLogsEnabled} onChange={e => setExportLogsEnabled(e.target.checked)} className="accent-purple-500 rounded w-4 h-4" />
                      <span>Allow Admin Log Exports</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Audit Log Retention Period (Days)</label>
                    <input type="number" value={retentionDays} onChange={e => setRetentionDays(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                  {editingProfile ? 'Save Profile Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProf && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Delete Safety Profile?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Are you sure you want to delete <strong className="text-white">{deleteConfirmProf.code || deleteConfirmProf.name}</strong>?</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmProf(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
              <button onClick={() => { deleteSafetyProfile(deleteConfirmProf.id); setDeleteConfirmProf(null); }} className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]">
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
