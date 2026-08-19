'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { UserCheck, CheckCircle2, XCircle, Search, Check } from 'lucide-react';

const CREDENTIAL_LABELS: Record<string, string> = {
  email: 'Email',
  mobile: 'Mobile',
  government_id: 'Government Id',
  selfie: 'Selfie',
  emergency_contact: 'Emergency Contact',
  face_match: 'Face Match',
  address: 'Address',
  background_check: 'Background Check',
  additional_document: 'Additional Document',
  manual_review: 'Manual Review',
};

export function VerificationTab() {
  const { verificationProfiles } = useServiceHubStore();
  const [selProfId, setSelProfId] = useState(verificationProfiles[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = useMemo(() =>
    verificationProfiles.filter(v => !searchTerm || v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.description.toLowerCase().includes(searchTerm.toLowerCase())),
    [verificationProfiles, searchTerm]
  );

  const activeProfile = verificationProfiles.find(v => v.id === selProfId) || verificationProfiles[0];

  const requiredCredentials = useMemo(() => {
    if (!activeProfile) return [];
    return Object.entries(activeProfile.requirements).filter(([_, isReq]) => isReq);
  }, [activeProfile]);

  const optionalCredentials = useMemo(() => {
    if (!activeProfile) return [];
    return Object.entries(activeProfile.requirements).filter(([_, isReq]) => !isReq);
  }, [activeProfile]);

  const totalReqCount = requiredCredentials.length;
  const totalCredCount = Object.keys(activeProfile?.requirements || {}).length;

  return (
    <div className="space-y-3 w-full">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search verification profiles..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
        />
      </div>

      {/* Top Profile Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredProfiles.map(prof => {
          const isSelected = selProfId === prof.id;

          return (
            <div
              key={prof.id}
              onClick={() => setSelProfId(prof.id)}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer space-y-2.5 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-2 border-purple-500 shadow-2xs ring-1 ring-purple-500/20'
                  : 'bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300'
              }`}
            >
              <div className="space-y-2">
                {/* Selected Top Row Badges */}
                <div className="flex items-center justify-between min-h-[18px]">
                  {isSelected ? (
                    <span className="px-2 py-0.2 rounded bg-purple-100 text-purple-700 text-[9px] font-bold">
                      Selected Profile
                    </span>
                  ) : (
                    <div></div>
                  )}
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 text-xs leading-snug">{prof.name}</h4>

                <div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold inline-block">
                    {prof.verification_level}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{prof.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Inspector Box */}
      {activeProfile && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">{activeProfile.name} Requirements Checklist</h4>
              <p className="text-[10px] text-slate-500 font-medium">
                Mandatory checks before companion onboarding: <strong className="text-purple-700 font-mono">{totalReqCount}/{totalCredCount} Mandatory</strong>
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
              Level: {activeProfile.verification_level}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-[11px]">
            {Object.entries(activeProfile.requirements).map(([key, isRequired]) => {
              const label = CREDENTIAL_LABELS[key] || key;
              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isRequired
                      ? 'bg-emerald-50/50 border-emerald-200/90 text-emerald-950'
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-400'
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  {isRequired ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
