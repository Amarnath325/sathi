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
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Configured Risk Profiles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Configured Risk Profiles <span className="text-slate-500 font-normal text-xs">({filteredRiskLevels.length})</span>
            </h4>
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Risk Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRiskLevels.map(rk => {
              const style = RISK_CARD_STYLES[rk.code] || RISK_CARD_STYLES.LOW;
              const linkedCats = categories.filter(c => c.default_risk_level_id === rk.id);

              return (
                <div key={rk.id} className={`p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all space-y-3.5 relative group ${style.card}`}>
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-slate-900 text-base">{rk.name}</h5>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${style.badge}`}>
                        {rk.code}
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(rk)}
                        className="p-1 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-purple-700 shadow-2xs transition-colors"
                        title="Edit Risk Level"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRiskLevel(rk.id)}
                        className="p-1 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600 shadow-2xs transition-colors"
                        title="Delete Risk Level"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{rk.description}</p>

                  {/* Single Line Details Row */}
                  <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/60">
                    <span>Verification: <span className={`font-bold ${style.text}`}>{rk.verification_level}</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Manual Approval: <span className={`font-bold ${rk.manual_approval_required ? 'text-rose-700' : 'text-emerald-700'}`}>{rk.manual_approval_required ? 'Required' : 'Auto-Publish'}</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Max Duration: <span className={`font-bold ${style.text}`}>{rk.maximum_booking_duration}h</span></span>
                  </div>

                  {/* Category Pills */}
                  {linkedCats.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {linkedCats.slice(0, 4).map(c => (
                        <span key={c.id} className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${style.bgBadge}`}>
                          {c.name}
                        </span>
                      ))}
                      {linkedCats.length > 4 && (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${style.bgBadge}`}>
                          +{linkedCats.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Risk Simulator & Search */}
        <div className="space-y-4">
          {/* Search Box on top right */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search risk profiles..."
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-xs transition-colors"
            />
          </div>

          {/* Simulator Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-md sticky top-4">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600 fill-purple-100" /> Risk Score Simulator
            </h4>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Base Service Risk</label>
                <select
                  value={simServiceRisk}
                  onChange={e => setSimServiceRisk(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-amber-700 font-extrabold text-xs outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Duration</label>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={simDuration}
                  onChange={e => setSimDuration(Number(e.target.value))}
                  className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200"
                />
                <span className="block text-xs font-bold text-blue-600 mt-1">{simDuration} hours</span>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={simNight}
                    onChange={e => setSimNight(e.target.checked)}
                    className="accent-purple-600 w-4 h-4 rounded"
                  />
                  <span className="text-slate-700 font-bold">Late Night Session</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={simCompVerified}
                    onChange={e => setSimCompVerified(e.target.checked)}
                    className="accent-purple-600 w-4 h-4 rounded"
                  />
                  <span className="text-slate-700 font-bold">Companion Background Verified</span>
                </label>
              </div>
            </div>

            {/* Calculated Result Output */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Calculated Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-purple-700">{calc.score}</span>
                  <span className="text-xs font-semibold text-slate-500">Points</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Risk Level</span>
                <span className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold inline-block border ${calcStyle.badge}`}>
                  {calc.level}
                </span>
              </div>

              {/* Status Alert Banner */}
              <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0">!</span>
                <span>
                  {calc.level === 'LOW' && 'Standard booking flow applies'}
                  {calc.level === 'MEDIUM' && 'GPS tracking required'}
                  {calc.level === 'HIGH' && 'Enhanced verification required'}
                  {calc.level === 'CRITICAL' && 'Manual admin approval required'}
                </span>
              </div>
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
