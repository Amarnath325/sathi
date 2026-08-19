'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { CompanionEligibilityEvaluator } from '@/lib/serviceHubEngines';
import { UserCheck, CheckCircle2, AlertTriangle, Star, Shield, FileCheck, Check, X, Plus, Edit2, Trash2 } from 'lucide-react';
import { EligibilityProfileItem } from '@/lib/types/serviceHub';

const ALL_DOC_OPTIONS = [
  'GOVERNMENT_ID',
  'SELFIE_LIVE',
  'EMERGENCY_CONTACT',
  'BACKGROUND_CHECK',
  'ADDRESS_PROOF',
  'MEDICAL_FITNESS_CERTIFICATE'
];

export function EligibilityTab() {
  const {
    eligibilityProfiles,
    addEligibilityProfile,
    updateEligibilityProfile,
    deleteEligibilityProfile
  } = useServiceHubStore();

  const [selectedProfileId, setSelectedProfileId] = useState(eligibilityProfiles[0]?.id || '');
  const activeProfile = eligibilityProfiles.find(p => p.id === selectedProfileId) || eligibilityProfiles[0];

  // Companion Simulator State
  const [compAge, setCompAge] = useState(24);
  const [compRating, setCompRating] = useState(4.8);
  const [hasGovtId, setHasGovtId] = useState(true);
  const [hasSelfie, setHasSelfie] = useState(true);
  const [hasEmergency, setHasEmergency] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);

  // CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<EligibilityProfileItem | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minimumAge, setMinimumAge] = useState(18);
  const [maximumAge, setMaximumAge] = useState(45);
  const [minimumRating, setMinimumRating] = useState(4.0);
  const [minimumBookingsDone, setMinimumBookingsDone] = useState(5);
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([
    'GOVERNMENT_ID',
    'SELFIE_LIVE',
    'EMERGENCY_CONTACT'
  ]);

  const result = activeProfile ? CompanionEligibilityEvaluator.evaluate({
    id: 'companion-demo-101',
    age: compAge,
    ratingAvg: compRating,
    completedBookings: 12,
    isSuspended,
    documents: {
      GOVERNMENT_ID: hasGovtId,
      SELFIE_LIVE: hasSelfie,
      EMERGENCY_CONTACT: hasEmergency
    }
  }, activeProfile) : null;

  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setName('');
    setDescription('');
    setMinimumAge(18);
    setMaximumAge(45);
    setMinimumRating(4.0);
    setMinimumBookingsDone(5);
    setRequiredDocuments(['GOVERNMENT_ID', 'SELFIE_LIVE', 'EMERGENCY_CONTACT']);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prof: EligibilityProfileItem) => {
    setEditingProfile(prof);
    setName(prof.name);
    setDescription(prof.description);
    setMinimumAge(prof.minimum_age);
    setMaximumAge(prof.maximum_age);
    setMinimumRating(prof.minimum_rating);
    setMinimumBookingsDone(prof.minimum_bookings_done);
    setRequiredDocuments([...prof.required_documents]);
    setIsModalOpen(true);
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this service eligibility profile?')) {
      deleteEligibilityProfile(id);
      if (selectedProfileId === id && eligibilityProfiles.length > 1) {
        const remaining = eligibilityProfiles.filter(p => p.id !== id);
        setSelectedProfileId(remaining[0]?.id || '');
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingProfile) {
      updateEligibilityProfile(editingProfile.id, {
        name,
        description,
        minimum_age: Number(minimumAge),
        maximum_age: Number(maximumAge),
        minimum_rating: Number(minimumRating),
        minimum_bookings_done: Number(minimumBookingsDone),
        required_documents: requiredDocuments,
      });
    } else {
      const newProf = addEligibilityProfile({
        name,
        description,
        minimum_age: Number(minimumAge),
        maximum_age: Number(maximumAge),
        minimum_rating: Number(minimumRating),
        minimum_bookings_done: Number(minimumBookingsDone),
        required_documents: requiredDocuments,
        status: 'ACTIVE'
      });
      setSelectedProfileId(newProf.id);
    }

    setIsModalOpen(false);
  };

  const toggleDocRequirement = (docKey: string) => {
    setRequiredDocuments(prev =>
      prev.includes(docKey) ? prev.filter(d => d !== docKey) : [...prev, docKey]
    );
  };

  return (
    <div className="space-y-5">
      {/* Profile Selector & Add Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          {eligibilityProfiles.map(p => {
            const isSel = activeProfile?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isSel
                    ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{p.name}</span>
                {isSel && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200 flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Eligibility Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Profile Criteria */}
        {activeProfile && (
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xl tracking-tight">{activeProfile.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{activeProfile.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(activeProfile)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                  <button
                    onClick={() => handleDeleteProfile(activeProfile.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>

              {/* Key Criteria Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Age Range */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-400 text-purple-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">AGE RANGE</span>
                    <span className="text-xl font-extrabold text-slate-900 block mt-0.5">
                      {activeProfile.minimum_age}–{activeProfile.maximum_age} yrs
                    </span>
                  </div>
                </div>

                {/* Min Rating */}
                <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-400 text-amber-600 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">MIN RATING</span>
                    <span className="text-xl font-extrabold text-amber-700 block mt-0.5">
                      {activeProfile.minimum_rating} ★
                    </span>
                  </div>
                </div>

                {/* Required Documents Count */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-400 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">REQUIRED DOCS</span>
                    <span className="text-xl font-extrabold text-indigo-700 block mt-0.5">
                      {activeProfile.required_documents.length} Items
                    </span>
                  </div>
                </div>
              </div>

              {/* Required Documents List */}
              <div className="space-y-3 pt-2">
                <h5 className="font-extrabold text-slate-900 text-sm">Required Verification Documents</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProfile.required_documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3 shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <span className="font-extrabold text-slate-900 text-xs capitalize">
                        {doc.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Right Column: Live Evaluator Simulator */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-md sticky top-4 h-fit">
          <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" /> Companion Qualification Evaluator
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-bold">Age</label>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
                  {compAge} years
                </span>
              </div>
              <input
                type="range"
                min={17}
                max={45}
                value={compAge}
                onChange={e => setCompAge(Number(e.target.value))}
                className="w-full accent-purple-600 h-1.5 rounded-full bg-slate-200 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                <span>17</span>
                <span>45</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-bold">Rating</label>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs border border-amber-100">
                  {compRating.toFixed(1)} ★
                </span>
              </div>
              <input
                type="range"
                min={3.0}
                max={5.0}
                step={0.1}
                value={compRating}
                onChange={e => setCompRating(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 rounded-full bg-slate-200 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                <span>3.0</span>
                <span>5.0</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { label: 'Govt ID Verified', val: hasGovtId, set: setHasGovtId, danger: false },
                { label: 'Live Selfie Verified', val: hasSelfie, set: setHasSelfie, danger: false },
                { label: 'Emergency Contact Verified', val: hasEmergency, set: setHasEmergency, danger: false },
                { label: 'Account Suspended', val: isSuspended, set: setIsSuspended, danger: true },
              ].map(({ label, val, set, danger }) => (
                <label
                  key={label}
                  className={`flex items-center justify-between cursor-pointer p-3 rounded-xl border transition-colors ${
                    danger && val
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : val
                      ? 'bg-slate-50 border-slate-200/90 text-slate-800'
                      : 'bg-white border-slate-200/70 text-slate-500'
                  }`}
                >
                  <span className="font-extrabold text-xs">{label}</span>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={e => set(e.target.checked)}
                    className={`w-4 h-4 rounded cursor-pointer ${danger ? 'accent-rose-600' : 'accent-purple-600'}`}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Evaluation Result Output Card */}
          {result && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2.5 shadow-2xs ${
              result.status === 'ELIGIBLE'
                ? 'bg-emerald-50/80 border-emerald-200/90'
                : 'bg-rose-50/80 border-rose-200/90'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 ${
                    result.status === 'ELIGIBLE' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}>
                    {result.status === 'ELIGIBLE' ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span className={`font-extrabold text-sm ${result.status === 'ELIGIBLE' ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {result.status === 'ELIGIBLE' ? 'ELIGIBLE FOR SERVICE' : 'INELIGIBLE'}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  result.status === 'ELIGIBLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {result.status}
                </span>
              </div>

              {result.missingRequirements.length > 0 && (
                <div className="text-rose-700 text-xs font-medium pt-2 border-t border-rose-200/80 space-y-1">
                  <p className="font-extrabold text-rose-800">Missing Requirements:</p>
                  {result.missingRequirements.map((m, i) => (
                    <p key={i} className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingProfile ? 'Edit Eligibility Profile' : 'Create Eligibility Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Profile Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. VIP Companion Eligibility Standard"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe mandatory qualifications for companion service activation..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Minimum Age (yrs)</label>
                  <input
                    type="number"
                    value={minimumAge}
                    onChange={e => setMinimumAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Maximum Age (yrs)</label>
                  <input
                    type="number"
                    value={maximumAge}
                    onChange={e => setMaximumAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Minimum Rating (★)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minimumRating}
                    onChange={e => setMinimumRating(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Bookings Completed</label>
                  <input
                    type="number"
                    value={minimumBookingsDone}
                    onChange={e => setMinimumBookingsDone(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">Required Verification Documents</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {ALL_DOC_OPTIONS.map(doc => (
                    <label key={doc} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-white rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={requiredDocuments.includes(doc)}
                        onChange={() => toggleDocRequirement(doc)}
                        className="accent-purple-600 rounded"
                      />
                      <span className="font-semibold text-slate-800 text-[11px] capitalize">
                        {doc.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
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
                  {editingProfile ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
