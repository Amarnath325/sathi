'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RulesEngine } from '@/lib/serviceHubEngines';
import { Sliders, Plus, AlertCircle, CheckCircle2, Play, Search } from 'lucide-react';

export function RulesTab() {
  const { rulesProfiles } = useServiceHubStore();

  const [testDuration, setTestDuration] = useState(10);
  const [testLiveLocation, setTestLiveLocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeProfile = rulesProfiles[0];
  const filteredRules = (activeProfile?.rules || []).filter(rule =>
    !searchTerm || rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eval1 = activeProfile?.rules[0] ? RulesEngine.evaluateRule(activeProfile.rules[0], { duration_hours: testDuration }) : null;
  const eval2 = activeProfile?.rules[1] ? RulesEngine.evaluateRule(activeProfile.rules[1], { live_location_enabled: testLiveLocation }) : null;

  const RULE_TYPE_COLORS: Record<string, string> = {
    MAX_DURATION:    'bg-amber-500/10 border-amber-500/30 text-amber-400',
    LOCATION:        'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    GPS_REQUIRED:    'bg-rose-500/10 border-rose-500/30 text-rose-400',
    BOOKING_WINDOW:  'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" /> Module 4: Dynamic Operational Rules Engine
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">{activeProfile?.rules.length || 0} Rules</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Rules use IF-THEN logic evaluated in real-time during booking validation — no controller hardcoding.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search rules by name or description..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-bold text-white text-sm">
            Active Rule Sets <span className="text-slate-400 font-normal text-xs">({filteredRules.length} shown)</span>
          </h4>

          {filteredRules.length > 0 ? filteredRules.map(rule => (
            <div key={rule.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">{rule.name}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${RULE_TYPE_COLORS[rule.rule_type] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {rule.rule_type}
                </span>
              </div>
              <p className="text-xs text-slate-400">{rule.description}</p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex flex-wrap items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">IF</span>
                <span className="text-slate-300">{rule.condition} {rule.operator} {String(rule.value)}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">THEN</span>
                <span className="text-rose-400 font-bold">{rule.action}</span>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
              No rules match your search.
            </div>
          )}
        </div>

        {/* Live Evaluator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 h-fit shadow-2xl sticky top-4">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Play className="w-4 h-4 text-indigo-400" /> Rule Evaluator Simulator
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Duration: <span className="text-white font-mono">{testDuration} hours</span></label>
              <input type="range" min={1} max={15} value={testDuration} onChange={e => setTestDuration(Number(e.target.value))} className="w-full accent-indigo-600 h-1.5 rounded-full" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>1h</span><span>15h</span></div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <input type="checkbox" id="ll" checked={testLiveLocation} onChange={e => setTestLiveLocation(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
              <span className="text-white font-bold">Live GPS Stream Enabled</span>
            </label>
          </div>

          {/* Results */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluation Results:</p>
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
                <CheckCircle2 className="w-4 h-4" /> All rules satisfied — no blocks required.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
