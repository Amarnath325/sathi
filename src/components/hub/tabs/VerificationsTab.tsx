'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  UserCheck, ShieldCheck, Search, Plus, X, Edit2, Trash2, Copy, Power,
  CheckCircle2, FileText, Lock, AlertTriangle, Layers, Clock, RefreshCw,
  UserX, CheckSquare, Eye, Sparkles, Building, Phone, Camera, MapPin, FileCode
} from 'lucide-react';
import { VerificationProfileItem, VerificationLevelTier, VerificationCheckDetail } from '@/lib/types/serviceHub';

const TIER_TABS: (VerificationLevelTier | 'ALL')[] = [
  'ALL',
  'Basic',
  'Standard',
  'Enhanced',
  'Restricted'
];

export function VerificationsTab() {
  const {
    verificationProfiles,
    categories,
    services,
    addVerificationProfile,
    updateVerificationProfile,
    deleteVerificationProfile,
    toggleVerificationProfileStatus,
    duplicateVerificationProfile,
    searchQuery: globalSearch
  } = useServiceHubStore();

  const [selectedProfId, setSelectedProfId] = useState<string>(verificationProfiles[0]?.id || '');
  const [localSearch, setLocalSearch] = useState('');
  const [activeTierTab, setActiveTierTab] = useState<VerificationLevelTier | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'IDENTITY' | 'CHECKS' | 'GOVERNANCE' | 'PREVIEW'>('IDENTITY');
  const [editingProfile, setEditingProfile] = useState<VerificationProfileItem | null>(null);
  const [deleteConfirmProf, setDeleteConfirmProf] = useState<VerificationProfileItem | null>(null);

  // Form Fields State
  // 1. Basic Information
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [tier, setTier] = useState<VerificationLevelTier>('Basic');
  const [description, setDescription] = useState('');
  const [scopeType, setScopeType] = useState<'GLOBAL' | 'CATEGORY' | 'SERVICE'>('GLOBAL');
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // 2. Verification Checks Matrix State
  const [checks, setChecks] = useState<VerificationProfileItem['checks']>({
    identity: { enabled: true, required: true, expiry_days: 365, accepted_documents_text: 'Aadhaar, Passport, Driving License' },
    contact: { enabled: true, required: true, expiry_days: 365, accepted_documents_text: 'Phone OTP & Verified Email' },
    face: { enabled: true, required: true, expiry_days: 180, accepted_documents_text: 'Live Camera Selfie' },
    address: { enabled: true, required: true, expiry_days: 365, accepted_documents_text: 'Utility Bill, Rent Agreement' },
    background: { enabled: false, required: false, expiry_days: 180, accepted_documents_text: 'Police Clearance Certificate (PCC)' },
    emergency: { enabled: true, required: true, accepted_documents_text: '2 Emergency Contacts' },
    additional_documents: { enabled: false, required: false, accepted_documents_text: 'Medical Fitness Certificate' }
  });

  // 3. Verification Rules & Governance
  const [applicabilityRoles, setApplicabilityRoles] = useState<('COMPANION' | 'CLIENT' | 'AGENT')[]>(['COMPANION']);
  const [applicabilityTrigger, setApplicabilityTrigger] = useState<'ALL_USERS' | 'HIGH_RISK_BOOKINGS' | 'NIGHT_BOOKINGS'>('ALL_USERS');
  const [expiryDurationDays, setExpiryDurationDays] = useState(365);
  const [reVerificationPolicy, setReVerificationPolicy] = useState<'ANNUAL_RENEWAL' | 'QUARTERLY_RECHECK' | 'POST_INCIDENT_MANDATORY'>('ANNUAL_RENEWAL');
  const [failureAction, setFailureAction] = useState<'AUTO_SUSPEND' | 'BLOCK_BOOKINGS' | 'FLAG_FOR_REVIEW'>('BLOCK_BOOKINGS');
  const [maxRetryAttempts, setMaxRetryAttempts] = useState(3);
  const [manualReviewRequired, setManualReviewRequired] = useState(false);
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(true);

  // Filtered Verification Profiles List
  const searchTerm = localSearch || globalSearch;
  const filteredProfiles = useMemo(() => {
    return verificationProfiles.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = activeTierTab === 'ALL' || p.profile_tier === activeTierTab || p.verification_level === activeTierTab;
      const matchesCategory = categoryFilter === 'ALL' || p.category_id === categoryFilter;

      return matchesSearch && matchesTier && matchesCategory;
    });
  }, [verificationProfiles, searchTerm, activeTierTab, categoryFilter]);

  const activeProfile = verificationProfiles.find(p => p.id === selectedProfId) || verificationProfiles[0];

  // Handlers
  const handleOpenCreate = () => {
    setEditingProfile(null);
    setCode(`VER-BAS-${Date.now().toString().slice(-4)}`);
    setName('');
    setTier('Basic');
    setDescription('');
    setScopeType('GLOBAL');
    setCategoryId('');
    setServiceId('');
    setStatus('ACTIVE');
    setChecks({
      identity: { enabled: true, required: true, expiry_days: 365, accepted_documents_text: 'Aadhaar, Passport, Voter ID' },
      contact: { enabled: true, required: true, expiry_days: 365, accepted_documents_text: 'Phone OTP & Verified Email' },
      face: { enabled: true, required: true, expiry_days: 180, accepted_documents_text: 'Live Camera Selfie' },
      address: { enabled: false, required: false },
      background: { enabled: false, required: false },
      emergency: { enabled: true, required: true, accepted_documents_text: '1 Primary Emergency Contact' },
      additional_documents: { enabled: false, required: false }
    });
    setApplicabilityRoles(['COMPANION']);
    setApplicabilityTrigger('ALL_USERS');
    setExpiryDurationDays(365);
    setReVerificationPolicy('ANNUAL_RENEWAL');
    setFailureAction('BLOCK_BOOKINGS');
    setMaxRetryAttempts(3);
    setManualReviewRequired(false);
    setAutoApprovalEnabled(true);
    setActiveModalTab('IDENTITY');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prof: VerificationProfileItem) => {
    setEditingProfile(prof);
    setCode(prof.code || `VER-${prof.id.slice(-4)}`);
    setName(prof.name);
    setTier(prof.profile_tier || (prof.verification_level as any) || 'Basic');
    setDescription(prof.description);
    setScopeType(prof.scope_type || 'GLOBAL');
    setCategoryId(prof.category_id || '');
    setServiceId(prof.service_id || '');
    setStatus(prof.status);

    if (prof.checks) {
      setChecks(prof.checks);
    }

    setApplicabilityRoles(prof.applicability_roles || ['COMPANION']);
    setApplicabilityTrigger(prof.applicability_trigger || 'ALL_USERS');
    setExpiryDurationDays(prof.expiry_duration_days || 365);
    setReVerificationPolicy(prof.re_verification_policy || 'ANNUAL_RENEWAL');
    setFailureAction(prof.failure_action || 'BLOCK_BOOKINGS');
    setMaxRetryAttempts(prof.max_retry_attempts || 3);
    setManualReviewRequired(prof.manual_review_required || false);
    setAutoApprovalEnabled(prof.auto_approval_enabled ?? true);

    setActiveModalTab('IDENTITY');
    setIsModalOpen(true);
  };

  const handleToggleCheck = (checkKey: keyof VerificationProfileItem['checks'], field: 'enabled' | 'required') => {
    setChecks(prev => ({
      ...prev,
      [checkKey]: {
        ...prev[checkKey],
        [field]: !prev[checkKey][field]
      }
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<VerificationProfileItem, 'id' | 'createdAt' | 'updatedAt'> = {
      code: code.trim(),
      name: name.trim(),
      profile_tier: tier,
      verification_level: tier as any,
      description: description.trim(),
      status,
      scope_type: scopeType,
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name,
      service_id: serviceId,
      service_name: services.find(s => s.id === serviceId)?.name,

      checks,
      requirements: {
        email: Boolean(checks.contact?.enabled),
        mobile: Boolean(checks.contact?.enabled),
        government_id: Boolean(checks.identity?.enabled),
        selfie: Boolean(checks.face?.enabled),
        face_match: Boolean(checks.face?.enabled && checks.face?.required),
        address: Boolean(checks.address?.enabled),
        background_check: Boolean(checks.background?.enabled),
        emergency_contact: Boolean(checks.emergency?.enabled),
        additional_document: Boolean(checks.additional_documents?.enabled),
        manual_review: manualReviewRequired
      },

      applicability_roles: applicabilityRoles,
      applicability_trigger: applicabilityTrigger,
      expiry_duration_days: Number(expiryDurationDays),
      re_verification_policy: reVerificationPolicy,
      failure_action: failureAction,
      max_retry_attempts: Number(maxRetryAttempts),
      manual_review_required: manualReviewRequired,
      auto_approval_enabled: autoApprovalEnabled
    };

    if (editingProfile) {
      updateVerificationProfile(editingProfile.id, payload);
    } else {
      addVerificationProfile(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3.5 w-full">
      {/* Verification Profile Tier Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 w-full select-none" style={{ scrollbarWidth: 'none' }}>
        {TIER_TABS.map(tab => {
          const isSelected = activeTierTab === tab;
          const count = tab === 'ALL' ? verificationProfiles.length : verificationProfiles.filter(p => p.profile_tier === tab || p.verification_level === tab).length;

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
              {tab === 'ALL' ? 'ALL TIERS' : tab.toUpperCase()} ({count})
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
              placeholder="Search by code, tier, or verification checks..."
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
          <Plus className="w-3.5 h-3.5" /> Add Verification Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Section 1: Configured Profiles Grid */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Configured Verification Profiles
              <span className="ml-1.5 text-slate-500 text-[10px] font-normal">({filteredProfiles.length} total)</span>
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
                          {prof.code || `VER-${prof.id.slice(-4)}`}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">{prof.name}</h5>
                        <span className={`px-2 py-0.2 rounded-full font-extrabold text-[9px] ${
                          prof.profile_tier === 'Restricted' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                          prof.profile_tier === 'Enhanced' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          prof.profile_tier === 'Standard' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                          'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}>
                          Tier: {prof.profile_tier || prof.verification_level}
                        </span>
                        <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${
                          prof.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {prof.status}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVerificationProfileStatus(prof.id); }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            prof.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title="Toggle Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateVerificationProfile(prof.id); }}
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

                    {/* Section 2: Verification Checks Matrix Pills */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Active Verification Checks Matrix:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prof.checks?.identity?.enabled && <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[9px]">Identity (Govt ID)</span>}
                        {prof.checks?.contact?.enabled && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px]">Contact (OTP & Email)</span>}
                        {prof.checks?.face?.enabled && <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[9px]">Face Match Selfie</span>}
                        {prof.checks?.address?.enabled && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[9px]">Address Proof</span>}
                        {prof.checks?.background?.enabled && <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[9px]">Police Clearance Check</span>}
                        {prof.checks?.emergency?.enabled && <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[9px]">Emergency Contacts</span>}
                        {prof.checks?.additional_documents?.enabled && <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-bold text-[9px]">Medical & Additional Docs</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No verification profiles match your search.
            </div>
          )}
        </div>

        {/* Section 3: Verification Rules & Governance Details Panel */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Governance & Enforcement
            </span>
            {activeProfile && <span className="text-[10px] font-mono text-purple-600 font-bold">{activeProfile.code || 'VER-BAS-01'}</span>}
          </h4>

          {activeProfile ? (
            <div className="space-y-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 font-mono text-[10px] space-y-1">
                <p className="font-bold text-purple-900">{activeProfile.name}</p>
                <p className="text-slate-600">Validity Expiry: <strong className="text-slate-900">{activeProfile.expiry_duration_days || 365} Days</strong></p>
                <p className="text-slate-600">Re-Verification: <strong className="text-purple-700">{activeProfile.re_verification_policy || 'ANNUAL_RENEWAL'}</strong></p>
                <p className="text-rose-700 font-bold">Failure Action: {activeProfile.failure_action || 'BLOCK_BOOKINGS'}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-[10px]">
                <p className="font-bold text-slate-700">Audit & Review Queue:</p>
                <p className="text-slate-600">Manual Admin Audit Queue: <strong className={activeProfile.manual_review_required ? 'text-amber-600 font-bold' : 'text-slate-500'}>{activeProfile.manual_review_required ? 'REQUIRED' : 'NO'}</strong></p>
                <p className="text-slate-600">AI Auto Approval Engine: <strong className={activeProfile.auto_approval_enabled !== false ? 'text-emerald-600 font-bold' : 'text-slate-500'}>{activeProfile.auto_approval_enabled !== false ? 'ENABLED' : 'DISABLED'}</strong></p>
                <p className="text-slate-600">Max Retry Attempts: <strong className="text-slate-900">{activeProfile.max_retry_attempts || 3} Tries</strong></p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic">Select a verification profile to inspect governance rules.</p>
          )}
        </div>
      </div>

      {/* Complete Multi-Section Create / Edit Verification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  {editingProfile ? `Edit Profile: ${editingProfile.code || editingProfile.name}` : 'Configure Verification Profile'}
                </h4>
                <p className="text-[11px] text-slate-400">Verification Checks, Governance Rules & Relational Scope</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Section Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'IDENTITY', label: '1. Identity & Scope' },
                { id: 'CHECKS', label: '2. Checks Matrix' },
                { id: 'GOVERNANCE', label: '3. Rules & Governance' },
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
              {/* TAB 1: IDENTITY & SCOPE */}
              {activeModalTab === 'IDENTITY' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Profile Code *</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="VER-BAS-01"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-purple-400 font-mono font-bold outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Profile Name *</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Standard Verification Profile"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Verification Profile Tier *</label>
                      <select value={tier} onChange={e => setTier(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-amber-400 font-bold outline-none focus:border-purple-500 text-[11px]">
                        <option value="Basic">Basic Profile</option>
                        <option value="Standard">Standard Profile</option>
                        <option value="Enhanced">Enhanced Profile</option>
                        <option value="Restricted">Restricted Profile</option>
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
                    <textarea rows={2} required value={description} onChange={e => setDescription(e.target.value)} placeholder="Overview of verification level required..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>
                </div>
              )}

              {/* TAB 2: VERIFICATION CHECKS MATRIX */}
              {activeModalTab === 'CHECKS' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-slate-400">Configure enabled checks and required/optional status:</p>
                  
                  {[
                    { key: 'identity', label: '1. Identity Check (Aadhaar / Passport / Voter ID)' },
                    { key: 'contact', label: '2. Contact Verification (Phone OTP & Email)' },
                    { key: 'face', label: '3. Face Match & Live Camera Selfie' },
                    { key: 'address', label: '4. Address Proof (Rent Agreement / Utility Bill)' },
                    { key: 'background', label: '5. Police Criminal Background Check (PCC)' },
                    { key: 'emergency', label: '6. Primary Emergency Contacts' },
                    { key: 'additional_documents', label: '7. Additional Documents (Medical / Guardian)' },
                  ].map(item => {
                    const checkState = checks[item.key as keyof typeof checks] || { enabled: false, required: false };

                    return (
                      <div key={item.key} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-200 text-[11px]">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-slate-400">
                            <input
                              type="checkbox"
                              checked={checkState.enabled}
                              onChange={() => handleToggleCheck(item.key as any, 'enabled')}
                              className="accent-purple-500 rounded"
                            />
                            <span>Enabled</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-amber-400">
                            <input
                              type="checkbox"
                              checked={checkState.required}
                              onChange={() => handleToggleCheck(item.key as any, 'required')}
                              disabled={!checkState.enabled}
                              className="accent-amber-500 rounded"
                            />
                            <span>Mandatory</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: RULES & GOVERNANCE */}
              {activeModalTab === 'GOVERNANCE' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Expiry Duration (Days)</label>
                      <input type="number" value={expiryDurationDays} onChange={e => setExpiryDurationDays(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Re-Verification Trigger</label>
                      <select value={reVerificationPolicy} onChange={e => setReVerificationPolicy(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="ANNUAL_RENEWAL">ANNUAL_RENEWAL (Every 365 Days)</option>
                        <option value="QUARTERLY_RECHECK">QUARTERLY_RECHECK (Every 90 Days)</option>
                        <option value="POST_INCIDENT_MANDATORY">POST_INCIDENT_MANDATORY</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Failure Enforcement</label>
                      <select value={failureAction} onChange={e => setFailureAction(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-rose-400 font-bold outline-none focus:border-purple-500 text-[11px]">
                        <option value="BLOCK_BOOKINGS">BLOCK_BOOKINGS (Halt Escort)</option>
                        <option value="AUTO_SUSPEND">AUTO_SUSPEND (Suspend Account)</option>
                        <option value="FLAG_FOR_REVIEW">FLAG_FOR_REVIEW</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Max Retry Limit</label>
                      <input type="number" value={maxRetryAttempts} onChange={e => setMaxRetryAttempts(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={manualReviewRequired} onChange={e => setManualReviewRequired(e.target.checked)} className="accent-purple-500 rounded w-4 h-4" />
                      <span>Admin Manual Audit Queue Sign-Off</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={autoApprovalEnabled} onChange={e => setAutoApprovalEnabled(e.target.checked)} className="accent-emerald-500 rounded w-4 h-4" />
                      <span>AI Auto Approval Engine</span>
                    </label>
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
                <h4 className="font-extrabold text-sm text-white">Delete Verification Profile?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Are you sure you want to delete <strong className="text-white">{deleteConfirmProf.code || deleteConfirmProf.name}</strong>?</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmProf(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
              <button onClick={() => { deleteVerificationProfile(deleteConfirmProf.id); setDeleteConfirmProf(null); }} className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]">
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
