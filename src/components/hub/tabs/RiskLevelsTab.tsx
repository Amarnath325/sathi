'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RiskEngine } from '@/lib/serviceHubEngines';
import { Shield, ShieldAlert, AlertCircle, CheckCircle2, Search, Plus, Edit2, Trash2, X, Sliders, Layers } from 'lucide-react';
import { RiskLevelItem, RiskLevelCode, VerificationLevel } from '@/lib/types/serviceHub';

const RISK_CARD_STYLES: Record<string, { card: string; badge: string; text: string; bgBadge: string }> = {
  LOW: {
    card: 'bg-emerald-50/40 border-emerald-200/80',
    badge: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    text: 'text-emerald-700',
    bgBadge: 'bg-emerald-100/60 text-emerald-900 border-emerald-200/60',
  },
  MEDIUM: {
    card: 'bg-amber-50/40 border-amber-200/80',
    badge: 'bg-amber-100/90 text-amber-800 border-amber-200',
    text: 'text-amber-700',
    bgBadge: 'bg-amber-100/60 text-amber-900 border-amber-200/60',
  },
  HIGH: {
    card: 'bg-rose-50/40 border-rose-200/80',
    badge: 'bg-rose-100/90 text-rose-800 border-rose-200',
    text: 'text-rose-700',
    bgBadge: 'bg-rose-100/60 text-rose-900 border-rose-200/60',
  },
  CRITICAL: {
    card: 'bg-purple-50/40 border-purple-200/80',
    badge: 'bg-purple-100/90 text-purple-800 border-purple-200',
    text: 'text-purple-700',
    bgBadge: 'bg-purple-100/60 text-purple-900 border-purple-200/60',
  },
};

