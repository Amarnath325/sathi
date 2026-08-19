'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { RiskEngine } from '@/lib/serviceHubEngines';
import { Shield, ShieldAlert, AlertCircle, CheckCircle2, Search, Plus, Edit2, Trash2, X } from 'lucide-react';
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
  const requiresManualApproval = calc.level === 'CRITICAL' || calc.level === 'HIGH';
  const requiresLiveLocation = calc.level !== 'LOW';
  const verificationRequired = calc.level === 'CRITICAL' || calc.level === 'HIGH' ? 'Advanced KYC & Background Check' : 'Basic KYC';

  const handleOpenAddModal = () => {
    setEditingRisk(null);
    setName('');
    setCode('MEDIUM');
    setScore(50);
    setDescription('');
    setVerificationLevel('Standard');
    setMonitoringLevel('Standard Periodic Check');
    setMaxDuration(8);
    setManualApprovalRequired(false);
    setLiveLocationRequired(true);
    setEmergencyContactRequired(true);
    setSosRequired(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rk: RiskLevelItem) => {
    setEditingRisk(rk);
    setName(rk.name);
    setCode(rk.code);
    setScore(rk.score);
    setDescription(rk.description);
    setVerificationLevel(rk.verification_level);
    setMonitoringLevel(rk.monitoring_level || 'Standard Periodic Check');
    setMaxDuration(rk.maximum_booking_duration);
    setManualApprovalRequired(rk.manual_approval_required);
    setLiveLocationRequired(rk.live_location_required);
    setEmergencyContactRequired(rk.emergency_contact_required);
    setSosRequired(rk.sos_required);
    setIsModalOpen(true);
  };

  const handleSaveRiskLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingRisk) {
      updateRiskLevel(editingRisk.id, {
        name,
        code,
        score: Number(score),
        description,
        color: code === 'LOW' ? '#10b981' : code === 'MEDIUM' ? '#f59e0b' : code === 'HIGH' ? '#f43f5e' : '#a855f7',
        verification_level: verificationLevel,
        monitoring_level: monitoringLevel,
        maximum_booking_duration: Number(maxDuration),
        manual_approval_required: manualApprovalRequired,
        live_location_required: liveLocationRequired,
        emergency_contact_required: emergencyContactRequired,
        sos_required: sosRequired,
      });
    } else {
      addRiskLevel({
        name,
        code,
        score: Number(score),
        description,
        color: code === 'LOW' ? '#10b981' : code === 'MEDIUM' ? '#f59e0b' : code === 'HIGH' ? '#f43f5e' : '#a855f7',
        verification_level: verificationLevel,
        monitoring_level: monitoringLevel,
        maximum_booking_duration: Number(maxDuration),
        manual_approval_required: manualApprovalRequired,
        live_location_required: liveLocationRequired,
        emergency_contact_required: emergencyContactRequired,
        sos_required: sosRequired,
        status: 'ACTIVE'
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteRiskLevel = (id: string) => {
    if (confirm('Are you sure you want to delete this risk level profile?')) {
      deleteRiskLevel(id);
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search risk levels by name or description..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        
        {/* Left Column: Configured Risk Profiles */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">
              Configured Risk Profiles <span className="text-slate-500 font-normal text-[10px]">({filteredRiskLevels.length})</span>
            </h4>
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Risk Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRiskLevels.map(rk => {
              const style = RISK_CARD_STYLES[rk.code] || RISK_CARD_STYLES.LOW;
              const linkedCats = categories.filter(c => c.default_risk_level_id === rk.id);

              return (
                <div key={rk.id} className={`p-3.5 rounded-2xl border shadow-2xs hover:shadow-xs transition-all space-y-2.5 ${style.card}`}>
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-slate-900 text-xs">{rk.name}</h5>
                    <span className={`px-2 py-0.2 rounded-lg text-[10px] font-extrabold border ${style.badge}`}>
                      {rk.code}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-600 font-medium leading-tight">{rk.description}</p>

                  {/* Details Row */}
                  <div className="text-[10px] font-semibold text-slate-600 flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/60">
                    <span>Verif: <strong className={style.text}>{rk.verification_level}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span>Approval: <strong className={rk.manual_approval_required ? 'text-rose-700' : 'text-emerald-700'}>{rk.manual_approval_required ? 'Required' : 'Auto'}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span>Max: <strong className={style.text}>{rk.maximum_booking_duration}h</strong></span>
                  </div>

                  {/* Category Pills */}
                  {linkedCats.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {linkedCats.slice(0, 4).map(c => (
                        <span key={c.id} className={`px-2 py-0.2 rounded text-[9px] font-semibold border ${style.bgBadge}`}>
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Risk Engine Simulator */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 h-fit shadow-2xs sticky top-3">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" /> Dynamic Risk Matrix Engine
          </h4>

          <div className="space-y-2.5 text-[11px]">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Service Risk Level</label>
              <select
                value={simServiceRisk}
                onChange={e => setSimServiceRisk(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-xl p-1.5 text-[11px] font-bold text-slate-900 outline-none focus:border-purple-500 shadow-2xs"
              >
                <option value="LOW">LOW — Public Errands</option>
                <option value="MEDIUM">MEDIUM — Social Events & Travel</option>
                <option value="HIGH">HIGH — Private / Elderly Care</option>
                <option value="CRITICAL">CRITICAL — High Risk Night Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Duration: <span className="text-slate-900 font-mono font-bold">{simDuration} hours</span>
              </label>
              <input
                type="range"
                min={1}
                max={14}
                value={simDuration}
                onChange={e => setSimDuration(Number(e.target.value))}
                className="w-full accent-purple-600 h-1 rounded-full bg-slate-200"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 font-medium"><span>1h</span><span>14h</span></div>
            </div>

            <div className="space-y-1.5 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simNight}
                  onChange={e => setSimNight(e.target.checked)}
                  className="accent-purple-600 w-3.5 h-3.5 rounded"
                />
                <span className="text-slate-700 font-bold text-[11px]">Night Time Booking (10 PM - 6 AM)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simCompVerified}
                  onChange={e => setSimCompVerified(e.target.checked)}
                  className="accent-purple-600 w-3.5 h-3.5 rounded"
                />
                <span className="text-slate-700 font-bold text-[11px]">Companion Fully Verified (Police + KYC)</span>
              </label>
            </div>
          </div>

          {/* Calculator Output */}
          <div className={`p-3 rounded-xl border space-y-2 transition-all ${calcStyle.card}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">SCORE RESULT</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold border ${calcStyle.badge}`}>
                {calc.level}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-mono text-slate-900">{calc.score}</span>
              <span className="text-[10px] text-slate-500 font-medium">/ 100 Risk Score</span>
            </div>

            <div className="space-y-1 text-[10px] border-t border-slate-200/60 pt-2 font-medium">
              <p className="flex justify-between"><span>Require Verification:</span> <strong className={calcStyle.text}>{verificationRequired}</strong></p>
              <p className="flex justify-between"><span>Manual Admin Review:</span> <strong className={requiresManualApproval ? 'text-rose-700' : 'text-emerald-700'}>{requiresManualApproval ? 'Required' : 'Auto'}</strong></p>
              <p className="flex justify-between"><span>Live Tracking:</span> <strong className={requiresLiveLocation ? 'text-rose-700' : 'text-slate-700'}>{requiresLiveLocation ? 'Mandatory' : 'Optional'}</strong></p>
            </div>
          </div>

        </div>

      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingRisk ? 'Edit Risk Profile' : 'Create Risk Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRiskLevel} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Profile Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. High Risk Event Service"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Risk Code</label>
                  <select
                    value={code}
                    onChange={e => setCode(e.target.value as RiskLevelCode)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Score</label>
                  <input
                    type="number"
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Duration (hrs)</label>
                  <input
                    type="number"
                    value={maxDuration}
                    onChange={e => setMaxDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe risk requirements and monitoring controls..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Verification Level</label>
                  <select
                    value={verificationLevel}
                    onChange={e => setVerificationLevel(e.target.value as VerificationLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Enhanced">Enhanced</option>
                    <option value="Restricted">Restricted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Monitoring Level</label>
                  <input
                    type="text"
                    value={monitoringLevel}
                    onChange={e => setMonitoringLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualApprovalRequired}
                    onChange={e => setManualApprovalRequired(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Require Manual Admin Approval</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liveLocationRequired}
                    onChange={e => setLiveLocationRequired(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Require Live GPS Location Streaming</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sosRequired}
                    onChange={e => setSosRequired(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Enable Panic SOS Dispatch</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm shadow-purple-200"
                >
                  {editingRisk ? 'Update Risk Profile' : 'Save Risk Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
