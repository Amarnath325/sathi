'use client';

import React, { useState, useEffect } from 'react';
import { X, QrCode, MapPin, CheckCircle2, ShieldCheck, RefreshCw, Compass, Smartphone, Zap } from 'lucide-react';

interface GeofenceQrVerificationModalProps {
  bookingNumber: string;
  locationAddress: string;
  companionName: string;
  userName: string;
  mode: 'CHECK_IN' | 'CHECK_OUT';
  onClose: () => void;
  onVerified: (mode: 'CHECK_IN' | 'CHECK_OUT') => void;
}

export function GeofenceQrVerificationModal({
  bookingNumber,
  locationAddress,
  companionName,
  userName,
  mode,
  onClose,
  onVerified
}: GeofenceQrVerificationModalProps) {
  const [gpsDistance, setGpsDistance] = useState<number>(14); // in meters
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(99.2);
  const [isScanning, setIsScanning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [otpCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate micro GPS jitter
      setGpsDistance(prev => Math.max(3, Math.min(25, prev + (Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsSuccess(true);
      setTimeout(() => {
        onVerified(mode);
        onClose();
      }, 1500);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {mode === 'CHECK_IN' ? 'Geofenced Meetup Check-In' : 'Meetup Completion Check-Out'}
              </h3>
              <p className="text-[10px] font-mono text-emerald-400">Ref: {bookingNumber}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-center">
          
          {/* GPS Proximity Badge */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-slate-300">
              <Compass className="w-4 h-4 text-purple-400 animate-spin" />
              <span>GPS Proximity:</span>
              <strong className="text-emerald-400 font-mono">{gpsDistance.toFixed(1)} meters</strong>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
              Within Geofence ({gpsAccuracy}%)
            </span>
          </div>

          {/* QR Code Container */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-4 relative overflow-hidden">
            
            {isSuccess ? (
              <div className="py-6 space-y-3 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-white">
                  {mode === 'CHECK_IN' ? 'Meetup Check-In Verified!' : 'Check-Out Verified!'}
                </h4>
                <p className="text-xs text-slate-400">GPS Timestamp & QR handshake recorded on blockchain ledger.</p>
              </div>
            ) : (
              <>
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-xl border-4 border-emerald-500/50 flex flex-col items-center justify-center relative">
                  {/* Simulated QR Code matrix grid */}
                  <div className="w-full h-full bg-slate-900 rounded-xl p-3 flex flex-col justify-between text-emerald-400 font-mono text-[9px] select-none overflow-hidden">
                    <div className="flex justify-between">
                      <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">QR-SATHI</span>
                      <span>{mode}</span>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-xs tracking-widest font-extrabold text-white">{otpCode}</div>
                      <div className="text-[8px] text-slate-400">{locationAddress}</div>
                    </div>

                    <div className="flex justify-between text-[8px] text-slate-500">
                      <span>{userName}</span>
                      <span>{companionName}</span>
                    </div>
                  </div>

                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center rounded-xl border-2 border-emerald-400 animate-pulse">
                      <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-white text-xs">Scan companion's screen or share OTP Code</p>
                  <p className="text-[11px] font-mono text-purple-400">One-Time Dynamic Passcode: <strong className="text-white bg-purple-950 px-2 py-0.5 rounded border border-purple-800">{otpCode}</strong></p>
                </div>

                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validating GPS & Scanning Code...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Simulate Companion QR Scan</span>
                    </>
                  )}
                </button>
              </>
            )}

          </div>

          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center gap-2 text-[10px] text-left">
            <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
            <span>Dual QR check-in protects escrow funds against non-attendance & false claims.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
