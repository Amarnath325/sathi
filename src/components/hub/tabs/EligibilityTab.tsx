'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  UserCheck, ShieldCheck, Search, Plus, X, Edit2, Trash2, Copy, Power,
  CheckCircle2, AlertTriangle, Layers, Award, Star, Play, FileCheck, CheckSquare, Sparkles, XCircle
} from 'lucide-react';
import { EligibilityProfileItem, EligibilityTier } from '@/lib/types/serviceHub';

export function EligibilityTab() {
  const {
    eligibilityProfiles,
    categories,
    services,
    addEligibilityProfile,
    updateEligibilityProfile,
    deleteEligibilityProfile,
    toggleEligibilityProfileStatus,
    duplicateEligibilityProfile,
    searchQuery: globalSearch
  } = useServiceHubStore();

  const [selectedProfId, setSelectedProfId] = useState<string>(eligibilityProfiles[0]?.id || '');
  const [activeTierFilter, setActiveTierFilter] = useState<'ALL' | EligibilityTier>('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'RULES' | 'EVALUATOR' | 'PREVIEW'>('RULES');
  const [editingProfile, setEditingProfile] = useState<EligibilityProfileItem | null>(null);
  const [deleteConfirmProf, setDeleteConfirmProf] = useState<EligibilityProfileItem | null>(null);

  // Form Fields State
  // Identity & Scope
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<EligibilityTier>('Standard');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [scopeType, setScopeType] = useState<'GLOBAL' | 'CATEGORY' | 'SERVICE'>('GLOBAL');
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');

  // 2. Eligibility Rules
  const [minAge, setMinAge] = useState(21);
  const [maxAge, setMaxAge] = useState(65);
  const [minRating, setMinRating] = useState(4.3);
  const [requiredVerificationLevel, setRequiredVerificationLevel] = useState<'Basic' | 'Standard' | 'Enhanced' | 'Restricted'>('Standard');
  const [requiredDocumentsText, setRequiredDocumentsText] = useState('GOVERNMENT_ID, SELFIE_MATCH, ADDRESS_PROOF');
  const [minCompletedSessions, setMinCompletedSessions] = useState(5);
  const [requireGoodAccountStanding, setRequireGoodAccountStanding] = useState(true);
  const [maxActiveStrikesAllowed, setMaxActiveStrikesAllowed] = useState(1);
  const [restrictedServicesText, setRestrictedServicesText] = useState('Restricted for unverified late-night events.');

  // 3. Evaluator Config
  const [autoEvaluationEnabled, setAutoEvaluationEnabled] = useState(true);
  const [reEvaluationIntervalDays, setReEvaluationIntervalDays] = useState(60);

  // Live Interactive Evaluator & Simulator Candidate State
  const [simAge, setSimAge] = useState(24);
  const [simRating, setSimRating] = useState(4.5);
  const [simVerificationLevel, setSimVerificationLevel] = useState<'Basic' | 'Standard' | 'Enhanced' | 'Restricted'>('Standard');
  const [simSessions, setSimSessions] = useState(12);
  const [simStrikes, setSimStrikes] = useState(0);
  const [simAccountStanding, setSimAccountStanding] = useState(true);

  // Filtered Profiles
  const searchTerm = localSearch || globalSearch;
  const filteredProfiles = useMemo(() => {
    return eligibilityProfiles.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'ALL' || p.category_id === categoryFilter;
      const matchesTier = activeTierFilter === 'ALL' || p.tier === activeTierFilter;
      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [eligibilityProfiles, searchTerm, categoryFilter, activeTierFilter]);

  const activeProfile = eligibilityProfiles.find(p => p.id === selectedProfId) || eligibilityProfiles[0];

  // Simulator Evaluation Logic
  const evaluationResult = useMemo(() => {
    if (!activeProfile) return null;
    const r = activeProfile.rules || {
      min_age: activeProfile.minimum_age || 18,
      max_age: activeProfile.maximum_age || 75,
      min_rating: activeProfile.minimum_rating || 4.0,
      required_verification_level: 'Standard',
      min_completed_sessions: activeProfile.minimum_bookings_done || 0,
      require_good_account_standing: true,
      max_active_strikes_allowed: 1
    };

    const checks = [
      { name: 'Age Requirement', passed: simAge >= r.min_age && simAge <= r.max_age, detail: `Candidate Age ${simAge} (Required: ${r.min_age}-${r.max_age})` },
      { name: 'Rating Requirement', passed: simRating >= r.min_rating, detail: `Candidate Rating ${simRating}★ (Required: ${r.min_rating}★)` },
      { name: 'Verification Tier', passed: simVerificationLevel === r.required_verification_level || simVerificationLevel === 'Restricted' || simVerificationLevel === 'Enhanced', detail: `Candidate Level: ${simVerificationLevel} (Required: ${r.required_verification_level})` },
      { name: 'Completed Sessions', passed: simSessions >= r.min_completed_sessions, detail: `Candidate Sessions: ${simSessions} (Required: ${r.min_completed_sessions})` },
      { name: 'Active Strikes', passed: simStrikes <= r.max_active_strikes_allowed, detail: `Candidate Strikes: ${simStrikes} (Max Allowed: ${r.max_active_strikes_allowed})` },
      { name: 'Account Standing', passed: simAccountStanding || !r.require_good_account_standing, detail: `Candidate Account Standing: ${simAccountStanding ? 'GOOD' : 'FLAGGED'}` },
    ];

    const failedChecks = checks.filter(c => !c.passed);
    const isEligible = failedChecks.length === 0;

    return {
      checks,
      failedChecks,
      status: isEligible ? 'ELIGIBLE' : failedChecks.length <= 1 ? 'CONDITIONAL' : 'NOT_ELIGIBLE'
    };
  }, [activeProfile, simAge, simRating, simVerificationLevel, simSessions, simStrikes, simAccountStanding]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingProfile(null);
    setCode(`ELG-STD-${Date.now().toString().slice(-4)}`);
    setName('Standard Companion Eligibility Profile');
    setDescription('Age 21-65, rating 4.3+, standard verification & 5 completed sessions.');
    setTier('Standard');
    setStatus('ACTIVE');
    setScopeType('GLOBAL');
    setCategoryId('');
    setServiceId('');

    setMinAge(21);
    setMaxAge(65);
    setMinRating(4.3);
    setRequiredVerificationLevel('Standard');
    setRequiredDocumentsText('GOVERNMENT_ID, SELFIE_MATCH, ADDRESS_PROOF');
    setMinCompletedSessions(5);
    setRequireGoodAccountStanding(true);
    setMaxActiveStrikesAllowed(1);
    setRestrictedServicesText('Restricted for unverified late-night events.');

    setAutoEvaluationEnabled(true);
    setReEvaluationIntervalDays(60);

    setActiveModalTab('RULES');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prof: EligibilityProfileItem) => {
    setEditingProfile(prof);
    setCode(prof.code || `ELG-${prof.id.slice(-4)}`);
    setName(prof.name);
    setDescription(prof.description);
    setTier(prof.tier || 'Standard');
    setStatus(prof.status);
    setScopeType(prof.scope_type || 'GLOBAL');
    setCategoryId(prof.category_id || '');
    setServiceId(prof.service_id || '');

    if (prof.rules) {
      setMinAge(prof.rules.min_age);
      setMaxAge(prof.rules.max_age);
      setMinRating(prof.rules.min_rating);
      setRequiredVerificationLevel(prof.rules.required_verification_level);
      setRequiredDocumentsText((prof.rules.required_documents || []).join(', '));
      setMinCompletedSessions(prof.rules.min_completed_sessions);
      setRequireGoodAccountStanding(prof.rules.require_good_account_standing);
      setMaxActiveStrikesAllowed(prof.rules.max_active_strikes_allowed);
      setRestrictedServicesText(prof.rules.restricted_services_text || '');
    }

    if (prof.evaluator) {
      setAutoEvaluationEnabled(prof.evaluator.auto_evaluation_enabled);
      setReEvaluationIntervalDays(prof.evaluator.re_evaluation_interval_days);
    }

    setActiveModalTab('RULES');
    setIsModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<EligibilityProfileItem, 'id' | 'createdAt' | 'updatedAt'> = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      tier,
      status,
      scope_type: scopeType,
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name,
      service_id: serviceId,
      service_name: services.find(s => s.id === serviceId)?.name,

      rules: {
        min_age: Number(minAge),
        max_age: Number(maxAge),
        min_rating: Number(minRating),
        required_verification_level: requiredVerificationLevel,
        required_documents: requiredDocumentsText.split(',').map(s => s.trim()).filter(Boolean),
        min_completed_sessions: Number(minCompletedSessions),
        require_good_account_standing: requireGoodAccountStanding,
        max_active_strikes_allowed: Number(maxActiveStrikesAllowed),
        restricted_services_text: restrictedServicesText.trim()
      },

      evaluator: {
        auto_evaluation_enabled: autoEvaluationEnabled,
        manual_override_allowed_roles: ['OPS_LEAD', 'SUPER_ADMIN'],
        re_evaluation_interval_days: Number(reEvaluationIntervalDays)
      },

      minimum_age: Number(minAge),
      maximum_age: Number(maxAge),
      minimum_rating: Number(minRating),
      minimum_bookings_done: Number(minCompletedSessions)
    };

    if (editingProfile) {
      updateEligibilityProfile(editingProfile.id, payload);
    } else {
      addEligibilityProfile(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3.5 w-full">
      {/* Tier Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200/80">
        {[
          { id: 'ALL', label: 'All Eligibility Profiles' },
          { id: 'Basic', label: 'Basic Tier' },
          { id: 'Standard', label: 'Standard Tier' },
          { id: 'Enhanced', label: 'Enhanced Tier' },
          { id: 'Restricted', label: 'Restricted Tier' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTierFilter(t.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 transition-all ${
              activeTierFilter === t.id
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
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
              placeholder="Search companion eligibility profiles by code or requirements..."
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
          <Plus className="w-3.5 h-3.5" /> Add Eligibility Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Section 1 & 2: Configured Eligibility Profiles Grid */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Companion Eligibility Profiles & Criteria
              <span className="ml-1.5 text-slate-500 text-[10px] font-normal">({filteredProfiles.length} active)</span>
            </h4>
          </div>

          {filteredProfiles.length > 0 ? (
            <div className="space-y-2.5">
              {filteredProfiles.map(prof => {
                const isSelected = selectedProfId === prof.id;

                return (
                  <div
                    key={prof.id}
                    className={`p-3.5 rounded-2xl bg-white border transition-all space-y-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-purple-500 shadow-2xs ring-1 ring-purple-500/20'
                        : 'border-slate-200/90 shadow-2xs hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedProfId(prof.id)}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-purple-300 font-mono font-bold text-[10px]">
                          {prof.code || `ELG-${prof.id.slice(-4)}`}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">{prof.name}</h5>
                        <span className="px-2 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[9px]">
                          {prof.tier || 'Standard'} Tier
                        </span>
                        <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${
                          prof.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {prof.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleEligibilityProfileStatus(prof.id); }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            prof.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title="Toggle Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateEligibilityProfile(prof.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Duplicate Profile"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(prof); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmProf(prof); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{prof.description}</p>

                    {/* Category & Service Relational Mapping */}
                    <div className="flex items-center gap-2 text-[10px] pt-0.5">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-purple-600" /> Relational Scope:
                      </span>
                      <span className="px-2 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-bold text-[9px]">
                        {prof.category_name || 'Global (All Categories & Services)'}
                      </span>
                      {prof.service_name && (
                        <span className="px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[9px]">
                          Service: {prof.service_name}
                        </span>
                      )}
                    </div>

                    {/* Rules Criteria Matrix Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Age Range</span>
                        <span className="font-bold text-slate-900">{prof.rules?.min_age || prof.minimum_age || 18} - {prof.rules?.max_age || prof.maximum_age || 65} Yrs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Min Rating</span>
                        <span className="font-bold text-amber-600">★ {prof.rules?.min_rating || prof.minimum_rating || 4.0} Stars</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Verification Level</span>
                        <span className="font-bold text-purple-700">{prof.rules?.required_verification_level || 'Standard'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Min Sessions</span>
                        <span className="font-bold text-emerald-700">{prof.rules?.min_completed_sessions || prof.minimum_bookings_done || 0} Sessions</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No eligibility profiles match your search.
            </div>
          )}
        </div>

        {/* Section 3: Live Interactive Eligibility Evaluator & Simulator */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Interactive Eligibility Evaluator
            </span>
            {activeProfile && <span className="text-[10px] font-mono text-purple-600 font-bold">{activeProfile.code || 'ELG-STD-01'}</span>}
          </h4>

          {/* Simulator Inputs Panel */}
          <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2.5 text-[11px]">
            <p className="text-purple-300 font-bold text-[10px]">Companion Candidate Inputs:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 text-[9px]">Age (Yrs):</label>
                <input type="number" value={simAge} onChange={e => setSimAge(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white font-mono text-[10px]" />
              </div>
              <div>
                <label className="block text-slate-400 text-[9px]">Rating (★):</label>
                <input type="number" step="0.1" value={simRating} onChange={e => setSimRating(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-amber-400 font-mono text-[10px]" />
              </div>
              <div>
                <label className="block text-slate-400 text-[9px]">Verification Level:</label>
                <select value={simVerificationLevel} onChange={e => setSimVerificationLevel(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-purple-400 font-mono text-[10px]">
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Enhanced">Enhanced</option>
                  <option value="Restricted">Restricted</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-[9px]">Completed Sessions:</label>
                <input type="number" value={simSessions} onChange={e => setSimSessions(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-emerald-400 font-mono text-[10px]" />
              </div>
            </div>
          </div>

          {/* Live Evaluation Decision Matrix */}
          {evaluationResult && (
            <div className="space-y-2 text-[11px]">
              <div className={`p-2.5 rounded-xl border font-mono font-bold flex items-center justify-between ${
                evaluationResult.status === 'ELIGIBLE' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                evaluationResult.status === 'CONDITIONAL' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}>
                <span>Candidate Status:</span>
                <span className="text-xs">{evaluationResult.status}</span>
              </div>

              {/* Checks List */}
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {evaluationResult.checks.map((chk, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-700 font-bold">{chk.name}</span>
                    {chk.passed ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Pass</span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Fail</span>
                    )}
                  </div>
                ))}
              </div>

              {evaluationResult.failedChecks.length > 0 && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[10px] text-rose-900 font-mono space-y-0.5">
                  <p className="font-bold">Failed Criteria ({evaluationResult.failedChecks.length}):</p>
                  {evaluationResult.failedChecks.map((f, i) => (
                    <p key={i}>• {f.detail}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Complete Multi-Section Create / Edit Eligibility Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  {editingProfile ? `Edit Eligibility Profile: ${editingProfile.code || editingProfile.name}` : 'Configure Companion Eligibility Profile'}
                </h4>
                <p className="text-[11px] text-slate-400">Eligibility Tiers, Rules Criteria & Automated Evaluator Configuration</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Section Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2">
              {[
                { id: 'RULES', label: '1. Profile & Eligibility Rules' },
                { id: 'EVALUATOR', label: '2. Evaluator Config' },
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

            <form onSubmit={handleSaveProfile} className="space-y-3 text-[11px]">
              {/* TAB 1: RULES */}
              {activeModalTab === 'RULES' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Profile Code *</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="ELG-STD-01"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-purple-400 font-mono font-bold outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Profile Name *</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Standard Companion Eligibility Profile"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Eligibility Tier</label>
                      <select value={tier} onChange={e => setTier(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-purple-400 font-bold outline-none focus:border-purple-500 text-[11px]">
                        <option value="Basic">Basic</option>
                        <option value="Standard">Standard</option>
                        <option value="Enhanced">Enhanced</option>
                        <option value="Restricted">Restricted</option>
                      </select>
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

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Status</label>
                      <select value={status} onChange={e => setStatus(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
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

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Min Age</label>
                      <input type="number" value={minAge} onChange={e => setMinAge(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Max Age</label>
                      <input type="number" value={maxAge} onChange={e => setMaxAge(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Min Rating (★)</label>
                      <input type="number" step="0.1" value={minRating} onChange={e => setMinRating(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-amber-400 font-mono font-bold outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Min Sessions</label>
                      <input type="number" value={minCompletedSessions} onChange={e => setMinCompletedSessions(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Required Verification Level</label>
                    <select value={requiredVerificationLevel} onChange={e => setRequiredVerificationLevel(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-purple-400 font-bold outline-none focus:border-purple-500 text-[11px]">
                      <option value="Basic">Basic Verification</option>
                      <option value="Standard">Standard Verification</option>
                      <option value="Enhanced">Enhanced Verification</option>
                      <option value="Restricted">Restricted Verification</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 2: EVALUATOR CONFIG */}
              {activeModalTab === 'EVALUATOR' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={autoEvaluationEnabled} onChange={e => setAutoEvaluationEnabled(e.target.checked)} className="accent-purple-500 rounded w-4 h-4" />
                      <span>Automated Real-Time Evaluation Engine</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={requireGoodAccountStanding} onChange={e => setRequireGoodAccountStanding(e.target.checked)} className="accent-emerald-500 rounded w-4 h-4" />
                      <span>Require Good Account Standing</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Re-Evaluation Interval (Days)</label>
                      <input type="number" value={reEvaluationIntervalDays} onChange={e => setReEvaluationIntervalDays(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Max Active Strikes Allowed</label>
                      <input type="number" value={maxActiveStrikesAllowed} onChange={e => setMaxActiveStrikesAllowed(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-rose-400 font-bold outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                  {editingProfile ? 'Save Profile Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProf && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Delete Eligibility Profile?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Are you sure you want to delete <strong className="text-white">{deleteConfirmProf.code || deleteConfirmProf.name}</strong>?</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmProf(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
              <button onClick={() => { deleteEligibilityProfile(deleteConfirmProf.id); setDeleteConfirmProf(null); }} className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]">
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
