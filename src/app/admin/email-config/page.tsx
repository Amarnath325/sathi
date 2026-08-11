'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SmtpConfigModule } from '@/components/admin/SmtpConfigModule';

export default function AdminEmailConfigPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/admin" className="hover:text-indigo-400 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Admin Command Center
          </Link>
          <span>/</span>
          <span className="text-white font-bold">SMTP Email Configuration</span>
        </div>

        {/* Module Render */}
        <SmtpConfigModule />

      </div>
    </div>
  );
}