export function RiskLevelsTab() {
  const { riskLevels, categories, addRiskLevel, updateRiskLevel, deleteRiskLevel } = useServiceHubStore();
  const [subTab, setSubTab] = useState<'profiles' | 'factors' | 'rules'>('profiles');

  const [simServiceRisk, setSimServiceRisk] = useState('MEDIUM');
  const [simDuration, setSimDuration] = useState(9);
  const [simNight, setSimNight] = useState(true);
  const [simCompVerified, setSimCompVerified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskLevelItem | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState<RiskLevelCode>('MEDIUM');
  const [score, setScore] = useState(50);
  const [description, setDescription] = useState('');
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('Standard');
  const [monitoringLevel, setMonitoringLevel] = useState('Standard Periodic Check');
  const [maxDuration, setMaxDuration] = useState(8);
  const [manualApprovalRequired, setManualApprovalRequired] = useState(false);
  const [liveLocationRequired, setLiveLocationRequired] = useState(true);
  const [emergencyContactRequired, setEmergencyContactRequired] = useState(true);
  const [sosRequired, setSosRequired] = useState(true);

  const filteredRiskLevels = useMemo(() =>
    riskLevels.filter(rk => !searchTerm || rk.name.toLowerCase().includes(searchTerm.toLowerCase()) || rk.description.toLowerCase().includes(searchTerm.toLowerCase())),
    [riskLevels, searchTerm]
  );

  const calc = RiskEngine.calculateRiskScore({
    serviceRiskCode: simServiceRisk,
    durationHours: simDuration,
    isNightTime: simNight,
    companionVerified: simCompVerified
  });

  const calcStyle = RISK_CARD_STYLES[calc.level] || RISK_CARD_STYLES.LOW;

  const RISK_FACTORS_MATRIX = [
    { factor: 'Service Risk', weight: '30%', desc: 'Base risk classification of requested service category (e.g. Travel vs Public Errand)' },
    { factor: 'Duration Risk', weight: '20%', desc: 'Session duration multiplier (> 8 hours adds +20 penalty)' },
    { factor: 'Time Risk', weight: '20%', desc: 'Night shift window (10 PM to 6 AM adds +25 risk points)' },
    { factor: 'Location Risk', weight: '10%', desc: 'Remote or unverified geofence area' },
    { factor: 'User Risk', weight: '10%', desc: 'New user account with 0 prior completed bookings' },
    { factor: 'Verification Risk', weight: '5%', desc: 'Companion background verification completeness' },
    { factor: 'Booking Risk', weight: '5%', desc: 'High value or instant booking without manual review' },
  ];

  return (
    <div className="space-y-3 w-full">
      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200/80">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setSubTab('profiles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'profiles'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Risk Profiles</span>
          </button>

          <button
            onClick={() => setSubTab('factors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'factors'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Risk Factors</span>
          </button>

          <button
            onClick={() => setSubTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'rules'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>3. Risk Rules Engine</span>
          </button>
        </div>
      </div>

      {/* 1. RISK PROFILES SUB-TAB */}
      {subTab === 'profiles' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Configured Risk Profiles (Low, Medium, High, Critical)
            </h4>
            <button
              onClick={() => { setIsModalOpen(true); setEditingRisk(null); }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Risk Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredRiskLevels.map(rk => {
              const style = RISK_CARD_STYLES[rk.code] || RISK_CARD_STYLES.LOW;

              return (
                <div key={rk.id} className={`p-3.5 rounded-2xl border space-y-2.5 shadow-2xs ${style.card}`}>
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-slate-900 text-xs">{rk.name}</h5>
                    <span className={`px-2 py-0.2 rounded-lg text-[10px] font-extrabold border ${style.badge}`}>
                      {rk.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight">{rk.description}</p>
                  <div className="pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-600 space-y-0.5">
                    <p>Score Range: <strong>{rk.score} pts</strong></p>
                    <p>Verif Requirement: <strong>{rk.verification_level}</strong></p>
                    <p>Approval: <strong>{rk.manual_approval_required ? 'Manual Admin' : 'Automated'}</strong></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. RISK FACTORS SUB-TAB */}
      {subTab === 'factors' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Dynamic Risk Assessment Factors & Weights</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {RISK_FACTORS_MATRIX.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">{idx + 1}. {item.factor}</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                    Weight: {item.weight}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RISK RULES ENGINE SUB-TAB */}
      {subTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          {/* Controls Column */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-600" /> Matrix Simulator
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Service Base Risk</label>
                <select
                  value={simServiceRisk}
                  onChange={e => setSimServiceRisk(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2 font-bold text-slate-900 outline-none"
                >
                  <option value="LOW">LOW — Public Errands</option>
                  <option value="MEDIUM">MEDIUM — Social Events</option>
                  <option value="HIGH">HIGH — Private Care</option>
                  <option value="CRITICAL">CRITICAL — High Risk Travel</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Duration: <span className="text-purple-700 font-bold font-mono">{simDuration}h</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={simDuration}
                  onChange={e => setSimDuration(Number(e.target.value))}
                  className="w-full accent-purple-600 h-1 rounded-full bg-slate-200"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={simNight}
                    onChange={e => setSimNight(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  Night Shift (10 PM - 6 AM)
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={simCompVerified}
                    onChange={e => setSimCompVerified(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  Fully Verified Companion
                </label>
              </div>
            </div>
          </div>

          {/* Result Output Column */}
          <div className="lg:col-span-2 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs">Risk Matrix Output & Escalation Rules</h4>

            <div className={`p-4 rounded-2xl border space-y-2 ${calcStyle.card}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">CALCULATED SCORE</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${calcStyle.badge}`}>
                  {calc.level}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900">{calc.score} / 100 Points</div>
              <div className="text-xs space-y-1 pt-2 border-t font-semibold">
                <p>Required Verification Tier: <strong>{calc.level === 'CRITICAL' ? 'Enhanced + Police Check' : 'Standard KYC'}</strong></p>
                <p>Required Controls: <strong>Live Location + Panic SOS Dispatch</strong></p>
                <p>Escalation: <strong>{calc.level === 'CRITICAL' ? 'Immediate Supervisor Alert' : 'Standard Monitoring'}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
