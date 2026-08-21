'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { UserCheck, CheckCircle2, XCircle, Search, Check, Plus, Edit2, Trash2, X, Sliders, Layers, FileCheck } from 'lucide-react';
import { VerificationProfileItem, VerificationLevel } from '@/lib/types/serviceHub';

export function VerificationTab() {
  const {
    verificationProfiles,
    addVerificationProfile,
    updateVerificationProfile,
    deleteVerificationProfile
  } = useServiceHubStore();

  const [subTab, setSubTab] = useState<'profiles' | 'checks' | 'rules'>('profiles');
  const [selProfId, setSelProfId] = useState(verificationProfiles[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const activeProfile = verificationProfiles.find(v => v.id === selProfId) || verificationProfiles[0];

  const CHECKS_LIST = [
    { key: 'identity', name: 'Identity Verification', desc: 'Government ID / Aadhaar verification', level: 'Mandatory' },
    { key: 'contact', name: 'Contact Verification', desc: 'OTP Mobile & Email verification', level: 'Mandatory' },
    { key: 'face', name: 'Face Match', desc: 'Biometric selfie matching with photo ID', level: 'Mandatory' },
    { key: 'address', name: 'Address Proof', desc: 'Verified residential address verification', level: 'Enhanced' },
    { key: 'background', name: 'Background Check', desc: 'Police clearance certificate & court check', level: 'Enhanced' },
    { key: 'emergency', name: 'Emergency Contact Check', desc: 'Verified family/next of kin phone check', level: 'Mandatory' },
    { key: 'additional', name: 'Additional Documents', desc: 'Degree, character certificate, bank details', level: 'Restricted' },
  ];

  return (
    <div className="space-y-3 w-full">
      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200/80">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setSubTab('profiles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'profiles'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Verification Profiles</span>
          </button>

          <button
            onClick={() => setSubTab('checks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'checks'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>2. Verification Checks</span>
          </button>

          <button
            onClick={() => setSubTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'rules'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Verification Rules</span>
          </button>
        </div>
      </div>

      {/* 1. VERIFICATION PROFILES SUB-TAB */}
      {subTab === 'profiles' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {verificationProfiles.map(prof => {
              const isSelected = selProfId === prof.id || activeProfile?.id === prof.id;

              return (
                <div
                  key={prof.id}
                  onClick={() => setSelProfId(prof.id)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer space-y-2.5 flex flex-col justify-between shadow-2xs ${
                    isSelected
                      ? 'bg-white border-2 border-purple-500 ring-2 ring-purple-500/10'
                      : 'bg-white border border-slate-200/90 hover:border-purple-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                        {prof.verification_level}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{prof.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{prof.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VERIFICATION CHECKS SUB-TAB */}
      {subTab === 'checks' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Standard Verification Checks Matrix</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {CHECKS_LIST.map(item => (
              <div key={item.key} className="p-3 rounded-xl bg-slate-50 border space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">{item.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {item.level}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VERIFICATION RULES SUB-TAB */}
      {subTab === 'rules' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Configured Verification Enforcement Rules</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <span className="font-extrabold text-purple-950 block">1. Mandatory vs Optional Rules</span>
              <p className="text-[11px] text-purple-900">Government ID and Selfie match are non-negotiable mandatory checks prior to companion listing.</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <span className="font-extrabold text-indigo-950 block">2. Document Expiry & Re-Verification</span>
              <p className="text-[11px] text-indigo-900">Government IDs re-evaluated every 365 days. Police clearance re-verified every 180 days.</p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
              <span className="font-extrabold text-rose-950 block">3. Failure Handling & Rejection</span>
              <p className="text-[11px] text-rose-900">3 failed facial match attempts locks account and routes to manual admin review queue.</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="font-extrabold text-amber-950 block">4. Manual Supervisor Review</span>
              <p className="text-[11px] text-amber-900">Unclear documents flagged for human review by compliance officer within 2 hours.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
