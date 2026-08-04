'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  MessageSquare, 
  Wallet, 
  UserCheck, 
  AlertTriangle, 
  Bell, 
  ChevronDown, 
  Sparkles,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { RoleType } from '@/lib/types';

interface HeaderProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onTriggerSos: () => void;
}

export function Header({ currentRole, onRoleChange, onTriggerSos }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'KYC Document Approved', time: '10m ago', unread: true },
    { id: 2, title: 'Escrow Funds Secured for Booking #CC-2026', time: '1h ago', unread: true },
    { id: 3, title: 'New Message from Sophia Chen', time: '2h ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">Companion</span>
                <span className="text-xl font-bold tracking-tight gradient-text">Connect</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Trust & Safety Verified Platform
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <Search className="w-4 h-4 text-indigo-400" />
              Explore Companions
            </Link>
            
            <Link href="/kyc" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              KYC Verification
            </Link>

            <Link href="/chat" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors relative">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Chat
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-1 -right-2"></span>
            </Link>

            <Link href="/wallet" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <Wallet className="w-4 h-4 text-amber-400" />
              Escrow & Wallet
            </Link>

            <Link href="/safety" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Safety Center
            </Link>
          </nav>

          {/* Header Controls (Emergency SOS + Notifications + Profile) */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Notifications Popover */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 border border-slate-700 shadow-2xl z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <h4 className="text-sm font-semibold text-white">Notifications</h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">3 New</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                        <p className="text-xs font-medium text-white">{item.title}</p>
                        <span className="text-[10px] text-slate-500">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SOS Panic Trigger Button */}
            <button
              onClick={onTriggerSos}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/20 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:text-white" />
              EMERGENCY SOS
            </button>

            {/* Profile Link */}
            <Link href="/dashboard" className="flex items-center gap-2 p-1 pl-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700">
              <span className="text-xs font-medium text-slate-300">My Account</span>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-emerald-500/50"
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={onTriggerSos}
              className="p-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              SOS
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 pt-4 pb-6 space-y-3">
          <Link href="/search" className="block text-sm font-medium text-slate-200 py-2">Explore Companions</Link>
          <Link href="/kyc" className="block text-sm font-medium text-slate-200 py-2">KYC Verification</Link>
          <Link href="/chat" className="block text-sm font-medium text-slate-200 py-2">Chat & Messages</Link>
          <Link href="/wallet" className="block text-sm font-medium text-slate-200 py-2">Escrow Wallet</Link>
          <Link href="/safety" className="block text-sm font-medium text-slate-200 py-2">Safety & SOS</Link>
        </div>
      )}
    </header>
  );
}
