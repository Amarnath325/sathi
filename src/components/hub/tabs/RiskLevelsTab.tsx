'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RiskEngine } from '@/lib/serviceHubEngines';
import { ShieldAlert, Play, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

const RISK_STYLES: Record<string, { card: string; badge: string; score: string }> = {
  LOW:      { card: 'border-emerald-500/30 bg-emerald-500/5', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', score: 'text-emerald-400' },
  MEDIUM:   { card: 'border-amber-500/30 bg-amber-500/5', badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400', score: 'text-amber-400' },
  HIGH:     { card: 'border-rose-500/30 bg-rose-500/5', badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400', score: 'text-rose-400' },
  CRITICAL: { card: 'border-purple-500/30 bg-purple-500/5', badge: 'bg-purple-500/10 border-purple-500/30 text-purple-400', score: 'text-purple-400' },
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

  const calcStyle = RISK_STYLES[calc.level] || RISK_STYLES.LOW;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search risk profiles..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Profiles */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-bold text-white text-sm">Configured Risk Profiles <span className="text-slate-400 font-normal text-xs">({filteredRiskLevels.length})</span></h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRiskLevels.map(rk => {
              const style = RISK_STYLES[rk.code] || RISK_STYLES.LOW;
              const linkedCats = categories.filter(c => c.default_risk_level_id === rk.id);
              return (
                <div key={rk.id} className={`p-4 rounded-2xl border transition-all space-y-3 ${style.card}`}>
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-white text-sm">{rk.name}</h5>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${style.badge}`}>
                      {rk.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{rk.description}</p>
                  <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Verification:</span>
                      <span className="font-bold text-white">{rk.verification_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Manual Approval:</span>
                      <span className={`font-bold ${rk.manual_approval_required ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {rk.manual_approval_required ? 'Required' : 'Auto-Publish'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Duration:</span>
                      <span className="font-bold text-white">{rk.maximum_booking_duration}h</span>
                    </div>
                  </div>
                  {linkedCats.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {linkedCats.slice(0, 3).map(c => (
                        <span key={c.id} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">{c.name}</span>
                      ))}
                      {linkedCats.length > 3 && <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">+{linkedCats.length - 3} more</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Simulator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl sticky top-4">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Play className="w-4 h-4 text-indigo-400" /> Risk Score Simulator
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Base Service Risk</label>
              <select value={simServiceRisk} onChange={e => setSimServiceRisk(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-indigo-500">
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Duration: <span className="text-white font-mono">{simDuration} hours</span></label>
              <input type="range" min={1} max={14} value={simDuration} onChange={e => setSimDuration(Number(e.target.value))} className="w-full accent-indigo-600 h-1.5 rounded-full" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                <input type="checkbox" checked={simNight} onChange={e => setSimNight(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
                <span className="text-white font-bold">Late Night Session</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                <input type="checkbox" checked={simCompVerified} onChange={e => setSimCompVerified(e.target.checked)} className="accent-emerald-600 w-4 h-4" />
                <span className="text-white font-bold">Companion Background Verified</span>
              </label>
            </div>
          </div>

          {/* Result */}
          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${calcStyle.card}`}>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Calculated Score:</span>
              <span className="font-bold text-white">{calc.score} Points</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Risk Level:</span>
              <span className={`font-extrabold text-sm ${calcStyle.score}`}>{calc.level}</span>
            </div>
            <div className={`pt-2 text-center text-[11px] font-bold border-t border-slate-800 ${calcStyle.score}`}>
              {calc.level === 'LOW' && '✅ Standard booking flow applies'}
              {calc.level === 'MEDIUM' && '⚠️ GPS tracking required'}
              {calc.level === 'HIGH' && '🔴 Enhanced verification required'}
              {calc.level === 'CRITICAL' && '🚨 Manual admin approval required'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
