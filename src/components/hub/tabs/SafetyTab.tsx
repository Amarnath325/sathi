'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  Zap,
  Clock,
  ShieldAlert,
  Activity,
  Download,
  Smartphone,
  UserCheck,
  MapPin,
  Calendar,
  CheckSquare,
  ShieldCheck,
  Globe,
  Eye,
  Bell,
  Flag,
  MessageSquare,
  Box,
  Shield,
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  Search
} from 'lucide-react';
import { SafetyProfileItem, SafetyControlState } from '@/lib/types/serviceHub';

const CONTROL_LABELS: Record<string, string> = {
  sos: 'SOS Panic Button',
  emergency_contact: 'Emergency Contact',
  live_location: 'Live Location Streaming',
  periodic_checkin: 'Periodic Safety Check-in',
  booking_start_checkin: 'Booking Start Check-in',
  booking_end_checkout: 'Booking End Checkout',
  geofence: 'Geofence Boundaries',
  safe_location_requirement: 'Safe Location Verification',
  public_place_requirement: 'Public Place Requirement',
  emergency_notification: 'Emergency Push Alerts',
  admin_emergency_escalation: 'Admin Escalation Protocol',
  incident_reporting: 'In-App Incident Reporting',
  chat_monitoring: 'Automated Chat Monitoring',
  location_monitoring: 'Real-time Location Monitoring'
};

const CONTROL_KEYS = Object.keys(CONTROL_LABELS);

