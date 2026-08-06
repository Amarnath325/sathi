'use client';

import React, { useState, useEffect } from 'react';
import { PaymentGatewayConfig } from '@/lib/types';
import { X, Settings, ShieldCheck, Zap, Power, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  gateway: PaymentGatewayConfig | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<PaymentGatewayConfig>) => void;
}

export function PaymentConfigModal({ isOpen, gateway, onClose, onSave }: Props) {
  if (!isOpen || !gateway) return null;

  const [merchantId, setMerchantId] = useState(gateway.merchantId);
  const [environment, setEnvironment] = useState<'SANDBOX' | 'PRODUCTION'>(gateway.environment);
  const [transactionFeePercent, setTransactionFeePercent] = useState(gateway.transactionFeePercent);
  const [isEnabled, setIsEnabled] = useState(gateway.isEnabled);

  useEffect(() => {
    if (gateway) {
      setMerchantId(gateway.merchantId);
      setEnvironment(gateway.environment);
      setTransactionFeePercent(gateway.transactionFeePercent);
      setIsEnabled(gateway.isEnabled);
    }
  }, [gateway]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(gateway.id, {
      merchantId,
      environment,
      transactionFeePercent: Number(transactionFeePercent),
      isEnabled
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" /> Configure {gateway.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Manage API keys, environment parameters, and gateway status.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Merchant Account ID / Secret API Key</label>
            <input
              type="text"
              required
              value={merchantId}
              onChange={e => setMerchantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deployment Environment</label>
              <select
                value={environment}
                onChange={e => setEnvironment(e.target.value as 'SANDBOX' | 'PRODUCTION')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none font-bold"
              >
                <option value="PRODUCTION">PRODUCTION (Live Keys)</option>
                <option value="SANDBOX">SANDBOX (Test Simulator)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction Processing Fee (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={transactionFeePercent}
                onChange={e => setTransactionFeePercent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="gwEnableCheck"
              checked={isEnabled}
              onChange={e => setIsEnabled(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500 bg-slate-900 border-slate-800 cursor-pointer"
            />
            <label htmlFor="gwEnableCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
              Enable {gateway.provider} as an Active Checkout Payment Gateway
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white font-extrabold shadow-lg shadow-indigo-600/30"
            >
              Save Gateway Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
