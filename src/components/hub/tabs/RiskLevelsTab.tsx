'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  ShieldAlert, Shield, Search, Plus, X, Edit2, Trash2, Copy, Power,
  CheckCircle2, Sliders, AlertTriangle, Layers, Clock, AlertOctagon,
  Eye, Zap, ShieldCheck, UserX, Cpu, Activity, ArrowUpRight
} from 'lucide-react';
import { RiskLevelItem, RiskLevelCode, RiskFactorWeight } from '@/lib/types/serviceHub';

const RISK_TIER_TABS: (RiskLevelCode | 'ALL')[] = [
  'ALL',
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
];

export function RiskLevelsTab() {
  const {
    riskLevels,
    categories,
    services,
    addRiskLevel,
    updateRiskLevel,
    deleteRiskLevel,
    toggleRiskLevelStatus,
    duplicateRiskLevel,
    searchQuery: globalSearch
  } = useServiceHubStore();

  const [selectedRiskId, setSelectedRiskId] = useState<string>(riskLevels[0]?.id || '');
  const [localSearch, setLocalSearch] = useState('');
  const [activeTierTab, setActiveTierTab] = useState<RiskLevelCode | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'IDENTITY' | 'FACTORS' | 'CONTROLS' | 'ESCALATION'>('IDENTITY');
  const [editingRisk, setEditingRisk] = useState<RiskLevelItem | null>(null);
  const [deleteConfirmRisk, setDeleteConfirmRisk] = useState<RiskLevelItem | null>(null);

  // Form Fields State
  // 1. Risk Identity
  const [code, setCode] = useState<RiskLevelCode>('LOW');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scoreMin, setScoreMin] = useState(0);
  const [scoreMax, setScoreMax] = useState(25);
  const [color, setColor] = useState('emerald');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [scopeType, setScopeType] = useState<'GLOBAL' | 'CATEGORY' | 'SERVICE'>('GLOBAL');
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');

  // 2. Risk Factors Weights State
  const [factors, setFactors] = useState<RiskLevelItem['factors']>({
    service_risk: { factor_name: 'Service Risk', weight_score: 10, enabled: true, notes: 'Virtual or public guided tours' },
    duration_risk: { factor_name: 'Duration Risk', weight_score: 10, enabled: true, notes: 'Short sessions < 4 hours' },
    time_risk: { factor_name: 'Time Risk', weight_score: 5, enabled: true, notes: 'Daytime hours (08:00 - 20:00)' },
    location_risk: { factor_name: 'Location Risk', weight_score: 5, enabled: true, notes: 'High traffic verified public places' },
    user_risk: { factor_name: 'User Risk', weight_score: 10, enabled: true, notes: 'Repeat verified client' },
    verification_risk: { factor_name: 'Verification Risk', weight_score: 10, enabled: true, notes: 'Basic Govt ID & OTP verified' },
    booking_risk: { factor_name: 'Booking Risk', weight_score: 5, enabled: true, notes: 'Standard pricing < ₹2,000' }
  });

  // 3. Risk Rules, Controls & Escalation
  const [requiredVerificationTier, setRequiredVerificationTier] = useState<'Basic' | 'Standard' | 'Enhanced' | 'Restricted'>('Basic');
  const [monitoringLevel, setMonitoringLevel] = useState<'Standard' | 'Enhanced' | 'Continuous' | 'RealTime_Audit'>('Standard');
  const [manualApprovalRequired, setManualApprovalRequired] = useState(false);
  const [liveLocationRequired, setLiveLocationRequired] = useState(true);
  const [emergencyContactRequired, setEmergencyContactRequired] = useState(true);
  const [sosRequired, setSosRequired] = useState(true);
  const [periodicCheckinMins, setPeriodicCheckinMins] = useState(60);
  const [maximumBookingDuration, setMaximumBookingDuration] = useState(12);

  const [escalationAction, setEscalationAction] = useState<'AUTO_BLOCK' | 'EMERGENCY_OPS_ALERT' | 'IMMEDIATE_ESCALATION' | 'STANDARD_MONITOR'>('STANDARD_MONITOR');
  const [escalationTargetRole, setEscalationTargetRole] = useState<'OPS_LEAD' | 'SAFETY_DESK' | 'SUPER_ADMIN'>('SAFETY_DESK');

  // Filtered Risk Levels List
  const searchTerm = localSearch || globalSearch;
  const filteredRiskLevels = useMemo(() => {
    return riskLevels.filter(r => {
      const matchesSearch = !searchTerm ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = activeTierTab === 'ALL' || r.code === activeTierTab;
      const matchesCategory = categoryFilter === 'ALL' || r.category_id === categoryFilter;

      return matchesSearch && matchesTier && matchesCategory;
    });
  }, [riskLevels, searchTerm, activeTierTab, categoryFilter]);

  const activeRisk = riskLevels.find(r => r.id === selectedRiskId) || riskLevels[0];

  // Handlers
  const handleOpenCreate = () => {
    setEditingRisk(null);
    setCode('LOW');
    setName('Low Risk Tier Profile');
    setDescription('Standard companion bookings in verified public places during day hours.');
    setScoreMin(0);
    setScoreMax(25);
    setColor('emerald');
    setStatus('ACTIVE');
    setScopeType('GLOBAL');
    setCategoryId('');
    setServiceId('');

    setFactors({
      service_risk: { factor_name: 'Service Risk', weight_score: 10, enabled: true, notes: 'Virtual or public guided tours' },
      duration_risk: { factor_name: 'Duration Risk', weight_score: 10, enabled: true, notes: 'Short sessions < 4 hours' },
      time_risk: { factor_name: 'Time Risk', weight_score: 5, enabled: true, notes: 'Daytime hours (08:00 - 20:00)' },
      location_risk: { factor_name: 'Location Risk', weight_score: 5, enabled: true, notes: 'High traffic verified public places' },
      user_risk: { factor_name: 'User Risk', weight_score: 10, enabled: true, notes: 'Repeat verified client' },
      verification_risk: { factor_name: 'Verification Risk', weight_score: 10, enabled: true, notes: 'Basic Govt ID & OTP verified' },
      booking_risk: { factor_name: 'Booking Risk', weight_score: 5, enabled: true, notes: 'Standard pricing < ₹2,000' }
    });

    setRequiredVerificationTier('Basic');
    setMonitoringLevel('Standard');
    setManualApprovalRequired(false);
    setLiveLocationRequired(true);
    setEmergencyContactRequired(true);
    setSosRequired(true);
    setPeriodicCheckinMins(60);
    setMaximumBookingDuration(12);
    setEscalationAction('STANDARD_MONITOR');
    setEscalationTargetRole('SAFETY_DESK');

    setActiveModalTab('IDENTITY');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (risk: RiskLevelItem) => {
    setEditingRisk(risk);
    setCode(risk.code);
    setName(risk.name);
    setDescription(risk.description);
    setScoreMin(risk.score_min ?? 0);
    setScoreMax(risk.score_max ?? 25);
    setColor(risk.color);
    setStatus(risk.status);
    setScopeType(risk.scope_type || 'GLOBAL');
    setCategoryId(risk.category_id || '');
    setServiceId(risk.service_id || '');

    if (risk.factors) {
      setFactors(risk.factors);
    }

    setRequiredVerificationTier(risk.required_verification_tier || (risk.verification_level as any) || 'Basic');
    setMonitoringLevel(risk.monitoring_level as any || 'Standard');
    setManualApprovalRequired(risk.manual_approval_required);
    setLiveLocationRequired(risk.live_location_required);
    setEmergencyContactRequired(risk.emergency_contact_required);
    setSosRequired(risk.sos_required);
    setPeriodicCheckinMins(risk.periodic_checkin_mins || 30);
    setMaximumBookingDuration(risk.maximum_booking_duration);
    setEscalationAction(risk.escalation_action || 'STANDARD_MONITOR');
    setEscalationTargetRole(risk.escalation_target_role || 'SAFETY_DESK');

    setActiveModalTab('IDENTITY');
    setIsModalOpen(true);
  };

  const handleFactorWeightChange = (factorKey: keyof RiskLevelItem['factors'], field: 'weight_score' | 'enabled', val: any) => {
    setFactors(prev => ({
      ...prev,
      [factorKey]: {
        ...prev[factorKey],
        [field]: val
      }
    }));
  };

  const handleSaveRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<RiskLevelItem, 'id' | 'createdAt' | 'updatedAt'> = {
      code,
      name: name.trim(),
      description: description.trim(),
      score_min: Number(scoreMin),
      score_max: Number(scoreMax),
      score: Number(scoreMax),
      color,
      status,
      scope_type: scopeType,
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name,
      service_id: serviceId,
      service_name: services.find(s => s.id === serviceId)?.name,

      factors,

      required_verification_tier: requiredVerificationTier,
      verification_level: requiredVerificationTier as any,
      monitoring_level: monitoringLevel,
      manual_approval_required: manualApprovalRequired,
      live_location_required: liveLocationRequired,
      emergency_contact_required: emergencyContactRequired,
      sos_required: sosRequired,
      periodic_checkin_mins: Number(periodicCheckinMins),
      maximum_booking_duration: Number(maximumBookingDuration),

      escalation_action: escalationAction,
      escalation_target_role: escalationTargetRole
    };

    if (editingRisk) {
      updateRiskLevel(editingRisk.id, payload);
    } else {
      addRiskLevel(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3.5 w-full">
      {/* Risk Profile Tier Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 w-full select-none" style={{ scrollbarWidth: 'none' }}>
        {RISK_TIER_TABS.map(tab => {
          const isSelected = activeTierTab === tab;
          const count = tab === 'ALL' ? riskLevels.length : riskLevels.filter(r => r.code === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTierTab(tab)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all shrink-0 border whitespace-nowrap ${
                isSelected
                  ? 'bg-purple-600 border-purple-600 text-white shadow-2xs'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {tab === 'ALL' ? 'ALL RISK TIERS' : `${tab} RISK`} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search by risk tier, factor weights, or escalation rules..."
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-purple-500 shadow-2xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-2xs flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Risk Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Section 1: Configured Risk Levels Grid */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Risk Management Profiles & Factors
              <span className="ml-1.5 text-slate-500 text-[10px] font-normal">({filteredRiskLevels.length} configured)</span>
            </h4>
          </div>

          {filteredRiskLevels.length > 0 ? (
            <div className="space-y-2.5">
              {filteredRiskLevels.map(risk => {
                const isSelected = selectedRiskId === risk.id;

                return (
                  <div
                    key={risk.id}
                    className={`p-3.5 rounded-2xl bg-white border transition-all space-y-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-purple-500 shadow-2xs ring-1 ring-purple-500/20'
                        : 'border-slate-200/90 shadow-2xs hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedRiskId(risk.id)}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                          risk.code === 'CRITICAL' ? 'bg-purple-950 text-purple-300' :
                          risk.code === 'HIGH' ? 'bg-orange-950 text-orange-300' :
                          risk.code === 'MEDIUM' ? 'bg-amber-950 text-amber-300' :
                          'bg-emerald-950 text-emerald-300'
                        }`}>
                          {risk.code} RISK
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">{risk.name}</h5>
                        <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[9px]">
                          Score: {risk.score_min ?? 0} - {risk.score_max ?? 25}
                        </span>
                        <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${
                          risk.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {risk.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleRiskLevelStatus(risk.id); }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            risk.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title="Toggle Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateRiskLevel(risk.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Duplicate Risk Profile"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(risk); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Edit Risk Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmRisk(risk); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete Risk Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{risk.description}</p>

                    {/* Category & Service Relational Mapping */}
                    <div className="flex items-center gap-2 text-[10px] pt-0.5">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-purple-600" /> Relational Scope:
                      </span>
                      <span className="px-2 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-bold text-[9px]">
                        {risk.category_name || 'Global (All Categories & Services)'}
                      </span>
                      {risk.service_name && (
                        <span className="px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[9px]">
                          Service: {risk.service_name}
                        </span>
                      )}
                    </div>

                    {/* Section 2: 7 Risk Factors Matrix */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Risk Factors Weighting Matrix:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[9px]">
                        <div><span className="text-slate-400">Service Risk:</span> <strong className="text-slate-900">{risk.factors?.service_risk?.weight_score ?? 10}%</strong></div>
                        <div><span className="text-slate-400">Duration Risk:</span> <strong className="text-slate-900">{risk.factors?.duration_risk?.weight_score ?? 10}%</strong></div>
                        <div><span className="text-slate-400">Time Risk:</span> <strong className="text-slate-900">{risk.factors?.time_risk?.weight_score ?? 5}%</strong></div>
                        <div><span className="text-slate-400">Location Risk:</span> <strong className="text-slate-900">{risk.factors?.location_risk?.weight_score ?? 5}%</strong></div>
                        <div><span className="text-slate-400">User Risk:</span> <strong className="text-slate-900">{risk.factors?.user_risk?.weight_score ?? 10}%</strong></div>
                        <div><span className="text-slate-400">Verification Risk:</span> <strong className="text-slate-900">{risk.factors?.verification_risk?.weight_score ?? 10}%</strong></div>
                        <div><span className="text-slate-400">Booking Risk:</span> <strong className="text-slate-900">{risk.factors?.booking_risk?.weight_score ?? 5}%</strong></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No risk profiles match your search.
            </div>
          )}
        </div>

        {/* Section 3: Risk Controls & Escalation Rules Panel */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" /> Controls & Escalation Protocol
            </span>
            {activeRisk && <span className="text-[10px] font-mono text-purple-600 font-bold">{activeRisk.code}</span>}
          </h4>

          {activeRisk ? (
            <div className="space-y-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 font-mono text-[10px] space-y-1">
                <p className="font-bold text-purple-900">{activeRisk.name}</p>
                <p className="text-slate-600">Verification Tier: <strong className="text-purple-700">{activeRisk.required_verification_tier || activeRisk.verification_level}</strong></p>
                <p className="text-slate-600">Monitoring: <strong className="text-slate-900">{activeRisk.monitoring_level}</strong></p>
                <p className="text-rose-700 font-bold">Escalation Protocol: {activeRisk.escalation_action || 'STANDARD_MONITOR'}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-[10px]">
                <p className="font-bold text-slate-700">Mandatory Controls:</p>
                <p className="text-slate-600">Live GPS Streaming: <strong className="text-emerald-600 font-bold">{activeRisk.live_location_required ? 'ACTIVE' : 'OFF'}</strong></p>
                <p className="text-slate-600">SOS Panic Button: <strong className="text-emerald-600 font-bold">{activeRisk.sos_required ? 'ACTIVE' : 'OFF'}</strong></p>
                <p className="text-slate-600">Periodic Check-In: <strong className="text-slate-900">Every {activeRisk.periodic_checkin_mins || 30} Mins</strong></p>
                <p className="text-slate-600">Admin Sign-Off: <strong className={activeRisk.manual_approval_required ? 'text-amber-600 font-bold' : 'text-slate-500'}>{activeRisk.manual_approval_required ? 'REQUIRED' : 'AUTO'}</strong></p>
                <p className="text-slate-600">Max Duration: <strong className="text-slate-900">{activeRisk.maximum_booking_duration} Hours</strong></p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic">Select a risk level to inspect escalation rules.</p>
          )}
        </div>
      </div>

      {/* Complete Multi-Section Create / Edit Risk Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  {editingRisk ? `Edit Risk Profile: ${editingRisk.code}` : 'Configure Risk Management Profile'}
                </h4>
                <p className="text-[11px] text-slate-400">Risk Factors Matrix, Thresholds & Escalation Rules</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Section Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'IDENTITY', label: '1. Risk Profile Identity' },
                { id: 'FACTORS', label: '2. Risk Factors Weights' },
                { id: 'CONTROLS', label: '3. Required Controls' },
                { id: 'ESCALATION', label: '4. Escalation & Rules' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveModalTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 transition-all ${
                    activeModalTab === t.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveRisk} className="space-y-3 text-[11px]">
              {/* TAB 1: IDENTITY & SCOPE */}
              {activeModalTab === 'IDENTITY' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Risk Tier Code *</label>
                      <select value={code} onChange={e => setCode(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-purple-400 font-mono font-bold outline-none focus:border-purple-500 text-[11px]">
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Profile Name *</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. High Risk Tier Profile"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Score Min *</label>
                      <input type="number" required value={scoreMin} onChange={e => setScoreMin(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Score Max *</label>
                      <input type="number" required value={scoreMax} onChange={e => setScoreMax(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Scope Mapping</label>
                      <select value={scopeType} onChange={e => setScopeType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="GLOBAL">Global (All Categories)</option>
                        <option value="CATEGORY">Category Specific</option>
                        <option value="SERVICE">Service Specific</option>
                      </select>
                    </div>
                  </div>

                  {scopeType === 'CATEGORY' && (
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Target Category Relation</label>
                      <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="">Select Category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}

                  {scopeType === 'SERVICE' && (
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Target Service Relation</label>
                      <select value={serviceId} onChange={e => setServiceId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="">Select Service...</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Description *</label>
                    <textarea rows={2} required value={description} onChange={e => setDescription(e.target.value)} placeholder="Overview of risk triggers..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>
                </div>
              )}

              {/* TAB 2: RISK FACTORS WEIGHTS MATRIX */}
              {activeModalTab === 'FACTORS' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-slate-400">Configure weighted risk factors (0-100%):</p>
                  
                  {[
                    { key: 'service_risk', label: '1. Service Risk (Escort vs Virtual)' },
                    { key: 'duration_risk', label: '2. Duration Risk (Long Sessions > 8h)' },
                    { key: 'time_risk', label: '3. Time Risk (Night Session 23:00 - 05:00)' },
                    { key: 'location_risk', label: '4. Location Risk (Unverified Premise)' },
                    { key: 'user_risk', label: '5. User Risk (New Unrated Account)' },
                    { key: 'verification_risk', label: '6. Verification Risk (Basic vs PCC)' },
                    { key: 'booking_risk', label: '7. Booking Risk (High Value > ₹5,000)' },
                  ].map(item => {
                    const factorState = factors[item.key as keyof typeof factors] || { factor_name: item.label, weight_score: 10, enabled: true };

                    return (
                      <div key={item.key} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <span className="font-bold text-slate-200 text-[11px] flex-1">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400">Weight %:</label>
                          <input
                            type="number"
                            value={factorState.weight_score}
                            onChange={(e) => handleFactorWeightChange(item.key as any, 'weight_score', Number(e.target.value))}
                            className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-purple-300 font-mono font-bold text-[11px]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: REQUIRED CONTROLS */}
              {activeModalTab === 'CONTROLS' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Required Verification Tier</label>
                      <select value={requiredVerificationTier} onChange={e => setRequiredVerificationTier(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="Basic">Basic Profile</option>
                        <option value="Standard">Standard Profile</option>
                        <option value="Enhanced">Enhanced Profile</option>
                        <option value="Restricted">Restricted Profile</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Monitoring Level</label>
                      <select value={monitoringLevel} onChange={e => setMonitoringLevel(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="Standard">Standard Monitoring</option>
                        <option value="Enhanced">Enhanced Monitoring</option>
                        <option value="Continuous">Continuous Monitoring</option>
                        <option value="RealTime_Audit">RealTime Audit Queue</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Periodic Check-In (Mins)</label>
                      <input type="number" value={periodicCheckinMins} onChange={e => setPeriodicCheckinMins(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Max Duration (Hrs)</label>
                      <input type="number" value={maximumBookingDuration} onChange={e => setMaximumBookingDuration(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold text-[11px]">
                      <input type="checkbox" checked={liveLocationRequired} onChange={e => setLiveLocationRequired(e.target.checked)} className="accent-purple-500 rounded" />
                      <span>Live GPS Required</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold text-[11px]">
                      <input type="checkbox" checked={sosRequired} onChange={e => setSosRequired(e.target.checked)} className="accent-purple-500 rounded" />
                      <span>SOS Emergency Button</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold text-[11px]">
                      <input type="checkbox" checked={manualApprovalRequired} onChange={e => setManualApprovalRequired(e.target.checked)} className="accent-purple-500 rounded" />
                      <span>Admin Sign-Off Required</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold text-[11px]">
                      <input type="checkbox" checked={emergencyContactRequired} onChange={e => setEmergencyContactRequired(e.target.checked)} className="accent-purple-500 rounded" />
                      <span>Emergency Contacts</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 4: ESCALATION & RULES */}
              {activeModalTab === 'ESCALATION' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Escalation Protocol</label>
                      <select value={escalationAction} onChange={e => setEscalationAction(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-rose-400 font-bold outline-none focus:border-purple-500 text-[11px]">
                        <option value="STANDARD_MONITOR">STANDARD_MONITOR</option>
                        <option value="EMERGENCY_OPS_ALERT">EMERGENCY_OPS_ALERT</option>
                        <option value="IMMEDIATE_ESCALATION">IMMEDIATE_ESCALATION</option>
                        <option value="AUTO_BLOCK">AUTO_BLOCK (Halt Escort)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Escalation Target Role</label>
                      <select value={escalationTargetRole} onChange={e => setEscalationTargetRole(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="SAFETY_DESK">SAFETY_DESK</option>
                        <option value="OPS_LEAD">OPS_LEAD</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                  {editingRisk ? 'Save Risk Profile Changes' : 'Create Risk Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmRisk && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Delete Risk Profile?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Are you sure you want to delete <strong className="text-white">{deleteConfirmRisk.code} ({deleteConfirmRisk.name})</strong>?</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmRisk(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
              <button onClick={() => { deleteRiskLevel(deleteConfirmRisk.id); setDeleteConfirmRisk(null); }} className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]">
                Delete Risk Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
