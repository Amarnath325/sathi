'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, Shield, Search, Zap } from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiAssistantDrawer({ isOpen, onClose }: AiAssistantDrawerProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'AI' | 'USER'; text: string }>>([
    {
      sender: 'AI',
      text: "Hello! I'm Companion Connect AI. I can assist you with finding verified companions, evaluating trust scores, or guiding you through escrow protection."
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    setMessages(prev => [...prev, { sender: 'USER', text: userQuery }]);
    setInput('');

    setTimeout(() => {
      let reply = "I analyzed your request against our 100% verified database. Sophia Chen & Alexander Wright meet your criteria with 4.9+ ratings and active background checks.";
      if (userQuery.toLowerCase().includes('escrow') || userQuery.toLowerCase().includes('pay')) {
        reply = "Escrow protection locks your payment safely until your booking is completed. Payouts are released only after mutual code verification!";
      } else if (userQuery.toLowerCase().includes('safety') || userQuery.toLowerCase().includes('sos')) {
        reply = "Every booking features instant GPS live sharing and 1-tap Panic SOS emergency dispatch to local authorities and trusted contacts.";
      }
      setMessages(prev => [...prev, { sender: 'AI', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-panel border-l border-slate-800 shadow-2xl flex flex-col">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Companion AI Engine <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Powered by Risk Guard & Matching Neural Net</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-[11px]">
        <button 
          onClick={() => setInput("Show top rated event companions in SF")}
          className="px-2.5 py-1 rounded-full bg-slate-900 text-indigo-300 border border-indigo-500/20 whitespace-nowrap hover:border-indigo-400"
        >
          <Search className="w-3 h-3 inline mr-1" /> Top SF Companions
        </button>
        <button 
          onClick={() => setInput("How does escrow payment protection work?")}
          className="px-2.5 py-1 rounded-full bg-slate-900 text-emerald-300 border border-emerald-500/20 whitespace-nowrap hover:border-emerald-400"
        >
          <Shield className="w-3 h-3 inline mr-1" /> Escrow Explanation
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'USER' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Assistant anything..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" className="p-2 rounded-xl gradient-bg-primary text-white hover:opacity-90">
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
