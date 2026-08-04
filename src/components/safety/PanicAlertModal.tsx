'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, PhoneCall, MapPin, CheckCircle2, X } from 'lucide-react';

interface PanicAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PanicAlertModal({ isOpen, onClose }: PanicAlertModalProps) {
  const [alertState, setAlertState] = useState<'TRIGGERED' | 'DISPATCHED' | 'CANCELLED'>('TRIGGERED');
  const [pinInput, setPinInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full glass-panel border-2 border-rose-500 rounded-3xl p-6 relative shadow-2xl shadow-rose-900/50 animate-bounce-short">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {alertState === 'TRIGGERED' && (
          <div className="text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-600/20 border-4 border-rose-500 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">Emergency SOS Activated</h2>
              <p className="text-sm text-rose-300 mt-1">Your high-priority safety alert has been initiated!</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-400" /> Live GPS Coordinates:</span>
                <span className="font-mono text-emerald-400">37.7749° N, 122.4194° W</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Address:</span>
                <span className="font-mono text-slate-200">Market St & 4th St, San Francisco, CA</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Trusted Contacts Pings:</span>
                <span className="text-emerald-400 font-semibold">2 SMS Sent</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setAlertState('DISPATCHED')}
                className="w-full py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                CONNECT INSTANT 24/7 SAFETY DISPATCH
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel SOS (False Alarm)
              </button>
            </div>
          </div>
        )}

        {alertState === 'DISPATCHED' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Emergency Response Dispatched</h3>
              <p className="text-xs text-slate-300 mt-1">Our 24/7 Safety Command Center is actively monitoring your location audio & GPS feed.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              [DISPATCHER AUDIO AGENT READY - CALL CONNECTED]
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
            >
              Return to Platform
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
