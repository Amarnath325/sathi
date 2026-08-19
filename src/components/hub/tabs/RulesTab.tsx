'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RulesEngine } from '@/lib/serviceHubEngines';
import { Sliders, Plus, AlertCircle, AlertTriangle, CheckCircle2, Play, Search, Calendar, MapPin, Shield, Edit2, Trash2, X } from 'lucide-react';
import { RuleItem, RuleType, RuleOperator, RuleAction, RuleSeverity } from '@/lib/types/serviceHub';

export function RulesTab() {
  const { rulesProfiles, addRuleToProfile, updateRuleInProfile, deleteRuleFromProfile } = useServiceHubStore();

  const [testDuration, setTestDuration] = useState(10);
  const [testLiveLocation, setTestLiveLocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleItem | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('Duration Rule');
  const [ruleDescription, setRuleDescription] = useState('');
  const [ruleCondition, setRuleCondition] = useState('duration_hours');
  const [ruleOperator, setRuleOperator] = useState<RuleOperator>('GREATER_THAN');
  const [ruleValue, setRuleValue] = useState<string | number>('8');
  const [ruleAction, setRuleAction] = useState<RuleAction>('REQUIRE_APPROVAL');
  const [ruleSeverity, setRuleSeverity] = useState<RuleSeverity>('MEDIUM');

  const activeProfile = rulesProfiles[0];
  const filteredRules = (activeProfile?.rules || []).filter(rule =>
    !searchTerm || rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eval1 = activeProfile?.rules[0] ? RulesEngine.evaluateRule(activeProfile.rules[0], { duration_hours: testDuration }) : null;
  const eval2 = activeProfile?.rules[1] ? RulesEngine.evaluateRule(activeProfile.rules[1], { live_location_enabled: testLiveLocation }) : null;

  const handleOpenAddModal = () => {
    setEditingRule(null);
    setRuleName('');
    setRuleType('Duration Rule');
    setRuleDescription('');
    setRuleCondition('duration_hours');
    setRuleOperator('GREATER_THAN');
    setRuleValue('8');
    setRuleAction('REQUIRE_APPROVAL');
    setRuleSeverity('MEDIUM');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rule: RuleItem) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setRuleType(rule.rule_type);
    setRuleDescription(rule.description);
    setRuleCondition(rule.condition);
    setRuleOperator(rule.operator);
    setRuleValue(rule.value);
    setRuleAction(rule.action);
    setRuleSeverity(rule.severity);
    setIsModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !activeProfile) return;

    if (editingRule) {
      updateRuleInProfile(activeProfile.id, editingRule.id, {
        name: ruleName,
        rule_type: ruleType,
        description: ruleDescription,
        condition: ruleCondition,
        operator: ruleOperator,
        value: ruleValue,
        action: ruleAction,
        severity: ruleSeverity,
      });
    } else {
      addRuleToProfile(activeProfile.id, {
        name: ruleName,
        rule_type: ruleType,
        description: ruleDescription,
        condition: ruleCondition,
        operator: ruleOperator,
        value: ruleValue,
        action: ruleAction,
        severity: ruleSeverity,
        status: 'ACTIVE'
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (!activeProfile) return;
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteRuleFromProfile(activeProfile.id, ruleId);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search rules by name or description..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
          />
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200 flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Rule
        </button>
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
              <div key={rule.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3.5 relative group">
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

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold shrink-0">
                      {rule.rule_type}
                    </span>
                    <button
                      onClick={() => handleOpenEditModal(rule)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors"
                      title="Edit Rule"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* IF ... THEN ... logic box */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 font-mono text-xs text-slate-800 tracking-wide flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-bold text-slate-900">IF </span>
                    <span className="font-bold text-slate-800">{rule.condition} </span>
                    <span className="font-bold text-slate-800">{rule.operator} </span>
                    <span className="font-bold text-slate-900">{String(rule.value)} </span>
                    <span className="font-bold text-slate-900">THEN </span>
                    <span className="font-extrabold text-rose-600 tracking-wider">{rule.action}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    rule.severity === 'CRITICAL' ? 'bg-purple-100 text-purple-700' :
                    rule.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                    rule.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {rule.severity}
                  </span>
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

      {/* CRUD Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  placeholder="e.g. Max Duration Limit"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rule Type</label>
                  <select
                    value={ruleType}
                    onChange={e => setRuleType(e.target.value as RuleType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  >
                    <option value="Duration Rule">Duration Rule</option>
                    <option value="Location Rule">Location Rule</option>
                    <option value="Age Rule">Age Rule</option>
                    <option value="Safety Rule">Safety Rule</option>
                    <option value="Booking Rule">Booking Rule</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Severity</label>
                  <select
                    value={ruleSeverity}
                    onChange={e => setRuleSeverity(e.target.value as RuleSeverity)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  value={ruleDescription}
                  onChange={e => setRuleDescription(e.target.value)}
                  placeholder="Describe when this rule triggers..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Condition</label>
                  <input
                    type="text"
                    value={ruleCondition}
                    onChange={e => setRuleCondition(e.target.value)}
                    placeholder="e.g. duration_hours"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Operator</label>
                  <select
                    value={ruleOperator}
                    onChange={e => setRuleOperator(e.target.value as RuleOperator)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  >
                    <option value="GREATER_THAN">GREATER_THAN</option>
                    <option value="LESS_THAN">LESS_THAN</option>
                    <option value="EQUALS">EQUALS</option>
                    <option value="NOT_EQUALS">NOT_EQUALS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Value</label>
                  <input
                    type="text"
                    value={String(ruleValue)}
                    onChange={e => setRuleValue(e.target.value)}
                    placeholder="e.g. 8"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Action when Triggered</label>
                <select
                  value={ruleAction}
                  onChange={e => setRuleAction(e.target.value as RuleAction)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                >
                  <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                  <option value="BLOCK">BLOCK</option>
                  <option value="WARNING">WARNING</option>
                  <option value="REQUIRE_VERIFICATION">REQUIRE_VERIFICATION</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm shadow-purple-200"
                >
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
