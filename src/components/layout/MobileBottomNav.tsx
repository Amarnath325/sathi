'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Calendar, MessageSquare, User } from 'lucide-react';
import { useUserAuthStore } from '@/lib/userAuthStore';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useUserAuthStore();

  const NAV_ITEMS = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Discover', icon: Compass },
    { href: '/dashboard', label: 'Bookings', icon: Calendar },
    { href: '/chat', label: 'Messages', icon: MessageSquare },
    { href: isLoggedIn ? '/dashboard' : '/login', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              isActive 
                ? 'text-indigo-400 font-bold bg-indigo-500/10' 
                : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
