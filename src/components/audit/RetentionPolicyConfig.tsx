'use client';

import React from 'react';
import { Clock, Shield, Archive, HardDrive, CheckCircle2 } from 'lucide-react';
import { useAuditLogsStore, AuditDomain } from '@/lib/auditLogsStore';

const COMPLIANCE_BADGES: Record<string, string> = {
  SOC2_TYPE_II: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  HIPAA: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  GDPR: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  PCI_DSS: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

export function RetentionPolicyConfig() {
  const { retentionPolicies, updateRetentionPolicy } = useAuditLogsStore();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Domain Data Retention & Regulatory Archiving Policies
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure automated retention lifecycles compliant with SOC2 Type II, HIPAA, GDPR, and PCI-DSS standards
          </p>
        </div>
      </div>

      {/* Grid of Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {retentionPolicies.map((rp) => {
          const badge = COMPLIANCE_BADGES[rp.complianceStandard] || 'bg-slate-800 text-slate-400';
          const years = (rp.retentionDays / 365).toFixed(1);

          return (
            <div key={rp.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{rp.domain}</h4>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Retention: <span className="text-indigo-400 font-bold">{rp.retentionDays} Days</span> (~{years} years)
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${badge}`}>
                  {rp.complianceStandard}
                </span>
              </div>

              {/* Retention Slider */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={30}
                  max={2555}
                  step={30}
                  value={rp.retentionDays}
                  onChange={(e) => updateRetentionPolicy(rp.domain, { retentionDays: Number(e.target.value) })}
                  className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <label className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Archive className="w-3.5 h-3.5 text-cyan-400" /> Auto-Archive
                  </span>
                  <input
                    type="checkbox"
                    checked={rp.autoArchive}
                    onChange={(e) => updateRetentionPolicy(rp.domain, { autoArchive: e.target.checked })}
                    className="accent-indigo-500 rounded cursor-pointer"
                  />
                </label>

                <label className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Cold Storage
                  </span>
                  <input
                    type="checkbox"
                    checked={rp.coldStorageEnabled}
                    onChange={(e) => updateRetentionPolicy(rp.domain, { coldStorageEnabled: e.target.checked })}
                    className="accent-emerald-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
