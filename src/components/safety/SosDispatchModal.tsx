'use client';

import React, { useState } from 'react';
import { SosAlertItem } from '@/lib/types';
import { X, PhoneCall, ShieldAlert, Radio, MapPin, Send, CheckCircle2 } from 'lucide-react';


interface SosDispatchModalProps {
  isOpen: boolean;
  alert: SosAlertItem | null;
  onClose: () => void;
  onConfirmDispatch: (id: string, responderName: string, policeRef?: string) => void;
}

export function SosDispatchModal({ isOpen, alert, onClose, onConfirmDispatch }: SosDispatchModalProps) {
  const [responderType, setResponderType] = useState<'PATROL' | 'POLICE' | 'EMERGENCY_CONTACT'>('PATROL');
  const [responderName, setResponderName] = useState('Sathi Rapid Response Unit #4');
  const [policeRef, setPoliceRef] = useState('PCR-100-DELHI-8812');

  if (!isOpen || !alert) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDispatch(alert.id, responderName, responderType === 'POLICE' ? policeRef : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 glass-panel rounded-3xl border border-rose-500/40 shadow-2xl space-y-6 bg-slate-950/95 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Dispatch Rapid Emergency Response</h3>
            <p className="text-xs text-slate-400">Transmitting GPS coordinates and live audio stream</p>
          </div>
        </div>

        {/* Target Alert Snapshot */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">ALERT REF: <strong className="text-white">{alert.alertRef}</strong></span>
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase">{alert.severity}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{alert.locationName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Responder Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
              Select Response Agency
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setResponderType('PATROL');
                  setResponderName('Sathi Private Rapid Patrol Unit #4');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  responderType === 'PATROL'
                    ? 'bg-rose-600/20 border-rose-500 text-white font-bold shadow-lg shadow-rose-600/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-4 h-4 mx-auto mb-1 text-rose-400" />
                <span className="text-[11px] block font-bold">Private Security Patrol</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResponderType('POLICE');
                  setResponderName('City Police Control Room (PCR 100/911)');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  responderType === 'POLICE'
                    ? 'bg-purple-600/20 border-purple-500 text-white font-bold shadow-lg shadow-purple-600/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <span className="text-[11px] block font-bold">Police Dispatch (100)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResponderType('EMERGENCY_CONTACT');
                  setResponderName('User & Companion Kin Emergency Hotline');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  responderType === 'EMERGENCY_CONTACT'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <PhoneCall className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                <span className="text-[11px] block font-bold">Emergency Kin Contact</span>
              </button>
            </div>
          </div>

          {/* Responder Name Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">Assigned Patrol Unit / Agency Name</label>
            <input
              type="text"
              value={responderName}
              onChange={e => setResponderName(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-rose-500"
            />
          </div>

          {/* Police Ref (If Police selected) */}
          {responderType === 'POLICE' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Police PCR Dispatch Reference / FIR ID</label>
              <input
                type="text"
                value={policeRef}
                onChange={e => setPoliceRef(e.target.value)}
                placeholder="e.g. PCR-100-MUM-4421"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500 font-mono"
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Transmit Emergency Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
