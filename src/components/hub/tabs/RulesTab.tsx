'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RulesEngine } from '@/lib/serviceHubEngines';
import { Sliders, Plus, AlertCircle, CheckCircle2, Play } from 'lucide-react';

export function RulesTab() {
  const { rulesProfiles } = useServiceHubStore();

  const [testDuration, setTestDuration] = useState(10);
  const [testLiveLocation, setTestLiveLocation] = useState(false);

  const activeProfile = rulesProfiles[0];
  const eval1 = activeProfile?.rules[0] ? RulesEngine.evaluateRule(activeProfile.rules[0], { duration_hours: testDuration }) : null;
  const eval2 = activeProfile?.rules[1] ? RulesEngine.evaluateRule(activeProfile.rules[1], { live_location_enabled: testLiveLocation }) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> Module 4: Dynamic Operational Rules Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rules define IF-THEN conditional logic evaluated dynamically during booking validation without controller hardcoding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Profiles List */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-white text-sm">Active Rule Sets ({activeProfile?.rules.length || 0} Rules)</h4>
          <div className="space-y-3">
            {activeProfile?.rules.map(rule => (
              <div key={rule.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">{rule.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                    {rule.rule_type}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rule.description}</p>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 flex items-center gap-2">
                  <span className="text-amber-400 font-bold">IF</span>
                  <span>{rule.condition} {rule.operator} {String(rule.value)}</span>
                  <span className="text-emerald-400 font-bold">THEN</span>
                  <span className="text-rose-400 font-bold">{rule.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Rule Evaluator Tester */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Play className="w-4 h-4 text-indigo-400" /> Dynamic Rule Evaluator Simulator
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Simulated Duration ({testDuration} hours)</label>
              <input
                type="range"
                min={1}
                max={15}
                value={testDuration}
                onChange={(e) => setTestDuration(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="ll"
                checked={testLiveLocation}
                onChange={(e) => setTestLiveLocation(e.target.checked)}
                className="accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="ll" className="text-white font-bold cursor-pointer">Live GPS Stream Enabled</label>
            </div>
          </div>

          {/* Evaluation Results */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Evaluation Results:</p>
            {eval1?.triggers && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {eval1.message}
              </div>
            )}
            {eval2?.triggers && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {eval2.message}
              </div>
            )}
            {!eval1?.triggers && !eval2?.triggers && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> All operational rules satisfied! No block or approval required.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
