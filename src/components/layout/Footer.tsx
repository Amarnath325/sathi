'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Lock, Globe, FileText, HelpCircle, PhoneCall, AlertCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      
      {/* Top Banner: Strictly Legal & Safe Platform Notice */}
      <div className="bg-slate-900/80 border-b border-slate-800 py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white">Strict Zero-Tolerance Safety Policy:</span>
          <span>Companion Connect strictly prohibits illegal, unsafe, or non-consensual activities. All members undergo mandatory KYC verification and automated AI fraud screening.</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Companion Connect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Enterprise-grade verified marketplace connecting adults for safe social companionship, assistance, event attendance, travel guidance, elderly care, and study support. Protected by bank-grade escrow payments and 24/7 AI risk monitoring.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-emerald-400 pt-2">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> 256-bit AES Encrypted</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> GDPR & Identity Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/search?category=event" className="hover:text-white transition-colors">Event Companion</Link></li>
              <li><Link href="/search?category=elderly" className="hover:text-white transition-colors">Elderly Support</Link></li>
              <li><Link href="/search?category=travel" className="hover:text-white transition-colors">Travel Partner</Link></li>
              <li><Link href="/search?category=study" className="hover:text-white transition-colors">Study & Co-Working</Link></li>
              <li><Link href="/search?category=fitness" className="hover:text-white transition-colors">Fitness Partner</Link></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trust & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/kyc" className="hover:text-white transition-colors">KYC Verification Standard</Link></li>
              <li><Link href="/safety" className="hover:text-white transition-colors">Emergency Panic Alert</Link></li>
              <li><Link href="/wallet" className="hover:text-white transition-colors">Escrow Protection Guarantee</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">AI Fraud Monitoring</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Code of Conduct</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/legal" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">Consent & GDPR Center</Link></li>
              <li className="pt-2 text-rose-400 font-semibold flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> 24/7 Hotline: 1-800-SAFETY-HUB
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Companion Connect Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer">
              <Globe className="w-3.5 h-3.5" /> English (US)
            </span>
            <span className="hover:text-slate-300 cursor-pointer">USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
