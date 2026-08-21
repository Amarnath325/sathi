'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RulesEngine } from '@/lib/serviceHubEngines';
import {
  Sliders, Plus, AlertCircle, AlertTriangle, CheckCircle2, Play, Search,
  Calendar, MapPin, Shield, X, Edit2, Trash2, Copy, Power, Layers, Filter,
  FileText, ShieldCheck, ChevronRight, History, Info, Tag
} from 'lucide-react';
import { RuleItem, RuleCondition, RuleType, RuleOperator, RuleAction, RuleSeverity } from '@/lib/types/serviceHub';

export function RulesTab() {
  const {
    rulesProfiles,
    categories,
    services,
    addRuleToProfile,
    updateRuleInProfile,
    deleteRuleFromProfile,
    toggleRuleActive,
    duplicateRuleInProfile,
    searchQuery: globalSearch
  } = useServiceHubStore();

  const activeProfile = rulesProfiles[0];
  const rulesList = activeProfile?.rules || [];

  // Filtering State
  const [localSearch, setLocalSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [scopeFilter, setScopeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Simulator State
  const [testRuleId, setTestRuleId] = useState<string>(rulesList[0]?.id || '');
  const [simDuration, setSimDuration] = useState<number>(10);
  const [simLiveLocation, setSimLiveLocation] = useState<boolean>(false);
  const [simBookingAmount, setSimBookingAmount] = useState<number>(6000);
  const [simRiskLevel, setSimRiskLevel] = useState<string>('HIGH');

  // Modal & Modal Tab State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'BASIC' | 'CONDITIONS' | 'ACTIONS' | 'ADVANCED' | 'REVIEW' | 'AUDIT'>('BASIC');
  const [editingRule, setEditingRule] = useState<RuleItem | null>(null);
  const [deleteConfirmRule, setDeleteConfirmRule] = useState<RuleItem | null>(null);

  // Form Fields State
  // 1. Basic Information
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('Duration Rule');
  const [priority, setPriority] = useState<number>(1);
  const [scopeType, setScopeType] = useState<'GLOBAL' | 'CATEGORY' | 'SERVICE' | 'LOCATION'>('GLOBAL');
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [locationName, setLocationName] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // 2. Conditions
  const [groupOperator, setGroupOperator] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState<RuleCondition[]>([
    { id: 'c-1', field: 'duration_hours', operator: 'GREATER_THAN', value: 8, logical_operator: 'AND' }
  ]);

  // 3. Actions
  const [action, setAction] = useState<RuleAction>('REQUIRE_APPROVAL');
  const [additionalRequirements, setAdditionalRequirements] = useState<string[]>(['IDENTITY_VERIFICATION']);
  const [approvalLevel, setApprovalLevel] = useState<'SYSTEM_AUTO' | 'ADMIN_MANUAL' | 'MANAGER_REVIEW'>('MANAGER_REVIEW');
  const [restrictionMessage, setRestrictionMessage] = useState('');

  // 4. Advanced Settings
  const [riskLevelRequired, setRiskLevelRequired] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [verificationRequired, setVerificationRequired] = useState(true);
  const [allowOverride, setAllowOverride] = useState(true);
  const [overrideRole, setOverrideRole] = useState<'SUPER_ADMIN' | 'SUPPORT_LEAD' | 'OPERATIONS_MANAGER'>('OPERATIONS_MANAGER');
  const [validityStart, setValidityStart] = useState('2026-01-01');
  const [validityEnd, setValidityEnd] = useState('2026-12-31');
  const [escalationAction, setEscalationAction] = useState('');
  const [version, setVersion] = useState('v1.0');

  // Filtered Rules List
  const searchTerm = localSearch || globalSearch;
  const filteredRules = useMemo(() => {
    return rulesList.filter(rule => {
      const matchesSearch = !searchTerm ||
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rule.code && rule.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        rule.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'ALL' || rule.rule_type === typeFilter;
      const matchesScope = scopeFilter === 'ALL' || rule.scope_type === scopeFilter;
      const matchesStatus = statusFilter === 'ALL' || rule.status === statusFilter;

      return matchesSearch && matchesType && matchesScope && matchesStatus;
    });
  }, [rulesList, searchTerm, typeFilter, scopeFilter, statusFilter]);

  const selectedTestRule = rulesList.find(r => r.id === testRuleId) || rulesList[0];
  const simResult = selectedTestRule ? RulesEngine.evaluateRule(selectedTestRule, {
    duration_hours: simDuration,
    live_location_enabled: simLiveLocation,
    booking_amount: simBookingAmount,
    risk_level: simRiskLevel
  }) : null;

  // Handlers
  const handleOpenCreate = () => {
    setEditingRule(null);
    setCode(`RULE-${Date.now().toString().slice(-4)}`);
    setName('');
    setDescription('');
    setRuleType('Duration Rule');
    setPriority(1);
    setScopeType('GLOBAL');
    setCategoryId('');
    setServiceId('');
    setLocationName('');
    setStatus('ACTIVE');
    setGroupOperator('AND');
    setConditions([{ id: `c-${Date.now()}`, field: 'duration_hours', operator: 'GREATER_THAN', value: 8, logical_operator: 'AND' }]);
    setAction('REQUIRE_APPROVAL');
    setAdditionalRequirements(['IDENTITY_VERIFICATION']);
    setApprovalLevel('MANAGER_REVIEW');
    setRestrictionMessage('');
    setRiskLevelRequired('HIGH');
    setVerificationRequired(true);
    setAllowOverride(true);
    setOverrideRole('OPERATIONS_MANAGER');
    setValidityStart(new Date().toISOString().split('T')[0]);
    setValidityEnd('');
    setEscalationAction('');
    setVersion('v1.0');
    setActiveModalTab('BASIC');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rule: RuleItem) => {
    setEditingRule(rule);
    setCode(rule.code || `RULE-${rule.id.slice(-4)}`);
    setName(rule.name);
    setDescription(rule.description);
    setRuleType(rule.rule_type);
    setPriority(rule.priority || 1);
    setScopeType(rule.scope_type || 'GLOBAL');
    setCategoryId(rule.category_id || '');
    setServiceId(rule.service_id || '');
    setLocationName(rule.location_name || '');
    setStatus(rule.status);
    setGroupOperator(rule.condition_group_operator || 'AND');
    setConditions(rule.conditions && rule.conditions.length > 0 ? rule.conditions : [
      { id: 'c-1', field: rule.condition, operator: rule.operator, value: rule.value }
    ]);
    setAction(rule.action);
    setAdditionalRequirements(rule.additional_requirements || []);
    setApprovalLevel(rule.approval_level || 'SYSTEM_AUTO');
    setRestrictionMessage(rule.restriction_message || '');
    setRiskLevelRequired(rule.risk_level_required || 'MEDIUM');
    setVerificationRequired(rule.verification_required ?? true);
    setAllowOverride(rule.allow_override ?? true);
    setOverrideRole(rule.override_role || 'OPERATIONS_MANAGER');
    setValidityStart(rule.validity_start || '');
    setValidityEnd(rule.validity_end || '');
    setEscalationAction(rule.escalation_action || '');
    setVersion(rule.version || 'v1.0');
    setActiveModalTab('BASIC');
    setIsModalOpen(true);
  };

  const handleAddConditionRow = () => {
    setConditions(prev => [
      ...prev,
      { id: `c-${Date.now()}`, field: 'booking_amount', operator: 'GREATER_THAN', value: 1000, logical_operator: 'AND' }
    ]);
  };

  const handleRemoveConditionRow = (id: string) => {
    if (conditions.length <= 1) return;
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const handleToggleRequirement = (req: string) => {
    setAdditionalRequirements(prev =>
      prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]
    );
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeProfile) return;

    const primaryCond = conditions[0] || { field: 'duration_hours', operator: 'GREATER_THAN', value: 8 };

    const payload: Omit<RuleItem, 'id'> = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      rule_type: ruleType,
      priority: Number(priority),
      scope_type: scopeType,
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name,
      service_id: serviceId,
      service_name: services.find(s => s.id === serviceId)?.name,
      location_name: locationName.trim(),
      condition_group_operator: groupOperator,
      conditions,
      condition: primaryCond.field,
      operator: primaryCond.operator,
      value: primaryCond.value,
      action,
      additional_requirements: additionalRequirements,
      approval_level: approvalLevel,
      restriction_message: restrictionMessage.trim(),
      risk_level_required: riskLevelRequired,
      verification_required: verificationRequired,
      allow_override: allowOverride,
      override_role: overrideRole,
      validity_start: validityStart,
      validity_end: validityEnd,
      escalation_action: escalationAction.trim(),
      version,
      severity: action === 'BLOCK' ? 'CRITICAL' : action === 'REQUIRE_APPROVAL' ? 'HIGH' : 'MEDIUM',
      status
    };

    if (editingRule) {
      updateRuleInProfile(activeProfile.id, editingRule.id, payload);
    } else {
      addRuleToProfile(activeProfile.id, payload);
    }

    setIsModalOpen(false);
  };

  const handleDeleteRule = (rule: RuleItem) => {
    if (!activeProfile) return;
    deleteRuleFromProfile(activeProfile.id, rule.id);
    setDeleteConfirmRule(null);
  };

  return (
    <div className="space-y-3.5 w-full">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search by rule code, name, or description..."
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 shadow-2xs transition-colors"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="ALL">All Rule Types</option>
            <option value="Duration Rule">Duration Rule</option>
            <option value="Location Rule">Location Rule</option>
            <option value="Safety Rule">Safety Rule</option>
            <option value="Booking Rule">Booking Rule</option>
            <option value="Eligibility Rule">Eligibility Rule</option>
          </select>

          <select
            value={scopeFilter}
            onChange={e => setScopeFilter(e.target.value)}
            className="bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="ALL">All Scopes</option>
            <option value="GLOBAL">Global</option>
            <option value="CATEGORY">Category</option>
            <option value="SERVICE">Service</option>
            <option value="LOCATION">Location</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-2xs flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Operational Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Section 1: Configured Rule List */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Operational Rules Engine
              <span className="ml-1.5 text-slate-500 text-[10px] font-normal">({filteredRules.length} rules active)</span>
            </h4>
          </div>

          {filteredRules.length > 0 ? (
            <div className="space-y-2.5">
              {filteredRules.map(rule => {
                const isTested = testRuleId === rule.id;

                return (
                  <div
                    key={rule.id}
                    className={`p-3 rounded-2xl bg-white border transition-all space-y-2.5 ${
                      isTested
                        ? 'border-2 border-indigo-500 shadow-2xs ring-1 ring-indigo-500/20'
                        : 'border-slate-200/90 shadow-2xs hover:border-indigo-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-400 font-mono font-bold text-[10px]">
                          {rule.code || `RULE-${rule.id.slice(-4)}`}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">{rule.name}</h5>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold text-[9px]">
                          P{rule.priority || 1}
                        </span>
                        <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${
                          rule.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {rule.status}
                        </span>
                      </div>

                      {/* Quick Action Icons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleRuleActive(activeProfile.id, rule.id)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            rule.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title="Toggle Rule Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateRuleInProfile(activeProfile.id, rule.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          title="Duplicate Rule"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(rule)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          title="Edit Rule Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmRule(rule)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{rule.description}</p>

                    {/* Meta Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Scope</span>
                        <span className="font-bold text-slate-800">{rule.scope_type || 'GLOBAL'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Condition</span>
                        <span className="font-bold text-indigo-600">{rule.condition} {rule.operator} {String(rule.value)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Primary Action</span>
                        <span className={`font-bold ${
                          rule.action === 'BLOCK' ? 'text-rose-600' : rule.action === 'REQUIRE_APPROVAL' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>{rule.action}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Approval</span>
                        <span className="font-bold text-slate-800">{rule.approval_level || 'SYSTEM_AUTO'}</span>
                      </div>
                    </div>

                    {/* Requirements & Test Button */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px]">
                      <div className="flex items-center gap-1 flex-wrap text-slate-500">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span className="font-medium">Requirements:</span>
                        {(rule.additional_requirements || []).length > 0 ? (
                          rule.additional_requirements?.map(r => (
                            <span key={r} className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[9px]">
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </div>

                      <button
                        onClick={() => setTestRuleId(rule.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center gap-1 transition-all"
                      >
                        <Play className="w-3 h-3 fill-indigo-600 text-indigo-600" /> Test in Simulator
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No operational rules match your current search filters.
            </div>
          )}
        </div>

        {/* Section 6: Interactive Rule Simulator & Engine Tester */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Rule Evaluation Simulator
          </h4>

          <div className="space-y-2.5 text-[11px]">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Rule to Test</label>
              <select
                value={testRuleId}
                onChange={e => setTestRuleId(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-xl p-2 text-[11px] text-slate-900 font-bold outline-none focus:border-indigo-500 shadow-2xs"
              >
                {rulesList.map(r => <option key={r.id} value={r.id}>{r.code || r.name}: {r.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Simulated Duration: <span className="text-indigo-600 font-mono font-extrabold">{simDuration} hours</span></label>
              <input type="range" min={1} max={24} value={simDuration} onChange={e => setSimDuration(Number(e.target.value))} className="w-full accent-indigo-600 h-1 rounded-full bg-slate-200" />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Simulated Booking Amount: <span className="text-emerald-600 font-mono font-extrabold">₹{simBookingAmount}</span></label>
              <input type="range" min={500} max={20000} step={500} value={simBookingAmount} onChange={e => setSimBookingAmount(Number(e.target.value))} className="w-full accent-indigo-600 h-1 rounded-full bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
                <input type="checkbox" checked={simLiveLocation} onChange={e => setSimLiveLocation(e.target.checked)} className="accent-indigo-600 w-3.5 h-3.5 rounded" />
                <span className="text-slate-900 font-bold text-[10px]">Live GPS On</span>
              </label>

              <div>
                <select
                  value={simRiskLevel}
                  onChange={e => setSimRiskLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] text-slate-900 font-bold outline-none focus:border-indigo-500"
                >
                  <option value="LOW">Risk: LOW</option>
                  <option value="MEDIUM">Risk: MEDIUM</option>
                  <option value="HIGH">Risk: HIGH</option>
                  <option value="CRITICAL">Risk: CRITICAL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Simulator Evaluation Output */}
          {selectedTestRule && simResult && (
            <div className={`p-3 rounded-xl border text-[11px] space-y-1.5 font-mono ${
              simResult.triggers
                ? selectedTestRule.action === 'BLOCK'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : selectedTestRule.action === 'REQUIRE_APPROVAL'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between font-sans font-extrabold text-xs">
                <span className="flex items-center gap-1.5">
                  {simResult.triggers ? (
                    selectedTestRule.action === 'BLOCK' ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {simResult.triggers ? `RULE TRIGGERED: ${selectedTestRule.action}` : 'RULE PASSED (No Violation)'}
                </span>
              </div>
              <p className="font-sans text-[11px] leading-snug">
                {simResult.triggers
                  ? selectedTestRule.restriction_message || `Condition triggered for ${selectedTestRule.name}`
                  : `Simulated parameters meet all conditions for ${selectedTestRule.name}.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Complete Multi-Section Create / Edit Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  {editingRule ? `Edit Rule: ${editingRule.code || editingRule.name}` : 'Configure Operational Rule'}
                </h4>
                <p className="text-[11px] text-slate-400">Complete 6-section rule architecture & policy mapping</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 6 Modal Section Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'BASIC', label: '2. Basic Info' },
                { id: 'CONDITIONS', label: '3. Conditions' },
                { id: 'ACTIONS', label: '4. Actions' },
                { id: 'ADVANCED', label: '5. Advanced' },
                { id: 'REVIEW', label: '6. Review & Audit' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveModalTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 transition-all ${
                    activeModalTab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3 text-[11px]">
              {/* TAB 2: BASIC INFORMATION */}
              {activeModalTab === 'BASIC' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Rule Code *</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="RULE-DUR-01"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-amber-400 font-mono font-bold outline-none focus:border-indigo-500 text-[11px]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Rule Name *</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Duration Threshold Exceeded"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Description *</label>
                    <textarea rows={2} required value={description} onChange={e => setDescription(e.target.value)} placeholder="Operational behavior description..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Rule Type</label>
                      <select value={ruleType} onChange={e => setRuleType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                        <option value="Duration Rule">Duration Rule</option>
                        <option value="Location Rule">Location Rule</option>
                        <option value="Safety Rule">Safety Rule</option>
                        <option value="Booking Rule">Booking Rule</option>
                        <option value="Eligibility Rule">Eligibility Rule</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Priority (1-10)</label>
                      <input type="number" min={1} max={10} value={priority} onChange={e => setPriority(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-bold outline-none focus:border-indigo-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Scope / Mapping</label>
                      <select value={scopeType} onChange={e => setScopeType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                        <option value="GLOBAL">Global</option>
                        <option value="CATEGORY">Category Specific</option>
                        <option value="SERVICE">Service Specific</option>
                        <option value="LOCATION">Location Specific</option>
                      </select>
                    </div>
                  </div>

                  {scopeType === 'CATEGORY' && (
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Target Category</label>
                      <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                        <option value="">Select Category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}

                  {scopeType === 'SERVICE' && (
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Target Service</label>
                      <select value={serviceId} onChange={e => setServiceId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                        <option value="">Select Service...</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CONDITIONS */}
              {activeModalTab === 'CONDITIONS' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-300">Condition Group Logical Operator:</span>
                    <div className="flex gap-2">
                      {['AND', 'OR'].map(op => (
                        <button
                          type="button"
                          key={op}
                          onClick={() => setGroupOperator(op as any)}
                          className={`px-3 py-1 rounded-lg font-mono font-bold text-[10px] ${
                            groupOperator === op ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {conditions.map((cond, idx) => (
                      <div key={cond.id || idx} className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="col-span-4">
                          <label className="text-[9px] text-slate-500 font-bold block">Field</label>
                          <select
                            value={cond.field}
                            onChange={e => {
                              const updated = [...conditions];
                              updated[idx].field = e.target.value;
                              setConditions(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-[11px]"
                          >
                            <option value="duration_hours">duration_hours</option>
                            <option value="booking_amount">booking_amount</option>
                            <option value="live_location_enabled">live_location_enabled</option>
                            <option value="risk_level">risk_level</option>
                            <option value="companion_age">companion_age</option>
                          </select>
                        </div>

                        <div className="col-span-4">
                          <label className="text-[9px] text-slate-500 font-bold block">Operator</label>
                          <select
                            value={cond.operator}
                            onChange={e => {
                              const updated = [...conditions];
                              updated[idx].operator = e.target.value as any;
                              setConditions(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-[11px]"
                          >
                            <option value="GREATER_THAN">GREATER_THAN (&gt;)</option>
                            <option value="LESS_THAN">LESS_THAN (&lt;)</option>
                            <option value="EQUALS">EQUALS (=)</option>
                            <option value="NOT_EQUALS">NOT_EQUALS (!=)</option>
                            <option value="CONTAINS">CONTAINS</option>
                          </select>
                        </div>

                        <div className="col-span-3">
                          <label className="text-[9px] text-slate-500 font-bold block">Target Value</label>
                          <input
                            type="text"
                            value={String(cond.value)}
                            onChange={e => {
                              const updated = [...conditions];
                              const raw = e.target.value;
                              updated[idx].value = raw === 'true' ? true : raw === 'false' ? false : !isNaN(Number(raw)) ? Number(raw) : raw;
                              setConditions(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-indigo-400 font-mono font-bold text-[11px]"
                          />
                        </div>

                        <div className="col-span-1 text-right pt-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveConditionRow(cond.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddConditionRow}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Condition
                  </button>
                </div>
              )}

              {/* TAB 4: ACTIONS */}
              {activeModalTab === 'ACTIONS' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Primary Action *</label>
                      <select value={action} onChange={e => setAction(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                        <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                        <option value="BLOCK">BLOCK (Halt Transaction)</option>
                        <option value="WARN">WARN (Warning Banner)</option>
                        <option value="APPLY_DISCOUNT">APPLY_DISCOUNT</option>
                        <option value="SURGE_PRICE">SURGE_PRICE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Approval Level</label>
                      <select value={approvalLevel} onChange={e => setApprovalLevel(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                        <option value="SYSTEM_AUTO">SYSTEM_AUTO</option>
                        <option value="ADMIN_MANUAL">ADMIN_MANUAL</option>
                        <option value="MANAGER_REVIEW">MANAGER_REVIEW</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Restriction Message / Warning Text</label>
                    <input type="text" value={restrictionMessage} onChange={e => setRestrictionMessage(e.target.value)} placeholder="Message shown to user on rule trigger..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-bold">Additional Requirements</label>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                      {[
                        'IDENTITY_VERIFICATION',
                        'GUARDIAN_CONSENT',
                        'GPS_TRACKING',
                        'EMERGENCY_CONTACT',
                        'GOVT_ID_VERIFICATION',
                        'FACE_MATCH'
                      ].map(req => (
                        <label key={req} className="flex items-center gap-2 cursor-pointer p-1 text-[10px] text-slate-300">
                          <input
                            type="checkbox"
                            checked={additionalRequirements.includes(req)}
                            onChange={() => handleToggleRequirement(req)}
                            className="accent-indigo-500 rounded"
                          />
                          <span>{req}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ADVANCED SETTINGS */}
              {activeModalTab === 'ADVANCED' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Minimum Risk Level Required</label>
                      <select value={riskLevelRequired} onChange={e => setRiskLevelRequired(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Override Role Required</label>
                      <select value={overrideRole} onChange={e => setOverrideRole(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]">
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="SUPPORT_LEAD">SUPPORT_LEAD</option>
                        <option value="OPERATIONS_MANAGER">OPERATIONS_MANAGER</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Validity Start Date</label>
                      <input type="date" value={validityStart} onChange={e => setValidityStart(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Validity End Date</label>
                      <input type="date" value={validityEnd} onChange={e => setValidityEnd(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Escalation Action Protocol</label>
                    <input type="text" value={escalationAction} onChange={e => setEscalationAction(e.target.value)} placeholder="e.g. Escalate to Safety Desk after 2 hours"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500 text-[11px]" />
                  </div>
                </div>
              )}

              {/* TAB 6: REVIEW & AUDIT */}
              {activeModalTab === 'REVIEW' && (
                <div className="space-y-3 font-mono text-[11px] p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Rule Identity:</span>
                    <span className="font-bold text-amber-400">{code} ({name})</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Rule Type & Scope:</span>
                    <span className="font-bold text-white">{ruleType} ({scopeType})</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Primary Action:</span>
                    <span className="font-bold text-rose-400">{action}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Approval Level:</span>
                    <span className="font-bold text-indigo-400">{approvalLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Version:</span>
                    <span className="font-bold text-emerald-400">{version}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">Version: {version}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px]">
                    {editingRule ? 'Save Rule Changes' : 'Create Rule'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmRule && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Delete Operational Rule?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Are you sure you want to delete rule <strong className="text-white">{deleteConfirmRule.code || deleteConfirmRule.name}</strong>?</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmRule(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
              <button onClick={() => handleDeleteRule(deleteConfirmRule)} className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]">
                Delete Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
