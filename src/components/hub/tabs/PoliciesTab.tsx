'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { Shield, CheckCircle2, Search, Upload, ArrowUpRight, Plus, X } from 'lucide-react';
import { PolicyItem } from '@/lib/types/serviceHub';

export function PoliciesTab() {
  const { policies, addPolicy, publishNewPolicyVersion } = useServiceHubStore();
  const [versionNote, setVersionNote] = useState('');
  const [selectedPolId, setSelectedPolId] = useState(policies[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');
  const [kycRequired, setKycRequired] = useState(true);
  const [liveGpsRequired, setLiveGpsRequired] = useState(true);
  const [sosRequired, setSosRequired] = useState(true);
  const [publicPlacesOnly, setPublicPlacesOnly] = useState(true);

  const filteredPolicies = policies.filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePublishVersion = (polId: string, nextVersion: number) => {
    if (!versionNote.trim()) { alert('Please enter release notes for the new version.'); return; }
    publishNewPolicyVersion(polId, versionNote.trim());
    setVersionNote('');
    alert(`Policy version v${nextVersion}.0 published successfully!`);
  };

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName.trim()) return;

    const newPol: PolicyItem = {
      id: `pol-${Date.now()}`,
      name: policyName.trim(),
      description: description.trim() || 'Standard safety policy.',
      version: 1,
      status: 'PUBLISHED',
      effective_from: new Date().toISOString(),
      minimum_age: 18,
      kyc_required: kycRequired,
      background_check_required: true,
      emergency_contact_required: true,
      public_location_only: publicPlacesOnly,
      live_location_required: liveGpsRequired,
      sos_required: sosRequired,
      chat_moderation_required: true,
      incident_reporting_enabled: true,
      consent_required: true,
      versions: [
        {
          version: 1,
          effective_from: new Date().toISOString(),
          description: 'Initial release of policy.',
          prohibited_activity_text: 'Strict safety rules applied.'
        }
      ]
    };

    addPolicy(newPol);
    setIsModalOpen(false);
    setPolicyName('');
    setDescription('');
  };

  const PARAM_CONFIG = [
    { key: 'kyc_required', label: 'KYC Required' },
    { key: 'live_location_required', label: 'Live GPS' },
    { key: 'sos_required', label: 'SOS Active' },
    { key: 'public_location_only', label: 'Public Places Only' },
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search policies by name or description..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200 flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Policy
        </button>
      </div>

      {/* Policies List */}
      <div className="space-y-5">
        {filteredPolicies.length > 0 ? filteredPolicies.map(pol => (
          <div key={pol.id} className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-5">
            
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">{pol.name}</h4>
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
            <div className="flex flex-wrap items-center gap-2.5">
              {PARAM_CONFIG.map(({ key, label }) => {
                const isActive = Boolean(pol[key as keyof typeof pol]);
                if (!isActive) return null;
                return (
                  <div
                    key={key}
                    className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-extrabold">✓</span>
                    {label}
                  </div>
                );
              })}
            </div>

            {/* Separator & Immutable Version History */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <h5 className="font-extrabold text-purple-700 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-purple-700" /> IMMUTABLE VERSION HISTORY
              </h5>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(pol.versions || []).map((ver, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs flex items-center justify-between text-slate-700">
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
            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="text"
                value={pol.id === selectedPolId ? versionNote : ''}
                onFocus={() => setSelectedPolId(pol.id)}
                onChange={e => { setSelectedPolId(pol.id); setVersionNote(e.target.value); }}
                placeholder="Enter version release notes..."
                className="flex-1 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
              />
              <button
                onClick={() => handlePublishVersion(pol.id, pol.version + 1)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
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

      {/* Add Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl my-auto text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-white text-base">Add New Safety & Usage Policy</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePolicy} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Policy Title *</label>
                <input type="text" required value={policyName} onChange={e => setPolicyName(e.target.value)} placeholder="e.g. VIP Companion Conduct Policy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-indigo-500 transition-colors text-xs" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Policy scope and rules..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none text-xs" />
              </div>
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={kycRequired} onChange={e => setKycRequired(e.target.checked)} className="accent-purple-600 w-4 h-4 rounded" />
                  Mandatory KYC Verification Required
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={liveGpsRequired} onChange={e => setLiveGpsRequired(e.target.checked)} className="accent-purple-600 w-4 h-4 rounded" />
                  Mandatory Live GPS Tracking
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={sosRequired} onChange={e => setSosRequired(e.target.checked)} className="accent-purple-600 w-4 h-4 rounded" />
                  Emergency SOS Active
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={publicPlacesOnly} onChange={e => setPublicPlacesOnly(e.target.checked)} className="accent-purple-600 w-4 h-4 rounded" />
                  Public Places Only Requirement
                </label>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">Publish Policy v1.0</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
