'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  Zap, Clock, ShieldAlert, Activity, Download, Smartphone, UserCheck, MapPin, Calendar, CheckSquare,
  ShieldCheck, Globe, Eye, Bell, Flag, MessageSquare, Shield, Layers, AlertTriangle, FileText, CheckCircle2
} from 'lucide-react';

export function SafetyTab() {
  const { safetyProfiles, auditLogs } = useServiceHubStore();
  const profile = safetyProfiles[0];

  const [subTab, setSubTab] = useState<'controls' | 'automation' | 'emergency' | 'audit'>('controls');
  const [auditFilter, setAuditFilter] = useState<'ALL' | string>('ALL');

  const modules = [...new Set(auditLogs.map(l => l.module))];
  const filteredLogs = auditFilter === 'ALL' ? auditLogs : auditLogs.filter(l => l.module === auditFilter);

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `safety_audit_logs_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const SAFETY_CONTROLS_LIST = [
    { key: 'sos', name: 'Panic SOS Button', icon: Smartphone, status: 'Mandatory', desc: 'One-tap dispatch for instant emergency help' },
    { key: 'emergency_contact', name: 'Emergency Contact', icon: UserCheck, status: 'Mandatory', desc: 'Pre-registered emergency contact phone numbers' },
    { key: 'live_location', name: 'Live GPS Tracking', icon: MapPin, status: 'Mandatory', desc: 'Continuous encrypted live stream during booking' },
    { key: 'periodic_checkin', name: 'Periodic Check-In', icon: Clock, status: 'Mandatory', desc: 'Automated 45-min interval safety ping' },
    { key: 'booking_start', name: 'Booking Start Check-In', icon: Calendar, status: 'Mandatory', desc: 'Biometric/location check-in at session start' },
    { key: 'booking_end', name: 'Booking End Check-Out', icon: CheckSquare, status: 'Mandatory', desc: 'Required check-out confirmation' },
    { key: 'safe_location', name: 'Safe Location Requirement', icon: ShieldCheck, status: 'Mandatory', desc: 'Restricts bookings to verified addresses' },
    { key: 'public_place', name: 'Public Place Requirement', icon: Globe, status: 'Mandatory', desc: 'Restricts initial meetings to public venues' },
    { key: 'location_monitoring', name: 'Location Monitoring', icon: Eye, status: 'Mandatory', desc: 'Real-time telemetry monitor' },
  ];

  const SAFETY_AUTOMATION_LIST = [
    { key: 'geofence', name: 'Geofence Boundaries', icon: Layers, status: 'Active', desc: 'Triggers alerts if companion leaves booking zone' },
    { key: 'emergency_notification', name: 'Emergency Push Alerts', icon: Bell, status: 'Active', desc: 'Instant high-priority broadcasts to admin & team' },
    { key: 'admin_escalation', name: 'Admin Escalation Workflow', icon: Shield, status: 'Active', desc: 'Auto-escalates unacknowledged SOS after 60s' },
    { key: 'incident_reporting', name: 'Automated Incident Logging', icon: Flag, status: 'Active', desc: 'Auto-logs deviations into audit trail' },
    { key: 'chat_monitoring', name: 'AI Chat Moderation', icon: MessageSquare, status: 'Active', desc: 'Filters offensive language & unsafe requests' },
  ];

  return (
    <div className="space-y-3 w-full">
      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200/80">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setSubTab('controls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'controls'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Safety Controls</span>
          </button>

          <button
            onClick={() => setSubTab('automation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'automation'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>2. Safety Automation</span>
          </button>

          <button
            onClick={() => setSubTab('emergency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'emergency'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>3. Emergency & Incident</span>
          </button>

          <button
            onClick={() => setSubTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'audit'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>4. Security & Audit</span>
          </button>
        </div>
      </div>

      {/* 1. SAFETY CONTROLS SUB-TAB */}
      {subTab === 'controls' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
              <span>Configured Safety Controls Checklist</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                9 Controls Active
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {SAFETY_CONTROLS_LIST.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-extrabold text-slate-900 text-[11px]">{item.name}</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. SAFETY AUTOMATION SUB-TAB */}
      {subTab === 'automation' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Active Automated Safety Protocols</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {SAFETY_AUTOMATION_LIST.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-indigo-950 text-xs">{item.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-900 font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. EMERGENCY & INCIDENT SUB-TAB */}
      {subTab === 'emergency' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {/* Dispatch Protocol */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-rose-600" /> SOS Emergency Dispatch Protocol
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                <strong>1. Immediate Trigger:</strong> On SOS tap, system broadcasts live GPS coordinates to nearby emergency responders and registered contacts.
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <strong>2. Admin Escalation:</strong> Unresolved SOS triggers audio-visual alarms in admin console within 30 seconds.
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                <strong>3. Incident Management:</strong> Dedicated incident ticket is generated with immutable audit timestamping.
              </div>
            </div>
          </div>

          {/* Emergency Contacts Directory */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-600" /> Response Hotline Directory
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border flex justify-between items-center">
                <span>National Emergency Services</span>
                <strong className="font-mono text-purple-700">112</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border flex justify-between items-center">
                <span>Sathi 24x7 Safety Command Center</span>
                <strong className="font-mono text-purple-700">1800-100-SATHI</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border flex justify-between items-center">
                <span>Police Special Helpline</span>
                <strong className="font-mono text-purple-700">100</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SECURITY & AUDIT SUB-TAB */}
      {subTab === 'audit' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-600" /> Immutable Security Audit Logs
            </h4>

            <div className="flex items-center gap-2">
              <select
                value={auditFilter}
                onChange={e => setAuditFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="ALL">All Modules</option>
                {modules.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button
                onClick={handleExportLogs}
                className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Export Logs
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 font-mono text-[11px]">
            {filteredLogs.length > 0 ? filteredLogs.map(log => (
              <div key={log.id} className="p-2 rounded-xl bg-slate-50 border flex items-center justify-between text-slate-700">
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
      )}
    </div>
  );
}
