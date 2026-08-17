'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { ServiceItem } from '@/lib/types/serviceHub';
import { ServiceReadinessEngine } from '@/lib/serviceHubEngines';
import {
  X, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, DollarSign, Sliders, Shield,
  Lock, Clock, UserCheck, Check, Layers, AlertCircle
} from 'lucide-react';

interface Props {
  service: ServiceItem | null;
  onClose: () => void;
}

export function ServiceConfigDrawer({ service, onClose }: Props) {
  const {
    categories,
    pricingProfiles,
    rulesProfiles,
    policies,
    riskLevels,
    verificationProfiles,
    safetyProfiles,
    bookingRules,
    eligibilityProfiles,
    updateService,
    publishService
  } = useServiceHubStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'pricing' | 'rules' | 'policy' | 'risk' | 'verification' | 'safety' | 'booking' | 'eligibility'
  >('overview');

  if (!service) return null;

  const category = categories.find(c => c.id === service.category_id);
  const pricing = pricingProfiles.find(p => p.id === (service.pricing_profile_id || category?.default_pricing_profile_id));
  const rules = rulesProfiles.find(r => r.id === (service.rules_profile_id || category?.default_rules_id));
  const policy = policies.find(p => p.id === (service.policy_id || category?.default_policy_id));
  const risk = riskLevels.find(r => r.id === (service.risk_level_id || category?.default_risk_level_id));
  const verification = verificationProfiles.find(v => v.id === (service.verification_profile_id || category?.default_verification_profile_id));
  const safety = safetyProfiles.find(s => s.id === (service.safety_profile_id || category?.default_safety_profile_id));
  const bookingRule = bookingRules.find(b => b.id === (service.booking_rule_id || category?.default_booking_rule_id));
  const eligibility = eligibilityProfiles.find(e => e.id === (service.eligibility_profile_id || category?.default_eligibility_profile_id));

  const readiness = ServiceReadinessEngine.checkReadiness(
    service, category, pricing, rules, policy, risk, verification, safety, bookingRule, eligibility
  );

  const handlePublish = () => {
    const res = publishService(service.id);
    if (!res.success) {
      alert(`Cannot publish service: Missing mandatory configurations:\n• ${res.readinessMissing?.join('\n• ')}`);
    } else {
      alert(`Service "${service.name}" is now PUBLISHED and live for user bookings!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-3xl h-full flex flex-col shadow-2xl animate-fade-in">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-lg">{service.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  service.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {service.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Category: <span className="text-indigo-400 font-semibold">{category?.name || 'Unassigned'}</span> | Centralized Configuration Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Point Readiness Checklist Header Widget */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
              readiness.isReadyToPublish ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {readiness.isReadyToPublish ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{readiness.isReadyToPublish ? '10/10 Configured — Ready to Publish' : `${10 - readiness.missingItems.length}/10 Configured (${readiness.missingItems.length} Incomplete)`}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {service.status !== 'PUBLISHED' && (
              <button
                onClick={handlePublish}
                disabled={!readiness.isReadyToPublish}
                className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
                  readiness.isReadyToPublish ? 'gradient-bg-primary text-white shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Publish Service
              </button>
            )}
          </div>
        </div>

        {/* Configuration Navigation Sub-Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', ok: readiness.category },
            { id: 'pricing', label: 'Pricing', ok: readiness.pricing },
            { id: 'rules', label: 'Rules', ok: readiness.rules },
            { id: 'policy', label: 'Policy', ok: readiness.policy },
            { id: 'risk', label: 'Risk', ok: readiness.risk },
            { id: 'verification', label: 'Verification', ok: readiness.verification },
            { id: 'safety', label: 'Safety', ok: readiness.safety },
            { id: 'booking', label: 'Booking', ok: readiness.booking },
            { id: 'eligibility', label: 'Eligibility', ok: readiness.eligibility }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSubTab === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`w-2 h-2 rounded-full ${tab.ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </button>
          ))}
        </div>

        {/* Sub-Tab Content Workspace */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Service Metadata & Scope</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Service Name</label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(service.id, { name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={service.category_id}
                    onChange={(e) => updateService(service.id, { category_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Short Description</label>
                <input
                  type="text"
                  value={service.short_description || ''}
                  onChange={(e) => updateService(service.id, { short_description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  value={service.description}
                  onChange={(e) => updateService(service.id, { description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                />
              </div>
            </div>
          )}

          {activeSubTab === 'pricing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">Pricing Configuration</h4>
                <span className="text-slate-400 font-mono text-[10px]">Override Category Defaults</span>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Select Pricing Profile</label>
                <select
                  value={service.pricing_profile_id || ''}
                  onChange={(e) => updateService(service.id, { pricing_profile_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none font-bold"
                >
                  <option value="">-- Use Category Default ({category?.name}) --</option>
                  {pricingProfiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.pricing_type} - ₹{p.base_price})</option>
                  ))}
                </select>
              </div>

              {pricing && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="font-bold text-indigo-400">Active Profile: {pricing.name}</p>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-300">
                    <div>Base: ₹{pricing.base_price}</div>
                    <div>Platform Fee: {pricing.platform_fee}%</div>
                    <div>Commission: {pricing.companion_commission}%</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'rules' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Operational Rules Assignment</h4>
              <select
                value={service.rules_profile_id || ''}
                onChange={(e) => updateService(service.id, { rules_profile_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none font-bold"
              >
                <option value="">-- Use Category Default Rules --</option>
                {rulesProfiles.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.rules.length} Rules)</option>
                ))}
              </select>
            </div>
          )}

          {activeSubTab === 'policy' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Usage Policy Assignment</h4>
              <select
                value={service.policy_id || ''}
                onChange={(e) => updateService(service.id, { policy_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none font-bold"
              >
                <option value="">-- Use Category Default Policy --</option>
                {policies.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (v{p.version})</option>
                ))}
              </select>
            </div>
          )}

          {activeSubTab === 'risk' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Risk Assessment Assignment</h4>
              <select
                value={service.risk_level_id || ''}
                onChange={(e) => updateService(service.id, { risk_level_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none font-bold"
              >
                <option value="">-- Use Category Default Risk --</option>
                {riskLevels.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                ))}
              </select>
            </div>
          )}

          {activeSubTab === 'verification' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Verification Requirements</h4>
              <select
                value={service.verification_profile_id || ''}
                onChange={(e) => updateService(service.id, { verification_profile_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none font-bold"
              >
                <option value="">-- Use Category Default Verification --</option>
                {verificationProfiles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.verification_level})</option>
                ))}
              </select>
            </div>
          )}

          {activeSubTab === 'safety' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Safety Controls Suite</h4>
              <select
                value={service.safety_profile_id || ''}
                onChange={(e) => updateService(service.id, { safety_profile_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none font-bold"
              >
                <option value="">-- Use Category Default Safety Profile --</option>
                {safetyProfiles.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {activeSubTab === 'booking' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Booking & Cancellation Rules</h4>
              <select
                value={service.booking_rule_id || ''}
                onChange={(e) => updateService(service.id, { booking_rule_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none font-bold"
              >
                <option value="">-- Use Category Default Booking Rules --</option>
                {bookingRules.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {activeSubTab === 'eligibility' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Companion Eligibility Matrix</h4>
              <select
                value={service.eligibility_profile_id || ''}
                onChange={(e) => updateService(service.id, { eligibility_profile_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none font-bold"
              >
                <option value="">-- Use Category Default Eligibility Profile --</option>
                {eligibilityProfiles.map(el => (
                  <option key={el.id} value={el.id}>{el.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
