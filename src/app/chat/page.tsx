'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Mic, 
  Video, 
  Phone, 
  Lock, 
  CheckCheck, 
  AlertOctagon, 
  Image as ImageIcon,
  Smile,
  X,
  PhoneOff
} from 'lucide-react';
import { MOCK_MESSAGES, MOCK_COMPANIONS } from '@/lib/mockData';
import { ChatMessage } from '@/lib/types';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);

  const activeCompanion = MOCK_COMPANIONS[0]; // Sophia Chen

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'curr-user',
      receiverId: activeCompanion.id,
      senderName: 'You',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      encrypted: true
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate companion response
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: activeCompanion.id,
        receiverId: 'curr-user',
        senderName: activeCompanion.name,
        content: "Understood! I have noted down the venue and time details. See you there!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        encrypted: true
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-6rem)]">
      <div className="glass-panel rounded-3xl border border-slate-800 h-full overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Conversations List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/60">
          
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" /> Active Chats
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">E2E Encrypted</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 cursor-pointer flex items-center gap-3">
              <div className="relative">
                <img src={activeCompanion.avatar} alt={activeCompanion.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white truncate">{activeCompanion.name}</h4>
                  <span className="text-[10px] text-slate-400">12:35 PM</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate mt-0.5">I will arrive 15 minutes early near...</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Active Chat Window */}
        <div className="flex-1 flex flex-col bg-slate-900/40 relative">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-3">
              <img src={activeCompanion.avatar} alt={activeCompanion.name} className="w-10 h-10 rounded-full object-cover border border-indigo-500/40" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {activeCompanion.name}
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> AES-256 Signal Protocol Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setVideoCallActive(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                title="Start Encrypted Video Call"
              >
                <Video className="w-4 h-4 text-indigo-400" />
              </button>

              <button 
                onClick={() => setVideoCallActive(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                title="Start Voice Call"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </button>

              <button 
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/40"
                title="Report Chat Behavior"
              >
                <AlertOctagon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isMe = m.senderId === 'curr-user';
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] space-y-1`}>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'gradient-bg-primary text-white rounded-br-none shadow-lg' 
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}>
                      {m.content}
                    </div>

                    <div className={`flex items-center gap-1 text-[10px] text-slate-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span>{m.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Controls Bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
            <button type="button" className="p-2 text-slate-400 hover:text-white">
              <Paperclip className="w-4 h-4" />
            </button>
            <button type="button" className="p-2 text-slate-400 hover:text-white">
              <ImageIcon className="w-4 h-4" />
            </button>

            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your encrypted message..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button 
              type="button" 
              onClick={() => setVoiceRecording(!voiceRecording)}
              className={`p-2.5 rounded-xl border ${voiceRecording ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
            >
              <Mic className="w-4 h-4" />
            </button>

            <button type="submit" className="p-2.5 rounded-xl gradient-bg-primary text-white hover:opacity-90">
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

      {/* Simulated WebRTC Video Call Modal */}
      {videoCallActive && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-2xl w-full glass-panel border border-slate-700 rounded-3xl p-6 relative flex flex-col items-center space-y-6">
            
            <button onClick={() => setVideoCallActive(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-80 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
              <img src={activeCompanion.avatar} alt="Video Call Feed" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold animate-pulse">
                  WebRTC HD Video Stream Connected
                </span>
              </div>

              {/* User PiP Preview */}
              <div className="absolute bottom-4 right-4 w-28 h-20 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                  Your Camera
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-4 rounded-full bg-slate-800 text-slate-300 hover:text-white">
                <Mic className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setVideoCallActive(false)}
                className="p-5 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 hover:bg-rose-500"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button className="p-4 rounded-full bg-slate-800 text-slate-300 hover:text-white">
                <Video className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
