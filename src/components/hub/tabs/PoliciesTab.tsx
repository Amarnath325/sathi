'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { Shield, CheckCircle2, Search, Upload, ArrowUpRight, Plus, X, Edit2 } from 'lucide-react';
import { PolicyItem } from '@/lib/types/serviceHub';

export function PoliciesTab() {
  const { policies, addPolicy, updatePolicy, publishNewPolicyVersion } = useServiceHubStore();
  const [versionNote, setVersionNote] = useState('');
  const [selectedPolId, setSelectedPolId] = useState(policies[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyItem | null>(null);

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

  const handleOpenCreate = () => {
    setEditingPolicy(null);
    setPolicyName('');
    setDescription('');
    setKycRequired(true);
    setLiveGpsRequired(true);
    setSosRequired(true);
    setPublicPlacesOnly(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pol: PolicyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPolicy(pol);
    setPolicyName(pol.name);
    setDescription(pol.description);
    setKycRequired(Boolean(pol.kyc_required));
    setLiveGpsRequired(Boolean(pol.live_location_required));
    setSosRequired(Boolean(pol.sos_required));
    setPublicPlacesOnly(Boolean(pol.public_location_only));
    setIsModalOpen(true);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName.trim()) return;

    if (editingPolicy) {
      updatePolicy(editingPolicy.id, {
        name: policyName.trim(),
        description: description.trim(),
        kyc_required: kycRequired,
        live_location_required: liveGpsRequired,
        sos_required: sosRequired,
        public_location_only: publicPlacesOnly
      });
    } else {
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
    }
    setIsModalOpen(false);
  };

  const PARAM_CONFIG = [
    { key: 'kyc_required', label: 'KYC Required' },
    { key: 'live_location_required', label: 'Live GPS' },
    { key: 'sos_required', label: 'SOS Active' },
    { key: 'public_location_only', label: 'Public Places Only' },
  ] as const;

  return (
    <div className="space-y-3 w-full">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search policies by name or description..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-2xs flex items-center justify-center gap-1 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Policy
        </button>
      </div>

      {/* Policies List */}
      <div className="space-y-3">
        {filteredPolicies.length > 0 ? filteredPolicies.map(pol => (
          <div key={pol.id} className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-3">
            
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{pol.name}</h4>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/90 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    v{pol.version}.0 Active
                  </span>
                  <button
                    onClick={(e) => handleOpenEdit(pol, e)}
                    className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                    title="Edit Policy"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{pol.description}</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                Effective: {new Date(pol.effective_from).toLocaleDateString()}
              </span>
            </div>

            {/* Feature Pills Row */}
            <div className="flex flex-wrap items-center gap-2">
              {PARAM_CONFIG.map(({ key, label }) => {
                const isActive = Boolean(pol[key as keyof typeof pol]);
                if (!isActive) return null;
                return (
                  <div
                    key={key}
                    className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-200/80 flex items-center gap-1 shadow-2xs"
                  >
                    <span className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-extrabold">✓</span>
                    {label}
                  </div>
                );
              })}
            </div>

            {/* Separator & Immutable Version History */}
            <div className="pt-2.5 border-t border-slate-100 space-y-2">
              <h5 className="font-extrabold text-purple-700 text-[10px] tracking-wider uppercase flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-700" /> IMMUTABLE VERSION HISTORY
              </h5>
              
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {(pol.versions || []).map((ver, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50/70 border border-slate-200/80 text-[11px] flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900 font-mono text-[10px]">v{ver.version}.0</span>
                      <span className="text-slate-400 font-normal">—</span>
                      <span className="text-slate-700 font-medium">{ver.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium shrink-0">
                      Date: {new Date(ver.effective_from).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Version Publish Row */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={pol.id === selectedPolId ? versionNote : ''}
                onFocus={() => setSelectedPolId(pol.id)}
                onChange={e => { setSelectedPolId(pol.id); setVersionNote(e.target.value); }}
                placeholder="Enter version release notes..."
                className="flex-1 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
              />
              <button
                onClick={() => handlePublishVersion(pol.id, pol.version + 1)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shrink-0 flex items-center gap-1 shadow-2xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Publish v{pol.version + 1}.0
              </button>
            </div>

          </div>
        )) : (
          <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
            No policies match your search.
          </div>
        )}
      </div>

      {/* Add / Edit Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-3.5 shadow-2xl my-auto text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-white text-sm">
                {editingPolicy ? `Edit Policy: ${editingPolicy.name}` : 'Add New Safety & Usage Policy'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSavePolicy} className="space-y-2.5 text-[11px]">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Policy Title *</label>
                <input type="text" required value={policyName} onChange={e => setPolicyName(e.target.value)} placeholder="e.g. VIP Companion Conduct Policy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 transition-colors text-[11px]" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Policy scope and rules..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 resize-none text-[11px]" />
              </div>
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={kycRequired} onChange={e => setKycRequired(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                  Mandatory KYC Verification Required
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={liveGpsRequired} onChange={e => setLiveGpsRequired(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                  Mandatory Live GPS Tracking
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={sosRequired} onChange={e => setSosRequired(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                  Emergency SOS Active
                </label>
                <label className="flex items-center gap-2 text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={publicPlacesOnly} onChange={e => setPublicPlacesOnly(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                  Public Places Only Requirement
                </label>
              </div>
              <div className="pt-2.5 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                  {editingPolicy ? 'Save Changes' : 'Publish Policy v1.0'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
