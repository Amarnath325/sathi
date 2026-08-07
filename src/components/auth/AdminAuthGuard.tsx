'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Verify Admin authentication tokens
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (!token || !user) {
      setIsAuthorized(false);
      router.replace('/admin/login');
    } else {
      try {
        JSON.parse(user);
        setIsAuthorized(true);
      } catch (e) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthorized(false);
        router.replace('/admin/login');
      }
    }
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4 font-sans">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Verifying Admin Authorization</h3>
            <p className="text-xs text-slate-400 mt-1">Securing enterprise session gate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4 font-sans">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 shadow-2xl backdrop-blur-xl max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-300">Access Denied</h3>
            <p className="text-xs text-slate-400 mt-1">Unauthenticated request. Redirecting to Admin Login...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
