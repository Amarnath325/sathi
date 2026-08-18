'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { Shield, GitCommit, CheckCircle2, Search, Upload, ArrowUpRight } from 'lucide-react';

export function PoliciesTab() {
  const { policies, publishNewPolicyVersion } = useServiceHubStore();
  const [versionNote, setVersionNote] = useState('');
  const [selectedPolId, setSelectedPolId] = useState(policies[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPolicies = policies.filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePublishVersion = (polId: string, nextVersion: number) => {
    if (!versionNote.trim()) { alert('Please enter release notes for the new version.'); return; }
    publishNewPolicyVersion(polId, versionNote.trim());
    setVersionNote('');
    alert(`Policy version v${nextVersion}.0 published successfully!`);
  };

  const PARAM_CONFIG = [
    { key: 'kyc_required', label: 'KYC Required' },
    { key: 'live_location_required', label: 'Live GPS' },
    { key: 'sos_required', label: 'SOS Active' },
    { key: 'public_location_only', label: 'Public Places Only' },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search policies by name or description..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
        />
      </div>

      {/* Policies List */}
      <div className="space-y-5">
        {filteredPolicies.length > 0 ? filteredPolicies.map(pol => (
          <div key={pol.id} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-6">
            
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 text-xl tracking-tight">{pol.name}</h4>
                  <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/90 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    v{pol.version}.0 Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">{pol.description}</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 shrink-0">
                Effective: {new Date(pol.effective_from).toLocaleDateString()}
              </span>
            </div>

            {/* Feature Pills Row */}
            <div className="flex flex-wrap items-center gap-3">
              {PARAM_CONFIG.map(({ key, label }) => {
                const isActive = Boolean(pol[key as keyof typeof pol]);
                if (!isActive) return null;
                return (
                  <div
                    key={key}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200/80 flex items-center gap-2 shadow-2xs"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-extrabold">✓</span>
                    {label}
                  </div>
                );
              })}
            </div>

            {/* Separator & Immutable Version History */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <h5 className="font-extrabold text-purple-700 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-purple-700" /> IMMUTABLE VERSION HISTORY
              </h5>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(pol.versions || []).map((ver, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 font-mono">v{ver.version}.0</span>
                      <span className="text-slate-400 font-normal">—</span>
                      <span className="text-slate-700 font-medium">{ver.description}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium shrink-0">
                      Date: {new Date(ver.effective_from).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Version Publish Row */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="text"
                value={pol.id === selectedPolId ? versionNote : ''}
                onFocus={() => setSelectedPolId(pol.id)}
                onChange={e => { setSelectedPolId(pol.id); setVersionNote(e.target.value); }}
                placeholder="Enter version release notes..."
                className="flex-1 bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
              />
              <button
                onClick={() => handlePublishVersion(pol.id, pol.version + 1)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Publish v{pol.version + 1}.0
              </button>
            </div>

          </div>
        )) : (
          <div className="p-8 text-center text-slate-500 text-xs bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            No policies match your search.
          </div>
        )}
      </div>
    </div>
  );
}
