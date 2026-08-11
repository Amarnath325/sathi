'use client';

import React, { useState } from 'react';
import { X, Smartphone, Zap, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

interface SosGestureDetectorModalProps {
  onClose: () => void;
  onTriggerSos: () => void;
}

export function SosGestureDetectorModal({ onClose, onTriggerSos }: SosGestureDetectorModalProps) {
  const [shakeCount, setShakeCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);

  const handleSimulateShake = () => {
    const nextCount = shakeCount + 1;
    setShakeCount(nextCount);

    if (nextCount >= 3) {
      setIsActivated(true);
      setTimeout(() => {
        onTriggerSos();
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Shake-to-Trigger Motion Gesture</h3>
              <p className="text-[10px] text-rose-400 font-mono">Hands-Free Accelerometer Lock</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs text-center">
          
          <p className="text-slate-300 leading-relaxed max-w-xs mx-auto">
            Shake your phone rapidly 3 times or press Volume Down 3x to instantly broadcast an Emergency SOS without unlocking your phone screen.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Shake Counter:</span>
              <strong className="text-rose-400 font-bold">{shakeCount} / 3 Shakes</strong>
            </div>

            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-amber-400 transition-all duration-300"
                style={{ width: `${(shakeCount / 3) * 100}%` }}
              />
            </div>
          </div>

          {isActivated ? (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold space-y-2 animate-bounce">
              <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
              <p>3 SHAKES DETECTED! INITIATING SOS DISPATCH...</p>
            </div>
          ) : (
            <button
              onClick={handleSimulateShake}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Rapid Phone Shake ({shakeCount + 1}/3)</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
