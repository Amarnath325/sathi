'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  Zap, Clock, ShieldAlert, Activity, Download, Smartphone, UserCheck, MapPin, Calendar, CheckSquare,
  ShieldCheck, Globe, Eye, Bell, Flag, MessageSquare, Shield, Layers
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
    <div className="space-y-3 w-full">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: SOS DISPATCH */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-2xs">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">SOS DISPATCH</span>
            <span className="text-base font-extrabold text-emerald-700 leading-tight block">100% Operational</span>
            <span className="text-[10px] text-slate-500 font-medium block">Fully operational</span>
          </div>
        </div>

        {/* Card 2: CHECK-IN FREQUENCY */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-2xs">
            <Clock className="w-4 h-4 text-white fill-white opacity-90" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">CHECK-IN FREQUENCY</span>
            <span className="text-base font-extrabold text-indigo-700 leading-tight block">Every 45 Minutes</span>
            <span className="text-[10px] text-slate-500 font-medium block">Recommended interval</span>
          </div>
        </div>

        {/* Card 3: AUDIT TRAIL LOGGED */}
        <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">AUDIT TRAIL LOGGED</span>
            <span className="text-base font-extrabold text-purple-800 leading-tight block">{auditLogs.length} Events Logged</span>
            <span className="text-[10px] text-slate-500 font-medium block">Complete audit history</span>
          </div>
        </div>
      </div>

      {/* Safety Controls Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Required Safety Controls */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
            <span>Required Safety Controls</span>
            <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
              {requiredControls.length} Mandatory
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {requiredControls.map(([key]) => {
              const Icon = REQUIRED_CONTROL_ICONS[key] || Shield;
              const formattedName = key.replace(/_required$/, '').replace(/_/g, ' ');
              return (
                <div key={key} className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex items-center gap-2 text-emerald-950">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="font-semibold capitalize text-[11px]">{formattedName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Safety Automations */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
            <span>Active Safety Automations</span>
            <span className="px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold">
              {enabledControls.length} Active
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {enabledControls.map(([key]) => {
              const Icon = ENABLED_CONTROL_ICONS[key] || Activity;
              const formattedName = key.replace(/_enabled$/, '').replace(/_/g, ' ');
              return (
                <div key={key} className="p-2 rounded-xl bg-indigo-50/50 border border-indigo-200/80 flex items-center gap-2 text-indigo-950">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="font-semibold capitalize text-[11px]">{formattedName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audit Log Box */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-600" /> Immutable Security Audit Logs
          </h4>

          <div className="flex items-center gap-2">
            <select
              value={auditFilter}
              onChange={e => setAuditFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-bold text-slate-700 outline-none shadow-2xs"
            >
              <option value="ALL">All Modules</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button
              onClick={handleExportLogs}
              className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-2xs flex items-center gap-1 shrink-0"
            >
              <Download className="w-3 h-3" /> Export Logs
            </button>
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto space-y-1.5 font-mono text-[11px]">
          {filteredLogs.length > 0 ? filteredLogs.map(log => (
            <div key={log.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold text-[9px]">{log.module}</span>
                <strong className="text-slate-900 font-sans">{log.action}</strong>
                <span className="text-slate-400 font-sans">ID: {log.entity_id}</span>
              </div>
              <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          )) : (
            <div className="p-4 text-center text-slate-400 font-sans text-xs">No audit logs recorded yet.</div>
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
