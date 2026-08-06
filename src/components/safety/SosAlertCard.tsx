'use client';

import React from 'react';
import { SosAlertItem } from '@/lib/types';
import { ShieldAlert, MapPin, Radio, Phone, User, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, Clock } from 'lucide-react';

interface SosAlertCardProps {
  alert: SosAlertItem;
  onDispatch: (alert: SosAlertItem) => void;
  onResolve: (alert: SosAlertItem) => void;
}

export function SosAlertCard({ alert, onDispatch, onResolve }: SosAlertCardProps) {
  const isEmergency = alert.severity === 'CRITICAL_EMERGENCY' || alert.severity === 'HIGH';
  const isResolved = alert.status === 'RESOLVED_SAFE' || alert.status === 'FALSE_ALARM';

  return (
    <div className={`p-5 rounded-3xl transition-all border shadow-xl relative overflow-hidden ${
      isResolved
        ? 'bg-slate-900/80 border-slate-800'
        : isEmergency
        ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border-rose-500/50 shadow-rose-500/10 animate-pulse-border'
        : 'bg-slate-900 border-amber-500/40'
    }`}>
      {/* Background Pulse Glow */}
      {!isResolved && isEmergency && (
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${
            isResolved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 animate-bounce'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-white text-xs">{alert.alertRef}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                alert.severity === 'CRITICAL_EMERGENCY'
                  ? 'bg-rose-600 text-white'
                  : alert.severity === 'HIGH'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {alert.severity.replace('_', ' ')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-slate-500" />
              {new Date(alert.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 ${
            alert.status === 'ACTIVE_DISPATCH'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : alert.status === 'RESPONDER_EN_ROUTE'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : alert.status === 'POLICE_NOTIFIED'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : alert.status === 'RESOLVED_SAFE'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              alert.status === 'ACTIVE_DISPATCH' ? 'bg-rose-500 animate-ping' : 'bg-current'
            }`} />
            {alert.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Body Metadata */}
      <div className="space-y-3">
        {/* Parties */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Client User</span>
            <span className="font-bold text-white block truncate">{alert.userName}</span>
            {alert.userPhone && <span className="text-[10px] text-indigo-400 block font-mono">{alert.userPhone}</span>}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Companion Escort</span>
            <span className="font-bold text-purple-300 block truncate">{alert.companionName || 'Unassigned'}</span>
            {alert.companionPhone && <span className="text-[10px] text-purple-400 block font-mono">{alert.companionPhone}</span>}
          </div>
        </div>

        {/* Location & GPS */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{alert.locationName}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
            <span>GPS: {alert.coordinates.lat.toFixed(4)}, {alert.coordinates.lng.toFixed(4)}</span>
            <a
              href={`https://maps.google.com/?q=${alert.coordinates.lat},${alert.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-sans"
            >
              Live Map <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Audio Feed & Safe Word indicator */}
        {(alert.liveAudioFeedActive || alert.safeWordTriggered) && (
          <div className="flex items-center gap-2 text-xs">
            {alert.liveAudioFeedActive && (
              <span className="px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-1.5 text-[11px]">
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" /> Live Mic Feed Active
              </span>
            )}
            {alert.safeWordTriggered && (
              <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold">
                Safe Word: "{alert.safeWordTriggered}"
              </span>
            )}
          </div>
        )}

        {/* Notes / Responder */}
        {alert.assignedResponder && (
          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            <span className="font-bold">Responder: </span> {alert.assignedResponder}
            {alert.policeDispatchRef && <span className="font-mono text-[11px] text-purple-300 block">Police Ref: {alert.policeDispatchRef}</span>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
        {!isResolved ? (
          <>
            <button
              onClick={() => onDispatch(alert)}
              className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> Dispatch Emergency
            </button>
            <button
              onClick={() => onResolve(alert)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Resolve
            </button>
          </>
        ) : (
          <div className="w-full text-center text-xs text-emerald-400 font-bold py-1 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Issue Closed & Verified Safe
          </div>
        )}
      </div>
    </div>
  );
}
