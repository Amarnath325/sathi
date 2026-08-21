'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  Clock, Calendar, CheckCircle2, Search, Plus, X, Edit2, Trash2, Copy, Power,
  AlertTriangle, Layers, DollarSign, RefreshCw, Zap, Shield, FileText, CheckSquare, RotateCcw
} from 'lucide-react';
import { BookingRuleItem, CancellationTierRule } from '@/lib/types/serviceHub';

export function BookingCancellationTab() {
  const {
    bookingRules,
    categories,
    services,
    addBookingRule,
    updateBookingRule,
    deleteBookingRule,
    toggleBookingRuleStatus,
    duplicateBookingRule,
    searchQuery: globalSearch
  } = useServiceHubStore();

  const [selectedRuleId, setSelectedRuleId] = useState<string>(bookingRules[0]?.id || '');
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'BOOKING' | 'CANCELLATION' | 'REFUND' | 'PREVIEW'>('BOOKING');
  const [editingRule, setEditingRule] = useState<BookingRuleItem | null>(null);
  const [deleteConfirmRule, setDeleteConfirmRule] = useState<BookingRuleItem | null>(null);

  // Form Fields State
  // Identity & Scope
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [scopeType, setScopeType] = useState<'GLOBAL' | 'CATEGORY' | 'SERVICE'>('GLOBAL');
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');

  // 1. Booking Rules
  const [minAdvanceHours, setMinAdvanceHours] = useState(2);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(30);
  const [instantBookingAllowed, setInstantBookingAllowed] = useState(true);
  const [minDurationHours, setMinDurationHours] = useState(1);
  const [maxDurationHours, setMaxDurationHours] = useState(12);
  const [extensionAllowed, setExtensionAllowed] = useState(true);
  const [maxExtensionHours, setMaxExtensionHours] = useState(4);
  const [reschedulingAllowed, setReschedulingAllowed] = useState(true);
  const [rescheduleCutoffHours, setRescheduleCutoffHours] = useState(4);
  const [companionApprovalRequired, setCompanionApprovalRequired] = useState(true);
  const [adminApprovalRequired, setAdminApprovalRequired] = useState(false);

  // 2. Cancellation Rules
  const [freeCancellationWindowMins, setFreeCancellationWindowMins] = useState(1440); // 24h
  const [customerCancellationAllowed, setCustomerCancellationAllowed] = useState(true);
  const [companionCancellationPenaltyScore, setCompanionCancellationPenaltyScore] = useState(10);
  const [companionReassignmentEnabled, setCompanionReassignmentEnabled] = useState(true);
  const [cancellationTiers, setCancellationTiers] = useState<CancellationTierRule[]>([
    { hoursBeforeBooking: 24, refundPercentage: 100, cancellationFeePercent: 0 },
    { hoursBeforeBooking: 12, refundPercentage: 75, cancellationFeePercent: 25 },
    { hoursBeforeBooking: 2, refundPercentage: 50, cancellationFeePercent: 50 }
  ]);
  const [noShowGracePeriodMins, setNoShowGracePeriodMins] = useState(20);
  const [noShowFeePercent, setNoShowFeePercent] = useState(100);
  const [emergencyCancellationAllowed, setEmergencyCancellationAllowed] = useState(true);
  const [emergencyCancellationPolicyText, setEmergencyCancellationPolicyText] = useState('Full refund for verified medical emergencies or severe weather alerts.');

  // 3. Refund Rules
  const [refundSchedule, setRefundSchedule] = useState<'INSTANT_PAYMENT_METHOD' | 'THREE_TO_FIVE_DAYS' | 'WALLET_CREDIT'>('THREE_TO_FIVE_DAYS');
  const [platformFeeNonRefundable, setPlatformFeeNonRefundable] = useState(true);
  const [platformFeePercent, setPlatformFeePercent] = useState(5);
  const [gatewayFeeRetentionPercent, setGatewayFeeRetentionPercent] = useState(2);
  const [partialRefundEnabled, setPartialRefundEnabled] = useState(true);
  const [partialRefundFormulaText, setPartialRefundFormulaText] = useState('Pro-rata refund for unused hours minus 15% administrative fee.');
  const [autoRefundProcessing, setAutoRefundProcessing] = useState(true);

  // Filtered Rules
  const searchTerm = localSearch || globalSearch;
  const filteredRules = useMemo(() => {
    return bookingRules.filter(r => {
      const matchesSearch = !searchTerm ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.code && r.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'ALL' || r.category_id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [bookingRules, searchTerm, categoryFilter]);

  const activeRule = bookingRules.find(r => r.id === selectedRuleId) || bookingRules[0];

  // Handlers
  const handleOpenCreate = () => {
    setEditingRule(null);
    setCode(`BKG-STD-${Date.now().toString().slice(-4)}`);
    setName('Standard Booking & Cancellation Policy');
    setDescription('2h advance notice, 1h-12h session duration, free cancellation > 24h, and tiered refunds.');
    setStatus('ACTIVE');
    setScopeType('GLOBAL');
    setCategoryId('');
    setServiceId('');

    setMinAdvanceHours(2);
    setMaxAdvanceDays(30);
    setInstantBookingAllowed(true);
    setMinDurationHours(1);
    setMaxDurationHours(12);
    setExtensionAllowed(true);
    setMaxExtensionHours(4);
    setReschedulingAllowed(true);
    setRescheduleCutoffHours(4);
    setCompanionApprovalRequired(true);
    setAdminApprovalRequired(false);

    setFreeCancellationWindowMins(1440);
    setCustomerCancellationAllowed(true);
    setCompanionCancellationPenaltyScore(10);
    setCompanionReassignmentEnabled(true);
    setCancellationTiers([
      { hoursBeforeBooking: 24, refundPercentage: 100, cancellationFeePercent: 0 },
      { hoursBeforeBooking: 12, refundPercentage: 75, cancellationFeePercent: 25 },
      { hoursBeforeBooking: 2, refundPercentage: 50, cancellationFeePercent: 50 }
    ]);
    setNoShowGracePeriodMins(20);
    setNoShowFeePercent(100);
    setEmergencyCancellationAllowed(true);
    setEmergencyCancellationPolicyText('Full refund for verified medical emergencies or severe weather alerts.');

    setRefundSchedule('THREE_TO_FIVE_DAYS');
    setPlatformFeeNonRefundable(true);
    setPlatformFeePercent(5);
    setGatewayFeeRetentionPercent(2);
    setPartialRefundEnabled(true);
    setPartialRefundFormulaText('Pro-rata refund for unused hours minus 15% administrative fee.');
    setAutoRefundProcessing(true);

    setActiveModalTab('BOOKING');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rule: BookingRuleItem) => {
    setEditingRule(rule);
    setCode(rule.code || `BKG-${rule.id.slice(-4)}`);
    setName(rule.name);
    setDescription(rule.description || '');
    setStatus(rule.status);
    setScopeType(rule.scope_type || 'GLOBAL');
    setCategoryId(rule.category_id || '');
    setServiceId(rule.service_id || '');

    if (rule.booking_rules) {
      setMinAdvanceHours(rule.booking_rules.min_advance_hours);
      setMaxAdvanceDays(rule.booking_rules.max_advance_days);
      setInstantBookingAllowed(rule.booking_rules.instant_booking_allowed);
      setMinDurationHours(rule.booking_rules.min_duration_hours);
      setMaxDurationHours(rule.booking_rules.max_duration_hours);
      setExtensionAllowed(rule.booking_rules.extension_allowed);
      setMaxExtensionHours(rule.booking_rules.max_extension_hours);
      setReschedulingAllowed(rule.booking_rules.rescheduling_allowed);
      setRescheduleCutoffHours(rule.booking_rules.reschedule_cutoff_hours);
      setCompanionApprovalRequired(rule.booking_rules.companion_approval_required);
      setAdminApprovalRequired(rule.booking_rules.admin_approval_required);
    }

    if (rule.cancellation_rules) {
      setFreeCancellationWindowMins(rule.cancellation_rules.free_cancellation_window_mins || 1440);
      setCustomerCancellationAllowed(rule.cancellation_rules.customer_cancellation_allowed ?? true);
      setCompanionCancellationPenaltyScore(rule.cancellation_rules.companion_cancellation_penalty_score || 10);
      setCompanionReassignmentEnabled(rule.cancellation_rules.companion_reassignment_enabled ?? true);
      if (rule.cancellation_rules.tiers) setCancellationTiers(rule.cancellation_rules.tiers);
      setNoShowGracePeriodMins(rule.cancellation_rules.no_show_grace_period_mins || 20);
      setNoShowFeePercent(rule.cancellation_rules.no_show_fee_percent || 100);
      setEmergencyCancellationAllowed(rule.cancellation_rules.emergency_cancellation_allowed ?? true);
      setEmergencyCancellationPolicyText(rule.cancellation_rules.emergency_cancellation_policy_text || '');
    }

    if (rule.refund_rules) {
      setRefundSchedule(rule.refund_rules.refund_schedule || 'THREE_TO_FIVE_DAYS');
      setPlatformFeeNonRefundable(rule.refund_rules.platform_fee_non_refundable ?? true);
      setPlatformFeePercent(rule.refund_rules.platform_fee_percent || 5);
      setGatewayFeeRetentionPercent(rule.refund_rules.gateway_fee_retention_percent || 2);
      setPartialRefundEnabled(rule.refund_rules.partial_refund_enabled ?? true);
      setPartialRefundFormulaText(rule.refund_rules.partial_refund_formula_text || '');
      setAutoRefundProcessing(rule.refund_rules.auto_refund_processing ?? true);
    }

    setActiveModalTab('BOOKING');
    setIsModalOpen(true);
  };

  const handleAddTierRow = () => {
    setCancellationTiers(prev => [...prev, { hoursBeforeBooking: 4, refundPercentage: 40, cancellationFeePercent: 60 }]);
  };

  const handleUpdateTierRow = (index: number, field: keyof CancellationTierRule, val: number) => {
    setCancellationTiers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveTierRow = (index: number) => {
    setCancellationTiers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<BookingRuleItem, 'id' | 'createdAt' | 'updatedAt'> = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      status,
      scope_type: scopeType,
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name,
      service_id: serviceId,
      service_name: services.find(s => s.id === serviceId)?.name,

      booking_rules: {
        min_advance_hours: Number(minAdvanceHours),
        max_advance_days: Number(maxAdvanceDays),
        instant_booking_allowed: instantBookingAllowed,
        min_duration_hours: Number(minDurationHours),
        max_duration_hours: Number(maxDurationHours),
        extension_allowed: extensionAllowed,
        max_extension_hours: Number(maxExtensionHours),
        rescheduling_allowed: reschedulingAllowed,
        reschedule_cutoff_hours: Number(rescheduleCutoffHours),
        companion_approval_required: companionApprovalRequired,
        admin_approval_required: adminApprovalRequired
      },

      cancellation_rules: {
        free_cancellation_window_mins: Number(freeCancellationWindowMins),
        customer_cancellation_allowed: customerCancellationAllowed,
        companion_cancellation_penalty_score: Number(companionCancellationPenaltyScore),
        companion_reassignment_enabled: companionReassignmentEnabled,
        tiers: cancellationTiers,
        no_show_grace_period_mins: Number(noShowGracePeriodMins),
        no_show_fee_percent: Number(noShowFeePercent),
        emergency_cancellation_allowed: emergencyCancellationAllowed,
        emergency_cancellation_policy_text: emergencyCancellationPolicyText.trim()
      },

      refund_rules: {
        refund_schedule: refundSchedule,
        platform_fee_non_refundable: platformFeeNonRefundable,
        platform_fee_percent: Number(platformFeePercent),
        gateway_fee_retention_percent: Number(gatewayFeeRetentionPercent),
        partial_refund_enabled: partialRefundEnabled,
        partial_refund_formula_text: partialRefundFormulaText.trim(),
        auto_refund_processing: autoRefundProcessing
      },

      min_advance_hours: Number(minAdvanceHours),
      max_advance_days: Number(maxAdvanceDays),
      min_duration_hours: Number(minDurationHours),
      max_duration_hours: Number(maxDurationHours),
      same_day_allowed: instantBookingAllowed,
      instant_booking_allowed: instantBookingAllowed,
      companion_approval_required: companionApprovalRequired
    };

    if (editingRule) {
      updateBookingRule(editingRule.id, payload);
    } else {
      addBookingRule(payload);
    }

    setIsModalOpen(false);
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
              placeholder="Search booking & cancellation policies..."
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
          <Plus className="w-3.5 h-3.5" /> Add Booking Policy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Section 1 & 2: Configured Booking & Cancellation Policies Grid */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Booking, Cancellation & Refund Policies
              <span className="ml-1.5 text-slate-500 text-[10px] font-normal">({filteredRules.length} configured)</span>
            </h4>
          </div>

          {filteredRules.length > 0 ? (
            <div className="space-y-2.5">
              {filteredRules.map(rule => {
                const isSelected = selectedRuleId === rule.id;

                return (
                  <div
                    key={rule.id}
                    className={`p-3.5 rounded-2xl bg-white border transition-all space-y-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-purple-500 shadow-2xs ring-1 ring-purple-500/20'
                        : 'border-slate-200/90 shadow-2xs hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedRuleId(rule.id)}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-purple-300 font-mono font-bold text-[10px]">
                          {rule.code || `BKG-${rule.id.slice(-4)}`}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">{rule.name}</h5>
                        <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${
                          rule.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {rule.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookingRuleStatus(rule.id); }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            rule.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title="Toggle Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateBookingRule(rule.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Duplicate Rule"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(rule); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Edit Rule"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmRule(rule); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{rule.description}</p>

                    {/* Category & Service Relational Mapping */}
                    <div className="flex items-center gap-2 text-[10px] pt-0.5">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-purple-600" /> Relational Scope:
                      </span>
                      <span className="px-2 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-bold text-[9px]">
                        {rule.category_name || 'Global (All Categories & Services)'}
                      </span>
                      {rule.service_name && (
                        <span className="px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[9px]">
                          Service: {rule.service_name}
                        </span>
                      )}
                    </div>

                    {/* Section 1 & 2 Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Advance Notice</span>
                        <span className="font-bold text-slate-900">{rule.booking_rules?.min_advance_hours || rule.min_advance_hours || 2} Hours</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Session Duration</span>
                        <span className="font-bold text-slate-900">{rule.booking_rules?.min_duration_hours || rule.min_duration_hours || 1}h - {rule.booking_rules?.max_duration_hours || rule.max_duration_hours || 12}h</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Free Cancel Window</span>
                        <span className="font-bold text-purple-700">{Math.round((rule.cancellation_rules?.free_cancellation_window_mins || 1440) / 60)} Hours</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block text-[9px]">Refund Schedule</span>
                        <span className="font-bold text-emerald-700">{rule.refund_rules?.refund_schedule || '3-5 DAYS'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No booking policies match your search.
            </div>
          )}
        </div>

        {/* Section 3: Refund Matrix & Cancellation Tiers Panel */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-purple-600" /> Tiered Cancellation & Refund Matrix
            </span>
            {activeRule && <span className="text-[10px] font-mono text-purple-600 font-bold">{activeRule.code || 'BKG-STD-01'}</span>}
          </h4>

          {activeRule ? (
            <div className="space-y-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 font-mono text-[10px] space-y-1">
                <p className="font-bold text-purple-900">{activeRule.name}</p>
                <p className="text-slate-600">Platform Retention Fee: <strong className="text-slate-900">{activeRule.refund_rules?.platform_fee_percent || 5}%</strong></p>
                <p className="text-slate-600">Gateway Fee Retention: <strong className="text-slate-900">{activeRule.refund_rules?.gateway_fee_retention_percent || 2}%</strong></p>
                <p className="text-emerald-700 font-bold">Auto Refund Engine: {activeRule.refund_rules?.auto_refund_processing !== false ? 'ACTIVE' : 'MANUAL'}</p>
              </div>

              {/* Tiers Matrix Table */}
              <div className="space-y-2">
                <h5 className="font-extrabold text-slate-700 text-[11px]">Cancellation Notice Tiers:</h5>
                <div className="space-y-1">
                  {(activeRule.cancellation_rules?.tiers || []).map((t, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between font-mono text-[10px]">
                      <span className="text-slate-600 font-bold">&gt; {t.hoursBeforeBooking} Hours Before:</span>
                      <span className="text-emerald-700 font-bold">{t.refundPercentage}% Refund</span>
                      <span className="text-rose-600 text-[9px]">({t.cancellationFeePercent}% Fee)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* No Show Rule */}
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-[10px] text-rose-900 font-mono space-y-0.5">
                <p className="font-bold">No-Show Rule:</p>
                <p>Grace Period: {activeRule.cancellation_rules?.no_show_grace_period_mins || 20} mins | Fee Charged: {activeRule.cancellation_rules?.no_show_fee_percent || 100}%</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic">Select a booking policy to inspect refund tiers.</p>
          )}
        </div>
      </div>

      {/* Complete Multi-Section Create / Edit Booking Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  {editingRule ? `Edit Booking Policy: ${editingRule.code || editingRule.name}` : 'Configure Booking & Cancellation Policy'}
                </h4>
                <p className="text-[11px] text-slate-400">Booking Rules, Cancellation Tiers & Refund Processing Matrix</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Section Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'BOOKING', label: '1. Booking Rules' },
                { id: 'CANCELLATION', label: '2. Cancellation Tiers' },
                { id: 'REFUND', label: '3. Refund Rules' },
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

            <form onSubmit={handleSaveRule} className="space-y-3 text-[11px]">
              {/* TAB 1: BOOKING RULES */}
              {activeModalTab === 'BOOKING' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Policy Code *</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="BKG-STD-01"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-purple-400 font-mono font-bold outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Policy Name *</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Standard Booking & Cancellation Policy"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
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
                      <label className="block text-slate-400 font-bold mb-1">Min Advance (h)</label>
                      <input type="number" value={minAdvanceHours} onChange={e => setMinAdvanceHours(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Max Advance (d)</label>
                      <input type="number" value={maxAdvanceDays} onChange={e => setMaxAdvanceDays(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Min Duration (h)</label>
                      <input type="number" value={minDurationHours} onChange={e => setMinDurationHours(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Max Duration (h)</label>
                      <input type="number" value={maxDurationHours} onChange={e => setMaxDurationHours(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={instantBookingAllowed} onChange={e => setInstantBookingAllowed(e.target.checked)} className="accent-purple-500 rounded" />
                      <span>Instant Booking Allowed</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={extensionAllowed} onChange={e => setExtensionAllowed(e.target.checked)} className="accent-purple-500 rounded" />
                      <span>Session Extension Allowed</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={reschedulingAllowed} onChange={e => setReschedulingAllowed(e.target.checked)} className="accent-purple-500 rounded" />
                      <span>Rescheduling Allowed</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={companionApprovalRequired} onChange={e => setCompanionApprovalRequired(e.target.checked)} className="accent-purple-500 rounded" />
                      <span>Companion Approval Required</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: CANCELLATION TIERS */}
              {activeModalTab === 'CANCELLATION' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-slate-400 font-bold">Cancellation Window Tiers (% Refund vs Notice):</label>
                    <button type="button" onClick={handleAddTierRow} className="px-2 py-1 rounded-lg bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Tier
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {cancellationTiers.map((tierRow, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 text-[10px] font-bold">&gt;</span>
                          <input
                            type="number"
                            value={tierRow.hoursBeforeBooking}
                            onChange={e => handleUpdateTierRow(idx, 'hoursBeforeBooking', Number(e.target.value))}
                            className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                          />
                          <span className="text-slate-400 text-[10px]">hrs:</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tierRow.refundPercentage}
                            onChange={e => handleUpdateTierRow(idx, 'refundPercentage', Number(e.target.value))}
                            className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-emerald-400 font-mono font-bold text-[10px]"
                          />
                          <span className="text-slate-400 text-[10px]">% Refund</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tierRow.cancellationFeePercent}
                            onChange={e => handleUpdateTierRow(idx, 'cancellationFeePercent', Number(e.target.value))}
                            className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-rose-400 font-mono text-[10px]"
                          />
                          <span className="text-slate-400 text-[10px]">% Fee</span>
                        </div>

                        <button type="button" onClick={() => handleRemoveTierRow(idx)} className="p-1 rounded-lg text-slate-400 hover:text-rose-400 ml-auto">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">No-Show Grace Period (Mins)</label>
                      <input type="number" value={noShowGracePeriodMins} onChange={e => setNoShowGracePeriodMins(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">No-Show Charge Fee (%)</label>
                      <input type="number" value={noShowFeePercent} onChange={e => setNoShowFeePercent(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-rose-400 font-bold outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REFUND RULES */}
              {activeModalTab === 'REFUND' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Refund Processing Schedule</label>
                      <select value={refundSchedule} onChange={e => setRefundSchedule(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-emerald-400 font-bold outline-none focus:border-purple-500 text-[11px]">
                        <option value="THREE_TO_FIVE_DAYS">THREE_TO_FIVE_DAYS</option>
                        <option value="INSTANT_PAYMENT_METHOD">INSTANT_PAYMENT_METHOD</option>
                        <option value="WALLET_CREDIT">WALLET_CREDIT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Platform Fee Retention (%)</label>
                      <input type="number" value={platformFeePercent} onChange={e => setPlatformFeePercent(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={platformFeeNonRefundable} onChange={e => setPlatformFeeNonRefundable(e.target.checked)} className="accent-purple-500 rounded w-4 h-4" />
                      <span>Platform Fee Non-Refundable</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input type="checkbox" checked={autoRefundProcessing} onChange={e => setAutoRefundProcessing(e.target.checked)} className="accent-emerald-500 rounded w-4 h-4" />
                      <span>Auto Refund Engine</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                  {editingRule ? 'Save Policy Changes' : 'Create Policy'}
                </button>
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
                <h4 className="font-extrabold text-sm text-white">Delete Booking Policy?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Are you sure you want to delete <strong className="text-white">{deleteConfirmRule.code || deleteConfirmRule.name}</strong>?</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmRule(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
              <button onClick={() => { deleteBookingRule(deleteConfirmRule.id); setDeleteConfirmRule(null); }} className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]">
                Delete Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
