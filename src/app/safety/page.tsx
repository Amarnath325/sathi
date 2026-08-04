'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  UserPlus, 
  Phone, 
  CheckCircle2, 
  FileText, 
  Lock, 
  ShieldCheck,
  Send
} from 'lucide-react';

export default function SafetyPage() {
  const [contacts, setContacts] = useState([
    { name: 'Sarah Jenkins (Sister)', phone: '+1 (555) 019-2834', relation: 'Family' },
    { name: 'David Vance (Friend)', phone: '+1 (555) 482-[REDACTED]', relation: 'Friend' }
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  
  const [locationSharingActive, setLocationSharingActive] = useState(true);
  const [incidentReportSubmitted, setIncidentReportSubmitted] = useState(false);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    setContacts(prev => [...prev, { name: newContactName, phone: newContactPhone, relation: 'Trusted Contact' }]);
    setNewContactName('');
    setNewContactPhone('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Safety Header */}
      <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 bg-rose-950/10 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl gradient-bg-danger flex items-center justify-center shadow-lg shadow-rose-600/30">
          <ShieldAlert className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Trust & Safety Command Hub</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Zero-tolerance protection system equipped with 24/7 panic SOS triggers, encrypted GPS live tracking, and trusted contact emergency pings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: SOS Alert & GPS Sharing */}
        <div className="space-y-6">
          
          {/* Emergency Panic SOS Widget */}
          <div className="glass-panel p-6 rounded-3xl border border-rose-500/40 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Panic SOS Emergency Button</h3>
              <p className="text-xs text-slate-400 mt-1">Sends immediate live GPS pings to safety dispatch and trusted contacts.</p>
            </div>

            <button 
              onClick={() => alert("SOS Alert dispatched to 24/7 Security Command!")}
              className="w-full py-4 rounded-2xl gradient-bg-danger text-white text-xs font-black uppercase tracking-widest hover:opacity-95 shadow-xl shadow-rose-900/50"
            >
              TRIGGER SOS EMERGENCY PING
            </button>
          </div>

          {/* Live Location Sharing Switch */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" /> Live GPS Share
                </h4>
                <p className="text-[10px] text-slate-400">Share active trip coordinates during bookings</p>
              </div>

              <button 
                onClick={() => setLocationSharingActive(!locationSharingActive)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${locationSharingActive ? 'bg-emerald-500' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${locationSharingActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {locationSharingActive && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                ACTIVE GPS: 37.7749° N, 122.4194° W (Encrypted Feed)
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Trusted Contacts & Incident Report Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Trusted Contacts Manager */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" /> Emergency Trusted Contacts
            </h3>

            <div className="space-y-2">
              {contacts.map((c, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{c.name}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{c.phone}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 text-[10px] font-semibold">
                    {c.relation}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddContact} className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <input 
                type="text"
                placeholder="Contact Name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <input 
                type="text"
                placeholder="Phone Number"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shrink-0">
                Add Contact
              </button>
            </form>
          </div>

          {/* Incident Reporting Form */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-400" /> Report Safety Incident / Misconduct
            </h3>

            {incidentReportSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Incident Ticket Filed! Trust & Safety Moderation Team investigating.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setIncidentReportSubmitted(true); }} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Reason for Incident Report</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                    <option>Unsafe behavior or harassment</option>
                    <option>Off-platform cash demand</option>
                    <option>Impersonation or fake profile</option>
                    <option>Late cancellation or no-show</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Incident Description Details</label>
                  <textarea 
                    rows={3} 
                    placeholder="Provide full factual description of the incident..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit Confidential Safety Report
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
