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
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search verification profiles..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
        />
      </div>

      {/* Top 4 Profile Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProfiles.map(prof => {
          const isSelected = selProfId === prof.id;

          return (
            <div
              key={prof.id}
              onClick={() => setSelProfId(prof.id)}
              className={`p-5 rounded-2xl transition-all cursor-pointer space-y-3 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-2 border-purple-500 shadow-md'
                  : 'bg-white border border-slate-200/90 shadow-xs hover:border-purple-300'
              }`}
            >
              <div className="space-y-2.5">
                {/* Selected Top Row Badges */}
                <div className="flex items-center justify-between min-h-[22px]">
                  {isSelected ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                      Selected Profile
                    </span>
                  ) : (
                    <div></div>
                  )}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 text-base leading-snug">{prof.name}</h4>

                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold inline-block">
                    {prof.verification_level}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{prof.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Credential Matrix Section */}
      {activeProfile && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-slate-900 text-base">
              Credential Matrix: <span className="text-slate-900">{activeProfile.name}</span>
            </h4>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 flex items-center justify-center"></span>
              <span className="text-emerald-600 font-extrabold">{totalReqCount} / {totalCredCount}</span>
              <span className="text-slate-500 font-medium">Required</span>
            </div>
          </div>

          {/* Section 1: Required Credentials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-emerald-700 font-extrabold">Required</span>
              <span className="text-slate-400 font-normal">{requiredCredentials.length} credentials • Must be verified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {requiredCredentials.map(([reqKey]) => (
                <div
                  key={reqKey}
                  className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-3 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs leading-tight">
                      {CREDENTIAL_LABELS[reqKey] || reqKey.replace(/_/g, ' ')}
                    </h5>
                    <span className="text-[9px] font-extrabold text-emerald-700 tracking-wider">REQUIRED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2"></div>

          {/* Section 2: Optional Credentials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-extrabold">
                ✕
              </div>
              <span className="text-slate-600 font-bold">Optional</span>
              <span className="text-slate-400 font-normal">{optionalCredentials.length} credentials • Not required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {optionalCredentials.map(([reqKey]) => (
                <div
                  key={reqKey}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 shadow-2xs opacity-80"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 text-xs font-extrabold">
                    ✕
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs leading-tight">
                      {CREDENTIAL_LABELS[reqKey] || reqKey.replace(/_/g, ' ')}
                    </h5>
                    <span className="text-[9px] font-extrabold text-slate-400 tracking-wider">OPTIONAL</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
