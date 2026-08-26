'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map(toast => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border-2 backdrop-blur-xl shadow-2xl flex items-start gap-3.5 transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
                isError
                  ? 'bg-gradient-to-r from-red-950 via-rose-900 to-slate-950 border-rose-500/80 shadow-rose-950/60 text-white'
                  : isSuccess
                  ? 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border-emerald-500/80 shadow-emerald-950/60 text-white'
                  : isWarning
                  ? 'bg-gradient-to-r from-amber-950 via-yellow-950 to-slate-950 border-amber-500/80 shadow-amber-950/60 text-white'
                  : 'bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-950 border-indigo-500/80 shadow-indigo-950/60 text-white'
              }`}
            >
              {/* Icon Container with bright badge */}
              <div className={`p-2 rounded-xl shrink-0 ${
                isError ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/50' :
                isSuccess ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50' :
                isWarning ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50' :
                'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/50'
              }`}>
                {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                {isError && <XCircle className="w-5 h-5 text-rose-300" />}
                {isWarning && <AlertTriangle className="w-5 h-5" />}
                {toast.type === 'info' && <Info className="w-5 h-5" />}
              </div>

              {/* Title & Message */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className={`text-xs leading-relaxed font-medium ${
                    isError ? 'text-rose-100' :
                    isSuccess ? 'text-emerald-100' :
                    isWarning ? 'text-amber-100' :
                    'text-indigo-100'
                  }`}>
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all shrink-0"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