export function SafetyTab() {
  const {
    safetyProfiles,
    auditLogs,
    addSafetyProfile,
    updateSafetyProfile,
    deleteSafetyProfile
  } = useServiceHubStore();

  const [selProfId, setSelProfId] = useState(safetyProfiles[0]?.id || '');
  const [auditFilter, setAuditFilter] = useState<'ALL' | string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SafetyProfileItem | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState<Record<string, SafetyControlState>>({
    sos: 'Required',
    emergency_contact: 'Required',
    live_location: 'Required',
    periodic_checkin: 'Required',
    booking_start_checkin: 'Required',
    booking_end_checkout: 'Required',
    geofence: 'Enabled',
    safe_location_requirement: 'Required',
    public_place_requirement: 'Required',
    emergency_notification: 'Enabled',
    admin_emergency_escalation: 'Enabled',
    incident_reporting: 'Enabled',
    chat_monitoring: 'Enabled',
    location_monitoring: 'Required',
  });

  const activeProfile = safetyProfiles.find(s => s.id === selProfId) || safetyProfiles[0];

  const modules = [...new Set(auditLogs.map(l => l.module))];
  const filteredLogs = auditFilter === 'ALL' ? auditLogs : auditLogs.filter(l => l.module === auditFilter);

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `safety_audit_logs_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setName('');
    setDescription('');
    setControls({
      sos: 'Required',
      emergency_contact: 'Required',
      live_location: 'Required',
      periodic_checkin: 'Required',
      booking_start_checkin: 'Required',
      booking_end_checkout: 'Required',
      geofence: 'Enabled',
      safe_location_requirement: 'Required',
      public_place_requirement: 'Required',
      emergency_notification: 'Enabled',
      admin_emergency_escalation: 'Enabled',
      incident_reporting: 'Enabled',
      chat_monitoring: 'Enabled',
      location_monitoring: 'Required',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prof: SafetyProfileItem) => {
    setEditingProfile(prof);
    setName(prof.name);
    setDescription(prof.description);
    setControls({ ...prof.controls });
    setIsModalOpen(true);
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this safety profile?')) {
      deleteSafetyProfile(id);
      if (selProfId === id && safetyProfiles.length > 1) {
        const remaining = safetyProfiles.filter(s => s.id !== id);
        setSelProfId(remaining[0]?.id || '');
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const formattedControls = controls as SafetyProfileItem['controls'];

    if (editingProfile) {
      updateSafetyProfile(editingProfile.id, {
        name,
        description,
        controls: formattedControls,
      });
    } else {
      const newProf = addSafetyProfile({
        name,
        description,
        status: 'ACTIVE',
        controls: formattedControls,
      });
      setSelProfId(newProf.id);
    }

    setIsModalOpen(false);
  };

  const handleControlStateChange = (ctrlKey: string, newState: SafetyControlState) => {
    if (!activeProfile) return;
    const updatedControls = {
      ...activeProfile.controls,
      [ctrlKey]: newState
    };
    updateSafetyProfile(activeProfile.id, { controls: updatedControls });
  };

  // Split controls into Required and Enabled for active profile
  const requiredControls = useMemo(() => {
    if (!activeProfile) return [];
    return Object.entries(activeProfile.controls).filter(([_, state]) => state === 'Required');
  }, [activeProfile]);

  const enabledControls = useMemo(() => {
    if (!activeProfile) return [];
    return Object.entries(activeProfile.controls).filter(([_, state]) => state === 'Enabled');
  }, [activeProfile]);

  const optionalControls = useMemo(() => {
    if (!activeProfile) return [];
    return Object.entries(activeProfile.controls).filter(([_, state]) => state === 'Optional' || state === 'Disabled');
  }, [activeProfile]);

  return (
    <div className="space-y-5">
      {/* Top Bar: Profile Selector Tabs & Add Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          {safetyProfiles.map(prof => {
            const isSel = activeProfile?.id === prof.id;
            return (
              <button
                key={prof.id}
                onClick={() => setSelProfId(prof.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isSel
                    ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{prof.name}</span>
                {isSel && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200 flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Safety Profile
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: SOS DISPATCH */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase block">SOS DISPATCH</span>
            <span className="text-xl font-extrabold text-emerald-700 leading-tight block mt-0.5">100% Operational</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Fully operational</span>
          </div>
        </div>

        {/* Card 2: CHECK-IN FREQUENCY */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-6 h-6 text-white fill-white opacity-90" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase block">CHECK-IN FREQUENCY</span>
            <span className="text-xl font-extrabold text-indigo-700 leading-tight block mt-0.5">Every 45 Minutes</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Recommended interval</span>
          </div>
        </div>

        {/* Card 3: ACTIVE INCIDENTS */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase block">ACTIVE INCIDENTS</span>
            <span className="text-xl font-extrabold text-amber-700 leading-tight block mt-0.5">0 Flagged</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">No active safety incidents</span>
          </div>
        </div>
      </div>

      {/* Middle Container: Active Safety & Trust Profile Details & Matrix */}
      {activeProfile && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-lg">{activeProfile.name}</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{activeProfile.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEditModal(activeProfile)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button
                onClick={() => handleDeleteProfile(activeProfile.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>

          {/* REQUIRED SECTION */}
          <div>
            <span className="text-xs font-extrabold text-rose-600 tracking-wider uppercase block mb-3">
              REQUIRED ({requiredControls.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {requiredControls.map(([ctrlKey]) => {
                const formattedName = CONTROL_LABELS[ctrlKey] || ctrlKey.replace(/_/g, ' ');

                return (
                  <div
                    key={ctrlKey}
                    className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{formattedName}</span>
                    </div>
                    <select
                      value="Required"
                      onChange={e => handleControlStateChange(ctrlKey, e.target.value as SafetyControlState)}
                      className="bg-white border border-rose-200 text-rose-800 text-[10px] font-extrabold rounded-lg px-2 py-1 outline-none cursor-pointer"
                    >
                      <option value="Required">Required</option>
                      <option value="Enabled">Enabled</option>
                      <option value="Optional">Optional</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ENABLED SECTION */}
          <div className="pt-2">
            <span className="text-xs font-extrabold text-emerald-600 tracking-wider uppercase block mb-3">
              ENABLED ({enabledControls.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {enabledControls.map(([ctrlKey]) => {
                const formattedName = CONTROL_LABELS[ctrlKey] || ctrlKey.replace(/_/g, ' ');

                return (
                  <div
                    key={ctrlKey}
                    className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{formattedName}</span>
                    </div>
                    <select
                      value="Enabled"
                      onChange={e => handleControlStateChange(ctrlKey, e.target.value as SafetyControlState)}
                      className="bg-white border border-emerald-200 text-emerald-800 text-[10px] font-extrabold rounded-lg px-2 py-1 outline-none cursor-pointer"
                    >
                      <option value="Required">Required</option>
                      <option value="Enabled">Enabled</option>
                      <option value="Optional">Optional</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OPTIONAL / DISABLED SECTION */}
          {optionalControls.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-extrabold text-slate-500 tracking-wider uppercase block mb-3">
                OPTIONAL / DISABLED ({optionalControls.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {optionalControls.map(([ctrlKey, stateVal]) => {
                  const formattedName = CONTROL_LABELS[ctrlKey] || ctrlKey.replace(/_/g, ' ');

                  return (
                    <div
                      key={ctrlKey}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-2xs opacity-80"
                    >
                      <span className="text-xs font-semibold text-slate-700">{formattedName}</span>
                      <select
                        value={stateVal}
                        onChange={e => handleControlStateChange(ctrlKey, e.target.value as SafetyControlState)}
                        className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg px-2 py-1 outline-none cursor-pointer"
                      >
                        <option value="Required">Required</option>
                        <option value="Enabled">Enabled</option>
                        <option value="Optional">Optional</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Container: Safety Configuration Audit Trail */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" /> Safety Configuration Audit Trail
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Track changes and actions across safety configuration</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={auditFilter}
              onChange={e => setAuditFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Modules</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button
              onClick={handleExportLogs}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pt-1">
          {filteredLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-slate-200/60">
              {auditLogs.length === 0 ? 'No audit records logged in current session.' : 'No logs match selected filter.'}
            </div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Box className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-extrabold text-slate-900 shrink-0">{log.module}</span>
                  <span className="text-slate-600 font-medium truncate">
                    Action:{' '}
                    <span className={`font-extrabold ${log.action === 'PUBLISH' || log.action === 'CREATE' ? 'text-emerald-600' : log.action === 'SUSPEND' ? 'text-amber-600' : 'text-purple-600'}`}>
                      {log.action}
                    </span>
                  </span>
                  <span className="text-slate-400 font-medium text-xs truncate">ID: {log.entity_id}</span>
                </div>
                <span className="text-slate-500 font-semibold text-xs shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingProfile ? 'Edit Safety Profile' : 'Create Safety Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Profile Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. VIP Companion Safety Controls"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe emergency dispatch and location safety policies..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">Safety Controls Configuration</label>
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
                  {CONTROL_KEYS.map(key => (
                    <div key={key} className="flex items-center justify-between p-1.5 hover:bg-white rounded-lg transition-colors">
                      <span className="font-semibold text-slate-800">{CONTROL_LABELS[key]}</span>
                      <select
                        value={controls[key] || 'Enabled'}
                        onChange={e => setControls(prev => ({ ...prev, [key]: e.target.value as SafetyControlState }))}
                        className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="Required">Required</option>
                        <option value="Enabled">Enabled</option>
                        <option value="Optional">Optional</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm shadow-purple-200"
                >
                  {editingProfile ? 'Update Safety Profile' : 'Save Safety Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
