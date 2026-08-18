'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CompanionEligibilityEvaluator } from '@/lib/serviceHubEngines';
import { UserCheck, CheckCircle2, AlertTriangle, ShieldAlert, Download } from 'lucide-react';

export function EligibilityTab() {
  const { eligibilityProfiles } = useServiceHubStore();
  const [selectedProfileId, setSelectedProfileId] = useState(eligibilityProfiles[0]?.id || '');
  const profile = eligibilityProfiles.find(p => p.id === selectedProfileId) || eligibilityProfiles[0];

  // Companion Simulator State
  const [compAge, setCompAge] = useState(24);
  const [compRating, setCompRating] = useState(4.8);
  const [hasGovtId, setHasGovtId] = useState(true);
  const [hasSelfie, setHasSelfie] = useState(true);
  const [hasEmergency, setHasEmergency] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);

  const result = profile ? CompanionEligibilityEvaluator.evaluate({
    id: 'companion-demo-101',
    age: compAge,
    ratingAvg: compRating,
    completedBookings: 12,
    isSuspended,
    documents: {
      GOVERNMENT_ID: hasGovtId,
      SELFIE_LIVE: hasSelfie,
      EMERGENCY_CONTACT: hasEmergency
    }
  }, profile) : null;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(eligibilityProfiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `eligibility_profiles_${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Profile Selector */}
      {eligibilityProfiles.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {eligibilityProfiles.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                selectedProfileId === p.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Criteria */}
        {profile && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h4 className="font-extrabold text-white text-base">{profile.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{profile.description}</p>
              </div>

              {/* Key Criteria */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Age Range</span>
                  <span className="font-bold text-white block">{profile.minimum_age}–{profile.maximum_age} yrs</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Min Rating</span>
                  <span className="font-bold text-amber-400 block">{profile.minimum_rating} ★</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase">Required Docs</span>
                  <span className="font-bold text-indigo-400 block">{profile.required_documents.length} Items</span>
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Documents</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.required_documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-medium text-slate-300">{doc.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Evaluator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl sticky top-4">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" /> Companion Qualification Evaluator
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Age: <span className="text-white font-mono">{compAge} years</span></label>
              <input type="range" min={17} max={45} value={compAge} onChange={e => setCompAge(Number(e.target.value))} className="w-full accent-indigo-600 h-1.5 rounded-full" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>17</span><span>45</span></div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Rating: <span className="text-white font-mono">{compRating.toFixed(1)} ★</span></label>
              <input type="range" min={3.0} max={5.0} step={0.1} value={compRating} onChange={e => setCompRating(Number(e.target.value))} className="w-full accent-amber-500 h-1.5 rounded-full" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>3.0</span><span>5.0</span></div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Govt ID Verified', val: hasGovtId, set: setHasGovtId, color: 'accent-emerald-500' },
                { label: 'Live Selfie Verified', val: hasSelfie, set: setHasSelfie, color: 'accent-emerald-500' },
                { label: 'Emergency Contact', val: hasEmergency, set: setHasEmergency, color: 'accent-emerald-500' },
                { label: 'Account Suspended', val: isSuspended, set: setIsSuspended, color: 'accent-rose-500', danger: true },
              ].map(({ label, val, set, color, danger }) => (
                <label key={label} className={`flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border transition-colors ${
                  danger && val ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}>
                  <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} className={`${color} w-4 h-4`} />
                  <span className={`font-bold ${danger ? 'text-rose-400' : 'text-white'}`}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Evaluation Result */}
          {result && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
              result.status === 'ELIGIBLE' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className={result.status === 'ELIGIBLE' ? 'text-emerald-300' : 'text-amber-300'}>
                  {result.status === 'ELIGIBLE' ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}
                </span>
                <span className={`px-2 py-0.5 rounded-full bg-slate-950 font-mono text-[10px] ${result.status === 'ELIGIBLE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.status}
                </span>
              </div>
              {result.missingRequirements.length > 0 && (
                <div className="text-rose-400 text-[11px] font-mono pt-1 border-t border-slate-800 space-y-1">
                  <p className="font-bold text-rose-300">Missing Requirements:</p>
                  {result.missingRequirements.map((m, i) => <p key={i} className="flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0" />{m}</p>)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
