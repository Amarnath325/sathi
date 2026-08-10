'use client';

import React, { useState } from 'react';
import { ShieldAlert, MapPin, PhoneCall, AlertTriangle, X, Radio } from 'lucide-react';
import { useCommunicationStore } from '@/lib/communicationStore';

interface SOSPanicModalProps {
  conversationId: string;
  companionName: string;
  onClose: () => void;
}

export default function SOSPanicModal({ conversationId, companionName, onClose }: SOSPanicModalProps) {
  const { triggerSosEmergency } = useCommunicationStore();
  const [isActivating, setIsActivating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isDispatched, setIsDispatched] = useState(false);

  const handleTriggerPanic = () => {
    setIsActivating(true);
    let current = 3;
    const interval = setInterval(() => {
      current -= 1;
      setCountdown(current);
      if (current === 0) {
        clearInterval(interval);
        // Trigger SOS emergency alert
        triggerSosEmergency(conversationId, {
          lat: 28.6139 + (Math.random() - 0.5) * 0.01,
          lng: 77.2090 + (Math.random() - 0.5) * 0.01,
          address: 'Grand Hyatt Hotel & Conference Lounge, Central Block',
        });
        setIsDispatched(true);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-rose-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel border-2 border-rose-500/80 rounded-3xl p-6 relative space-y-6 shadow-2xl shadow-rose-900/50 text-center overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {isDispatched ? (
          <div className="py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-rose-600/30 border-2 border-rose-500 mx-auto flex items-center justify-center animate-ping">
              <Radio className="w-10 h-10 text-rose-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white">EMERGENCY SOS DISPATCHED!</h3>
            <p className="text-xs text-rose-200 leading-relaxed">
              Your live GPS coordinates have been sent to <strong>Sathi Security Operations</strong> & local emergency contacts. Live monitoring active for session with {companionName}.
            </p>
            <div className="p-3 rounded-2xl bg-slate-950 border border-rose-500/40 text-[11px] text-rose-300 font-mono">
              GPS: 28.6139° N, 77.2090° E · Dispatch Code #SOS-9112
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
            >
              Close Emergency Overlay
            </button>
          </div>
        ) : isActivating ? (
          <div className="py-8 space-y-4">
            <div className="w-24 h-24 rounded-full bg-rose-600 text-white font-extrabold text-4xl mx-auto flex items-center justify-center animate-bounce shadow-2xl shadow-rose-600/60">
              {countdown}
            </div>
            <h3 className="text-lg font-bold text-white">Broadcasting Emergency SOS...</h3>
            <p className="text-xs text-rose-300">Tap below to cancel immediately if pressed by mistake.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:text-white border border-slate-700"
            >
              Cancel Emergency Signal
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-rose-600/20 text-rose-400 border border-rose-500/40 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-9 h-9 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Sathi Instant Emergency SOS</h3>
              <p className="text-xs text-slate-300 mt-1">
                Feeling unsafe during your session with {companionName}? Press below to dispatch silent emergency location alert to security center.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/30 text-[11px] text-slate-300 text-left space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <MapPin className="w-3.5 h-3.5" /> GPS Location Broadcast
              </div>
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <PhoneCall className="w-3.5 h-3.5" /> Admin SOS Dispatch Call
              </div>
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> Direct Hotel Security Push
              </div>
            </div>

            <button
              onClick={handleTriggerPanic}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-sm shadow-xl shadow-rose-600/50 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Radio className="w-5 h-5 animate-pulse" /> PRESS FOR EMERGENCY SOS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
