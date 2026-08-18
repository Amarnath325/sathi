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

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Configured Risk Profiles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Configured Risk Profiles <span className="text-slate-500 font-normal text-xs">({filteredRiskLevels.length})</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRiskLevels.map(rk => {
              const style = RISK_CARD_STYLES[rk.code] || RISK_CARD_STYLES.LOW;
              const linkedCats = categories.filter(c => c.default_risk_level_id === rk.id);

              return (
                <div key={rk.id} className={`p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all space-y-3.5 ${style.card}`}>
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-slate-900 text-base">{rk.name}</h5>
                    <span className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${style.badge}`}>
                      {rk.code}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{rk.description}</p>

                  {/* Single Line Details Row */}
                  <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/60">
                    <span>Verification: <span className={`font-bold ${style.text}`}>{rk.verification_level}</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Manual Approval: <span className={`font-bold ${rk.manual_approval_required ? 'text-rose-700' : 'text-emerald-700'}`}>{rk.manual_approval_required ? 'Required' : 'Auto-Publish'}</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Max Duration: <span className={`font-bold ${style.text}`}>{rk.maximum_booking_duration}h</span></span>
                  </div>

                  {/* Category Pills */}
                  {linkedCats.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {linkedCats.slice(0, 4).map(c => (
                        <span key={c.id} className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${style.bgBadge}`}>
                          {c.name}
                        </span>
                      ))}
                      {linkedCats.length > 4 && (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${style.bgBadge}`}>
                          +{linkedCats.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Risk Simulator & Search */}
        <div className="space-y-4">
          {/* Search Box on top right */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search risk profiles..."
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
            />
          </div>

          {/* Simulator Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-md sticky top-4">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600 fill-purple-100" /> Risk Score Simulator
            </h4>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Base Service Risk</label>
                <select
                  value={simServiceRisk}
                  onChange={e => setSimServiceRisk(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-amber-700 font-extrabold text-xs outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Duration</label>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={simDuration}
                  onChange={e => setSimDuration(Number(e.target.value))}
                  className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200"
                />
                <span className="block text-xs font-bold text-blue-600 mt-1">{simDuration} hours</span>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={simNight}
                    onChange={e => setSimNight(e.target.checked)}
                    className="accent-purple-600 w-4 h-4 rounded"
                  />
                  <span className="text-slate-700 font-bold">Late Night Session</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={simCompVerified}
                    onChange={e => setSimCompVerified(e.target.checked)}
                    className="accent-purple-600 w-4 h-4 rounded"
                  />
                  <span className="text-slate-700 font-bold">Companion Background Verified</span>
                </label>
              </div>
            </div>

            {/* Calculated Result Output */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Calculated Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-purple-700">{calc.score}</span>
                  <span className="text-xs font-semibold text-slate-500">Points</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Risk Level</span>
                <span className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold inline-block border ${calcStyle.badge}`}>
                  {calc.level}
                </span>
              </div>

              {/* Status Alert Banner */}
              <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0">!</span>
                <span>
                  {calc.level === 'LOW' && 'Standard booking flow applies'}
                  {calc.level === 'MEDIUM' && 'GPS tracking required'}
                  {calc.level === 'HIGH' && 'Enhanced verification required'}
                  {calc.level === 'CRITICAL' && 'Manual admin approval required'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
