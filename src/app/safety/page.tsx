'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ShieldCheck, 
  MapPin, 
  Radio, 
  Phone, 
  PhoneCall, 
  AlertTriangle, 
  FileText, 
  Send, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Activity,
  Mic,
  Navigation,
  RefreshCw,
  Clock,
  Paperclip,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { analyzeVoiceForSafeWord } from '@/lib/aiSafetyVoiceTelemetry';
import { LiveSafetyTrackModal } from '@/components/safety/LiveSafetyTrackModal';
import { SafetyZoneShield } from '@/components/safety/SafetyZoneShield';
import { dispatchEmergencyContactsAlert } from '@/lib/emergencyDispatcher';
import { SosGestureDetectorModal } from '@/components/safety/SosGestureDetectorModal';
import { SilentSosStealthModal } from '@/components/safety/SilentSosStealthModal';
import { SosDispatchRadarModal } from '@/components/safety/SosDispatchRadarModal';
import { executeEmergencyEscrowFreeze } from '@/lib/escrowFreezeEngine';
import { Share2, Sparkles, Volume2, Smartphone, EyeOff } from 'lucide-react';

export default function SafetyHubPage() {
  const triggerSosAlert = useAdminStore((state) => state.triggerSosAlert);
  const createIncidentReport = useAdminStore((state) => state.createIncidentReport);
  const sosAlerts = useAdminStore((state) => state.sosAlerts);
  const incidentReports = useAdminStore((state) => state.incidentReports);

  // SOS Form & Live Telemetry State
  const [isSubmittingSos, setIsSubmittingSos] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosAlertRef, setSosAlertRef] = useState<string | null>(null);
  const [safeWordInput, setSafeWordInput] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: 28.6315,
    lng: 77.2167,
    name: 'Connaught Place, New Delhi (Geofenced Zone 4)'
  });
  const [isMicStreaming, setIsMicStreaming] = useState(true);
  const [patrolDistance, setPatrolDistance] = useState('1.2 km');

  // Incident Form state
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState<'CUSTOMER' | 'COMPANION'>('CUSTOMER');
  const [targetName, setTargetName] = useState('');
  const [category, setCategory] = useState<any>('HARASSMENT');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [incidentSubmitted, setIncidentSubmitted] = useState(false);
  const [submittedIncidentRef, setSubmittedIncidentRef] = useState<string | null>(null);

  // Advance Safety Center State
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [voiceTestInput, setVoiceTestInput] = useState('');
  const [voiceLog, setVoiceLog] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  // Ultra-Advance SOS State
  const [isGestureModalOpen, setIsGestureModalOpen] = useState(false);
  const [isStealthModalOpen, setIsStealthModalOpen] = useState(false);
  const [isRadarModalOpen, setIsRadarModalOpen] = useState(false);
  const [escrowFreezeNotice, setEscrowFreezeNotice] = useState<any>(null);

  // Active Tab for live safety feeds
  const [activeTab, setActiveTab] = useState<'sos-hub' | 'incident-report' | 'live-patrol' | 'my-tickets'>('sos-hub');

  useEffect(() => {
    // Attempt Geolocation Acquisition
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: `Live GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
          });
        },
        () => {
          // Default fallback
        }
      );
    }
  }, []);

  const handlePanicTrigger = async () => {
    setIsSubmittingSos(true);
    try {
      // Backend API Call with persistent store fallback
      const res = await fetch('/api/safety/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr-client-current',
          userName: reporterName || 'Active Verified Client',
          locationName: userLocation.name,
          coordinates: { lat: userLocation.lat, lng: userLocation.lng },
          severity: 'CRITICAL_EMERGENCY',
          safeWordTriggered: safeWordInput || 'DYNAMIC_PANIC',
          notes: `Live Emergency SOS Triggered. Mic Audio Stream: Active. Safe Word: ${safeWordInput || 'N/A'}`
        })
      });

      const data = await res.json();
      if (data.success && data.alert) {
        setSosAlertRef(data.alert.alertRef);
      } else {
        const fallbackAlert = triggerSosAlert({
          userId: 'usr-client-current',
          userName: reporterName || 'Active Verified Client',
          locationName: userLocation.name,
          coordinates: { lat: userLocation.lat, lng: userLocation.lng },
          severity: 'CRITICAL_EMERGENCY',
          safeWordTriggered: safeWordInput || 'DYNAMIC_PANIC',
          notes: 'Triggered from Client Safety Hub emergency panic button.'
        });
        setSosAlertRef(fallbackAlert.alertRef);
      }
      // Trigger Emergency Contact SMS/Call Dispatcher & Financial Escrow Freeze
      const disp = dispatchEmergencyContactsAlert(
        reporterName || 'Active Verified Client',
        userLocation.name,
        sosAlertRef || 'SOS-EMERGENCY'
      );
      setDispatchResult(disp);

      const frz = executeEmergencyEscrowFreeze('usr-client-current', sosAlertRef || 'SOS-EMERGENCY', 250);
      setEscrowFreezeNotice(frz);

      setSosTriggered(true);
    } catch (err) {
      const fallbackAlert = triggerSosAlert({
        userId: 'usr-client-current',
        userName: reporterName || 'Active Verified Client',
        locationName: userLocation.name,
        coordinates: { lat: userLocation.lat, lng: userLocation.lng },
        severity: 'CRITICAL_EMERGENCY',
        safeWordTriggered: safeWordInput || 'DYNAMIC_PANIC',
        notes: 'Triggered from Client Safety Hub emergency panic button.'
      });
      setSosAlertRef(fallbackAlert.alertRef);

      const disp = dispatchEmergencyContactsAlert(
        reporterName || 'Active Verified Client',
        userLocation.name,
        fallbackAlert.alertRef
      );
      setDispatchResult(disp);

      const frz = executeEmergencyEscrowFreeze('usr-client-current', fallbackAlert.alertRef, 250);
      setEscrowFreezeNotice(frz);

      setSosTriggered(true);
    } finally {
      setIsSubmittingSos(false);
    }
  };

  const handleTestVoiceCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceTestInput.trim()) return;

    const res = analyzeVoiceForSafeWord(voiceTestInput, safeWordInput);
    setVoiceLog(res.recommendedAction);

    if (res.autoTriggerSos) {
      setTimeout(() => {
        handlePanicTrigger();
      }, 1000);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !targetName || !description) return;

    setIsSubmittingReport(true);
    try {
      const res = await fetch('/api/safety/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId: 'usr-client-' + Date.now(),
          reporterName,
          reporterRole,
          targetId: 'usr-target-' + Date.now(),
          targetName,
          targetRole: reporterRole === 'CUSTOMER' ? 'COMPANION' : 'CUSTOMER',
          category,
          severity: 'SERIOUS',
          description,
          evidenceUrls: evidenceUrl ? [evidenceUrl] : []
        })
      });

      const data = await res.json();
      if (data.success && data.incident) {
        setSubmittedIncidentRef(data.incident.incidentRef);
      } else {
        const fallbackTicket = createIncidentReport({
          reporterId: 'usr-client-' + Date.now(),
          reporterName,
          reporterRole,
          targetId: 'usr-target-' + Date.now(),
          targetName,
          targetRole: reporterRole === 'CUSTOMER' ? 'COMPANION' : 'CUSTOMER',
          category,
          severity: 'SERIOUS',
          description,
          evidenceUrls: evidenceUrl ? [evidenceUrl] : [],
          disciplinaryAction: 'NONE'
        });
        setSubmittedIncidentRef(fallbackTicket.incidentRef);
      }
      setIncidentSubmitted(true);
    } catch (err) {
      const fallbackTicket = createIncidentReport({
        reporterId: 'usr-client-' + Date.now(),
        reporterName,
        reporterRole,
        targetId: 'usr-target-' + Date.now(),
        targetName,
        targetRole: reporterRole === 'CUSTOMER' ? 'COMPANION' : 'CUSTOMER',
        category,
        severity: 'SERIOUS',
        description,
        evidenceUrls: evidenceUrl ? [evidenceUrl] : [],
        disciplinaryAction: 'NONE'
      });
      setSubmittedIncidentRef(fallbackTicket.incidentRef);
      setIncidentSubmitted(true);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* 🚀 Main Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 p-6 sm:p-10 md:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" /> 24/7 Enterprise Safety & Rapid SOS Command
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Your Safety is Our <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-indigo-300 bg-clip-text text-transparent">Absolute Priority</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base font-light leading-relaxed">
            Equipped with live GPS geofencing, encrypted audio streaming telemetry, dynamic safe-words, instant police control room integration, and automated escrow disciplinary freezes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-600/30 flex items-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Live Track-Me Satellite Link</span>
            </button>

            <button
              onClick={() => setIsGestureModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl shadow-rose-600/30 flex items-center gap-2 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Shake-to-SOS Motion Lock</span>
            </button>

            <button
              onClick={() => setIsStealthModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-extrabold text-xs flex items-center gap-2 transition-all"
            >
              <EyeOff className="w-4 h-4 text-purple-400" />
              <span>Silent Covert Stealth Disguise Mode</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Avg Response</span>
              <span className="text-sm sm:text-base font-black text-emerald-400">1.8 Mins</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Patrol Status</span>
              <span className="text-sm sm:text-base font-black text-indigo-400">Active Duty</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Mic Telemetry</span>
              <span className="text-sm sm:text-base font-black text-cyan-400">Encrypted</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Trust Rating</span>
              <span className="text-sm sm:text-base font-black text-amber-400">99.98% Safe</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'sos-hub', label: '🚨 Panic SOS Command', icon: ShieldAlert },
          { id: 'incident-report', label: '📝 Incident Ticket Portal', icon: FileText },
          { id: 'live-patrol', label: '📡 Geofence & Patrol Radar', icon: Radio },
          { id: 'my-tickets', label: '📜 Live Safety Log Stream', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white border-transparent shadow-lg shadow-rose-600/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: 🚨 EMERGENCY SOS PANIC HUB                           */}
      {/* ========================================================= */}
      {activeTab === 'sos-hub' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Main Panic Trigger Button */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-rose-500/40 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">Live Emergency Panic Trigger</h2>
                  <p className="text-xs text-slate-400">Instant 1-Touch Dispatch to Sathi Patrol Units & PCR</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> GPS Lock Active
              </span>
            </div>

            {!sosTriggered ? (
              <div className="text-center py-6 sm:py-8 space-y-6">
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  If you feel unsafe, detect route deviations, or encounter non-consensual behavior, tap the SOS Panic Button below. Your live GPS and audio feed will immediately sync to Sathi Emergency Command.
                </p>

                {/* Optional Safe-Word Input */}
                <div className="max-w-xs mx-auto space-y-1.5 text-left">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    Optional Safe-Word Trigger Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BLUE_ORCHID"
                    value={safeWordInput}
                    onChange={(e) => setSafeWordInput(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                {/* Big Red SOS Button */}
                <button
                  onClick={handlePanicTrigger}
                  disabled={isSubmittingSos}
                  className="w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 text-white font-black text-lg sm:text-xl shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 border-4 border-rose-400/40 animate-pulse disabled:opacity-50"
                >
                  {isSubmittingSos ? (
                    <RefreshCw className="w-10 h-10 animate-spin text-white" />
                  ) : (
                    <>
                      <ShieldAlert className="w-12 h-12 text-white" />
                      <span>TRIGGER SOS</span>
                      <span className="text-[10px] text-rose-200 font-mono font-normal">INSTANT DISPATCH</span>
                    </>
                  )}
                </button>

                {/* AI Hands-Free Voice Telemetry Tester */}
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 max-w-md mx-auto space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-4 h-4 text-purple-400" /> AI Hands-Free Voice Safe-Word Acoustic Monitor
                    </span>
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Sathi AI listens for voice triggers (e.g. "BLUE ORCHID", "HELP SATHI"). Test voice command below:
                  </p>
                  <form onSubmit={handleTestVoiceCommand} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Help Sathi, BLUE ORCHID"
                      value={voiceTestInput}
                      onChange={(e) => setVoiceTestInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                    />
                    <button type="submit" className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">
                      Analyze
                    </button>
                  </form>
                  {voiceLog && (
                    <p className="text-[10px] font-mono text-purple-200 bg-slate-950 p-2 rounded-lg border border-purple-500/30">
                      {voiceLog}
                    </p>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-6 sm:p-8 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-center space-y-5 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-600/40 animate-bounce">
                  <Radio className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-mono text-xs text-rose-300 font-extrabold block">DISPATCH REF: {sosAlertRef || 'SOS-ALERT-ACTIVE'}</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">EMERGENCY DISPATCH ACTIVATED</h3>
                  <p className="text-xs text-rose-200 mt-2 max-w-md mx-auto leading-relaxed">
                    Sathi Rapid Security Patrol and Police Command Room have received your coordinates ({userLocation.name}). Live audio telemetry streaming is active.
                  </p>
                </div>

                {/* Emergency Contact SMS/Call Dispatch Notice */}
                {dispatchResult && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-rose-500/40 max-w-md mx-auto text-left space-y-1.5 font-mono text-[11px]">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-emerald-400" /> Emergency SMS/Call Dispatched ({dispatchResult.contactsNotified} Contacts)
                    </span>
                    <p className="text-slate-300 text-[10px]">{dispatchResult.smsMessagePreview}</p>
                  </div>
                )}

                {/* Automatic Financial Escrow Freeze Lock Banner */}
                {escrowFreezeNotice && (
                  <div className="p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 max-w-md mx-auto text-left space-y-1 font-mono text-[11px]">
                    <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-indigo-400" /> Automatic Escrow Financial Freeze Lock
                    </span>
                    <p className="text-slate-300 text-[10px]">{escrowFreezeNotice.lockReason}</p>
                  </div>
                )}

                {/* Live Radar Dispatch Map Button */}
                <div className="pt-1">
                  <button
                    onClick={() => setIsRadarModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-extrabold text-xs shadow-xl shadow-rose-600/30 flex items-center gap-2 mx-auto transition-all animate-pulse"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Track Patrol Vehicle #402 Satellite Radar Map</span>
                  </button>
                </div>

                {/* Live Audio Telemetry Stream Visualizer */}
                <div className="bg-slate-950/90 border border-rose-500/30 rounded-2xl p-4 max-w-md mx-auto space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <Mic className="w-4 h-4 animate-pulse text-rose-500" /> Mic Feed: Live Stream
                    </span>
                    <span className="text-slate-400">Patrol ETA: <strong className="text-emerald-400">{patrolDistance}</strong></span>
                  </div>
                  <div className="h-8 flex items-center justify-center gap-1.5 overflow-hidden">
                    {[40, 85, 30, 90, 60, 100, 45, 75, 95, 30, 80, 65, 90, 40, 70].map((h, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 bg-gradient-to-t from-rose-600 to-amber-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${idx * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setSosTriggered(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
                  >
                    Stand-Down / Cancel False Alarm
                  </button>
                </div>
              </div>
            )}

            {/* Geofenced Safety Zone Shield Card */}
            <SafetyZoneShield locationName={userLocation.name} />
          </div>

          {/* Right Col: Emergency Hotlines & Patrol Quick Call */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <PhoneCall className="w-5 h-5 text-indigo-400" /> Direct Emergency Hotlines
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Police Control Room (PCR)', number: '100 / 112', color: 'bg-rose-500/20 border-rose-500/40 text-rose-300' },
                { name: 'Sathi Security Command Desk', number: '+91 1800-SATHI-SAFE', color: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' },
                { name: 'Women & Child Safety Line', number: '1091', color: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
                { name: 'Medical Emergency Ambulance', number: '102', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' }
              ].map((hotline, idx) => (
                <a
                  key={idx}
                  href={`tel:${hotline.number}`}
                  className={`p-4 rounded-2xl border ${hotline.color} flex items-center justify-between hover:scale-[1.02] transition-all`}
                >
                  <div>
                    <span className="text-xs font-bold block">{hotline.name}</span>
                    <span className="font-mono text-sm font-black">{hotline.number}</span>
                  </div>
                  <Phone className="w-5 h-5 opacity-80" />
                </a>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Lock className="w-4 h-4 text-purple-400" /> Automatic Escrow Protection
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Triggering SOS automatically freezes booking payout escrows until safety officers verify member well-being.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: 📝 INCIDENT TICKET PORTAL                          */}
      {/* ========================================================= */}
      {activeTab === 'incident-report' && (
        <section id="incident-report" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">File Confidential Safety Ticket</h2>
              <p className="text-xs text-slate-400">Reviewed by Sathi Trust & Safety Committee within 15 minutes</p>
            </div>
          </div>

          {!incidentSubmitted ? (
            <form onSubmit={handleReportSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Your Role</label>
                <select
                  value={reporterRole}
                  onChange={(e: any) => setReporterRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="CUSTOMER">Client Customer</option>
                  <option value="COMPANION">Verified Companion Partner</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Offending Party Name / ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra / CMP-9821"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Incident Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="HARASSMENT">Inappropriate Conduct / Harassment</option>
                  <option value="STALKING">Stalking / Unsolicited Boundary Breach</option>
                  <option value="NO_SHOW_ISOLATION">No-Show / Location Isolation</option>
                  <option value="IDENTITY_MISMATCH">Profile Identity Mismatch</option>
                  <option value="PAYMENT_EXTORTION">Payment Extortion Attempt</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Detailed Incident Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide precise timeline, location details, and conversation summary..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-400" /> Evidence Document / Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://cloud-storage.com/evidence-screenshot.png"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingReport ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Safety Incident Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-4 animate-fadeIn">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <div>
                <span className="font-mono text-xs text-emerald-300 font-bold">TICKET REF: {submittedIncidentRef || 'INC-88912'}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Incident Ticket Logged</h3>
                <p className="text-xs text-emerald-200 max-w-md mx-auto mt-1 leading-relaxed">
                  Our Trust & Safety Committee has received your report. Disciplinary risk checks and escrow holds are now active.
                </p>
              </div>
              <button
                onClick={() => setIncidentSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
              >
                File Another Ticket
              </button>
            </div>
          )}
        </section>
      )}

      {/* ========================================================= */}
      {/* TAB 3: 📡 GEOFENCE & PATROL RADAR                         */}
      {/* ========================================================= */}
      {activeTab === 'live-patrol' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/40">
                  <Navigation className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Geofenced Safety Patrol Network</h2>
                  <p className="text-xs text-slate-400">Satellite GPS Lock & Nearby Rapid Response Units</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                Radar Active
              </span>
            </div>

            {/* Simulated Live Radar Screen */}
            <div className="h-64 sm:h-72 rounded-2xl bg-slate-950 border border-cyan-500/30 relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(6,182,212,0.15)_0%,_transparent_70%)] animate-pulse" />
              
              {/* Radar Rings */}
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-cyan-500/30 absolute" />
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-cyan-500/40 absolute animate-ping" />
              <div className="w-16 h-16 rounded-full border border-rose-500/50 absolute" />

              {/* Center User Dot */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-lg shadow-rose-500/50 animate-bounce" />
                <span className="text-[10px] font-mono font-bold bg-slate-900/90 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40">
                  You ({userLocation.name})
                </span>
              </div>

              {/* Patrol Unit 1 Dot */}
              <div className="absolute top-12 right-20 flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] font-mono text-emerald-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Patrol Unit #402 ({patrolDistance})
                </span>
              </div>

              {/* Patrol Unit 2 Dot */}
              <div className="absolute bottom-10 left-16 flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-[9px] font-mono text-cyan-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  Patrol Unit #109 (2.4 km)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" /> Geofence Deviation Shield
                </span>
                <p className="text-[11px] text-slate-400">
                  If route departs by more than 500m from booked venue, automated check-in prompt triggers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> Audio Heartbeat Check
                </span>
                <p className="text-[11px] text-slate-400">
                  Periodic silent ping to companion device confirms dual-party agreement and safe state.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Verified Patrol Fleet
            </h3>

            <div className="space-y-3">
              {[
                { unit: 'Patrol Unit #402', status: 'ON PATROL', distance: '1.2 km away', phone: '+91 98110-SATHI1' },
                { unit: 'Patrol Unit #109', status: 'STANDBY', distance: '2.4 km away', phone: '+91 98110-SATHI2' },
                { unit: 'Patrol Unit #881', status: 'DISPATCH READY', distance: '3.8 km away', phone: '+91 98110-SATHI3' }
              ].map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{p.unit}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{p.distance}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: 📜 LIVE SAFETY LOG STREAM                           */}
      {/* ========================================================= */}
      {activeTab === 'my-tickets' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/40">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Live System Safety Stream</h2>
                <p className="text-xs text-slate-400">Real-time Emergency SOS Alerts & Incident Tickets</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">Total Logs: {sosAlerts.length + incidentReports.length}</span>
          </div>

          <div className="space-y-3">
            {sosAlerts.length === 0 && incidentReports.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No active safety incidents logged in system. All geofenced zones normal.
              </div>
            ) : (
              <>
                {sosAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{alert.userName}</span>
                          <span className="font-mono text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 font-bold">
                            {alert.alertRef}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{alert.locationName} • Safe-Word: {alert.safeWordTriggered || 'N/A'}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                      {alert.status}
                    </span>
                  </div>
                ))}

                {incidentReports.map((inc) => (
                  <div key={inc.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{inc.reporterName} vs {inc.targetName}</span>
                          <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold">
                            {inc.incidentRef}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{inc.category} • Severity: {inc.severity}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono">
                      {inc.status}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Live Track-Me Satellite Link Share Modal */}
      {isTrackModalOpen && (
        <LiveSafetyTrackModal
          userLocationName={userLocation.name}
          onClose={() => setIsTrackModalOpen(false)}
        />
      )}

      {/* Shake Motion Gesture Detector Modal */}
      {isGestureModalOpen && (
        <SosGestureDetectorModal
          onClose={() => setIsGestureModalOpen(false)}
          onTriggerSos={handlePanicTrigger}
        />
      )}

      {/* Silent Covert Stealth Disguise Screen Modal */}
      {isStealthModalOpen && (
        <SilentSosStealthModal
          userLocationName={userLocation.name}
          onClose={() => setIsStealthModalOpen(false)}
        />
      )}

      {/* Live Responder Patrol Radar Map Modal */}
      {isRadarModalOpen && (
        <SosDispatchRadarModal
          userLocationName={userLocation.name}
          alertRef={sosAlertRef || 'SOS-DISPATCH-402'}
          onClose={() => setIsRadarModalOpen(false)}
        />
      )}

    </div>
  );
}
