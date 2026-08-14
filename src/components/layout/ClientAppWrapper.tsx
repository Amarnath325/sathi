'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { PanicAlertModal } from '@/components/safety/PanicAlertModal';
import { AiAssistantDrawer } from '@/components/ai/AiAssistantDrawer';
import { RoleType } from '@/lib/types';
import { Bot } from 'lucide-react';

export function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleType>('CUSTOMER');
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if currently viewing an Admin route (/admin, /admin/login, /admin/dashboard)
  const currentPath = mounted && typeof window !== 'undefined' ? window.location.pathname : (pathname || '');
  const isAdminRoute = currentPath.includes('/admin') || pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <ThemeProvider>
        <main className="flex-1 min-h-screen bg-slate-950">{children}</main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <Header 
          currentRole={currentRole} 
          onRoleChange={setCurrentRole} 
          onTriggerSos={() => setSosModalOpen(true)} 
        />

        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>

        <MobileBottomNav />

        <Footer />

        {/* Global Emergency SOS Modal */}
        <PanicAlertModal 
          isOpen={sosModalOpen} 
          onClose={() => setSosModalOpen(false)} 
        />

        {/* Floating AI Assistant Trigger Button */}
        <button
          onClick={() => setAiDrawerOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 p-3.5 rounded-full gradient-bg-primary text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 transition-transform flex items-center gap-2 group"
          title="Open AI Smart Assistant"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap pr-2">
            Ask AI Assistant
          </span>
        </button>

        {/* AI Assistant Drawer */}
        <AiAssistantDrawer 
          isOpen={aiDrawerOpen} 
          onClose={() => setAiDrawerOpen(false)} 
        />
      </ToastProvider>
    </ThemeProvider>
  );
}
