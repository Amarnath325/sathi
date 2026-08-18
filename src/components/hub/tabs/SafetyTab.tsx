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
} from 'lucide-react';

const REQUIRED_CONTROL_ICONS: Record<string, React.ElementType> = {
  sos_required: Smartphone,
  emergency_contact_required: UserCheck,
  live_location_required: MapPin,
  periodic_checkin_required: Clock,
  booking_start_checkin_required: Calendar,
  booking_end_checkout_required: CheckSquare,
  safe_location_requirement_required: ShieldCheck,
  public_place_requirement_required: Globe,
  location_monitoring_required: Eye,
};

const ENABLED_CONTROL_ICONS: Record<string, React.ElementType> = {
  geofence_enabled: Layers,
  emergency_notification_enabled: Bell,
  admin_emergency_escalation_enabled: Shield,
  incident_reporting_enabled: Flag,
  chat_monitoring_enabled: MessageSquare,
};

export function SafetyTab() {
  const { safetyProfiles, auditLogs } = useServiceHubStore();
  const profile = safetyProfiles[0];
  const [auditFilter, setAuditFilter] = useState<'ALL' | string>('ALL');

  const modules = [...new Set(auditLogs.map(l => l.module))];
  const filteredLogs = auditFilter === 'ALL' ? auditLogs : auditLogs.filter(l => l.module === auditFilter);

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `safety_audit_logs_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Split controls into Required and Enabled
  const requiredControls = useMemo(() => {
    if (!profile) return [];
    return Object.entries(profile.controls).filter(([_, state]) => state === 'Required');
  }, [profile]);

  const enabledControls = useMemo(() => {
    if (!profile) return [];
    return Object.entries(profile.controls).filter(([_, state]) => state === 'Enabled');
  }, [profile]);

  return (
    <div className="space-y-5">
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

      {/* Middle Container: Standard Safety & Trust Profile */}
      {profile && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <div>
            <h4 className="font-extrabold text-slate-900 text-lg">Standard Safety & Trust Profile</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Core safety and trust requirements and capabilities</p>
          </div>

          {/* REQUIRED SECTION */}
          <div>
            <span className="text-xs font-extrabold text-rose-600 tracking-wider uppercase block mb-3">REQUIRED</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {requiredControls.map(([ctrlKey]) => {
                const IconComp = REQUIRED_CONTROL_ICONS[ctrlKey] || ShieldCheck;
                const formattedName = ctrlKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                return (
                  <div
                    key={ctrlKey}
                    className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/80 flex items-center gap-3 shadow-2xs"
                  >
                    <IconComp className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{formattedName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ENABLED SECTION */}
          <div className="pt-2">
            <span className="text-xs font-extrabold text-emerald-600 tracking-wider uppercase block mb-3">ENABLED</span>
            <div className="flex flex-wrap gap-3">
              {enabledControls.map(([ctrlKey]) => {
                const IconComp = ENABLED_CONTROL_ICONS[ctrlKey] || ShieldCheck;
                const formattedName = ctrlKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                return (
                  <div
                    key={ctrlKey}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-2.5 shadow-2xs"
                  >
                    <IconComp className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{formattedName}</span>
                  </div>
                );
              })}
            </div>
          </div>

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
    </div>
  );
}
