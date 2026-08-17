'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { UserCheck, CheckCircle2, XCircle } from 'lucide-react';

export function VerificationTab() {
  const { verificationProfiles } = useServiceHubStore();

  const [selProfId, setSelProfId] = useState(verificationProfiles[0]?.id || '');
  const activeProfile = verificationProfiles.find(v => v.id === selProfId) || verificationProfiles[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" /> Module 7: Reusable Verification Profiles Suite
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Profiles define mandatory credential checks before allowing companions to provide specific services.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {verificationProfiles.map(prof => (
          <div
            key={prof.id}
            onClick={() => setSelProfId(prof.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              selProfId === prof.id ? 'bg-slate-900 border-indigo-500 shadow-xl' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-white text-sm">{prof.name}</h4>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                {prof.verification_level}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">{prof.description}</p>
          </div>
        ))}
      </div>

      {/* Selected Profile Detailed Matrix */}
      {activeProfile && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="font-extrabold text-white text-base flex items-center gap-2">
            Credential Matrix: <span className="text-indigo-400">{activeProfile.name}</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {Object.entries(activeProfile.requirements).map(([reqKey, isReq]) => (
              <div
                key={reqKey}
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isReq ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-bold capitalize">{reqKey.replace(/_/g, ' ')}</span>
                {isReq ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-600" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
