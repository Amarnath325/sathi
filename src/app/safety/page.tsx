'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import { useAdminStore } from '@/lib/adminStore';
import { ShieldAlert, ShieldCheck, MapPin, Radio, Phone, PhoneCall, AlertTriangle, FileText, Send, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export default function SafetyHubPage() {
  const triggerSosAlert = useAdminStore((state) => state.triggerSosAlert);
  const createIncidentReport = useAdminStore((state) => state.createIncidentReport);

  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosAlertRef, setSosAlertRef] = useState<string | null>(null);
  const [safeWordInput, setSafeWordInput] = useState('');
  
  // Incident Form state
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState<'CUSTOMER' | 'COMPANION'>('CUSTOMER');
  const [targetName, setTargetName] = useState('');
  const [category, setCategory] = useState<any>('HARASSMENT');
  const [description, setDescription] = useState('');
  const [incidentSubmitted, setIncidentSubmitted] = useState(false);

  const handlePanicTrigger = () => {
    // Geolocation fallback
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const newAlert = triggerSosAlert({
          userId: 'usr-client-current',
          userName: 'Current Client User',
          locationName: 'Live Geofenced GPS Coordinate',
          coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          severity: 'CRITICAL_EMERGENCY',
          safeWordTriggered: safeWordInput || 'DYNAMIC_PANIC',
          notes: 'Triggered from Client Safety Hub emergency panic button.'
        });
        setSosAlertRef(newAlert.alertRef);
        setSosTriggered(true);
      },
      () => {
        const newAlert = triggerSosAlert({
          userId: 'usr-client-current',
          userName: 'Current Client User',
          locationName: 'Connaught Place, New Delhi',
          coordinates: { lat: 28.6315, lng: 77.2167 },
          severity: 'CRITICAL_EMERGENCY',
          safeWordTriggered: safeWordInput || 'DYNAMIC_PANIC',
          notes: 'Triggered from Client Safety Hub emergency panic button.'
        });
        setSosAlertRef(newAlert.alertRef);
        setSosTriggered(true);
      }
    );
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !targetName || !description) return;

    createIncidentReport({
      reporterId: 'usr-client-' + Date.now(),
      reporterName,
      reporterRole,
      targetId: 'usr-target-' + Date.now(),
      targetName,
      targetRole: reporterRole === 'CUSTOMER' ? 'COMPANION' : 'CUSTOMER',
      category,
      severity: 'SERIOUS',
      description,
      disciplinaryAction: 'NONE'
    });

    setIncidentSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Header
        currentRole="CUSTOMER"
        onRoleChange={() => {}}
        onTriggerSos={handlePanicTrigger}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 space-y-12">


        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 p-8 md:p-12 shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" /> 24/7 Trust & Security Shield
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Your Safety is Our <span className="gradient-text from-rose-400 to-amber-300">Absolute Priority</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed">
              Equipped with real-time GPS geofencing, encrypted live audio feeds, dynamic safe-words, and instant dispatch to Sathi Rapid Patrol units and local police.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#panic-trigger"
                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <ShieldAlert className="w-5 h-5" /> Emergency SOS Panic Hub
              </a>
              <a
                href="#incident-report"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center gap-2"
              >
                <FileText className="w-5 h-5 text-indigo-400" /> Report Incident Ticket
              </a>
            </div>
          </div>
        </section>

        {/* Emergency SOS Panic Hub Section */}
        <section id="panic-trigger" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Main Panic Trigger Button */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/80 border border-rose-500/40 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Live Emergency Panic Trigger</h2>
                  <p className="text-xs text-slate-400">One-touch dispatch to nearby security units</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> GPS Lock Active
              </span>
            </div>

            {!sosTriggered ? (
              <div className="text-center py-8 space-y-6">
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  If you feel unsafe or experience a venue departure deviation, tap the Emergency Red Button below to broadcast your live GPS to Sathi Command Center.
                </p>

                {/* Optional Safe-Word Input */}
                <div className="max-w-xs mx-auto space-y-1 text-left">
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Optional Safe-Word Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BLUE_ORCHID"
                    value={safeWordInput}
                    onChange={(e) => setSafeWordInput(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white uppercase font-mono outline-none focus:border-rose-500"
                  />
                </div>

                {/* Big Red Button */}
                <button
                  onClick={handlePanicTrigger}
                  className="w-48 h-48 mx-auto rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 text-white font-black text-xl shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 border-4 border-rose-400/40 animate-pulse"
                >
                  <ShieldAlert className="w-12 h-12 text-white" />
                  <span>TRIGGER SOS</span>
                  <span className="text-[10px] text-rose-200 font-mono font-normal">PRESS & HOLD</span>
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-600/40 animate-bounce">
                  <Radio className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-mono text-xs text-rose-300 font-bold block">DISPATCH REF: {sosAlertRef}</span>
                  <h3 className="text-2xl font-black text-white mt-1">EMERGENCY DISPATCH ACTIVATED</h3>
                  <p className="text-xs text-rose-200 mt-2">
                    Sathi Rapid Security Patrol and Police Command Room have received your coordinates. Live mic streaming active.
                  </p>
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => setSosTriggered(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs"
                  >
                    Cancel False Alarm Signal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Emergency Hotlines */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <PhoneCall className="w-5 h-5 text-indigo-400" /> Direct Emergency Hotlines
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Police Control Room (PCR)', number: '100 / 112', color: 'bg-rose-500/20 border-rose-500/40 text-rose-300' },
                { name: 'Sathi Security Command', number: '+91 1800-SATHI-SAFE', color: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' },
                { name: 'Women Helpline', number: '1091', color: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
                { name: 'Ambulance Emergency', number: '102', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' }
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
          </div>
        </section>

        {/* Incident Reporting Section */}
        <section id="incident-report" className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">File Safety & Code of Conduct Incident</h2>
              <p className="text-xs text-slate-400">All reports are confidentially audited by our Trust & Safety Officers</p>
            </div>
          </div>

          {!incidentSubmitted ? (
            <form onSubmit={handleReportSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Your Role</label>
                <select
                  value={reporterRole}
                  onChange={(e: any) => setReporterRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="CUSTOMER">Client Customer</option>
                  <option value="COMPANION">Verified Escrow Companion</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Offending Party Full Name / ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Incident Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="HARASSMENT">Harassment or Inappropriate Conduct</option>
                  <option value="STALKING">Stalking / Unsolicited Follows</option>
                  <option value="NO_SHOW_ISOLATION">No-Show or Location Isolation</option>
                  <option value="IDENTITY_MISMATCH">Profile Identity Mismatch</option>
                  <option value="PAYMENT_EXTORTION">Payment Extortion Attempt</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400">Detailed Description of Incident</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide precise timeline, venue details, and description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Confidential Safety Ticket
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Incident Report Filed Successfully</h3>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                Our Trust & Safety Committee has logged your ticket. Disciplinary escrow freezes and risk checks are now active.
              </p>
              <button
                onClick={() => setIncidentSubmitted(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 text-xs font-bold"
              >
                File Another Ticket
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
