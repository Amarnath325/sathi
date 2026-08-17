'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { Shield, Plus, GitCommit, CheckCircle2 } from 'lucide-react';

export function PoliciesTab() {
  const { policies, publishNewPolicyVersion } = useServiceHubStore();
  const [versionNote, setVersionNote] = useState('');
  const [selectedPolId, setSelectedPolId] = useState(policies[0]?.id || '');

  const handlePublishVersion = (polId: string) => {
    if (!versionNote.trim()) return;
    publishNewPolicyVersion(polId, versionNote.trim());
    setVersionNote('');
    alert('New policy version published! Historical booking policy versions remain intact.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" /> Module 5: Immutable Versioned Policies Manager
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Published policies are versioned. New versions never modify historical policy versions bound to existing bookings.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {policies.map(pol => (
          <div key={pol.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white text-base">{pol.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold">
                    Version v{pol.version}.0 Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{pol.description}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Effective From: {new Date(pol.effective_from).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Policy Parameters Grid */}
            <div className="grid grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-2xl border border-slate-800 text-slate-300">
              <div>KYC Required: {pol.kyc_required ? 'Yes' : 'No'}</div>
              <div>Live Location: {pol.live_location_required ? 'Yes' : 'No'}</div>
              <div>SOS Active: {pol.sos_required ? 'Yes' : 'No'}</div>
              <div>Public Place: {pol.public_location_only ? 'Yes' : 'No'}</div>
            </div>

            {/* Version History Log */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <GitCommit className="w-3.5 h-3.5 text-indigo-400" /> Immutable Version History:
              </span>
              <div className="space-y-1.5">
                {(pol.versions || []).map((ver, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                    <div>
                      <span className="font-bold text-indigo-400 font-mono">v{ver.version}.0</span> — {ver.description}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(ver.effective_from).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish New Version Input */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={pol.id === selectedPolId ? versionNote : ''}
                onFocus={() => setSelectedPolId(pol.id)}
                onChange={(e) => { setSelectedPolId(pol.id); setVersionNote(e.target.value); }}
                placeholder="Version update release notes..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
              <button
                onClick={() => handlePublishVersion(pol.id)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 shrink-0"
              >
                Publish Version v{pol.version + 1}.0
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
