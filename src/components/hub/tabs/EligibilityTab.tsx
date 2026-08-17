'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CompanionEligibilityEvaluator } from '@/lib/serviceHubEngines';
import { UserCheck, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export function EligibilityTab() {
  const { eligibilityProfiles } = useServiceHubStore();
  const profile = eligibilityProfiles[0];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" /> Module 10: Companion Service Eligibility Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated eligibility evaluation before companions can accept service bookings. Checks age, ratings, documents, and suspension status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Criteria */}
        {profile && (
          <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-extrabold text-white text-base">{profile.name}</h4>
            <p className="text-xs text-slate-400">{profile.description}</p>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>Age Bounds: {profile.minimum_age} - {profile.maximum_age} yrs</div>
              <div>Min Rating: {profile.minimum_rating} ★</div>
              <div>Required Docs: {profile.required_documents.length} Items</div>
            </div>
          </div>
        )}

        {/* Live Evaluator Simulator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" /> Companion Qualification Evaluator
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Companion Age ({compAge} years)</label>
              <input
                type="range"
                min={17}
                max={40}
                value={compAge}
                onChange={(e) => setCompAge(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Rating Average ({compRating} ★)</label>
              <input
                type="range"
                min={3.0}
                max={5.0}
                step={0.1}
                value={compRating}
                onChange={(e) => setCompRating(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasGovtId} onChange={(e) => setHasGovtId(e.target.checked)} className="accent-indigo-600" />
                <span className="text-white font-bold">Government ID Verified</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasSelfie} onChange={(e) => setHasSelfie(e.target.checked)} className="accent-indigo-600" />
                <span className="text-white font-bold">Live Selfie Verified</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasEmergency} onChange={(e) => setHasEmergency(e.target.checked)} className="accent-indigo-600" />
                <span className="text-white font-bold">Emergency Contact Verified</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isSuspended} onChange={(e) => setIsSuspended(e.target.checked)} className="accent-rose-500" />
                <span className="text-rose-400 font-bold">Account Suspended</span>
              </label>
            </div>
          </div>

          {/* Evaluation Result */}
          {result && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              result.status === 'ELIGIBLE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>Evaluation Result:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 font-mono text-[11px]">{result.status}</span>
              </div>
              {result.missingRequirements.length > 0 && (
                <div className="text-rose-400 text-[11px] font-mono">
                  <p className="font-bold">Missing Criteria:</p>
                  {result.missingRequirements.map((m, i) => <p key={i}>• {m}</p>)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
