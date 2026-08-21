'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RulesEngine } from '@/lib/serviceHubEngines';
import { Sliders, Plus, AlertCircle, AlertTriangle, CheckCircle2, Play, Search, Calendar, MapPin, Shield, X, Edit2, Layers, FileText, Activity } from 'lucide-react';
import { RuleItem } from '@/lib/types/serviceHub';

export function RulesTab() {
  const { rulesProfiles, addRuleToProfile, updateRuleInProfile } = useServiceHubStore();

  const [subTab, setSubTab] = useState<'list' | 'basic' | 'conditions' | 'actions' | 'advanced' | 'review'>('list');
  const [testDuration, setTestDuration] = useState(10);
  const [testLiveLocation, setTestLiveLocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeProfile = rulesProfiles[0];
  const rules = activeProfile?.rules || [];
  const [selectedRuleId, setSelectedRuleId] = useState(rules[0]?.id || '');
  const activeRule = rules.find(r => r.id === selectedRuleId) || rules[0];

  const eval1 = rules[0] ? RulesEngine.evaluateRule(rules[0], { duration_hours: testDuration }) : null;
  const eval2 = rules[1] ? RulesEngine.evaluateRule(rules[1], { live_location_enabled: testLiveLocation }) : null;

  return (
    <div className="space-y-3 w-full">
      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200/80">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setSubTab('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'list'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Rule List</span>
          </button>

          <button
            onClick={() => setSubTab('basic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'basic'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Basic Info</span>
          </button>

          <button
            onClick={() => setSubTab('conditions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'conditions'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Conditions</span>
          </button>

          <button
            onClick={() => setSubTab('actions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'actions'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>4. Actions</span>
          </button>

          <button
            onClick={() => setSubTab('advanced')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'advanced'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>5. Advanced Settings</span>
          </button>

          <button
            onClick={() => setSubTab('review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'review'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>6. Review & Audit</span>
          </button>
        </div>
      </div>

      {/* 1. RULE LIST SUB-TAB */}
      {subTab === 'list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">Active Operational Rules ({rules.length})</h4>
          </div>

          <div className="space-y-2.5">
            {rules.map(rule => (
              <div
                key={rule.id}
                onClick={() => setSelectedRuleId(rule.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-2xs ${
                  selectedRuleId === rule.id ? 'bg-white border-2 border-purple-500 ring-2 ring-purple-500/10' : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-slate-900 text-xs">{rule.name}</h5>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                    {rule.rule_type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. BASIC INFO SUB-TAB */}
      {subTab === 'basic' && activeRule && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Rule Identity & Operational Scope</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">RULE IDENTITY</span>
              <strong className="text-slate-900 text-sm block mt-1">{activeRule.name}</strong>
              <span className="text-[10px] text-slate-500">ID: {activeRule.id}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">SCOPE & MAPPING</span>
              <strong className="text-purple-700 text-sm block mt-1">{activeRule.rule_type}</strong>
              <span className="text-[10px] text-slate-500">Global Operational Engine Scope</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">STATUS & PRIORITY</span>
              <strong className="text-emerald-700 text-sm block mt-1">ACTIVE (Priority 1)</strong>
              <span className="text-[10px] text-slate-500">Severity: {activeRule.severity}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONDITIONS SUB-TAB */}
      {subTab === 'conditions' && activeRule && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Condition Groups & Logical Operators</h4>
          <div className="p-3 rounded-xl bg-slate-50 border font-mono text-xs text-slate-800">
            <span className="font-bold text-purple-700">IF </span>
            <span>{activeRule.condition} </span>
            <span className="font-bold text-purple-700">{activeRule.operator} </span>
            <strong className="text-slate-900">{String(activeRule.value)}</strong>
          </div>
        </div>
      )}

      {/* 4. ACTIONS SUB-TAB */}
      {subTab === 'actions' && activeRule && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Primary Actions & System Restrictions</h4>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1">
            <span className="font-extrabold text-rose-900 block">Primary Action Triggered</span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold font-mono text-xs inline-block">
              {activeRule.action}
            </span>
            <p className="text-[11px] text-rose-800 mt-1">
              Enforces mandatory system action when conditions evaluate to true.
            </p>
          </div>
        </div>
      )}

      {/* 5. ADVANCED SETTINGS SUB-TAB */}
      {subTab === 'advanced' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Advanced Rule Linking & Escalations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border">
              <strong>Risk & Verification Link:</strong> Tied to High Risk Level profiles.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <strong>Override Rules:</strong> Supervisor override permitted with 2-Factor Authentication.
            </div>
          </div>
        </div>
      )}

      {/* 6. REVIEW & AUDIT SUB-TAB */}
      {subTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Play className="w-4 h-4 text-purple-600" /> Interactive Rule Simulator
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Test Duration: <span className="text-purple-700 font-bold font-mono">{testDuration} hours</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={testDuration}
                  onChange={e => setTestDuration(Number(e.target.value))}
                  className="w-full accent-purple-600 h-1 rounded-full bg-slate-200"
                />
              </div>

              {eval1?.triggers ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold">
                  ⚠️ Rule Triggered: Duration exceeds 8 hours (Requires Admin Approval)
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold">
                  ✓ Rule Satisfied: Duration within normal limits.
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs">Rule Audit History</h4>
            <div className="p-3 rounded-xl bg-slate-50 border text-xs text-slate-600 font-mono">
              Last modified by AMARNATH CHAUHAN on 2026-08-21 (Version 1.0)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
