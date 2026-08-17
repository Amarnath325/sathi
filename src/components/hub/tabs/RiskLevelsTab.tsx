'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RiskEngine } from '@/lib/serviceHubEngines';
import { ShieldAlert, Play, AlertTriangle } from 'lucide-react';

export function RiskLevelsTab() {
  const { riskLevels } = useServiceHubStore();

  const [simServiceRisk, setSimServiceRisk] = useState('MEDIUM');
  const [simDuration, setSimDuration] = useState(9);
  const [simNight, setSimNight] = useState(true);
  const [simCompVerified, setSimCompVerified] = useState(false);

  const calc = RiskEngine.calculateRiskScore({
    serviceRiskCode: simServiceRisk,
    durationHours: simDuration,
    isNightTime: simNight,
    companionVerified: simCompVerified
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Module 6: Risk Levels & Multi-factor Score Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal numerical scores are automatically evaluated and converted into LOW, MEDIUM, HIGH, or CRITICAL levels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Profiles Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-white text-sm">Configured Risk Profiles ({riskLevels.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {riskLevels.map(rk => (
              <div key={rk.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-white text-sm">{rk.name}</h5>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    rk.code === 'LOW' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    rk.code === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    rk.code === 'HIGH' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                    'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  }`}>
                    {rk.code} (Score &lt; {rk.score * 2})
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rk.description}</p>
                <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div>Verification: {rk.verification_level}</div>
                  <div>Manual Approval: {rk.manual_approval_required ? 'Required' : 'Auto'}</div>
                  <div>Max Duration: {rk.maximum_booking_duration} hours</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Risk Calculator Simulator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Play className="w-4 h-4 text-indigo-400" /> Multi-Factor Risk Score Simulator
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Base Service Risk</label>
              <select
                value={simServiceRisk}
                onChange={(e) => setSimServiceRisk(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Duration ({simDuration} hours)</label>
              <input
                type="range"
                min={1}
                max={14}
                value={simDuration}
                onChange={(e) => setSimDuration(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simNight}
                  onChange={(e) => setSimNight(e.target.checked)}
                  className="accent-indigo-600"
                />
                <span className="text-white font-bold">Late Night Session</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simCompVerified}
                  onChange={(e) => setSimCompVerified(e.target.checked)}
                  className="accent-indigo-600"
                />
                <span className="text-white font-bold">Companion Background Verified</span>
              </label>
            </div>
          </div>

          {/* Result Output */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Calculated Score:</span>
              <span className="font-bold text-white">{calc.score} Points</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Evaluated Level:</span>
              <span className={`font-extrabold ${
                calc.level === 'LOW' ? 'text-emerald-400' :
                calc.level === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
              }`}>{calc.level}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
