'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RiskEngine } from '@/lib/serviceHubEngines';
import { Shield, ShieldAlert, AlertCircle, CheckCircle2, Search } from 'lucide-react';

const RISK_CARD_STYLES: Record<string, { card: string; badge: string; text: string; bgBadge: string }> = {
  LOW: {
    card: 'bg-emerald-50/40 border-emerald-200/80',
    badge: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    text: 'text-emerald-700',
    bgBadge: 'bg-emerald-100/60 text-emerald-900 border-emerald-200/60',
  },
  MEDIUM: {
    card: 'bg-amber-50/40 border-amber-200/80',
    badge: 'bg-amber-100/90 text-amber-800 border-amber-200',
    text: 'text-amber-700',
    bgBadge: 'bg-amber-100/60 text-amber-900 border-amber-200/60',
  },
  HIGH: {
    card: 'bg-rose-50/40 border-rose-200/80',
    badge: 'bg-rose-100/90 text-rose-800 border-rose-200',
    text: 'text-rose-700',
    bgBadge: 'bg-rose-100/60 text-rose-900 border-rose-200/60',
  },
  CRITICAL: {
    card: 'bg-purple-50/40 border-purple-200/80',
    badge: 'bg-purple-100/90 text-purple-800 border-purple-200',
    text: 'text-purple-700',
    bgBadge: 'bg-purple-100/60 text-purple-900 border-purple-200/60',
  },
};

export function RiskLevelsTab() {
  const { riskLevels, categories } = useServiceHubStore();
  const [simServiceRisk, setSimServiceRisk] = useState('MEDIUM');
  const [simDuration, setSimDuration] = useState(9);
  const [simNight, setSimNight] = useState(true);
  const [simCompVerified, setSimCompVerified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRiskLevels = useMemo(() =>
    riskLevels.filter(rk => !searchTerm || rk.name.toLowerCase().includes(searchTerm.toLowerCase()) || rk.description.toLowerCase().includes(searchTerm.toLowerCase())),
    [riskLevels, searchTerm]
  );

  const calc = RiskEngine.calculateRiskScore({
    serviceRiskCode: simServiceRisk,
    durationHours: simDuration,
    isNightTime: simNight,
    companionVerified: simCompVerified
  });

  const calcStyle = RISK_CARD_STYLES[calc.level] || RISK_CARD_STYLES.LOW;
  const requiresManualApproval = calc.level === 'CRITICAL' || calc.level === 'HIGH';
  const requiresLiveLocation = calc.level !== 'LOW';
  const verificationRequired = calc.level === 'CRITICAL' || calc.level === 'HIGH' ? 'Advanced KYC & Background Check' : 'Basic KYC';

  return (
    <div className="space-y-3 w-full">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search risk levels by name or description..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        
        {/* Left Column: Configured Risk Profiles */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Configured Risk Profiles <span className="text-slate-500 font-normal text-[10px]">({filteredRiskLevels.length})</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRiskLevels.map(rk => {
              const style = RISK_CARD_STYLES[rk.code] || RISK_CARD_STYLES.LOW;
              const linkedCats = categories.filter(c => c.default_risk_level_id === rk.id);

              return (
                <div key={rk.id} className={`p-3.5 rounded-2xl border shadow-2xs hover:shadow-xs transition-all space-y-2.5 ${style.card}`}>
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-slate-900 text-xs">{rk.name}</h5>
                    <span className={`px-2 py-0.2 rounded-lg text-[10px] font-extrabold border ${style.badge}`}>
                      {rk.code}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-600 font-medium leading-tight">{rk.description}</p>

                  {/* Details Row */}
                  <div className="text-[10px] font-semibold text-slate-600 flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/60">
                    <span>Verif: <strong className={style.text}>{rk.verification_level}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span>Approval: <strong className={rk.manual_approval_required ? 'text-rose-700' : 'text-emerald-700'}>{rk.manual_approval_required ? 'Required' : 'Auto'}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span>Max: <strong className={style.text}>{rk.maximum_booking_duration}h</strong></span>
                  </div>

                  {/* Category Pills */}
                  {linkedCats.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {linkedCats.slice(0, 4).map(c => (
                        <span key={c.id} className={`px-2 py-0.2 rounded text-[9px] font-semibold border ${style.bgBadge}`}>
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Risk Engine Simulator */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" /> Dynamic Risk Matrix Engine
          </h4>

          <div className="space-y-2.5 text-[11px]">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Service Risk Level</label>
              <select
                value={simServiceRisk}
                onChange={e => setSimServiceRisk(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-xl p-1.5 text-[11px] font-bold text-slate-900 outline-none focus:border-purple-500 shadow-2xs"
              >
                <option value="LOW">LOW — Public Errands</option>
                <option value="MEDIUM">MEDIUM — Social Events & Travel</option>
                <option value="HIGH">HIGH — Private / Elderly Care</option>
                <option value="CRITICAL">CRITICAL — High Risk Night Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Duration: <span className="text-slate-900 font-mono font-bold">{simDuration} hours</span>
              </label>
              <input
                type="range"
                min={1}
                max={14}
                value={simDuration}
                onChange={e => setSimDuration(Number(e.target.value))}
                className="w-full accent-purple-600 h-1 rounded-full bg-slate-200"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 font-medium"><span>1h</span><span>14h</span></div>
            </div>

            <div className="space-y-1.5 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simNight}
                  onChange={e => setSimNight(e.target.checked)}
                  className="accent-purple-600 w-3.5 h-3.5 rounded"
                />
                <span className="text-slate-700 font-bold text-[11px]">Night Time Booking (10 PM - 6 AM)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simCompVerified}
                  onChange={e => setSimCompVerified(e.target.checked)}
                  className="accent-purple-600 w-3.5 h-3.5 rounded"
                />
                <span className="text-slate-700 font-bold text-[11px]">Companion Fully Verified (Police + KYC)</span>
              </label>
            </div>
          </div>

          {/* Calculator Output */}
          <div className={`p-3 rounded-xl border space-y-2 transition-all ${calcStyle.card}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">SCORE RESULT</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold border ${calcStyle.badge}`}>
                {calc.level}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-mono text-slate-900">{calc.score}</span>
              <span className="text-[10px] text-slate-500 font-medium">/ 100 Risk Score</span>
            </div>

            <div className="space-y-1 text-[10px] border-t border-slate-200/60 pt-2 font-medium">
              <p className="flex justify-between"><span>Require Verification:</span> <strong className={calcStyle.text}>{verificationRequired}</strong></p>
              <p className="flex justify-between"><span>Manual Admin Review:</span> <strong className={requiresManualApproval ? 'text-rose-700' : 'text-emerald-700'}>{requiresManualApproval ? 'Required' : 'Auto'}</strong></p>
              <p className="flex justify-between"><span>Live Tracking:</span> <strong className={requiresLiveLocation ? 'text-rose-700' : 'text-slate-700'}>{requiresLiveLocation ? 'Mandatory' : 'Optional'}</strong></p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
