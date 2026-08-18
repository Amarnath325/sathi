'use client';

import React, { useState, useMemo } from 'react';
import { useServiceHubStore } from '@/lib/serviceHubStore';
import { UserCheck, CheckCircle2, XCircle, Search } from 'lucide-react';

const LEVEL_STYLES: Record<string, string> = {
  BASIC:    'bg-slate-500/10 border-slate-500/30 text-slate-300',
  STANDARD: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  ENHANCED: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
  CRITICAL: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
};

export function VerificationTab() {
  const { verificationProfiles } = useServiceHubStore();
  const [selProfId, setSelProfId] = useState(verificationProfiles[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = useMemo(() =>
    verificationProfiles.filter(v => !searchTerm || v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.description.toLowerCase().includes(searchTerm.toLowerCase())),
    [verificationProfiles, searchTerm]
  );

  const activeProfile = verificationProfiles.find(v => v.id === selProfId) || verificationProfiles[0];

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search verification profiles..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProfiles.map(prof => {
          const isSelected = selProfId === prof.id;
          const style = LEVEL_STYLES[prof.verification_level] || LEVEL_STYLES.BASIC;
          return (
            <div
              key={prof.id}
              onClick={() => setSelProfId(prof.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 hover:-translate-y-0.5 ${
                isSelected ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-white text-sm">{prof.name}</h4>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${style}`}>
                  {prof.verification_level}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{prof.description}</p>
              {isSelected && (
                <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Selected Profile
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Profile Detailed Matrix */}
      {activeProfile && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-white text-base flex items-center gap-2">
              Credential Matrix:
              <span className="text-indigo-400">{activeProfile.name}</span>
            </h4>
            <span className="text-xs text-slate-400">
              {Object.values(activeProfile.requirements).filter(Boolean).length} / {Object.keys(activeProfile.requirements).length} Required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 text-xs">
            {Object.entries(activeProfile.requirements).map(([reqKey, isReq]) => (
              <div
                key={reqKey}
                className={`p-3.5 rounded-2xl border flex flex-col gap-2 transition-all ${
                  isReq ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold capitalize text-[11px] leading-tight ${isReq ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {reqKey.replace(/_/g, ' ')}
                  </span>
                  {isReq
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    : <XCircle className="w-4 h-4 text-slate-700 shrink-0" />
                  }
                </div>
                <span className={`text-[10px] font-mono font-bold ${isReq ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {isReq ? 'REQUIRED' : 'OPTIONAL'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
