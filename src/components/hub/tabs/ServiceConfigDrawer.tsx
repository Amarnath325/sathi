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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end overflow-hidden">
      <div className="bg-slate-900 border-l border-slate-800 w-full sm:max-w-2xl md:max-w-3xl h-full flex flex-col shadow-2xl animate-fade-in overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-white text-base sm:text-lg">{service.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  service.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {service.status}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Category: <span className="text-indigo-400 font-semibold">{category?.name || 'Unassigned'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Point Readiness Checklist Header Widget */}
        <div className="p-3.5 sm:p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold w-full sm:w-auto justify-center ${
              readiness.isReadyToPublish ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {readiness.isReadyToPublish ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{readiness.isReadyToPublish ? '10/10 Ready to Publish' : `${10 - readiness.missingItems.length}/10 Configured`}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {service.status !== 'PUBLISHED' && (
              <button
                onClick={handlePublish}
                disabled={!readiness.isReadyToPublish}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl font-extrabold text-xs transition-all text-center ${
                  readiness.isReadyToPublish ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Publish Service
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'overview', label: 'Checklist', icon: CheckCircle2 },
            { id: 'pricing', label: 'Pricing', icon: DollarSign, isSet: !!service.pricing_profile_id },
            { id: 'rules', label: 'Rules', icon: Sliders, isSet: !!service.rules_profile_id },
            { id: 'policy', label: 'Policy', icon: Shield, isSet: !!service.policy_id },
            { id: 'risk', label: 'Risk', icon: Lock, isSet: !!service.risk_level_id },
            { id: 'verification', label: 'Verification', icon: UserCheck, isSet: !!service.verification_profile_id },
            { id: 'safety', label: 'Safety', icon: ShieldCheck, isSet: !!service.safety_profile_id },
            { id: 'booking', label: 'Booking', icon: Clock, isSet: !!service.booking_rule_id },
            { id: 'eligibility', label: 'Eligibility', icon: Layers, isSet: !!service.eligibility_profile_id }
          ].map(st => {
            const isActive = activeSubTab === st.id;
            const Icon = st.icon;
            return (
              <button
                key={st.id}
                onClick={() => setActiveSubTab(st.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{st.label}</span>
                {st.isSet && <Check className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Sub-Tab Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 text-xs">
          {activeSubTab === 'overview' && (() => {
            const checklistItems = [
              { name: '1. Category Assignment', configured: readiness.category },
              { name: '2. Pricing Profile', configured: readiness.pricing },
              { name: '3. Rules Engine Profile', configured: readiness.rules },
              { name: '4. Safety & Policy Engine', configured: readiness.policy },
              { name: '5. Risk Level Matrix', configured: readiness.risk },
              { name: '6. Verification Profile', configured: readiness.verification },
              { name: '7. Active Safety Controls', configured: readiness.safety },
              { name: '8. Booking Advance Rules', configured: readiness.booking },
              { name: '9. Cancellation Policy', configured: readiness.cancellation },
              { name: '10. Companion Eligibility', configured: readiness.eligibility }
            ];

            return (
              <div className="space-y-4">
                <h4 className="font-extrabold text-white text-sm">10-Point Interconnected Engine Checklist</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                      item.configured ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      <span className="font-semibold">{item.name}</span>
                      {item.configured ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {activeSubTab === 'pricing' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-white text-sm">Pricing Profile Binding</h4>
              <div className="space-y-2">
                {pricingProfiles.map(p => (
                  <div
                    key={p.id}
                    onClick={() => updateService(service.id, { pricing_profile_id: p.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      service.pricing_profile_id === p.id ? 'bg-purple-900/30 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="text-emerald-400 font-mono font-bold">₹{p.base_price} ({p.pricing_type})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'risk' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-white text-sm">Risk Level Assignment</h4>
              <div className="space-y-2">
                {riskLevels.map(r => (
                  <div
                    key={r.id}
                    onClick={() => updateService(service.id, { risk_level_id: r.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      service.risk_level_id === r.id ? 'bg-purple-900/30 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{r.name} ({r.code})</span>
                      <span className="text-amber-400 font-bold">Score: {r.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
