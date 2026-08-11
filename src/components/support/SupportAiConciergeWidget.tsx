'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Shield, ArrowRight, HelpCircle, MessageCircle, AlertCircle } from 'lucide-react';

interface SupportAiConciergeWidgetProps {
  onOpenFileDisputeModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'AI' | 'USER';
  text: string;
  timestamp: string;
  isFaqTrigger?: boolean;
}

export function SupportAiConciergeWidget({ onOpenFileDisputeModal }: SupportAiConciergeWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'AI',
      text: 'Hello! I am Sathi AI Concierge. How can I assist you with your booking, escrow funds, or companion safety today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // AI Response logic
    setTimeout(() => {
      let responseText = 'I understand your query. For security, all Sathi bookings are locked in Escrow. If there is a service discrepancy, you can file an official dispute ticket or request a mutual settlement.';
      const lower = query.toLowerCase();

      if (lower.includes('escrow') || lower.includes('hold')) {
        responseText = '🛡️ Sathi Escrow Hold System keeps your payment 100% secure until meetup completion. Payouts are only released after dual QR check-in verification.';
      } else if (lower.includes('late') || lower.includes('delay') || lower.includes('show')) {
        responseText = '⏰ If your Companion is more than 20 minutes late without notification, you are eligible for an immediate 100% Escrow Refund under Policy 3.1.';
      } else if (lower.includes('cancel') || lower.includes('refund')) {
        responseText = '💳 You can cancel your booking up to 2 hours before the start time for a full instant refund. After that, a 10% cancellation fee applies.';
      } else if (lower.includes('safety') || lower.includes('emergency')) {
        responseText = '🚨 For safety concerns, tap the Red SOS Panic Broadcast button at any time during an active booking for immediate 24/7 Responder Dispatch.';
      }

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'AI',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Trigger Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full gradient-bg-primary text-white shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 font-bold text-xs border border-purple-400/40 relative group"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1" />
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="hidden sm:inline">24/7 AI Concierge</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-fade-in">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  Sathi AI Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">Instant Support & Escrow Help</p>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs custom-scrollbar">
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'AI' && (
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 text-[10px] font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'USER'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-[11px]">{msg.text}</p>
                  <span className="text-[9px] opacity-60 block mt-1 font-mono text-right">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-[10px]">
                <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Sathi AI is analyzing query...</span>
              </div>
            )}

            {/* Quick FAQs */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">Quick Assistance:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendMessage('How does Escrow Protection work?')}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 text-[10px] transition-all"
                >
                  🛡️ How Escrow Works
                </button>
                <button
                  onClick={() => handleSendMessage('My companion is late')}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 text-[10px] transition-all"
                >
                  ⏰ Companion Late Policy
                </button>
                <button
                  onClick={() => handleSendMessage('How do I cancel booking?')}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 text-[10px] transition-all"
                >
                  💳 Cancellation Rules
                </button>
              </div>
            </div>

            {/* Escalate to Formal Ticket */}
            {onOpenFileDisputeModal && (
              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-center space-y-2 mt-3">
                <p className="text-[10px] text-purple-200 font-medium">Issue unresolved by AI assistant?</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFileDisputeModal();
                  }}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>File Formal Dispute Ticket</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* Footer Input */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Sathi AI support..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
