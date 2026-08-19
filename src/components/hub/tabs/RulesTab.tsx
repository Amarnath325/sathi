'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RulesEngine } from '@/lib/serviceHubEngines';
import { Sliders, Plus, AlertCircle, AlertTriangle, CheckCircle2, Play, Search, Calendar, MapPin, Shield, X, Edit2 } from 'lucide-react';
import { RuleItem } from '@/lib/types/serviceHub';

export function RulesTab() {
  const { rulesProfiles, addRuleToProfile, updateRuleInProfile } = useServiceHubStore();

  const [testDuration, setTestDuration] = useState(10);
  const [testLiveLocation, setTestLiveLocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Add/Edit Rule Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleItem | null>(null);

  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [ruleType, setRuleType] = useState<'Duration Rule' | 'Location Rule' | 'Safety Rule'>('Duration Rule');
  const [condition, setCondition] = useState('duration_hours');
  const [operator, setOperator] = useState('GREATER_THAN');
  const [value, setValue] = useState('8');
  const [action, setAction] = useState<'REQUIRE_APPROVAL' | 'BLOCK' | 'WARN'>('REQUIRE_APPROVAL');

  const activeProfile = rulesProfiles[0];
  const filteredRules = (activeProfile?.rules || []).filter(rule =>
    !searchTerm || rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eval1 = activeProfile?.rules[0] ? RulesEngine.evaluateRule(activeProfile.rules[0], { duration_hours: testDuration }) : null;
  const eval2 = activeProfile?.rules[1] ? RulesEngine.evaluateRule(activeProfile.rules[1], { live_location_enabled: testLiveLocation }) : null;

  const handleOpenCreate = () => {
    setEditingRule(null);
    setRuleName('');
    setDescription('');
    setRuleType('Duration Rule');
    setCondition('duration_hours');
    setOperator('GREATER_THAN');
    setValue('8');
    setAction('REQUIRE_APPROVAL');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rule: RuleItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRule(rule);
    setRuleName(rule.name);
    setDescription(rule.description);
    setRuleType(rule.rule_type as any);
    setCondition(rule.condition);
    setOperator(rule.operator);
    setValue(String(rule.value));
    setAction(rule.action as any);
    setIsModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !activeProfile) return;

    const parsedVal = isNaN(Number(value)) ? value : Number(value);

    if (editingRule) {
      updateRuleInProfile(activeProfile.id, editingRule.id, {
        name: ruleName.trim(),
        rule_type: ruleType as any,
        condition,
        operator: operator as any,
        value: parsedVal,
        action: action as any,
        severity: action === 'BLOCK' ? 'HIGH' : 'MEDIUM',
        description: description.trim()
      });
    } else {
      const newRule: RuleItem = {
        id: `rule-${Date.now()}`,
        name: ruleName.trim(),
        rule_type: ruleType as any,
        condition,
        operator: operator as any,
        value: parsedVal,
        action: action as any,
        severity: action === 'BLOCK' ? 'HIGH' : 'MEDIUM',
        description: description.trim() || 'Custom validation rule.',
        status: 'ACTIVE'
      };
      addRuleToProfile(activeProfile.id, newRule);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search rules by name or description..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-2xs flex items-center justify-center gap-1 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Active Rule Sets <span className="text-slate-500 font-normal text-[10px]">({filteredRules.length} shown)</span>
            </h4>
          </div>

          {filteredRules.length > 0 ? filteredRules.map(rule => {
            const isDuration = rule.rule_type === 'Duration Rule' || rule.name.toLowerCase().includes('duration');
            const isLocation = rule.rule_type === 'Location Rule' || rule.name.toLowerCase().includes('location') || rule.name.toLowerCase().includes('gps');

            return (
              <div key={rule.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-2.5">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                      {isDuration ? (
                        <Calendar className="w-4 h-4 text-purple-600" />
                      ) : isLocation ? (
                        <MapPin className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Shield className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs leading-snug">{rule.name}</h5>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold shrink-0">
                      {isDuration ? 'Duration Rule' : isLocation ? 'Location Rule' : rule.rule_type}
                    </span>
                    <button
                      onClick={(e) => handleOpenEdit(rule, e)}
                      className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                      title="Edit Rule"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* IF ... THEN ... logic box */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 font-mono text-[11px] text-slate-800 tracking-wide">
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
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No rules match your search.
            </div>
          )}
        </div>

        {/* Live Evaluator Simulator */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Play className="w-3 h-3 fill-white ml-0.5" />
            </span>
            Rule Evaluator Simulator
          </h4>

          <div className="space-y-3 text-[11px]">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Duration: <span className="text-blue-600 font-bold font-mono">{testDuration} hours</span>
              </label>
              <input
                type="range"
                min={1}
                max={15}
                value={testDuration}
                onChange={e => setTestDuration(Number(e.target.value))}
                className="w-full accent-purple-600 h-1 rounded-full bg-slate-200"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 font-medium"><span>1h</span><span>15h</span></div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                id="ll"
                checked={testLiveLocation}
                onChange={e => setTestLiveLocation(e.target.checked)}
                className="accent-purple-600 w-3.5 h-3.5 rounded"
              />
              <span className="text-slate-700 font-bold">Live GPS Stream Enabled</span>
            </label>
          </div>

          {/* Evaluation Results Section */}
          <div className="space-y-2 pt-2.5 border-t border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">EVALUATION RESULTS</p>

            {eval1?.triggers && (
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-2 text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-extrabold text-amber-950 text-[11px]">Rule Triggered [Duration Max Threshold]</h6>
                  <p className="text-amber-800 text-[10px] mt-0.5 font-medium leading-tight">
                    Bookings longer than 8 hours require explicit admin approval <span className="font-bold text-amber-900">(MEDIUM)</span>
                  </p>
                </div>
              </div>
            )}

            {eval2?.triggers && (
              <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/90 flex items-start gap-2 text-[11px]">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-extrabold text-rose-950 text-[11px]">Rule Triggered [Live Location Permission Required]</h6>
                  <p className="text-rose-800 text-[10px] mt-0.5 font-medium leading-tight">
                    Mandatory live GPS streaming during offline sessions <span className="font-bold text-rose-900">(HIGH)</span>
                  </p>
                </div>
              </div>
            )}

            {!eval1?.triggers && !eval2?.triggers && (
              <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex items-center gap-2 text-[11px] text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All rules satisfied — no blocks required.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-3.5 shadow-2xl my-auto text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-white text-sm">
                {editingRule ? `Edit Rule: ${editingRule.name}` : 'Add New Operational Rule'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveRule} className="space-y-2.5 text-[11px]">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Rule Name *</label>
                <input type="text" required value={ruleName} onChange={e => setRuleName(e.target.value)} placeholder="e.g. Max Booking Limit per Companion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 transition-colors text-[11px]" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Rule Type</label>
                  <select value={ruleType} onChange={e => setRuleType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                    <option value="Duration Rule">Duration Rule</option>
                    <option value="Location Rule">Location Rule</option>
                    <option value="Safety Rule">Safety Rule</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Operator</label>
                  <select value={operator} onChange={e => setOperator(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                    <option value="GREATER_THAN">GREATER_THAN</option>
                    <option value="LESS_THAN">LESS_THAN</option>
                    <option value="EQUALS">EQUALS</option>
                    <option value="CONTAINS">CONTAINS</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Condition Key</label>
                  <input type="text" value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g. duration_hours"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Value</label>
                  <input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder="8"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Action Triggered</label>
                <select value={action} onChange={e => setAction(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                  <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                  <option value="BLOCK">BLOCK</option>
                  <option value="WARN">WARN</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Rule description..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 resize-none text-[11px]" />
              </div>
              <div className="pt-2.5 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                  {editingRule ? 'Save Changes' : 'Add Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
