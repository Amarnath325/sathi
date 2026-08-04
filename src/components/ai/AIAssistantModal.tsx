'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Send, 
  X, 
  ShieldCheck, 
  UserCheck, 
  Search, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your Companion Connect AI Assistant. Tell me what kind of companion or assistance service you need today (e.g. 'I need a verified gala partner in New York' or 'Elderly support in Chicago')."
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Based on your request "${userText}", I matched 3 top 100% KYC-Verified companions with 4.9+ ratings in your target location. All bookings remain protected under bank-grade escrow.`
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[560px] animate-scale-up">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Matchmaker & Safety Assistant
              </h3>
              <p className="text-[11px] text-slate-400">Powered by Neural Intent & Safety Algorithms</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  AI
                </div>
              )}
              <div className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'}`}>
                {msg.text}

                {msg.sender === 'ai' && i > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <Link 
                      href="/search" 
                      onClick={onClose}
                      className="px-3 py-1.5 rounded-xl gradient-bg-primary text-white text-[11px] font-bold flex items-center gap-1 hover:opacity-90"
                    >
                      View AI Recommendations <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2 items-center text-slate-400 text-xs italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              AI is analyzing verified companion credentials...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input 
            type="text" 
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Describe your ideal companion or assistance service..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button 
            type="submit"
            className="p-2.5 rounded-2xl gradient-bg-primary text-white hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
