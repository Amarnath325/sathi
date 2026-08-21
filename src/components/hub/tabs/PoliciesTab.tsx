'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import {
  Shield, CheckCircle2, Search, Plus, X, Edit2, Trash2, Copy, Power,
  FileText, History, Lock, AlertTriangle, Layers, UserCheck, PhoneCall,
  MessageSquare, Globe, ArrowUpRight, Clock, ShieldCheck, Zap, Calendar,
  CreditCard, AlertOctagon, HelpCircle, FileCheck
} from 'lucide-react';
import { PolicyItem, PolicyVersionItem, PolicyCategoryDomain } from '@/lib/types/serviceHub';

const DOMAIN_TABS: (PolicyCategoryDomain | 'ALL')[] = [
  'ALL',
  'General',
  'Booking',
  'Safety',
  'Conduct & Restrictions',
  'Cancellation & Disputes'
];

export function PoliciesTab() {
  const {
    policies,
    categories,
    services,
    addPolicy,
    updatePolicy,
    publishNewPolicyVersion,
    deletePolicy,
    togglePolicyStatus,
    duplicatePolicy,
    searchQuery: globalSearch
  } = useServiceHubStore();

  const [selectedPolId, setSelectedPolId] = useState<string>(policies[0]?.id || '');
  const [localSearch, setLocalSearch] = useState('');
  const [activeDomainTab, setActiveDomainTab] = useState<PolicyCategoryDomain | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Publish New Version Modal
  const [publishModalPol, setPublishModalPol] = useState<PolicyItem | null>(null);
  const [versionNote, setVersionNote] = useState('');

  // Main Policy Modal & Modal Tabs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'DOMAIN_SELECT' | 'GENERAL' | 'BOOKING' | 'SAFETY' | 'CONDUCT' | 'CANCELLATION' | 'ENFORCEMENT' | 'PREVIEW'>('DOMAIN_SELECT');
  const [editingPolicy, setEditingPolicy] = useState<PolicyItem | null>(null);
  const [deleteConfirmPol, setDeleteConfirmPol] = useState<PolicyItem | null>(null);

  // Form Fields State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState<PolicyCategoryDomain>('General');
  const [description, setDescription] = useState('');
  const [scopeType, setScopeType] = useState<'GLOBAL' | 'CATEGORY' | 'SERVICE' | 'LOCATION'>('GLOBAL');
  const [categoryId, setCategoryId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'DEACTIVATED'>('PUBLISHED');

  // 1. General Policy
  const [eligibilityText, setEligibilityText] = useState('Active Govt ID Verified Users aged 18+ with clear background check.');
  const [minimumAge, setMinimumAge] = useState(18);
  const [kycRequired, setKycRequired] = useState(true);
  const [backgroundCheckRequired, setBackgroundCheckRequired] = useState(true);
  const [consentRequired, setConsentRequired] = useState(true);
  const [allowedCategoriesText, setAllowedCategoriesText] = useState('Events & Social, Travel & Exploration, Fitness & Shopping');
  const [timeLocationRulesText, setTimeLocationRulesText] = useState('Public locations between 06:00 to 23:00 hours.');
  const [generalRestrictionsText, setGeneralRestrictionsText] = useState('No unverified private residential meetings.');

  // 2. Booking Policy
  const [minDurationHours, setMinDurationHours] = useState(1);
  const [maxDurationHours, setMaxDurationHours] = useState(12);
  const [advanceBookingHours, setAdvanceBookingHours] = useState(2);
  const [sameDayBookingAllowed, setSameDayBookingAllowed] = useState(true);
  const [approvalRequiredForBooking, setApprovalRequiredForBooking] = useState(true);
  const [extensionAllowed, setExtensionAllowed] = useState(true);
  const [reschedulingAllowed, setReschedulingAllowed] = useState(true);
  const [paymentRequirement, setPaymentRequirement] = useState<'FULL_ADVANCE' | 'PARTIAL_DEPOSIT' | 'POST_PAY'>('FULL_ADVANCE');

  // 3. Safety Policy
  const [publicLocationOnly, setPublicLocationOnly] = useState(true);
  const [liveLocationRequired, setLiveLocationRequired] = useState(true);
  const [checkInOutRequired, setCheckInOutRequired] = useState(true);
  const [periodicCheckInIntervalMins, setPeriodicCheckInIntervalMins] = useState(30);
  const [sosRequired, setSosRequired] = useState(true);
  const [emergencyContactRequired, setEmergencyContactRequired] = useState(true);
  const [nightBookingRestricted, setNightBookingRestricted] = useState(true);
  const [restrictedLocationsText, setRestrictedLocationsText] = useState('Unlit isolated areas, unverified private residences');
  const [autoSosEscalationMinutes, setAutoSosEscalationMinutes] = useState(5);

  // 4. Conduct & Restrictions Policy
  const [companionRulesText, setCompanionRulesText] = useState('Professional decorum, punctual check-in, active GPS sharing, respectful boundaries.');
  const [customerRulesText, setCustomerRulesText] = useState('Respectful conduct, public meeting places only, no coercion or illegal requests.');
  const [prohibitedActivityText, setProhibitedActivityText] = useState('Strictly zero tolerance for harassment, substance abuse, physical coercion, or illegal activity.');
  const [restrictedServicesText, setRestrictedServicesText] = useState('No private unverified overnight stays or non-public locations.');
  const [communicationRulesText, setCommunicationRulesText] = useState('All messaging must happen through in-app moderated chat.');
  const [zeroToleranceViolationsText, setZeroToleranceViolationsText] = useState('Immediate account ban and legal escalation upon violation report.');
  const [chatModerationRequired, setChatModerationRequired] = useState(true);
  const [incidentReportingEnabled, setIncidentReportingEnabled] = useState(true);

  // 5. Cancellation & Disputes Policy
  const [customerCancellationRulesText, setCustomerCancellationRulesText] = useState('Full refund if cancelled > 4h before booking; 50% refund within 2h to 4h.');
  const [companionCancellationRulesText, setCompanionCancellationRulesText] = useState('Companion cancellation incurs penalty score and instant reassignment.');
  const [noShowPolicyText, setNoShowPolicyText] = useState('No-show after 20 mins grace period incurs 100% booking charge.');
  const [refundRulesText, setRefundRulesText] = useState('Processed back to original payment method within 3-5 business days.');
  const [complaintProtocolText, setComplaintProtocolText] = useState('Report via app within 24 hours of booking completion.');
  const [incidentEscalationText, setIncidentEscalationText] = useState('Safety Desk response within 15 minutes for flagged incidents.');
  const [disputeResolutionText, setDisputeResolutionText] = useState('Independent dispute arbitration panel review within 48 hours.');
  const [enforcementType, setEnforcementType] = useState<'STRICT_BLOCK' | 'WARNING_ACKNOWLEDGEMENT' | 'MANUAL_REVIEW'>('STRICT_BLOCK');
  const [exceptionsAllowed, setExceptionsAllowed] = useState(false);
  const [exceptionProcessText, setExceptionProcessText] = useState('Medical emergency exceptions reviewed by Support Lead.');

  // Filtered Policies List
  const searchTerm = localSearch || globalSearch;
  const filteredPolicies = useMemo(() => {
    return policies.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDomain = activeDomainTab === 'ALL' || p.policy_domain === activeDomainTab;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || p.category_id === categoryFilter;

      return matchesSearch && matchesDomain && matchesStatus && matchesCategory;
    });
  }, [policies, searchTerm, activeDomainTab, statusFilter, categoryFilter]);

  const activePolicy = policies.find(p => p.id === selectedPolId) || policies[0];

  // Handlers
  const handleOpenCreate = () => {
    setEditingPolicy(null);
    setCode(`POL-GEN-${Date.now().toString().slice(-4)}`);
    setName('');
    setDomain('General');
    setDescription('');
    setScopeType('GLOBAL');
    setCategoryId('');
    setServiceId('');
    setStatus('PUBLISHED');
    setActiveModalTab('DOMAIN_SELECT');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pol: PolicyItem) => {
    setEditingPolicy(pol);
    setCode(pol.code || `POL-${pol.id.slice(-4)}`);
    setName(pol.name);
    setDomain(pol.policy_domain || 'General');
    setDescription(pol.description);
    setScopeType(pol.scope_type || 'GLOBAL');
    setCategoryId(pol.category_id || '');
    setServiceId(pol.service_id || '');
    setStatus(pol.status);

    // Populate Domain Details
    setEligibilityText(pol.eligibility_text || '');
    setMinimumAge(pol.minimum_age || 18);
    setKycRequired(pol.kyc_required);
    setBackgroundCheckRequired(pol.background_check_required);
    setConsentRequired(pol.consent_required);
    setAllowedCategoriesText(pol.allowed_categories_text || '');
    setTimeLocationRulesText(pol.time_location_rules_text || '');
    setGeneralRestrictionsText(pol.general_restrictions_text || '');

    setMinDurationHours(pol.min_duration_hours || 1);
    setMaxDurationHours(pol.max_duration_hours || 12);
    setAdvanceBookingHours(pol.advance_booking_hours || 2);
    setSameDayBookingAllowed(pol.same_day_booking_allowed ?? true);
    setApprovalRequiredForBooking(pol.approval_required_for_booking ?? true);
    setExtensionAllowed(pol.extension_allowed ?? true);
    setReschedulingAllowed(pol.rescheduling_allowed ?? true);
    setPaymentRequirement(pol.payment_requirement || 'FULL_ADVANCE');

    setPublicLocationOnly(pol.public_location_only);
    setLiveLocationRequired(pol.live_location_required);
    setCheckInOutRequired(pol.check_in_out_required ?? true);
    setPeriodicCheckInIntervalMins(pol.periodic_check_in_interval_mins || 30);
    setSosRequired(pol.sos_required);
    setEmergencyContactRequired(pol.emergency_contact_required);
    setNightBookingRestricted(pol.night_booking_restricted ?? true);
    setRestrictedLocationsText(pol.restricted_locations_text || '');
    setAutoSosEscalationMinutes(pol.auto_sos_escalation_minutes || 5);

    setCompanionRulesText(pol.companion_rules_text || '');
    setCustomerRulesText(pol.customer_rules_text || '');
    setProhibitedActivityText(pol.prohibited_activity_text || '');
    setRestrictedServicesText(pol.restricted_services_text || '');
    setCommunicationRulesText(pol.communication_rules_text || '');
    setZeroToleranceViolationsText(pol.zero_tolerance_violations_text || '');
    setChatModerationRequired(pol.chat_moderation_required);
    setIncidentReportingEnabled(pol.incident_reporting_enabled);

    setCustomerCancellationRulesText(pol.customer_cancellation_rules_text || '');
    setCompanionCancellationRulesText(pol.companion_cancellation_rules_text || '');
    setNoShowPolicyText(pol.no_show_policy_text || '');
    setRefundRulesText(pol.refund_rules_text || '');
    setComplaintProtocolText(pol.complaint_protocol_text || '');
    setIncidentEscalationText(pol.incident_escalation_text || '');
    setDisputeResolutionText(pol.dispute_resolution_text || '');
    setEnforcementType(pol.enforcement_type || 'STRICT_BLOCK');
    setExceptionsAllowed(pol.exceptions_allowed || false);
    setExceptionProcessText(pol.exception_process_text || '');

    setActiveModalTab('DOMAIN_SELECT');
    setIsModalOpen(true);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<PolicyItem, 'id' | 'version' | 'effective_from'> = {
      code: code.trim(),
      name: name.trim(),
      policy_domain: domain,
      description: description.trim(),
      scope_type: scopeType,
      category_id: categoryId,
      category_name: categories.find(c => c.id === categoryId)?.name,
      service_id: serviceId,
      service_name: services.find(s => s.id === serviceId)?.name,
      status,

      eligibility_text: eligibilityText.trim(),
      minimum_age: Number(minimumAge),
      kyc_required: kycRequired,
      background_check_required: backgroundCheckRequired,
      consent_required: consentRequired,
      allowed_categories_text: allowedCategoriesText.trim(),
      time_location_rules_text: timeLocationRulesText.trim(),
      general_restrictions_text: generalRestrictionsText.trim(),

      min_duration_hours: Number(minDurationHours),
      max_duration_hours: Number(maxDurationHours),
      advance_booking_hours: Number(advanceBookingHours),
      same_day_booking_allowed: sameDayBookingAllowed,
      approval_required_for_booking: approvalRequiredForBooking,
      extension_allowed: extensionAllowed,
      rescheduling_allowed: reschedulingAllowed,
      payment_requirement: paymentRequirement,

      public_location_only: publicLocationOnly,
      live_location_required: liveLocationRequired,
      check_in_out_required: checkInOutRequired,
      periodic_check_in_interval_mins: Number(periodicCheckInIntervalMins),
      sos_required: sosRequired,
      emergency_contact_required: emergencyContactRequired,
      night_booking_restricted: nightBookingRestricted,
      restricted_locations_text: restrictedLocationsText.trim(),
      auto_sos_escalation_minutes: Number(autoSosEscalationMinutes),

      companion_rules_text: companionRulesText.trim(),
      customer_rules_text: customerRulesText.trim(),
      prohibited_activity_text: prohibitedActivityText.trim(),
      restricted_services_text: restrictedServicesText.trim(),
      communication_rules_text: communicationRulesText.trim(),
      zero_tolerance_violations_text: zeroToleranceViolationsText.trim(),
      chat_moderation_required: chatModerationRequired,
      incident_reporting_enabled: incidentReportingEnabled,

      customer_cancellation_rules_text: customerCancellationRulesText.trim(),
      companion_cancellation_rules_text: companionCancellationRulesText.trim(),
      no_show_policy_text: noShowPolicyText.trim(),
      refund_rules_text: refundRulesText.trim(),
      complaint_protocol_text: complaintProtocolText.trim(),
      incident_escalation_text: incidentEscalationText.trim(),
      dispute_resolution_text: disputeResolutionText.trim(),
      enforcement_type: enforcementType,
      exceptions_allowed: exceptionsAllowed,
      exception_process_text: exceptionProcessText.trim(),

      approval_status: 'APPROVED',
      approved_by: 'Policy Governance Committee'
    };

    if (editingPolicy) {
      updatePolicy(editingPolicy.id, payload);
    } else {
      addPolicy({
        ...payload,
        versions: [
          {
            version: 1,
            effective_from: new Date().toISOString(),
            description: `Initial release of ${name.trim()}`,
            published_by: 'Policy Governance'
          }
        ]
      });
    }

    setIsModalOpen(false);
  };

  const handlePublishVersionSubmit = () => {
    if (!publishModalPol || !versionNote.trim()) return;
    publishNewPolicyVersion(publishModalPol.id, versionNote.trim());
    setVersionNote('');
    setPublishModalPol(null);
  };

  const handleDeletePolicySubmit = (pol: PolicyItem) => {
    deletePolicy(pol.id);
    setDeleteConfirmPol(null);
  };

  return (
    <div className="space-y-3.5 w-full">
      {/* 5 Policy Domain Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 w-full select-none" style={{ scrollbarWidth: 'none' }}>
        {DOMAIN_TABS.map(tab => {
          const isSelected = activeDomainTab === tab;
          const count = tab === 'ALL' ? policies.length : policies.filter(p => p.policy_domain === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveDomainTab(tab)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all shrink-0 border whitespace-nowrap ${
                isSelected
                  ? 'bg-purple-600 border-purple-600 text-white shadow-2xs'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {tab === 'ALL' ? 'ALL POLICY DOMAINS' : tab.toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search by code, domain, or policy rules..."
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
          <Plus className="w-3.5 h-3.5" /> Add Policy Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Section 1: Configured Policy List */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Governance & Safety Policy Modules
              <span className="ml-1.5 text-slate-500 text-[10px] font-normal">({filteredPolicies.length} active)</span>
            </h4>
          </div>

          {filteredPolicies.length > 0 ? (
            <div className="space-y-2.5">
              {filteredPolicies.map(pol => {
                const isSelected = selectedPolId === pol.id;

                return (
                  <div
                    key={pol.id}
                    className={`p-3.5 rounded-2xl bg-white border transition-all space-y-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-purple-500 shadow-2xs ring-1 ring-purple-500/20'
                        : 'border-slate-200/90 shadow-2xs hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedPolId(pol.id)}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-purple-300 font-mono font-bold text-[10px]">
                          {pol.code || `POL-${pol.id.slice(-4)}`}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs">{pol.name}</h5>
                        <span className="px-2 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-extrabold text-[9px]">
                          {pol.policy_domain || 'General'}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-extrabold text-[9px]">
                          v{pol.version}.0
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePolicyStatus(pol.id); }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            pol.status === 'PUBLISHED' ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title="Toggle Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPublishModalPol(pol); }}
                          className="p-1.5 rounded-lg text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
                          title="Publish New Version"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicatePolicy(pol.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Duplicate Policy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(pol); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          title="Edit Policy"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmPol(pol); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete Policy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{pol.description}</p>

                    {/* Category & Service Relation Mapping Badge */}
                    <div className="flex items-center gap-2 text-[10px] pt-0.5">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-purple-600" /> Mapping Relation:
                      </span>
                      <span className="px-2 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-bold text-[9px]">
                        {pol.category_name || 'Global (All Categories & Services)'}
                      </span>
                      {pol.service_name && (
                        <span className="px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[9px]">
                          Service: {pol.service_name}
                        </span>
                      )}
                    </div>

                    {/* Domain-specific Preview Pill */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[10px] space-y-1">
                      {pol.policy_domain === 'General' && (
                        <p className="text-slate-700"><strong>Eligibility:</strong> {pol.eligibility_text || 'Govt ID Verified 18+'}</p>
                      )}
                      {pol.policy_domain === 'Booking' && (
                        <p className="text-slate-700"><strong>Booking Rules:</strong> {pol.min_duration_hours || 1}h-{pol.max_duration_hours || 12}h Duration | Advance: {pol.advance_booking_hours || 2}h | Deposit: {pol.payment_requirement || 'FULL_ADVANCE'}</p>
                      )}
                      {pol.policy_domain === 'Safety' && (
                        <p className="text-amber-800"><strong>Safety Protocols:</strong> Live GPS ({pol.live_location_required ? 'Yes' : 'No'}) | Check-In Interval: {pol.periodic_check_in_interval_mins || 30}m | SOS Escalation: {pol.auto_sos_escalation_minutes || 5}m</p>
                      )}
                      {pol.policy_domain === 'Conduct & Restrictions' && (
                        <p className="text-rose-800"><strong>Prohibited & Conduct:</strong> {pol.prohibited_activity_text || 'Zero Tolerance Violation Enforcement'}</p>
                      )}
                      {pol.policy_domain === 'Cancellation & Disputes' && (
                        <p className="text-slate-700"><strong>Cancellation & Refunds:</strong> {pol.customer_cancellation_rules_text || '50%-100% refund tiers based on notice time'}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-[11px] bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              No policies match your search filters.
            </div>
          )}
        </div>

        {/* Section 5: Version History Panel */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-purple-600" /> Immutable Version History
            </span>
            {activePolicy && <span className="text-[10px] font-mono text-purple-600 font-bold">v{activePolicy.version}.0</span>}
          </h4>

          {activePolicy ? (
            <div className="space-y-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 font-mono text-[10px] space-y-1">
                <p className="font-bold text-purple-900">{activePolicy.code || 'POL-GEN-01'}: {activePolicy.name}</p>
                <p className="text-slate-600">Domain: <strong className="text-purple-700">{activePolicy.policy_domain || 'General'}</strong></p>
                <p className="text-emerald-700 font-bold">Status: {activePolicy.status}</p>
              </div>

              {/* Version Timeline */}
              <div className="space-y-2">
                <h5 className="font-extrabold text-slate-700 text-[11px]">Published Revisions:</h5>
                {(activePolicy.versions || []).map((ver, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-purple-700 text-[10px]">Version v{ver.version}.0</span>
                      <span className="text-[9px] text-slate-400 font-mono">{new Date(ver.effective_from).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-700">{ver.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPublishModalPol(activePolicy)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Publish New Version (v{activePolicy.version + 1}.0)
              </button>
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic">Select a policy to view version history.</p>
          )}
        </div>
      </div>

      {/* Complete Multi-Domain Create / Edit Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl my-auto text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  {editingPolicy ? `Edit Policy: ${editingPolicy.code || editingPolicy.name}` : 'Configure Policy Profile'}
                </h4>
                <p className="text-[11px] text-slate-400">Category & Service Relational Policy Management</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Domain Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'DOMAIN_SELECT', label: '2. Identity & Scope' },
                { id: 'GENERAL', label: 'General' },
                { id: 'BOOKING', label: 'Booking' },
                { id: 'SAFETY', label: 'Safety' },
                { id: 'CONDUCT', label: 'Conduct' },
                { id: 'CANCELLATION', label: 'Disputes' },
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

            <form onSubmit={handleSavePolicy} className="space-y-3 text-[11px]">
              {/* TAB: IDENTITY & SCOPE */}
              {activeModalTab === 'DOMAIN_SELECT' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Policy Code *</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="POL-GEN-01"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-purple-400 font-mono font-bold outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Policy Name *</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Booking Duration & Advance Notice Policy"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Policy Domain Module *</label>
                      <select value={domain} onChange={e => setDomain(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-amber-400 font-bold outline-none focus:border-purple-500 text-[11px]">
                        <option value="General">1. General Policy</option>
                        <option value="Booking">2. Booking Policy</option>
                        <option value="Safety">3. Safety Policy</option>
                        <option value="Conduct & Restrictions">4. Conduct & Restrictions Policy</option>
                        <option value="Cancellation & Disputes">5. Cancellation & Disputes Policy</option>
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
                    <textarea rows={2} required value={description} onChange={e => setDescription(e.target.value)} placeholder="Overview of policy guidelines..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>
                </div>
              )}

              {/* TAB 1: GENERAL POLICY */}
              {activeModalTab === 'GENERAL' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">User Eligibility Criteria</label>
                    <input type="text" value={eligibilityText} onChange={e => setEligibilityText(e.target.value)} placeholder="e.g. Active Govt ID Verified Users aged 18+"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Minimum Age *</label>
                      <input type="number" required value={minimumAge} onChange={e => setMinimumAge(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-bold">
                        <input type="checkbox" checked={kycRequired} onChange={e => setKycRequired(e.target.checked)} className="accent-purple-500 rounded" />
                        <span>KYC Required</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-bold">
                        <input type="checkbox" checked={backgroundCheckRequired} onChange={e => setBackgroundCheckRequired(e.target.checked)} className="accent-purple-500 rounded" />
                        <span>Background Check</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">General Restrictions & Time/Location Rules</label>
                    <input type="text" value={generalRestrictionsText} onChange={e => setGeneralRestrictionsText(e.target.value)} placeholder="e.g. Public meeting places between 06:00 to 23:00"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>
                </div>
              )}

              {/* TAB 2: BOOKING POLICY */}
              {activeModalTab === 'BOOKING' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Min Duration (Hrs)</label>
                      <input type="number" value={minDurationHours} onChange={e => setMinDurationHours(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Max Duration (Hrs)</label>
                      <input type="number" value={maxDurationHours} onChange={e => setMaxDurationHours(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Advance Notice (Hrs)</label>
                      <input type="number" value={advanceBookingHours} onChange={e => setAdvanceBookingHours(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Payment Requirement</label>
                      <select value={paymentRequirement} onChange={e => setPaymentRequirement(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]">
                        <option value="FULL_ADVANCE">FULL_ADVANCE (100% Prepay)</option>
                        <option value="PARTIAL_DEPOSIT">PARTIAL_DEPOSIT (50% Deposit)</option>
                        <option value="POST_PAY">POST_PAY (Post Completion)</option>
                      </select>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-bold">
                        <input type="checkbox" checked={sameDayBookingAllowed} onChange={e => setSameDayBookingAllowed(e.target.checked)} className="accent-purple-500 rounded" />
                        <span>Same-Day Booking Allowed</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-bold">
                        <input type="checkbox" checked={approvalRequiredForBooking} onChange={e => setApprovalRequiredForBooking(e.target.checked)} className="accent-purple-500 rounded" />
                        <span>Admin Approval Required</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SAFETY POLICY */}
              {activeModalTab === 'SAFETY' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold p-2 bg-slate-950 border border-slate-800 rounded-xl">
                      <input type="checkbox" checked={liveLocationRequired} onChange={e => setLiveLocationRequired(e.target.checked)} className="accent-purple-500 w-4 h-4 rounded" />
                      <span>Live GPS Streaming</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold p-2 bg-slate-950 border border-slate-800 rounded-xl">
                      <input type="checkbox" checked={sosRequired} onChange={e => setSosRequired(e.target.checked)} className="accent-purple-500 w-4 h-4 rounded" />
                      <span>SOS Emergency Button</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold p-2 bg-slate-950 border border-slate-800 rounded-xl">
                      <input type="checkbox" checked={checkInOutRequired} onChange={e => setCheckInOutRequired(e.target.checked)} className="accent-purple-500 w-4 h-4 rounded" />
                      <span>Check-In / Check-Out</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold p-2 bg-slate-950 border border-slate-800 rounded-xl">
                      <input type="checkbox" checked={emergencyContactRequired} onChange={e => setEmergencyContactRequired(e.target.checked)} className="accent-purple-500 w-4 h-4 rounded" />
                      <span>Emergency Contact</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Periodic Check-In Interval (Mins)</label>
                      <input type="number" value={periodicCheckInIntervalMins} onChange={e => setPeriodicCheckInIntervalMins(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Auto-SOS Escalation Timer (Mins)</label>
                      <input type="number" value={autoSosEscalationMinutes} onChange={e => setAutoSosEscalationMinutes(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CONDUCT & RESTRICTIONS */}
              {activeModalTab === 'CONDUCT' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Companion Code of Conduct</label>
                    <input type="text" value={companionRulesText} onChange={e => setCompanionRulesText(e.target.value)} placeholder="Professional decorum, punctual check-in..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Prohibited Activities & Zero-Tolerance Text</label>
                    <textarea rows={2} value={prohibitedActivityText} onChange={e => setProhibitedActivityText(e.target.value)} placeholder="Zero tolerance for harassment or illegal activity..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-rose-300 outline-none focus:border-purple-500 text-[11px]" />
                  </div>
                </div>
              )}

              {/* TAB 5: CANCELLATION & DISPUTES */}
              {activeModalTab === 'CANCELLATION' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Customer Cancellation Rules</label>
                    <input type="text" value={customerCancellationRulesText} onChange={e => setCustomerCancellationRulesText(e.target.value)} placeholder="Full refund >4h; 50% refund within 2h-4h"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">No-Show & Dispute Resolution Protocol</label>
                    <input type="text" value={disputeResolutionText} onChange={e => setDisputeResolutionText(e.target.value)} placeholder="Independent arbitration panel review within 48 hours"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white outline-none focus:border-purple-500 text-[11px]" />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                  {editingPolicy ? 'Save Policy Changes' : 'Create Policy Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Version Modal */}
      {publishModalPol && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-extrabold text-white text-sm">Publish Version v{publishModalPol.version + 1}.0</h4>
              <button onClick={() => setPublishModalPol(null)} className="p-1 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-slate-400 font-bold mb-1 text-[11px]">Release Notes / Description *</label>
              <textarea
                rows={3}
                required
                value={versionNote}
                onChange={e => setVersionNote(e.target.value)}
                placeholder="Explain policy changes in this release..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-[11px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPublishModalPol(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
              <button onClick={handlePublishVersionSubmit} className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]">
                Publish v{publishModalPol.version + 1}.0
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmPol && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Delete Policy Profile?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Are you sure you want to delete <strong className="text-white">{deleteConfirmPol.code || deleteConfirmPol.name}</strong>?</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmPol(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px]">Cancel</button>
              <button onClick={() => handleDeletePolicySubmit(deleteConfirmPol)} className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]">
                Delete Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
