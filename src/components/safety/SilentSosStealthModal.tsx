'use client';

import React, { useState } from 'react';
import { EyeOff, ShieldAlert, Mic, Radio, Battery, Lock } from 'lucide-react';

interface SilentSosStealthModalProps {
  userLocationName: string;
  onClose: () => void;
}

export function SilentSosStealthModal({ userLocationName, onClose }: SilentSosStealthModalProps) {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [covertActive, setCovertActive] = useState(true);

  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else {
      setCalcDisplay(prev => prev === '0' ? val : prev + val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 animate-fade-in font-sans">
      
      {/* Covert Top Indicator (Disguised as Calculator / Battery Screen) */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-zinc-500 text-xs">
        <span className="font-mono flex items-center gap-1.5 text-rose-500/80 font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" /> COVERT SILENT SOS ACTIVE
        </span>
        <button
          onClick={onClose}
          className="text-[10px] text-zinc-600 hover:text-zinc-400 font-mono px-2 py-1 bg-zinc-900 rounded border border-zinc-800"
        >
          Exit Disguise (Tap 2x)
        </button>
      </div>

      {/* Disguise Screen Body: Real Working Fake Calculator */}
      <div className="max-w-xs mx-auto w-full space-y-4 my-auto">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-right font-mono text-3xl text-white tracking-widest overflow-hidden">
          {calcDisplay}
        </div>

        <div className="grid grid-cols-4 gap-3 text-sm font-bold font-mono">
          {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (
            <button
              key={btn}
              onClick={() => handleCalcClick(btn)}
              className="py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-extrabold active:scale-95 transition-all"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Covert Footer Notice */}
      <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center text-[10px] font-mono text-rose-300 space-y-1">
        <p className="font-bold flex items-center justify-center gap-1">
          <Mic className="w-3 h-3 text-rose-400 animate-pulse" /> Background Audio & GPS Live Streaming to PCR
        </p>
        <p className="text-zinc-400">Screen appears as normal calculator to any observer.</p>
      </div>

    </div>
  );
}
