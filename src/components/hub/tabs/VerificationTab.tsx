'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { UserCheck, CheckCircle2, XCircle, Search, Check, Plus, Edit2, Trash2, X, Sliders, Layers, FileCheck } from 'lucide-react';
import { VerificationProfileItem, VerificationLevel } from '@/lib/types/serviceHub';

export function VerificationTab() {
  const {
    verificationProfiles,
    addVerificationProfile,
    updateVerificationProfile,
    deleteVerificationProfile
  } = useServiceHubStore();

  const [subTab, setSubTab] = useState<'profiles' | 'checks' | 'rules'>('profiles');
  const [selProfId, setSelProfId] = useState(verificationProfiles[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const activeProfile = verificationProfiles.find(v => v.id === selProfId) || verificationProfiles[0];

  // Modal State for Add / Edit Verification Profile
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<VerificationProfileItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [verifLevel, setVerifLevel] = useState<VerificationLevel>('Standard');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // 10 Requirement Flags
  const [emailReq, setEmailReq] = useState(true);
  const [mobileReq, setMobileReq] = useState(true);
  const [govtIdReq, setGovtIdReq] = useState(true);
  const [selfieReq, setSelfieReq] = useState(true);
  const [faceMatchReq, setFaceMatchReq] = useState(true);
  const [addressReq, setAddressReq] = useState(false);
  const [bgCheckReq, setBgCheckReq] = useState(false);
  const [emergContactReq, setEmergContactReq] = useState(true);
  const [addDocReq, setAddDocReq] = useState(false);
  const [manualReviewReq, setManualReviewReq] = useState(false);

  const openAddModal = () => {
    setEditingProf(null);
    setName('');
    setDescription('');
    setVerifLevel('Standard');
    setStatus('ACTIVE');
    setEmailReq(true);
    setMobileReq(true);
    setGovtIdReq(true);
    setSelfieReq(true);
    setFaceMatchReq(true);
    setAddressReq(false);
    setBgCheckReq(false);
    setEmergContactReq(true);
    setAddDocReq(false);
    setManualReviewReq(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prof: VerificationProfileItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProf(prof);
    setName(prof.name);
    setDescription(prof.description);
    setVerifLevel(prof.verification_level);
    setStatus(prof.status || 'ACTIVE');
    setEmailReq(prof.requirements?.email ?? true);
    setMobileReq(prof.requirements?.mobile ?? true);
    setGovtIdReq(prof.requirements?.government_id ?? true);
    setSelfieReq(prof.requirements?.selfie ?? true);
    setFaceMatchReq(prof.requirements?.face_match ?? true);
    setAddressReq(prof.requirements?.address ?? false);
    setBgCheckReq(prof.requirements?.background_check ?? false);
    setEmergContactReq(prof.requirements?.emergency_contact ?? true);
    setAddDocReq(prof.requirements?.additional_document ?? false);
    setManualReviewReq(prof.requirements?.manual_review ?? false);
    setIsModalOpen(true);
  };

  const handleDeleteProfile = (id: string, profName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete verification profile "${profName}"?`)) {
      deleteVerificationProfile(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert('Please enter profile name.'); return; }

    const payload = {
      name,
      description,
      verification_level: verifLevel,
      status,
      requirements: {
        email: emailReq,
        mobile: mobileReq,
        government_id: govtIdReq,
        selfie: selfieReq,
        face_match: faceMatchReq,
        address: addressReq,
        background_check: bgCheckReq,
        emergency_contact: emergContactReq,
        additional_document: addDocReq,
        manual_review: manualReviewReq
      }
    };

    if (editingProf) {
      updateVerificationProfile(editingProf.id, payload);
    } else {
      addVerificationProfile(payload);
    }

    setIsModalOpen(false);
  };

  const CHECKS_LIST = [
    { key: 'identity', name: 'Identity Verification', desc: 'Government ID / Aadhaar verification', level: 'Mandatory' },
    { key: 'contact', name: 'Contact Verification', desc: 'OTP Mobile & Email verification', level: 'Mandatory' },
    { key: 'face', name: 'Face Match', desc: 'Biometric selfie matching with photo ID', level: 'Mandatory' },
    { key: 'address', name: 'Address Proof', desc: 'Verified residential address verification', level: 'Enhanced' },
    { key: 'background', name: 'Background Check', desc: 'Police clearance certificate & court check', level: 'Enhanced' },
    { key: 'emergency', name: 'Emergency Contact Check', desc: 'Verified family/next of kin phone check', level: 'Mandatory' },
    { key: 'additional', name: 'Additional Documents', desc: 'Degree, character certificate, bank details', level: 'Restricted' },
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
            <span>1. Verification Profiles</span>
          </button>

          <button
            onClick={() => setSubTab('checks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'checks'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>2. Verification Checks</span>
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
            <span>3. Verification Rules</span>
          </button>
        </div>

        <button
          onClick={openAddModal}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Profile
        </button>
      </div>

      {/* 1. VERIFICATION PROFILES SUB-TAB */}
      {subTab === 'profiles' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {verificationProfiles.map(prof => {
              const isSelected = selProfId === prof.id || activeProfile?.id === prof.id;

              return (
                <div
                  key={prof.id}
                  onClick={() => setSelProfId(prof.id)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer space-y-2.5 flex flex-col justify-between shadow-2xs ${
                    isSelected
                      ? 'bg-white border-2 border-purple-500 ring-2 ring-purple-500/10'
                      : 'bg-white border border-slate-200/90 hover:border-purple-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                        {prof.verification_level}
                      </span>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={(e) => openEditModal(prof, e)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProfile(prof.id, prof.name, e)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{prof.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{prof.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VERIFICATION CHECKS SUB-TAB */}
      {subTab === 'checks' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Standard Verification Checks Matrix</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {CHECKS_LIST.map(item => (
              <div key={item.key} className="p-3 rounded-xl bg-slate-50 border space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">{item.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {item.level}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VERIFICATION RULES SUB-TAB */}
      {subTab === 'rules' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Configured Verification Enforcement Rules</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <span className="font-extrabold text-purple-950 block">1. Mandatory vs Optional Rules</span>
              <p className="text-[11px] text-purple-900">Government ID and Selfie match are non-negotiable mandatory checks prior to companion listing.</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <span className="font-extrabold text-indigo-950 block">2. Document Expiry & Re-Verification</span>
              <p className="text-[11px] text-indigo-900">Government IDs re-evaluated every 365 days. Police clearance re-verified every 180 days.</p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
              <span className="font-extrabold text-rose-950 block">3. Failure Handling & Rejection</span>
              <p className="text-[11px] text-rose-900">3 failed facial match attempts locks account and routes to manual admin review queue.</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="font-extrabold text-amber-950 block">4. Manual Supervisor Review</span>
              <p className="text-[11px] text-amber-900">Unclear documents flagged for human review by compliance officer within 2 hours.</p>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT VERIFICATION PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingProf ? 'Edit Verification Profile' : 'Create Verification Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Profile Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Enhanced VIP Verification Profile"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Verification Level</label>
                  <select
                    value={verifLevel}
                    onChange={e => setVerifLevel(e.target.value as VerificationLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Enhanced">Enhanced</option>
                    <option value="Restricted">Restricted</option>
                  </select>
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

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe verification profile scope..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 block text-xs">Verification Requirements Matrix</span>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={emailReq} onChange={e => setEmailReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Email Verification
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={mobileReq} onChange={e => setMobileReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Mobile OTP Verification
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={govtIdReq} onChange={e => setGovtIdReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Government ID / Aadhaar
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={selfieReq} onChange={e => setSelfieReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Live Selfie Capture
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={faceMatchReq} onChange={e => setFaceMatchReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Biometric Face Match
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={addressReq} onChange={e => setAddressReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Address Verification
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={bgCheckReq} onChange={e => setBgCheckReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Police Background Check
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={emergContactReq} onChange={e => setEmergContactReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Emergency Contact Check
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={addDocReq} onChange={e => setAddDocReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Additional Certificates
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input type="checkbox" checked={manualReviewReq} onChange={e => setManualReviewReq(e.target.checked)} className="accent-purple-600 rounded" />
                    Manual Admin Review
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
