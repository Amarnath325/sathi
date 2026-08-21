'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RulesEngine } from '@/lib/serviceHubEngines';
import { Sliders, Plus, AlertCircle, AlertTriangle, CheckCircle2, Play, Search, Calendar, MapPin, Shield, X, Edit2, Trash2, Layers, FileText, Activity } from 'lucide-react';
import { RuleItem, RuleType, RuleOperator, RuleAction, RuleSeverity } from '@/lib/types/serviceHub';

export function RulesTab() {
  const { rulesProfiles, addRuleToProfile, updateRuleInProfile, deleteRuleFromProfile } = useServiceHubStore();

  const [subTab, setSubTab] = useState<'list' | 'basic' | 'conditions' | 'actions' | 'advanced' | 'review'>('list');
  const [testDuration, setTestDuration] = useState(10);
  const [testLiveLocation, setTestLiveLocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeProfile = rulesProfiles[0];
  const rules = activeProfile?.rules || [];
  const [selectedRuleId, setSelectedRuleId] = useState(rules[0]?.id || '');
  const activeRule = rules.find(r => r.id === selectedRuleId) || rules[0];

  // Modal State for Add / Edit Rule
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('Duration Rule');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('duration_hours');
  const [operator, setOperator] = useState<RuleOperator>('GREATER_THAN');
  const [value, setValue] = useState<string | number>('8');
  const [action, setAction] = useState<RuleAction>('REQUIRE_APPROVAL');
  const [severity, setSeverity] = useState<RuleSeverity>('HIGH');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const openAddModal = () => {
    setEditingRule(null);
    setName('');
    setRuleType('Duration Rule');
    setDescription('');
    setCondition('duration_hours');
    setOperator('GREATER_THAN');
    setValue('8');
    setAction('REQUIRE_APPROVAL');
    setSeverity('HIGH');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const openEditModal = (rule: RuleItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingRule(rule);
    setName(rule.name);
    setRuleType(rule.rule_type);
    setDescription(rule.description);
    setCondition(rule.condition);
    setOperator(rule.operator);
    setValue(typeof rule.value === 'boolean' ? String(rule.value) : rule.value);
    setAction(rule.action);
    setSeverity(rule.severity);
    setStatus(rule.status);
    setIsModalOpen(true);
  };

  const handleDeleteRule = (ruleId: string, ruleName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete rule "${ruleName}"?`)) {
      deleteRuleFromProfile(activeProfile.id, ruleId);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert('Please enter rule name.'); return; }

    const ruleData = {
      name,
      rule_type: ruleType,
      description,
      condition,
      operator,
      value,
      action,
      severity,
      status
    };

    if (editingRule) {
      updateRuleInProfile(activeProfile.id, editingRule.id, ruleData);
    } else {
      addRuleToProfile(activeProfile.id, ruleData);
    }

    setIsModalOpen(false);
  };

  const eval1 = rules[0] ? RulesEngine.evaluateRule(rules[0], { duration_hours: testDuration }) : null;

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

        <button
          onClick={openAddModal}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Rule
        </button>
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
                  selectedRuleId === rule.id ? 'bg-white border-2 border-purple-500 ring-2 ring-purple-500/10' : 'bg-white border-slate-200/90 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h5 className="font-extrabold text-slate-900 text-xs">{rule.name}</h5>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                      {rule.rule_type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rule.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {rule.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => openEditModal(rule, e)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors"
                      title="Edit Rule"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteRule(rule.id, rule.name, e)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">Rule Identity & Operational Scope</h4>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => openEditModal(activeRule, e)}
                className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Rule
              </button>
              <button
                onClick={(e) => handleDeleteRule(activeRule.id, activeRule.name, e)}
                className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Rule
              </button>
            </div>
          </div>
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
              <strong className="text-emerald-700 text-sm block mt-1">{activeRule.status}</strong>
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
                  ⚠️ Rule Triggered: Duration exceeds threshold (Requires Admin Approval)
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
              Last modified on {new Date().toLocaleDateString()} (Version 1.0)
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT RULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingRule ? 'Edit Rule Configuration' : 'Create New Operational Rule'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Rule Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Maximum Booking Duration Rule"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rule Type</label>
                  <select
                    value={ruleType}
                    onChange={e => setRuleType(e.target.value as RuleType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  >
                    <option value="Age Rule">Age Rule</option>
                    <option value="Location Rule">Location Rule</option>
                    <option value="Duration Rule">Duration Rule</option>
                    <option value="Booking Rule">Booking Rule</option>
                    <option value="Availability Rule">Availability Rule</option>
                    <option value="Travel Rule">Travel Rule</option>
                    <option value="Communication Rule">Communication Rule</option>
                    <option value="Identity Rule">Identity Rule</option>
                    <option value="Safety Rule">Safety Rule</option>
                    <option value="Document Rule">Document Rule</option>
                    <option value="Payment Rule">Payment Rule</option>
                    <option value="Prohibited Activity Rule">Prohibited Activity Rule</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as RuleSeverity)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
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
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Explain when this rule applies..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Condition Variable</label>
                  <input
                    type="text"
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                    placeholder="duration_hours"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Operator</label>
                  <select
                    value={operator}
                    onChange={e => setOperator(e.target.value as RuleOperator)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-slate-900 outline-none"
                  >
                    <option value="EQUALS">EQUALS</option>
                    <option value="NOT_EQUALS">NOT_EQUALS</option>
                    <option value="GREATER_THAN">GREATER_THAN</option>
                    <option value="LESS_THAN">LESS_THAN</option>
                    <option value="CONTAINS">CONTAINS</option>
                    <option value="IN">IN</option>
                    <option value="NOT_IN">NOT_IN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Threshold Value</label>
                  <input
                    type="text"
                    value={String(value)}
                    onChange={e => setValue(e.target.value)}
                    placeholder="8"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">System Action</label>
                  <select
                    value={action}
                    onChange={e => setAction(e.target.value as RuleAction)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  >
                    <option value="WARNING">WARNING</option>
                    <option value="BLOCK">BLOCK</option>
                    <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                    <option value="REQUIRE_VERIFICATION">REQUIRE_VERIFICATION</option>
                    <option value="REQUIRE_ADDITIONAL_INFO">REQUIRE_ADDITIONAL_INFO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
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
