'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CompanionEligibilityEvaluator } from '@/lib/serviceHubEngines';
import {
  UserCheck, CheckCircle2, AlertTriangle, Star, Shield, FileCheck, Check, X,
  Sliders, Award, ShieldAlert, FileText, Activity, Layers, CheckSquare, Clock, Plus, Edit2, Trash2
} from 'lucide-react';
import { EligibilityProfileItem } from '@/lib/types/serviceHub';

export function EligibilityTab() {
  const { eligibilityProfiles, addEligibilityProfile, updateEligibilityProfile, deleteEligibilityProfile } = useServiceHubStore();
  const [subTab, setSubTab] = useState<'profiles' | 'rules' | 'evaluator'>('profiles');
  const [selectedProfileId, setSelectedProfileId] = useState(eligibilityProfiles[0]?.id || '');

  const profile = eligibilityProfiles.find(p => p.id === selectedProfileId) || eligibilityProfiles[0];

  // Modal State for Add / Edit Eligibility Profile
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<EligibilityProfileItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minimumAge, setMinimumAge] = useState(18);
  const [maximumAge, setMaximumAge] = useState(60);
  const [minimumRating, setMinimumRating] = useState(4.0);
  const [minimumBookingsDone, setMinimumBookingsDone] = useState(5);
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Documents Checklist
  const [reqGovtId, setReqGovtId] = useState(true);
  const [reqSelfie, setReqSelfie] = useState(true);
  const [reqEmergencyContact, setReqEmergencyContact] = useState(true);
  const [reqPoliceCheck, setReqPoliceCheck] = useState(false);

  const openAddModal = () => {
    setEditingProf(null);
    setName('');
    setDescription('');
    setMinimumAge(18);
    setMaximumAge(60);
    setMinimumRating(4.0);
    setMinimumBookingsDone(5);
    setStatus('ACTIVE');
    setReqGovtId(true);
    setReqSelfie(true);
    setReqEmergencyContact(true);
    setReqPoliceCheck(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: EligibilityProfileItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProf(p);
    setName(p.name);
    setDescription(p.description);
    setMinimumAge(p.minimum_age || 18);
    setMaximumAge(p.maximum_age || 60);
    setMinimumRating(p.minimum_rating || 4.0);
    setMinimumBookingsDone(p.minimum_bookings_done || 0);
    setStatus(p.status || 'ACTIVE');

    const docs = p.required_documents || [];
    setReqGovtId(docs.includes('GOVERNMENT_ID'));
    setReqSelfie(docs.includes('SELFIE_LIVE'));
    setReqEmergencyContact(docs.includes('EMERGENCY_CONTACT'));
    setReqPoliceCheck(docs.includes('POLICE_CLEARANCE'));
    setIsModalOpen(true);
  };

  const handleDeleteProfile = (id: string, pName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete eligibility profile "${pName}"?`)) {
      deleteEligibilityProfile(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert('Please enter profile name.'); return; }

    const docs: string[] = [];
    if (reqGovtId) docs.push('GOVERNMENT_ID');
    if (reqSelfie) docs.push('SELFIE_LIVE');
    if (reqEmergencyContact) docs.push('EMERGENCY_CONTACT');
    if (reqPoliceCheck) docs.push('POLICE_CLEARANCE');

    const payload = {
      name,
      description,
      minimum_age: minimumAge,
      maximum_age: maximumAge,
      minimum_rating: minimumRating,
      minimum_bookings_done: minimumBookingsDone,
      required_documents: docs,
      status
    };

    if (editingProf) {
      updateEligibilityProfile(editingProf.id, payload);
    } else {
      addEligibilityProfile(payload);
    }

    setIsModalOpen(false);
  };

  // Companion Simulator State
  const [compAge, setCompAge] = useState(24);
  const [compRating, setCompRating] = useState(4.8);
  const [completedBookings, setCompletedBookings] = useState(15);
  const [hasGovtId, setHasGovtId] = useState(true);
  const [hasSelfie, setHasSelfie] = useState(true);
  const [hasEmergency, setHasEmergency] = useState(true);
  const [hasPoliceCheck, setHasPoliceCheck] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);

  // Evaluator computation
  const evalResult = profile ? CompanionEligibilityEvaluator.evaluate({
    id: 'companion-demo-101',
    age: compAge,
    ratingAvg: compRating,
    completedBookings,
    isSuspended,
    documents: {
      GOVERNMENT_ID: hasGovtId,
      SELFIE_LIVE: hasSelfie,
      EMERGENCY_CONTACT: hasEmergency,
      POLICE_CLEARANCE: hasPoliceCheck
    }
  }, profile) : null;

  return (
    <div className="space-y-3 w-full">
      {/* Top Internal Navigation Header */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSubTab('profiles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'profiles'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Eligibility Profiles</span>
          </button>

          <button
            onClick={() => setSubTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'rules'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Eligibility Rules</span>
          </button>

          <button
            onClick={() => setSubTab('evaluator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'evaluator'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3. Eligibility Evaluator</span>
          </button>
        </div>

        {/* Profile Selector Badge & Add Profile */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500">Active Profile:</span>
          <select
            value={selectedProfileId}
            onChange={e => setSelectedProfileId(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-purple-700 outline-none shadow-2xs"
          >
            {eligibilityProfiles.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Profile
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: ELIGIBILITY PROFILES */}
      {subTab === 'profiles' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {eligibilityProfiles.map(p => {
              const isSelected = selectedProfileId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfileId(p.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 shadow-2xs hover:shadow-xs ${
                    isSelected
                      ? 'bg-white border-2 border-purple-500 ring-2 ring-purple-500/10'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold border bg-purple-50 text-purple-700 border-purple-200">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => openEditModal(p, e)}
                        className="p-1 rounded-md bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteProfile(p.id, p.name, e)}
                        className="p-1 rounded-md bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{p.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                    <div className="bg-slate-50 p-1 rounded"><span className="text-slate-400 block text-[8px]">AGE</span><strong className="text-slate-800">{p.minimum_age}–{p.maximum_age}</strong></div>
                    <div className="bg-slate-50 p-1 rounded"><span className="text-slate-400 block text-[8px]">MIN RATING</span><strong className="text-amber-700">{p.minimum_rating}★</strong></div>
                    <div className="bg-slate-50 p-1 rounded"><span className="text-slate-400 block text-[8px]">DOCS</span><strong className="text-indigo-700">{p.required_documents?.length || 0} Req</strong></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Profile Active Config Details */}
          {profile && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" /> Currently Selected Profile: <span className="text-purple-700">{profile.name}</span>
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => openEditModal(profile, e)}
                    className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                  <button
                    onClick={(e) => handleDeleteProfile(profile.id, profile.name, e)}
                    className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600">{profile.description}</p>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-100 text-[11px] font-bold text-purple-800">
                  Minimum Age: {profile.minimum_age} years
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-[11px] font-bold text-amber-800">
                  Minimum Rating: {profile.minimum_rating} ★
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-800">
                  Mandatory Docs: {(profile.required_documents || []).join(', ').replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ELIGIBILITY RULES */}
      {subTab === 'rules' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
              <span>Configured Companion Eligibility Rules Matrix</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">7 Active Criteria</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">1. Age Threshold</span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.2 rounded border border-purple-200">Min {profile?.minimum_age || 18} Yrs</span>
                </div>
                <p className="text-[11px] text-slate-500">Companion must be legally adult within allowed minimum age limit.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">2. Customer Rating</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200">Min {profile?.minimum_rating || 4.0} ★</span>
                </div>
                <p className="text-[11px] text-slate-500">Average historical rating across completed companion bookings.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">3. Identity Verification</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">KYC + Face Match</span>
                </div>
                <p className="text-[11px] text-slate-500">Aadhaar/Govt ID verification and live biometric selfie match.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">4. Mandatory Documents</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-200">{profile?.required_documents?.length || 0} Documents</span>
                </div>
                <p className="text-[11px] text-slate-500">All required documents must be uploaded and verified by admin.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">5. Experience & History</span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.2 rounded border border-slate-300">Min {profile?.minimum_bookings_done || 0} Bookings</span>
                </div>
                <p className="text-[11px] text-slate-500">Required minimum successful bookings for tier escalation.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">6. Account Standing</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">Clean Record</span>
                </div>
                <p className="text-[11px] text-slate-500">Account must not be suspended, flagged for fraud, or under audit.</p>
              </div>

              <div className="p-3 rounded-xl md:col-span-2 bg-purple-50/60 border border-purple-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-purple-950">7. Service-Specific Eligibility</span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.2 rounded">Dynamic Mapping</span>
                </div>
                <p className="text-[11px] text-purple-800">Higher risk services require higher eligibility profile compliance.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ELIGIBILITY EVALUATOR */}
      {subTab === 'evaluator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          {/* Controls Column */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-2xs">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-600" /> Evaluator Simulator Inputs
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Profile for Test</label>
                <select
                  value={selectedProfileId}
                  onChange={e => setSelectedProfileId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900 outline-none"
                >
                  {eligibilityProfiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-0.5">Companion Age: <strong className="text-slate-900">{compAge} yrs</strong></label>
                <input type="range" min={16} max={75} value={compAge} onChange={e => setCompAge(Number(e.target.value))} className="w-full accent-purple-600 h-1 bg-slate-200 rounded-full" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-0.5">Rating Avg: <strong className="text-amber-700">{compRating} ★</strong></label>
                <input type="range" min={1.0} max={5.0} step={0.1} value={compRating} onChange={e => setCompRating(Number(e.target.value))} className="w-full accent-purple-600 h-1 bg-slate-200 rounded-full" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-0.5">Completed Bookings: <strong className="text-indigo-700">{completedBookings}</strong></label>
                <input type="range" min={0} max={50} value={completedBookings} onChange={e => setCompletedBookings(Number(e.target.value))} className="w-full accent-purple-600 h-1 bg-slate-200 rounded-full" />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input type="checkbox" checked={hasGovtId} onChange={e => setHasGovtId(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                  Verified Government ID
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input type="checkbox" checked={hasSelfie} onChange={e => setHasSelfie(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                  Verified Live Selfie
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input type="checkbox" checked={hasEmergency} onChange={e => setHasEmergency(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                  Emergency Contact Added
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input type="checkbox" checked={hasPoliceCheck} onChange={e => setHasPoliceCheck(e.target.checked)} className="accent-purple-600 w-3.5 h-3.5 rounded" />
                  Police Verification Clearance
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-700">
                  <input type="checkbox" checked={isSuspended} onChange={e => setIsSuspended(e.target.checked)} className="accent-rose-600 w-3.5 h-3.5 rounded" />
                  Account Suspended / Flagged
                </label>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-3">
            {evalResult && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Evaluation Decision Output</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Evaluated against profile: <strong>{profile?.name}</strong></p>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider uppercase ${
                    evalResult.status === 'ELIGIBLE' ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-200' : 'bg-rose-600 text-white shadow-xs shadow-rose-200'
                  }`}>
                    Final: {evalResult.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h5 className="font-extrabold text-slate-900 text-xs">Granular Criteria Rule Evaluation</h5>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 border flex justify-between items-center">
                      <span className="font-sans font-semibold">1. Age Requirement ({profile?.minimum_age}+ yrs):</span>
                      <strong className={compAge >= (profile?.minimum_age || 18) ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'}>
                        {compAge >= (profile?.minimum_age || 18) ? 'PASSED' : 'FAILED'}
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border flex justify-between items-center">
                      <span className="font-sans font-semibold">2. Rating Requirement ({profile?.minimum_rating}+ ★):</span>
                      <strong className={compRating >= (profile?.minimum_rating || 4.0) ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'}>
                        {compRating >= (profile?.minimum_rating || 4.0) ? 'PASSED' : 'FAILED'}
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border flex justify-between items-center">
                      <span className="font-sans font-semibold">3. Account Status (Not Suspended):</span>
                      <strong className={!isSuspended ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'}>
                        {!isSuspended ? 'PASSED' : 'FAILED'}
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border flex justify-between items-center">
                      <span className="font-sans font-semibold">4. Mandatory Document Checklist:</span>
                      <strong className={evalResult.missingRequirements.length === 0 ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'}>
                        {evalResult.missingRequirements.length === 0 ? 'PASSED' : 'FAILED'}
                      </strong>
                    </div>
                  </div>
                </div>

                {evalResult.missingRequirements.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
                    <h6 className="font-extrabold text-xs flex items-center gap-1 text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Failed Criteria Reasons:
                    </h6>
                    <div className="text-[11px] space-y-0.5 pl-5 list-disc text-rose-900 font-medium">
                      {evalResult.missingRequirements.map((r, i) => (
                        <p key={i}>• {r}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT ELIGIBILITY PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingProf ? 'Edit Eligibility Profile' : 'Create Eligibility Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Profile Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Senior Companion Eligibility Profile"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Summarize eligibility requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Minimum Age</label>
                  <input
                    type="number"
                    value={minimumAge}
                    onChange={e => setMinimumAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Maximum Age</label>
                  <input
                    type="number"
                    value={maximumAge}
                    onChange={e => setMaximumAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minimumRating}
                    onChange={e => setMinimumRating(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Completed Bookings</label>
                  <input
                    type="number"
                    value={minimumBookingsDone}
                    onChange={e => setMinimumBookingsDone(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 block text-xs">Required Document Verification Checklist</span>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={reqGovtId} onChange={e => setReqGovtId(e.target.checked)} className="accent-purple-600 rounded" />
                    Government ID / Aadhaar
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={reqSelfie} onChange={e => setReqSelfie(e.target.checked)} className="accent-purple-600 rounded" />
                    Live Selfie Match
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={reqEmergencyContact} onChange={e => setReqEmergencyContact(e.target.checked)} className="accent-purple-600 rounded" />
                    Emergency Contact Number
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={reqPoliceCheck} onChange={e => setReqPoliceCheck(e.target.checked)} className="accent-purple-600 rounded" />
                    Police Verification Clearance
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {editingProf ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
