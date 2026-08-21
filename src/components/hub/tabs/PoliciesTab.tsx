'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { Shield, CheckCircle2, Search, Upload, ArrowUpRight, Plus, X, Edit2, FileText, Sliders, Layers, CheckSquare } from 'lucide-react';
import { PolicyItem } from '@/lib/types/serviceHub';

export function PoliciesTab() {
  const { policies, addPolicy, updatePolicy, publishNewPolicyVersion } = useServiceHubStore();
  const [subTab, setSubTab] = useState<'list' | 'basic_info' | 'requirements' | 'enforcement' | 'version_history'>('list');

  const [versionNote, setVersionNote] = useState('');
  const [selectedPolId, setSelectedPolId] = useState(policies[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const activePolicy = policies.find(p => p.id === selectedPolId) || policies[0];

  const handlePublishVersion = (polId: string, nextVersion: number) => {
    if (!versionNote.trim()) { alert('Please enter release notes for the new version.'); return; }
    publishNewPolicyVersion(polId, versionNote.trim());
    setVersionNote('');
    alert(`Policy version v${nextVersion}.0 published successfully!`);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200/80">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setSubTab('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'list'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Policy List</span>
          </button>

          <button
            onClick={() => setSubTab('basic_info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'basic_info'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Basic Info</span>
          </button>

          <button
            onClick={() => setSubTab('requirements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'requirements'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>3. Policy Requirements</span>
          </button>

          <button
            onClick={() => setSubTab('enforcement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'enforcement'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>4. Enforcement</span>
          </button>

          <button
            onClick={() => setSubTab('version_history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'version_history'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>5. Version History</span>
          </button>
        </div>
      </div>

      {/* 1. POLICY LIST SUB-TAB */}
      {subTab === 'list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">Active Enterprise Policies ({policies.length})</h4>
          </div>

          <div className="space-y-2.5">
            {policies.map(pol => (
              <div
                key={pol.id}
                onClick={() => setSelectedPolId(pol.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-2xs ${
                  selectedPolId === pol.id ? 'bg-white border-2 border-purple-500 ring-2 ring-purple-500/10' : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-slate-900 text-xs">{pol.name}</h5>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    v{pol.version}.0 Published
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{pol.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. BASIC INFO SUB-TAB */}
      {subTab === 'basic_info' && activePolicy && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Basic Policy Identity & Service Mapping</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">POLICY IDENTITY</span>
              <strong className="text-slate-900 text-sm block mt-1">{activePolicy.name}</strong>
              <span className="text-[10px] text-slate-500">ID: {activePolicy.id}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">SERVICE MAPPING</span>
              <strong className="text-purple-700 text-sm block mt-1">All Enterprise Categories</strong>
              <span className="text-[10px] text-slate-500">Global Enforcement Scope</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">VERSION & STATUS</span>
              <strong className="text-emerald-700 text-sm block mt-1">v{activePolicy.version}.0 (PUBLISHED)</strong>
              <span className="text-[10px] text-slate-500">Effective from: {new Date(activePolicy.effective_from).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. POLICY REQUIREMENTS SUB-TAB */}
      {subTab === 'requirements' && activePolicy && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Policy Controls & Requirements Matrix</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <span className="font-extrabold text-purple-950 block">Safety Requirements</span>
              <p className="text-[11px] text-purple-900">Mandatory SOS Panic Button, Live GPS location streaming, and periodic check-in pings.</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <span className="font-extrabold text-indigo-950 block">Verification Requirements</span>
              <p className="text-[11px] text-indigo-900">Aadhaar KYC, live selfie face match, and emergency contact registration required.</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="font-extrabold text-emerald-950 block">Location Requirements</span>
              <p className="text-[11px] text-emerald-900">Initial meetings restricted strictly to public places; safe location geofencing enabled.</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="font-extrabold text-amber-950 block">Communication & Emergency</span>
              <p className="text-[11px] text-amber-900">In-app chat moderation active; automated escalation triggers on unresolved alerts.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. APPLICABILITY & ENFORCEMENT SUB-TAB */}
      {subTab === 'enforcement' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Applicability & Automated Enforcement</h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border">
              <strong>Who It Applies To:</strong> All onboarded companions and registered customers across all active service categories.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <strong>When It Applies:</strong> Enforced 24/7 during active booking sessions and pre-booking matching.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <strong>Enforcement Level:</strong> Automated strict system blocking for non-compliant sessions with real-time audit logging.
            </div>
          </div>
        </div>
      )}

      {/* 5. VERSION HISTORY SUB-TAB */}
      {subTab === 'version_history' && activePolicy && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Immutable Policy Version History & Publish Trigger</h4>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {(activePolicy.versions || []).map((ver, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border text-xs flex justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 font-mono">v{ver.version}.0</span>
                  <span className="text-slate-600 ml-2">{ver.description}</span>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(ver.effective_from).toLocaleDateString()}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <input
              type="text"
              value={versionNote}
              onChange={e => setVersionNote(e.target.value)}
              placeholder="Enter version release notes..."
              className="flex-1 bg-white border rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none"
            />
            <button
              onClick={() => handlePublishVersion(activePolicy.id, activePolicy.version + 1)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              Publish v{activePolicy.version + 1}.0
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
