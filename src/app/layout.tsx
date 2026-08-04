'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PanicAlertModal } from '@/components/safety/PanicAlertModal';
import { AiAssistantDrawer } from '@/components/ai/AiAssistantDrawer';
import { RoleType } from '@/lib/types';
import { Bot } from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<RoleType>('CUSTOMER');
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Check if current route is an Admin portal route (/admin, /admin/login, /admin/dashboard)
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en" className="dark">
      <head>
        <title>Companion Connect | Enterprise Verified Companion Marketplace</title>
        <meta name="description" content="Secure enterprise marketplace connecting verified adults for safe social companionship, assistance, event attendance, travel guidance, elderly support, and study partnership." />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        
        {/* Render Public Header ONLY on non-admin routes */}
        {!isAdminRoute && (
          <Header 
            currentRole={currentRole} 
            onRoleChange={setCurrentRole} 
            onTriggerSos={() => setSosModalOpen(true)} 
          />
        )}

        <main className="flex-1">
          {children}
        </main>

        {/* Render Public Footer ONLY on non-admin routes */}
        {!isAdminRoute && <Footer />}

        {/* Global Emergency SOS Modal (Public Site Only) */}
        {!isAdminRoute && (
          <PanicAlertModal 
            isOpen={sosModalOpen} 
            onClose={() => setSosModalOpen(false)} 
          />
        )}

        {/* Floating AI Assistant Trigger Button (Public Site Only) */}
        {!isAdminRoute && (
          <>
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full gradient-bg-primary text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 transition-transform flex items-center gap-2 group"
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
          </>
        )}

      </body>
    </html>
  );
}
