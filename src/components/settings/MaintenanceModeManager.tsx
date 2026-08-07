'use client';

import React from 'react';
import { Wrench, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useSystemSettingsStore } from '@/lib/systemSettingsStore';

export function MaintenanceModeManager() {
  const { maintenance, updateMaintenanceSettings, toggleMaintenanceMode } = useSystemSettingsStore();

  const services = [
    { id: 'COMPANION_SEARCH', label: 'Companion Search & Catalog' },
    { id: 'PAYMENTS_API', label: 'Payments & Escrow Processing' },
    { id: 'REVIEWS_API', label: 'Review Moderation API' },
    { id: 'KYC_API', label: 'KYC Document Verification' },
  ];

  const handleToggleService = (svcId: string) => {
    const isIncluded = maintenance.affectedServices.includes(svcId);
    const updated = isIncluded
      ? maintenance.affectedServices.filter((s) => s !== svcId)
      : [...maintenance.affectedServices, svcId];

    updateMaintenanceSettings({ affectedServices: updated });
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Panic Card */}
      <div className={`p-6 rounded-3xl border transition-all ${
        maintenance.isMaintenanceActive
          ? 'bg-amber-950/40 border-amber-500 shadow-2xl shadow-amber-900/50 animate-pulse'
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              maintenance.isMaintenanceActive ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">Global Maintenance Mode</h3>
                {maintenance.isMaintenanceActive ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    MAINTENANCE ACTIVE ⚠️
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ALL SYSTEMS OPERATIONAL 🟢
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Display public maintenance banner and pause selected API microservices for upgrades
              </p>
            </div>
          </div>

          <button
            onClick={toggleMaintenanceMode}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xl ${
              maintenance.isMaintenanceActive
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
          >
            {maintenance.isMaintenanceActive ? 'Turn Off Maintenance' : 'Activate Maintenance Mode'}
          </button>
        </div>
      </div>

      {/* Outage Announcement Text & Services List */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400" /> Public Outage Announcement Text
        </h4>

        <textarea
          rows={3}
          value={maintenance.outageMessage}
          onChange={(e) => updateMaintenanceSettings({ outageMessage: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />

        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-300 block">Affected Services Checklist</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((svc) => {
              const isAffected = maintenance.affectedServices.includes(svc.id);
              return (
                <div
                  key={svc.id}
                  onClick={() => handleToggleService(svc.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isAffected
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">{svc.label}</span>
                  <input
                    type="checkbox"
                    checked={isAffected}
                    onChange={() => {}}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
