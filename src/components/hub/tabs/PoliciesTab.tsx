'use client';

import React, { useState } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { Shield, CheckCircle2, Search, Upload, ArrowUpRight, Plus, X, Edit2, Trash2, FileText, Sliders, Layers, CheckSquare } from 'lucide-react';
import { PolicyItem } from '@/lib/types/serviceHub';

export function PoliciesTab() {
  const { policies, addPolicy, updatePolicy, deletePolicy, publishNewPolicyVersion } = useServiceHubStore();
  const [subTab, setSubTab] = useState<'list' | 'basic_info' | 'requirements' | 'enforcement' | 'version_history'>('list');

  const [versionNote, setVersionNote] = useState('');
  const [selectedPolId, setSelectedPolId] = useState(policies[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const activePolicy = policies.find(p => p.id === selectedPolId) || policies[0];

  // Modal State for Add / Edit Policy
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyItem | null>(null);

  // Form State for Policy Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'DEACTIVATED'>('PUBLISHED');
  const [minimumAge, setMinimumAge] = useState(18);
  const [kycRequired, setKycRequired] = useState(true);
  const [backgroundCheckRequired, setBackgroundCheckRequired] = useState(true);
  const [emergencyContactRequired, setEmergencyContactRequired] = useState(true);
  const [publicLocationOnly, setPublicLocationOnly] = useState(true);
  const [liveLocationRequired, setLiveLocationRequired] = useState(true);
  const [sosRequired, setSosRequired] = useState(true);
  const [chatModerationRequired, setChatModerationRequired] = useState(true);
  const [incidentReportingEnabled, setIncidentReportingEnabled] = useState(true);
  const [consentRequired, setConsentRequired] = useState(true);
  const [prohibitedActivityText, setProhibitedActivityText] = useState('');

  const openAddModal = () => {
    setEditingPolicy(null);
    setName('');
    setDescription('');
    setStatus('PUBLISHED');
    setMinimumAge(18);
    setKycRequired(true);
    setBackgroundCheckRequired(true);
    setEmergencyContactRequired(true);
    setPublicLocationOnly(true);
    setLiveLocationRequired(true);
    setSosRequired(true);
    setChatModerationRequired(true);
    setIncidentReportingEnabled(true);
    setConsentRequired(true);
    setProhibitedActivityText('');
    setIsModalOpen(true);
  };

  const openEditModal = (pol: PolicyItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPolicy(pol);
    setName(pol.name);
    setDescription(pol.description);
    setStatus(pol.status);
    setMinimumAge(pol.minimum_age || 18);
    setKycRequired(pol.kyc_required ?? true);
    setBackgroundCheckRequired(pol.background_check_required ?? true);
    setEmergencyContactRequired(pol.emergency_contact_required ?? true);
    setPublicLocationOnly(pol.public_location_only ?? true);
    setLiveLocationRequired(pol.live_location_required ?? true);
    setSosRequired(pol.sos_required ?? true);
    setChatModerationRequired(pol.chat_moderation_required ?? true);
    setIncidentReportingEnabled(pol.incident_reporting_enabled ?? true);
    setConsentRequired(pol.consent_required ?? true);
    setProhibitedActivityText(pol.prohibited_activity_text || '');
    setIsModalOpen(true);
  };

  const handleDeletePolicy = (id: string, polName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete policy "${polName}"?`)) {
      deletePolicy(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert('Please enter policy name.'); return; }

    const payload = {
      name,
      description,
      status,
      minimum_age: minimumAge,
      kyc_required: kycRequired,
      background_check_required: backgroundCheckRequired,
      emergency_contact_required: emergencyContactRequired,
      public_location_only: publicLocationOnly,
      live_location_required: liveLocationRequired,
      sos_required: sosRequired,
      chat_moderation_required: chatModerationRequired,
      incident_reporting_enabled: incidentReportingEnabled,
      consent_required: consentRequired,
      prohibited_activity_text: prohibitedActivityText
    };

    if (editingPolicy) {
      updatePolicy(editingPolicy.id, payload);
    } else {
      addPolicy(payload);
    }

    setIsModalOpen(false);
  };

  const handlePublishVersion = (polId: string, nextVersion: number) => {
    if (!versionNote.trim()) { alert('Please enter release notes for the new version.'); return; }
    publishNewPolicyVersion(polId, versionNote.trim());
    setVersionNote('');
    alert(`Policy version v${nextVersion}.0 published successfully!`);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200/80">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setSubTab('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'list'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Policy List</span>
          </button>

          <button
            onClick={() => setSubTab('basic_info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'basic_info'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Basic Info</span>
          </button>

          <button
            onClick={() => setSubTab('requirements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'requirements'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>3. Policy Requirements</span>
          </button>

          <button
            onClick={() => setSubTab('enforcement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'enforcement'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>4. Enforcement</span>
          </button>

          <button
            onClick={() => setSubTab('version_history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'version_history'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>5. Version History</span>
          </button>
        </div>

        <button
          onClick={openAddModal}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Policy
        </button>
      </div>

      {/* 1. POLICY LIST SUB-TAB */}
      {subTab === 'list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">Active Enterprise Policies ({policies.length})</h4>
          </div>

          <div className="space-y-2.5">
            {policies.map(pol => (
              <div
                key={pol.id}
                onClick={() => setSelectedPolId(pol.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-2xs ${
                  selectedPolId === pol.id ? 'bg-white border-2 border-purple-500 ring-2 ring-purple-500/10' : 'bg-white border-slate-200/90 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h5 className="font-extrabold text-slate-900 text-xs">{pol.name}</h5>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      v{pol.version}.0 Published
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                      {pol.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => openEditModal(pol, e)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors"
                      title="Edit Policy"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeletePolicy(pol.id, pol.name, e)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                      title="Delete Policy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">{pol.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. BASIC INFO SUB-TAB */}
      {subTab === 'basic_info' && activePolicy && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs">Basic Policy Identity & Service Mapping</h4>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => openEditModal(activePolicy, e)}
                className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Policy
              </button>
              <button
                onClick={(e) => handleDeletePolicy(activePolicy.id, activePolicy.name, e)}
                className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Policy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">POLICY IDENTITY</span>
              <strong className="text-slate-900 text-sm block mt-1">{activePolicy.name}</strong>
              <span className="text-[10px] text-slate-500">ID: {activePolicy.id}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">SERVICE MAPPING</span>
              <strong className="text-purple-700 text-sm block mt-1">All Enterprise Categories</strong>
              <span className="text-[10px] text-slate-500">Global Enforcement Scope</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">VERSION & STATUS</span>
              <strong className="text-emerald-700 text-sm block mt-1">v{activePolicy.version}.0 ({activePolicy.status})</strong>
              <span className="text-[10px] text-slate-500">Effective from: {new Date(activePolicy.effective_from).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. POLICY REQUIREMENTS SUB-TAB */}
      {subTab === 'requirements' && activePolicy && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Policy Controls & Requirements Matrix</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <span className="font-extrabold text-purple-950 block">Safety Requirements</span>
              <p className="text-[11px] text-purple-900">
                SOS: {activePolicy.sos_required ? 'Mandatory' : 'Optional'} | Live GPS: {activePolicy.live_location_required ? 'Mandatory' : 'Optional'} | Minimum Age: {activePolicy.minimum_age} yrs
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <span className="font-extrabold text-indigo-950 block">Verification Requirements</span>
              <p className="text-[11px] text-indigo-900">
                Aadhaar KYC: {activePolicy.kyc_required ? 'Mandatory' : 'Optional'} | Background Check: {activePolicy.background_check_required ? 'Mandatory' : 'Optional'} | Emergency Contact: {activePolicy.emergency_contact_required ? 'Mandatory' : 'Optional'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="font-extrabold text-emerald-950 block">Location Requirements</span>
              <p className="text-[11px] text-emerald-900">
                Public Location Only: {activePolicy.public_location_only ? 'Strictly Enforced' : 'Flexible'} | Live Tracking: {activePolicy.live_location_required ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="font-extrabold text-amber-950 block">Communication & Emergency</span>
              <p className="text-[11px] text-amber-900">
                Chat Moderation: {activePolicy.chat_moderation_required ? 'Active AI Filter' : 'Disabled'} | Incident Reporting: {activePolicy.incident_reporting_enabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. APPLICABILITY & ENFORCEMENT SUB-TAB */}
      {subTab === 'enforcement' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Applicability & Automated Enforcement</h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border">
              <strong>Who It Applies To:</strong> All onboarded companions and registered customers across all active service categories.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <strong>When It Applies:</strong> Enforced 24/7 during active booking sessions and pre-booking matching.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <strong>Enforcement Level:</strong> Automated strict system blocking for non-compliant sessions with real-time audit logging.
            </div>
          </div>
        </div>
      )}

      {/* 5. VERSION HISTORY SUB-TAB */}
      {subTab === 'version_history' && activePolicy && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs">Immutable Policy Version History & Publish Trigger</h4>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {(activePolicy.versions || []).map((ver, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border text-xs flex justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 font-mono">v{ver.version}.0</span>
                  <span className="text-slate-600 ml-2">{ver.description}</span>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(ver.effective_from).toLocaleDateString()}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <input
              type="text"
              value={versionNote}
              onChange={e => setVersionNote(e.target.value)}
              placeholder="Enter version release notes..."
              className="flex-1 bg-white border rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none"
            />
            <button
              onClick={() => handlePublishVersion(activePolicy.id, activePolicy.version + 1)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              Publish v{activePolicy.version + 1}.0
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT POLICY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingPolicy ? 'Edit Usage Policy' : 'Create Enterprise Usage Policy'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Policy Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Standard Companion Safety & Trust Policy"
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
                  placeholder="Summarize policy enforcement scope..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Minimum Age Requirement</label>
                  <input
                    type="number"
                    value={minimumAge}
                    onChange={e => setMinimumAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Publish Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="DEACTIVATED">DEACTIVATED</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 block text-xs">Mandatory Enforcement Checklist</span>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={kycRequired}
                      onChange={e => setKycRequired(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    Aadhaar / KYC Required
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={backgroundCheckRequired}
                      onChange={e => setBackgroundCheckRequired(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    Background Check
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={emergencyContactRequired}
                      onChange={e => setEmergencyContactRequired(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    Emergency Contact
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={publicLocationOnly}
                      onChange={e => setPublicLocationOnly(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    Public Location Only
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={liveLocationRequired}
                      onChange={e => setLiveLocationRequired(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    Live Location Stream
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={sosRequired}
                      onChange={e => setSosRequired(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    Panic SOS Dispatch
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={chatModerationRequired}
                      onChange={e => setChatModerationRequired(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    AI Chat Moderation
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={incidentReportingEnabled}
                      onChange={e => setIncidentReportingEnabled(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    Incident Audit Logging
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 col-span-2">
                    <input
                      type="checkbox"
                      checked={consentRequired}
                      onChange={e => setConsentRequired(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    User & Companion Explicit Safety Consent
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Prohibited Activity Guidelines</label>
                <textarea
                  value={prohibitedActivityText}
                  onChange={e => setProhibitedActivityText(e.target.value)}
                  rows={2}
                  placeholder="Specify disallowed behaviors or illegal activities..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium text-slate-900 outline-none"
                />
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
                  {editingPolicy ? 'Update Policy' : 'Create Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
