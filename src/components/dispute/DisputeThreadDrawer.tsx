'use client';

import React, { useState } from 'react';
import { X, Send, Lock, MessageSquare, Shield, User, Sparkles } from 'lucide-react';
import { DisputeTicket } from '@/lib/types';
import { useAdminStore } from '@/lib/adminStore';

interface DisputeThreadDrawerProps {
  dispute: DisputeTicket;
  onClose: () => void;
}

export function DisputeThreadDrawer({ dispute, onClose }: DisputeThreadDrawerProps) {
  const { addDisputeMessage } = useAdminStore();
  const [messageText, setMessageText] = useState('');
  const [isStaffNote, setIsStaffNote] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    addDisputeMessage(dispute.id, {
      senderId: 'admin-current',
      senderName: 'Senior Arbitrator (Support)',
      senderRole: 'ADMIN',
      message: messageText.trim(),
      isArbitratorNote: isStaffNote
    });

    setMessageText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
      
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              Arbitration Log ({dispute.disputeRef})
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              {dispute.customerName} vs {dispute.companionName}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messaging History Scroll Area */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs custom-scrollbar">
        
        {/* Ticket Header Card */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span>Category: <strong className="text-purple-400">{dispute.category}</strong></span>
            <span>Escrow: <strong className="text-emerald-400">${dispute.disputedAmount}</strong></span>
          </div>
          <p className="text-slate-300 font-medium text-xs font-mono">Issue: {dispute.reason}</p>
        </div>

        {dispute.messages.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="font-bold text-white">No messages posted yet</p>
            <p className="text-[11px]">Start arbitration thread by typing a message below.</p>
          </div>
        ) : (
          dispute.messages.map((msg) => {
            const isAdmin = msg.senderRole === 'ADMIN';
            const isCustomer = msg.senderRole === 'CUSTOMER';
            const isNote = msg.isArbitratorNote;

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isNote
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : isAdmin
                    ? 'bg-purple-600/20 border-purple-500/30 text-white ml-6'
                    : isCustomer
                    ? 'bg-slate-950 border-slate-800 text-slate-200 mr-6'
                    : 'bg-indigo-950/40 border-indigo-800/40 text-slate-200 ml-6'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px]">
                  <span className="font-bold flex items-center gap-1">
                    {isAdmin ? <Shield className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-slate-400" />}
                    {msg.senderName} ({msg.senderRole})
                  </span>
                  <span className="font-mono text-slate-400">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {isNote && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 uppercase font-bold mb-1">
                    <Lock className="w-3 h-3" /> Private Staff Note
                  </div>
                )}

                <p className="leading-relaxed text-xs">{msg.message}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Input Message Footer */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <label className="flex items-center gap-1.5 cursor-pointer text-amber-300 font-bold">
            <input
              type="checkbox"
              checked={isStaffNote}
              onChange={(e) => setIsStaffNote(e.target.checked)}
              className="rounded accent-amber-500"
            />
            <Lock className="w-3 h-3" /> Internal Staff Note Only
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={isStaffNote ? "Type internal staff arbitration note..." : "Type response to customer & companion..."}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
}
