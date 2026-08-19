'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CompanionEligibilityEvaluator } from '@/lib/serviceHubEngines';
import { UserCheck, CheckCircle2, AlertTriangle, Star, Shield, FileCheck, Check, X } from 'lucide-react';

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

  return (
    <div className="space-y-3 w-full">
      {/* Profile Selector */}
      {eligibilityProfiles.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar w-full">
          {eligibilityProfiles.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 border ${
                selectedProfileId === p.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        
        {/* Left Column: Profile Criteria */}
        {profile && (
          <div className="lg:col-span-2 space-y-3">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{profile.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{profile.description}</p>
              </div>

              {/* Key Criteria Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Age Range */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-full border border-purple-400 text-purple-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">AGE RANGE</span>
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {profile.minimum_age}–{profile.maximum_age} yrs
                    </span>
                  </div>
                </div>

                {/* Min Rating */}
                <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-full border border-amber-400 text-amber-600 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">MIN RATING</span>
                    <span className="text-sm font-extrabold text-amber-700 block">
                      {profile.minimum_rating} ★
                    </span>
                  </div>
                </div>

                {/* Required Documents Count */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-8 h-8 rounded-full border border-indigo-400 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-500 tracking-wider uppercase block">REQUIRED DOCS</span>
                    <span className="text-sm font-extrabold text-indigo-700 block">
                      {profile.required_documents.length} Docs Required
                    </span>
                  </div>
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <h5 className="font-extrabold text-slate-900 text-xs">Mandatory Onboarding Document Checklist</h5>
                <div className="flex flex-wrap gap-1.5">
                  {profile.required_documents.map(doc => (
                    <span key={doc} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-800 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> {doc.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Companion Evaluator Simulator Column */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-purple-600" /> Companion Live Evaluator
          </h4>

          <div className="space-y-2.5 text-[11px]">
            <div>
              <label className="block text-slate-700 font-bold mb-0.5">Companion Age: <strong className="text-slate-900">{compAge} yrs</strong></label>
              <input type="range" min={16} max={80} value={compAge} onChange={e => setCompAge(Number(e.target.value))} className="w-full accent-purple-600 h-1 bg-slate-200 rounded-full" />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-0.5">Rating: <strong className="text-amber-700">{compRating} ★</strong></label>
              <input type="range" min={1.0} max={5.0} step={0.1} value={compRating} onChange={e => setCompRating(Number(e.target.value))} className="w-full accent-purple-600 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="space-y-1 pt-1 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input type="checkbox" checked={hasGovtId} onChange={e => setHasGovtId(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                Verified Government ID
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input type="checkbox" checked={hasSelfie} onChange={e => setHasSelfie(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                Verified Live Selfie
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input type="checkbox" checked={hasEmergency} onChange={e => setHasEmergency(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                Emergency Contact Added
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-700">
                <input type="checkbox" checked={isSuspended} onChange={e => setIsSuspended(e.target.checked)} className="accent-rose-600 w-3.5 h-3.5 rounded" />
                Account Suspended
              </label>
            </div>
          </div>

          {/* Evaluator Output */}
          {result && (
            <div className={`p-3 rounded-xl border space-y-1.5 font-mono text-[11px] ${
              result.status === 'ELIGIBLE' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center justify-between font-sans">
                <span className="text-[10px] font-bold uppercase text-slate-500">EVALUATION RESULT</span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold ${
                  result.status === 'ELIGIBLE' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {result.status}
                </span>
              </div>
              {result.missingRequirements.length > 0 ? (
                <div className="space-y-0.5 text-[10px] text-rose-800 font-sans">
                  <strong>Missing Requirements:</strong>
                  {result.missingRequirements.map((m, i) => <p key={i}>• {m}</p>)}
                </div>
              ) : (
                <p className="text-[10px] font-sans text-emerald-800 font-bold">Passed all eligibility criteria!</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
