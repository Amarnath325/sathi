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
  X,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { RoleType } from '@/lib/types';
import { useUserAuthStore } from '@/lib/userAuthStore';

import { NotificationBell } from '@/components/notifications/NotificationBell';

interface HeaderProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onTriggerSos: () => void;
}

export function Header({ currentRole, onRoleChange, onTriggerSos }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useUserAuthStore();

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

          {/* Nav Links (Desktop & Laptop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            <Link href="/search" className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              <Search className="w-4 h-4 text-indigo-400" />
              Explore Companions
            </Link>
            
            <Link href="/kyc" className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              KYC Verification
            </Link>

            <Link href="/chat" className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-slate-300 hover:text-white transition-colors relative">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Chat
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-1 -right-2"></span>
            </Link>

            <Link href="/wallet" className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              <Wallet className="w-4 h-4 text-amber-400" />
              Escrow & Wallet
            </Link>

            <Link href="/safety" className="flex items-center gap-2 text-xs xl:text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Safety Center
            </Link>
          </nav>

          {/* Header Controls (Emergency SOS + Notifications + Auth State) */}
          <div className="hidden sm:flex items-center gap-3">

            {/* Notification Bell Component */}
            <NotificationBell />

            {/* SOS Panic Trigger Button */}
            <button
              onClick={onTriggerSos}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/20 animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">EMERGENCY SOS</span>
              <span className="md:hidden">SOS</span>
            </button>

            {/* Auth Conditional Rendering */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700">
                  <span className="text-xs font-semibold text-slate-300 hidden md:inline">My Account</span>
                  <img 
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                    alt="Avatar" 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-emerald-500/50"
                  />
                </Link>
                
                <button
                  onClick={() => logout()}
                  title="Logout Account" 
                  className="hidden sm:flex items-center justify-center p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" /> Login
                </Link>

                <Link 
                  href="/register" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-bg-primary text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register
                </Link>
              </div>
            )}

          </div>

          {/* Mobile & Tablet Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onTriggerSos}
              className="sm:hidden p-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
            >
              SOS
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-fadeIn max-h-[85vh] overflow-y-auto">
          <Link 
            href="/search" 
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200 py-2.5 px-3 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <Search className="w-4 h-4 text-indigo-400" /> Explore Companions
          </Link>
          <Link 
            href="/kyc" 
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200 py-2.5 px-3 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" /> KYC Verification
          </Link>
          <Link 
            href="/chat" 
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200 py-2.5 px-3 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" /> Chat & Direct Messages
          </Link>
          <Link 
            href="/wallet" 
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200 py-2.5 px-3 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <Wallet className="w-4 h-4 text-amber-400" /> Escrow & Wallet
          </Link>
          <Link 
            href="/safety" 
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200 py-2.5 px-3 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Safety & Panic Center
          </Link>
          
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center gap-2.5"
                >
                  <img 
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500/50" 
                  />
                  <span className="text-xs font-bold text-white">My Profile & Bookings</span>
                </Link>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 text-xs font-bold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full justify-between">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 text-center"
                >
                  Login
                </Link>

                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex-1 py-2 rounded-xl gradient-bg-primary text-xs font-extrabold text-white text-center shadow-lg shadow-indigo-600/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
