'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { Shield, GitCommit, CheckCircle2, Search, Download } from 'lucide-react';

export function PoliciesTab() {
  const { policies, publishNewPolicyVersion } = useServiceHubStore();
  const [versionNote, setVersionNote] = useState('');
  const [selectedPolId, setSelectedPolId] = useState(policies[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPolicies = policies.filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePublishVersion = (polId: string) => {
    if (!versionNote.trim()) { alert('Please enter release notes for the new version.'); return; }
    publishNewPolicyVersion(polId, versionNote.trim());
    setVersionNote('');
    alert('New policy version published successfully!');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(policies, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `policies_export_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const PARAM_LABELS: Record<string, string> = {
    kyc_required: 'KYC Required',
    live_location_required: 'Live GPS',
    sos_required: 'SOS Active',
    public_location_only: 'Public Places Only',
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search policies by name or description..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Policies */}
      <div className="space-y-4">
        {filteredPolicies.length > 0 ? filteredPolicies.map(pol => (
          <div key={pol.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 space-y-4 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-white text-base">{pol.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold">
                    v{pol.version}.0 Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{pol.description}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                Effective: {new Date(pol.effective_from).toLocaleDateString()}
              </span>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
              {(Object.entries({ kyc_required: pol.kyc_required, live_location_required: pol.live_location_required, sos_required: pol.sos_required, public_location_only: pol.public_location_only }) as [string, boolean][]).map(([key, val]) => (
                <div key={key} className={`p-2.5 rounded-xl border flex items-center justify-between ${val ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900 border-slate-800'}`}>
                  <span className={`text-[10px] font-bold ${val ? 'text-emerald-300' : 'text-slate-500'}`}>{PARAM_LABELS[key] || key}</span>
                  {val
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    : <span className="text-slate-600 text-[10px] font-mono">OFF</span>
                  }
                </div>
              ))}
            </div>

            {/* Version History */}
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-indigo-400" /> Immutable Version History
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {(pol.versions || []).map((ver, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-400 font-mono">v{ver.version}.0</span>
                      <span className="text-slate-400">—</span>
                      <span>{ver.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{new Date(ver.effective_from).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish New Version */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={pol.id === selectedPolId ? versionNote : ''}
                onFocus={() => setSelectedPolId(pol.id)}
                onChange={e => { setSelectedPolId(pol.id); setVersionNote(e.target.value); }}
                placeholder="Enter version release notes..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={() => handlePublishVersion(pol.id)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Publish v{pol.version + 1}.0
              </button>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
            No policies match your search.
          </div>
        )}
      </div>
    </div>
  );
}
