'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { UserCheck, CheckCircle2, XCircle, Search, Check, Plus, Edit2, Trash2, X } from 'lucide-react';
import { VerificationProfileItem, VerificationLevel } from '@/lib/types/serviceHub';

const CREDENTIAL_LABELS: Record<string, string> = {
  email: 'Email',
  mobile: 'Mobile',
  government_id: 'Government Id',
  selfie: 'Selfie',
  emergency_contact: 'Emergency Contact',
  face_match: 'Face Match',
  address: 'Address',
  background_check: 'Background Check',
  additional_document: 'Additional Document',
  manual_review: 'Manual Review',
};

const ALL_CREDENTIAL_KEYS = [
  'email',
  'mobile',
  'government_id',
  'selfie',
  'face_match',
  'address',
  'background_check',
  'emergency_contact',
  'additional_document',
  'manual_review',
] as const;

export function VerificationTab() {
  const {
    verificationProfiles,
    addVerificationProfile,
    updateVerificationProfile,
    deleteVerificationProfile
  } = useServiceHubStore();

  const [selProfId, setSelProfId] = useState(verificationProfiles[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  // CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<VerificationProfileItem | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('Standard');
  const [requirements, setRequirements] = useState<Record<string, boolean>>({
    email: true,
    mobile: true,
    government_id: true,
    selfie: true,
    face_match: false,
    address: false,
    background_check: false,
    emergency_contact: true,
    additional_document: false,
    manual_review: false,
  });

  const filteredProfiles = useMemo(() =>
    verificationProfiles.filter(v => !searchTerm || v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.description.toLowerCase().includes(searchTerm.toLowerCase())),
    [verificationProfiles, searchTerm]
  );

  const activeProfile = verificationProfiles.find(v => v.id === selProfId) || verificationProfiles[0];

  const requiredCredentials = useMemo(() => {
    if (!activeProfile) return [];
    return Object.entries(activeProfile.requirements).filter(([_, isReq]) => isReq);
  }, [activeProfile]);

  const optionalCredentials = useMemo(() => {
    if (!activeProfile) return [];
    return Object.entries(activeProfile.requirements).filter(([_, isReq]) => !isReq);
  }, [activeProfile]);

  const totalReqCount = requiredCredentials.length;
  const totalCredCount = Object.keys(activeProfile?.requirements || {}).length;

  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setName('');
    setDescription('');
    setVerificationLevel('Standard');
    setRequirements({
      email: true,
      mobile: true,
      government_id: true,
      selfie: true,
      face_match: false,
      address: false,
      background_check: false,
      emergency_contact: true,
      additional_document: false,
      manual_review: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prof: VerificationProfileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfile(prof);
    setName(prof.name);
    setDescription(prof.description);
    setVerificationLevel(prof.verification_level);
    setRequirements({ ...prof.requirements });
    setIsModalOpen(true);
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this verification profile?')) {
      deleteVerificationProfile(id);
      if (selProfId === id && verificationProfiles.length > 1) {
        const remaining = verificationProfiles.filter(v => v.id !== id);
        setSelProfId(remaining[0]?.id || '');
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const formattedReqs = requirements as VerificationProfileItem['requirements'];

    if (editingProfile) {
      updateVerificationProfile(editingProfile.id, {
        name,
        description,
        verification_level: verificationLevel,
        requirements: formattedReqs,
      });
    } else {
      const newProf = addVerificationProfile({
        name,
        description,
        verification_level: verificationLevel,
        status: 'ACTIVE',
        requirements: formattedReqs,
      });
      setSelProfId(newProf.id);
    }

    setIsModalOpen(false);
  };

  const toggleCredentialRequirement = (key: string) => {
    if (!activeProfile) return;
    const updatedReqs = {
      ...activeProfile.requirements,
      [key]: !activeProfile.requirements[key as keyof typeof activeProfile.requirements]
    };
    updateVerificationProfile(activeProfile.id, { requirements: updatedReqs });
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
          placeholder="Search verification profiles..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 shadow-2xs transition-colors"
        />
      </div>

      {/* Top Profile Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredProfiles.map(prof => {
          const isSelected = selProfId === prof.id || activeProfile?.id === prof.id;

          return (
            <div
              key={prof.id}
              onClick={() => setSelProfId(prof.id)}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer space-y-2.5 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-2 border-purple-500 shadow-2xs ring-1 ring-purple-500/20'
                  : 'bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300'
              }`}
            >
              <div className="space-y-2">
                {/* Selected Top Row Badges */}
                <div className="flex items-center justify-between min-h-[18px]">
                  {isSelected ? (
                    <span className="px-2 py-0.2 rounded bg-purple-100 text-purple-700 text-[9px] font-bold">
                      Selected Profile
                    </span>
                  ) : (
                    <div></div>
                  )}
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 text-xs leading-snug">{prof.name}</h4>

                <div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold inline-block">
                    {prof.verification_level}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{prof.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Inspector Box */}
      {activeProfile && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">{activeProfile.name} Requirements Checklist</h4>
              <p className="text-[10px] text-slate-500 font-medium">
                Mandatory checks before companion onboarding: <strong className="text-purple-700 font-mono">{totalReqCount}/{totalCredCount} Mandatory</strong>
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
              Level: {activeProfile.verification_level}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-[11px]">
            {Object.entries(activeProfile.requirements).map(([key, isRequired]) => {
              const label = CREDENTIAL_LABELS[key] || key;
              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isRequired
                      ? 'bg-emerald-50/50 border-emerald-200/90 text-emerald-950'
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-400'
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  {isRequired ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingProfile ? 'Edit Verification Profile' : 'Add Verification Profile'}
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
                  placeholder="e.g. Premium VIP Verification"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

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
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe identity verification standards..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">Required Credentials</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {ALL_CREDENTIAL_KEYS.map(key => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-white rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={!!requirements[key]}
                        onChange={e => setRequirements(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="accent-purple-600 rounded"
                      />
                      <span className="font-semibold text-slate-800">{CREDENTIAL_LABELS[key]}</span>
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
                  {editingProfile ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
