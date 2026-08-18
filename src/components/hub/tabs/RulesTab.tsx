'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RulesEngine } from '@/lib/serviceHubEngines';
import { Sliders, Plus, AlertCircle, AlertTriangle, CheckCircle2, Play, Search, Calendar, MapPin, Shield } from 'lucide-react';

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

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search rules by name or description..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Active Rule Sets <span className="text-slate-500 font-normal text-xs">({filteredRules.length} shown)</span>
            </h4>
          </div>

          {filteredRules.length > 0 ? filteredRules.map(rule => {
            const isDuration = rule.rule_type === 'Duration Rule' || rule.name.toLowerCase().includes('duration');
            const isLocation = rule.rule_type === 'Location Rule' || rule.name.toLowerCase().includes('location') || rule.name.toLowerCase().includes('gps');

            return (
              <div key={rule.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                      {isDuration ? (
                        <Calendar className="w-5 h-5 text-purple-600" />
                      ) : isLocation ? (
                        <MapPin className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Shield className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm leading-snug">{rule.name}</h5>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{rule.description}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold shrink-0">
                    {isDuration ? 'Duration Rule' : isLocation ? 'Location Rule' : rule.rule_type}
                  </span>
                </div>

                {/* IF ... THEN ... logic box */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 font-mono text-xs text-slate-800 tracking-wide">
                  <span className="font-bold text-slate-900">IF </span>
                  <span className="font-bold text-slate-800">{rule.condition} </span>
                  <span className="font-bold text-slate-800">{rule.operator} </span>
                  <span className="font-bold text-slate-900">{String(rule.value)} </span>
                  <span className="font-bold text-slate-900">THEN </span>
                  <span className="font-extrabold text-rose-600 tracking-wider">{rule.action}</span>
                </div>
              </div>
            );
          }) : (
            <div className="p-8 text-center text-slate-500 text-xs bg-white border border-slate-200/90 rounded-2xl shadow-xs">
              No rules match your search.
            </div>
          )}
        </div>

        {/* Live Evaluator Simulator */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 h-fit shadow-md sticky top-4">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </span>
            Rule Evaluator Simulator
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Duration: <span className="text-blue-600 font-bold font-mono">{testDuration} hours</span>
              </label>
              <input
                type="range"
                min={1}
                max={15}
                value={testDuration}
                onChange={e => setTestDuration(Number(e.target.value))}
                className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium"><span>1h</span><span>15h</span></div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                id="ll"
                checked={testLiveLocation}
                onChange={e => setTestLiveLocation(e.target.checked)}
                className="accent-purple-600 w-4 h-4 rounded"
              />
              <span className="text-slate-700 font-bold">Live GPS Stream Enabled</span>
            </label>
          </div>

          {/* Evaluation Results Section */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EVALUATION RESULTS</p>

            {eval1?.triggers && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-extrabold text-amber-950 text-xs">Rule Triggered [Duration Max Threshold]</h6>
                  <p className="text-amber-800 text-[11px] mt-0.5 font-medium leading-tight">
                    Bookings longer than 8 hours require explicit admin approval <span className="font-bold text-amber-900">(MEDIUM)</span>
                  </p>
                </div>
              </div>
            )}

            {eval2?.triggers && (
              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/90 flex items-start gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-extrabold text-rose-950 text-xs">Rule Triggered [Live Location Permission Required]</h6>
                  <p className="text-rose-800 text-[11px] mt-0.5 font-medium leading-tight">
                    Mandatory live GPS streaming during offline sessions <span className="font-bold text-rose-900">(HIGH)</span>
                  </p>
                </div>
              </div>
            )}

            {!eval1?.triggers && !eval2?.triggers && (
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex items-center gap-2.5 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>All rules satisfied — no blocks required.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
