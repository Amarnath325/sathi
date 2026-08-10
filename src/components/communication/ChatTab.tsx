'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send, Paperclip, Mic, Video, Phone, Lock, CheckCheck, Check,
  AlertOctagon, Image as ImageIcon, Smile, X, PhoneOff, Pin,
  Archive, Ban, Bell, BellOff, MoreVertical, Search, Trash2,
  MapPin, Clock, MessageSquare, ArrowLeft, Calendar, Sparkles,
  Monitor, CircleDot, FileText, Download, Loader2, ShieldAlert,
  Globe, Timer, Play, Volume2, Scale, WifiOff, VolumeX
} from 'lucide-react';
import { useCommunicationStore, Conversation, FullChatMessage, MessageStatus } from '@/lib/communicationStore';
import { MessagingModerationEngine } from '@/lib/messagingModeration';
import { uploadFileInChunks, ChunkUploadProgress } from '@/lib/chunkUpload';
import MeetingSchedulerModal from './MeetingSchedulerModal';
import AISummaryModal from './AISummaryModal';
import SOSPanicModal from './SOSPanicModal';
import E2EFingerprintModal from './E2EFingerprintModal';
import DisputeReportModal from './DisputeReportModal';
import InChatEscrowCard from './InChatEscrowCard';
import LiveLocationTrackerCard from './LiveLocationTrackerCard';

const EMOJI_QUICK = ['❤️', '👍', '😂', '😮', '😢', '🙏', '🔥', '👏'];

function formatTime(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function StatusTick({ status }: { status: MessageStatus }) {
  if (status === 'PENDING_SYNC') return <span title="Pending Connection Sync"><Clock className="w-3 h-3 text-amber-400 animate-pulse" /></span>;
  if (status === 'SENDING') return <Clock className="w-3 h-3 text-slate-500" />;
  if (status === 'DELIVERED') return <CheckCheck className="w-3 h-3 text-slate-400" />;
  if (status === 'READ') return <CheckCheck className="w-3 h-3 text-cyan-400" />;
  return <Check className="w-3 h-3 text-slate-400" />;
}

function MessageBubble({
  msg, isMe, conversationId, onReact
}: {
  msg: FullChatMessage;
  isMe: boolean;
  conversationId: string;
  onReact: (msgId: string, emoji: string) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const { deleteMessageForEveryone, translateMessage, currentUserId } = useCommunicationStore();

  const groupedReactions = useMemo(() => {
    const map: Record<string, number> = {};
    (msg.reactions || []).forEach(r => { map[r.emoji] = (map[r.emoji] || 0) + 1; });
    return Object.entries(map);
  }, [msg.reactions]);

  const toggleAudioSpeed = () => {
    if (audioSpeed === 1.0) setAudioSpeed(1.5);
    else if (audioSpeed === 1.5) setAudioSpeed(2.0);
    else setAudioSpeed(1.0);
  };

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
      {!isMe && (
        <img src={msg.senderAvatar} alt={msg.senderName}
          className="w-7 h-7 rounded-full object-cover border border-slate-700 mr-2 self-end mb-1 flex-shrink-0" />
      )}

      <div className={`max-w-[72%] space-y-1`}>
        {!isMe && (
          <p className="text-[10px] text-indigo-400 font-bold px-1">{msg.senderName}</p>
        )}

        <div className="relative">
          {/* Emoji & Action Triggers */}
          <div className={`absolute ${isMe ? '-left-16' : '-right-16'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
            <button
              onClick={() => setShowReactions(v => !v)}
              className="p-1 rounded-full bg-slate-800 border border-slate-700 hover:border-indigo-500"
              title="React"
            >
              <Smile className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => translateMessage(conversationId, msg.id, 'EN')}
              className="p-1 rounded-full bg-slate-800 border border-slate-700 hover:border-indigo-500"
              title="Translate Message"
            >
              <Globe className="w-3 h-3 text-indigo-400" />
            </button>
          </div>

          {/* Context Menu */}
          {isMe && (
            <button
              onClick={() => setShowMenu(v => !v)}
              className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-slate-800 border border-slate-700"
            >
              <MoreVertical className="w-3 h-3 text-slate-400" />
            </button>
          )}

          {showMenu && isMe && (
            <div className="absolute right-full mr-2 top-0 z-20 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden min-w-[130px]">
              <button
                onClick={() => { deleteMessageForEveryone(conversationId, msg.id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-400 hover:bg-slate-800"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showReactions && (
            <div className={`absolute ${isMe ? 'right-0' : 'left-0'} -top-10 z-20 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex items-center gap-1 px-2 py-1.5`}>
              {EMOJI_QUICK.map(em => (
                <button key={em} onClick={() => { onReact(msg.id, em); setShowReactions(false); }}
                  className="text-base hover:scale-125 transition-transform">
                  {em}
                </button>
              ))}
            </div>
          )}

          {/* Special Cards or Standard Message */}
          {msg.type === 'ESCROW_CARD' && msg.escrowState ? (
            <InChatEscrowCard
              conversationId={conversationId}
              bookingRef={msg.escrowState.bookingRef}
              amount={msg.escrowState.amount}
              status={msg.escrowState.status}
              companionName="Elena Rostova"
            />
          ) : msg.type === 'LOCATION_TRACKER_CARD' || msg.liveLocationState ? (
            <LiveLocationTrackerCard
              companionName="Elena Rostova"
              distanceMeters={msg.liveLocationState?.distanceMeters || 320}
              etaMinutes={msg.liveLocationState?.etaMinutes || 4}
              venueName={msg.liveLocationState?.venueName || 'Grand Hotel Lobby'}
            />
          ) : msg.type === 'AUDIO' ? (
            <div className="p-3 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-2 text-white">
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full gradient-bg-primary flex items-center justify-center text-white shadow-md">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </button>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex items-center">
                  <div className="h-full bg-indigo-500 w-1/3" />
                </div>
                <button
                  onClick={toggleAudioSpeed}
                  className="px-2 py-0.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-[10px] font-mono font-bold text-indigo-300 hover:text-white"
                >
                  {audioSpeed}x
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Voice Note (00:28s) · {audioSpeed}x Speed</p>
            </div>
          ) : msg.deletedForEveryone ? (
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 text-xs italic">
              {msg.content}
            </div>
          ) : (
            <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed space-y-1 ${isMe
              ? 'gradient-bg-primary text-white rounded-br-none shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
            }`}>
              <p>{msg.content}</p>
              {msg.translatedText && (
                <div className="pt-1.5 border-t border-white/20 text-[11px] font-sans text-amber-200 flex items-start gap-1">
                  <Globe className="w-3 h-3 text-amber-300 mt-0.5 shrink-0" />
                  <span>{msg.translatedText}</span>
                </div>
              )}
              {msg.ephemeralExpiresAt && (
                <div className="pt-1 text-[9px] font-mono text-rose-300 flex items-center gap-1">
                  <Timer className="w-2.5 h-2.5" /> Ephemeral (Auto-destructs soon)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reactions */}
        {groupedReactions.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            {groupedReactions.map(([em, count]) => (
              <button key={em}
                onClick={() => onReact(msg.id, em)}
                className="px-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] hover:border-indigo-500/50 transition-all">
                {em} {count > 1 && <span className="text-slate-400">{count}</span>}
              </button>
            ))}
          </div>
        )}

        <div className={`flex items-center gap-1 text-[10px] text-slate-500 ${isMe ? 'justify-end' : 'justify-start'} px-1`}>
          <span suppressHydrationWarning>{msg.timestamp}</span>
          {isMe && <StatusTick status={msg.status} />}
        </div>
      </div>
    </div>
  );
}

function ConversationItem({
  conv, isActive, onClick, currentUserId
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}) {
  const otherName = (conv.participantNames || [conv.participantName]).find(n => n !== 'Alex Thompson') || conv.participantName;
  const otherAvatar = conv.participantAvatars ? conv.participantAvatars.find((_, i) => (conv.participantIds || [])[i] !== currentUserId) : conv.participantAvatar;

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-2xl transition-all text-left flex items-center gap-3 ${
        isActive
          ? 'bg-indigo-600/20 border border-indigo-500/40'
          : 'hover:bg-slate-900 border border-transparent'
      }`}
    >
      <div className="relative flex-shrink-0">
        <img src={otherAvatar} alt={otherName} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
        {conv.isOnline && (
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0" />
        )}
        {conv.status === 'ARCHIVED' && (
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 border-2 border-slate-950 absolute bottom-0 right-0" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            {conv.isPinned && <Pin className="w-2.5 h-2.5 text-indigo-400" />}
            {conv.notificationPref === 'MUTED' && <BellOff className="w-2.5 h-2.5 text-slate-500" />}
            <h4 className="text-xs font-bold text-white truncate">{otherName}</h4>
          </div>
          <span className="text-[9px] text-slate-500 shrink-0 ml-1" suppressHydrationWarning>
            {formatTime(conv.lastMessageAt || conv.lastMessageTime || '')}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[10px] text-slate-400 truncate">{conv.lastMessage}</p>
          {conv.unreadCount > 0 && (
            <span className="ml-1 shrink-0 w-4 h-4 rounded-full gradient-bg-primary text-white text-[9px] font-bold flex items-center justify-center">
              {conv.unreadCount}
            </span>
          )}
        </div>
        {conv.bookingRef && (
          <span className="text-[9px] font-mono text-indigo-500">{conv.bookingRef}</span>
        )}
      </div>
    </button>
  );
}

export default function ChatTab() {
  const {
    conversations, currentUserId, currentUserName,
    sendMessage, markConversationRead, addReaction, removeReaction,
    togglePinConversation, archiveConversation, unarchiveConversation,
    blockConversation, setNotificationPref, setTypingStatus, callState, setCallState,
    isNoiseSuppressionEnabled, toggleNoiseSuppression, flushOfflineQueue, offlineQueue
  } = useCommunicationStore();

  const [activeConvId, setActiveConvId] = useState<string | null>('conv-1');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [showConvMenu, setShowConvMenu] = useState(false);

  // Advanced Feature States
  const [uploadProgress, setUploadProgress] = useState<ChunkUploadProgress | null>(null);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);
  const [showAISummaryModal, setShowAISummaryModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [ephemeralMinutes, setEphemeralMinutes] = useState<number | undefined>(undefined);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCallRecording, setIsCallRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushOfflineQueue]);

  const activeConv = useMemo(
    () => conversations.find(c => c.id === activeConvId) || null,
    [conversations, activeConvId]
  );

  const filteredConvs = useMemo(() => {
    let list = showArchived
      ? conversations.filter(c => c.status === 'ARCHIVED')
      : conversations.filter(c => c.status !== 'ARCHIVED');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        (c.participantNames || [c.participantName]).some(n => (n || '').toLowerCase().includes(q)) ||
        (c.lastMessage || '').toLowerCase().includes(q) ||
        (c.bookingRef || '').toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastMessageAt || b.lastMessageTime || 0).getTime() - new Date(a.lastMessageAt || a.lastMessageTime || 0).getTime();
    });
  }, [conversations, searchQuery, showArchived]);

  useEffect(() => {
    if (activeConvId) markConversationRead(activeConvId);
  }, [activeConvId, activeConv?.messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // Handle Typing Indicator Trigger
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (activeConvId) {
      setTypingStatus(activeConvId, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(activeConvId, false);
      }, 2500);
    }
  };

  // Handle File Chunk Upload Trigger
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConvId) return;

    try {
      const result = await uploadFileInChunks(file, (progress) => {
        setUploadProgress(progress);
      });

      // Send uploaded file payload into chat
      sendMessage(
        activeConvId,
        `📎 Attached File: ${result.fileName} (${(result.fileSize / (1024 * 1024)).toFixed(2)} MB - ${result.chunkCount} Chunks Uploaded)`,
        'FILE',
        result.url
      );
    } catch (err) {
      alert('Chunk Upload Failed. Please try again.');
    } finally {
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Screen Share Trigger
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          await navigator.mediaDevices.getDisplayMedia({ video: true });
        }
        setIsScreenSharing(true);
      } else {
        setIsScreenSharing(false);
      }
    } catch (e) {
      setIsScreenSharing(false);
    }
  };

  // Handle Call Recording Toggle
  const toggleCallRecording = () => {
    if (!isCallRecording) {
      setIsCallRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setIsCallRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);

      // Trigger automatic recording download
      const alertMsg = `🎥 Call Recording Saved (${recordingSeconds}s). Session transcript processed for AI Summary.`;
      alert(alertMsg);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    // Evaluate message against Real-Time Moderation & Anti-Bypass Filter
    const isBookingConfirmed = Boolean(activeConv?.bookingRef);
    const modResult = MessagingModerationEngine.moderateMessage(inputText.trim(), isBookingConfirmed);

    if (modResult.containsProhibitedContent) {
      alert(`[TRUST & SAFETY BLOCK] ${modResult.rejectionReason}`);
      return;
    }

    sendMessage(activeConvId, modResult.sanitizedContent, 'TEXT', undefined, ephemeralMinutes);
    setInputText('');
  };

  const handleReact = (msgId: string, emoji: string) => {
    if (!activeConvId || !activeConv) return;
    const msg = activeConv.messages.find(m => m.id === msgId);
    if (!msg) return;
    const alreadyReacted = (msg.reactions || []).some(r => r.userId === currentUserId && r.emoji === emoji);
    if (alreadyReacted) removeReaction(activeConvId, msgId, emoji);
    else addReaction(activeConvId, msgId, emoji);
  };

  const otherName = activeConv ? ((activeConv.participantNames || [activeConv.participantName]).find(n => n !== currentUserName) || activeConv.participantName) : '';
  const otherAvatar = activeConv ? ((activeConv.participantAvatars || [activeConv.participantAvatar]).find((_, i) => (activeConv.participantIds || [])[i] !== currentUserId) || activeConv.participantAvatar || '') : '';

  return (
    <div className="glass-panel rounded-2xl sm:rounded-3xl border border-slate-800 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-10rem)] min-h-[500px]">
      
      {/* === LEFT SIDEBAR: Conversation List === */}
      <div className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/60 ${
        activeConvId ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              {showArchived ? 'Archived' : 'Active Chats'}
            </h2>
            <button
              onClick={() => setShowArchived(v => !v)}
              className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              <Archive className="w-3 h-3" />
              {showArchived ? 'Active' : 'Archived'}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConvs.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <Lock className="w-7 h-7 text-slate-600 mx-auto stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-400">No Booked Companion Chats</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Chat is restricted to companions with confirmed bookings. Book a companion to unlock end-to-end encrypted messaging.
              </p>
            </div>
          ) : (
            filteredConvs.map(conv => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={activeConvId === conv.id}
                onClick={() => { setActiveConvId(conv.id); setShowConvMenu(false); }}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      </div>

      {/* === RIGHT: Active Chat Window === */}
      {activeConv ? (
        <div className={`flex-1 flex-col bg-slate-900/40 relative ${
          activeConvId ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Chat Header */}
          <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-3">
              {/* Back button for mobile */}
              <button
                onClick={() => setActiveConvId(null)}
                className="md:hidden p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                title="Back to conversation list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="relative">
                <img src={otherAvatar} alt={otherName} className="w-10 h-10 rounded-full object-cover border border-indigo-500/40" />
                {activeConv.isOnline && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0 animate-pulse" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {otherName}
                  {activeConv.isOnline && <span className="text-[9px] text-emerald-400 font-normal">● Online</span>}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> AES-256 Encrypted
                  {activeConv.bookingRef && <span className="ml-2 text-indigo-400">· {activeConv.bookingRef}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSosModal(true)}
                className="px-3 py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-rose-900/30 animate-pulse"
                title="SOS Emergency Panic Alert"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">SOS PANIC</span>
              </button>

              <button
                onClick={() => setShowFingerprintModal(true)}
                className="p-2 rounded-xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-500 text-emerald-400"
                title="Verify E2E Safety Fingerprint"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => setShowAISummaryModal(true)}
                className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="AI Chat & Meeting Summary"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">AI Summary</span>
              </button>
              <button onClick={() => setVideoCallActive(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-indigo-400"
                title="Video Call">
                <Video className="w-4 h-4" />
              </button>
              <button onClick={() => setVideoCallActive(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400"
                title="Voice Call">
                <Phone className="w-4 h-4" />
              </button>
              <div className="relative">
                <button onClick={() => setShowConvMenu(v => !v)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showConvMenu && (
                  <div className="absolute right-0 top-full mt-1 z-30 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden min-w-[170px]">
                    <button onClick={() => { togglePinConversation(activeConv.id); setShowConvMenu(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800">
                      <Pin className="w-3.5 h-3.5 text-indigo-400" />
                      {activeConv.isPinned ? 'Unpin Chat' : 'Pin Chat'}
                    </button>
                    <button onClick={() => { setNotificationPref(activeConv.id, activeConv.notificationPref === 'MUTED' ? 'ALL' : 'MUTED'); setShowConvMenu(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800">
                      {activeConv.notificationPref === 'MUTED' ? <Bell className="w-3.5 h-3.5 text-emerald-400" /> : <BellOff className="w-3.5 h-3.5 text-amber-400" />}
                      {activeConv.notificationPref === 'MUTED' ? 'Unmute' : 'Mute Notifications'}
                    </button>
                    <button onClick={() => { activeConv.status === 'ARCHIVED' ? unarchiveConversation(activeConv.id) : archiveConversation(activeConv.id); setShowConvMenu(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800">
                      <Archive className="w-3.5 h-3.5 text-slate-400" />
                      {activeConv.status === 'ARCHIVED' ? 'Unarchive' : 'Archive Chat'}
                    </button>
                    <button onClick={() => { blockConversation(activeConv.id); setShowConvMenu(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-rose-400 hover:bg-slate-800">
                      <Ban className="w-3.5 h-3.5" /> Block User
                    </button>
                    <button onClick={() => { setShowDisputeModal(true); setShowConvMenu(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-rose-400 hover:bg-slate-800">
                      <Scale className="w-3.5 h-3.5 text-rose-400" /> File Dispute Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Offline Sync Banner */}
          {!isOnline && (
            <div className="mx-4 mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center justify-between font-mono animate-pulse">
              <span className="flex items-center gap-2">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                Network Disconnected · Messages will queue locally and auto-sync when online.
              </span>
              {offlineQueue.length > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-bold">
                  {offlineQueue.length} Queued
                </span>
              )}
            </div>
          )}

          {/* Typing Indicator Animated Bar */}
          {activeConv.isTyping && (
            <div className="mx-4 mt-2 px-3 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-[10px] text-indigo-300 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>{otherName} is typing a message...</span>
            </div>
          )}

          {/* Blocked Banner */}
          {activeConv.status === 'BLOCKED' && (
            <div className="mx-4 mt-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 text-center font-bold">
              🚫 You have blocked this user. Unblock to resume messaging.
            </div>
          )}

          {/* Section 48: Chat Safety Warning Banner */}
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-semibold flex items-center justify-between">
            <span>🛡️ <strong>Safety Warning:</strong> Never share passwords, OTPs, or financial info. Keep all payments inside Companion Connect.</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeConv.messages.map(msg => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isMe={msg.senderId === currentUserId}
                conversationId={activeConv.id}
                onReact={handleReact}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chunk File Upload Progress Banner */}
          {uploadProgress && (
            <div className="mx-4 mb-2 p-3 rounded-2xl bg-slate-900 border border-indigo-500/40 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-indigo-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  Uploading {uploadProgress.fileName}
                </span>
                <span>{uploadProgress.percentage}% (Chunk {uploadProgress.currentChunk}/{uploadProgress.totalChunks})</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-200" style={{ width: `${uploadProgress.percentage}%` }} />
              </div>
            </div>
          )}

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
              title="Attach File (Chunk Upload)"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowSchedulerModal(true)}
              className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
              title="Schedule Session Meeting"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
              title="Share Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            
            <input
              value={inputText}
              onChange={handleInputChange}
              placeholder={activeConv.status === 'BLOCKED' ? 'Unblock to send messages...' : 'Type an encrypted message...'}
              disabled={activeConv.status === 'BLOCKED'}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() => setEphemeralMinutes(m => m === undefined ? 60 : m === 60 ? 1440 : undefined)}
              className={`p-2 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                ephemeralMinutes
                  ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Self-Destruct Ephemeral Message Timer"
            >
              <Timer className="w-3.5 h-3.5" />
              <span className="text-[10px]">{ephemeralMinutes === 60 ? '1h' : ephemeralMinutes === 1440 ? '24h' : 'Off'}</span>
            </button>

            <button
              type="button"
              onClick={() => setVoiceRecording(v => !v)}
              className={`p-2.5 rounded-xl border transition-all ${voiceRecording ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || activeConv.status === 'BLOCKED'}
              className="p-2.5 rounded-xl gradient-bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-900/20">
          <div className="text-center space-y-3">
            <MessageSquare className="w-16 h-16 text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-400">Select a conversation</h3>
            <p className="text-xs text-slate-600">Choose a chat from the list to start messaging</p>
          </div>
        </div>
      )}

      {/* Dispute Incident Report Modal */}
      {showDisputeModal && activeConv && (
        <DisputeReportModal
          conversationId={activeConv.id}
          companionName={otherName}
          onClose={() => setShowDisputeModal(false)}
        />
      )}

      {/* SOS Panic Emergency Modal */}
      {showSosModal && activeConv && (
        <SOSPanicModal
          conversationId={activeConv.id}
          companionName={otherName}
          onClose={() => setShowSosModal(false)}
        />
      )}

      {/* E2E Security Fingerprint Verification Modal */}
      {showFingerprintModal && activeConv && (
        <E2EFingerprintModal
          companionName={otherName}
          onClose={() => setShowFingerprintModal(false)}
        />
      )}

      {/* Meeting Scheduler Modal */}
      {showSchedulerModal && activeConv && (
        <MeetingSchedulerModal
          conversationId={activeConv.id}
          companionName={otherName}
          onClose={() => setShowSchedulerModal(false)}
        />
      )}

      {/* AI Summary Modal */}
      {showAISummaryModal && activeConv && (
        <AISummaryModal
          companionName={otherName}
          messages={activeConv.messages}
          onClose={() => setShowAISummaryModal(false)}
        />
      )}

      {/* Enhanced WebRTC Video/Voice Call Modal with Screen Share, Recording & Subtitles */}
      {videoCallActive && activeConv && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-2xl w-full glass-panel border border-slate-700 rounded-3xl p-6 relative flex flex-col items-center space-y-6">
            <button onClick={() => setVideoCallActive(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-80 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
              <img src={otherAvatar} alt={otherName} className="w-full h-full object-cover opacity-80" />
              
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold animate-pulse">
                  {isScreenSharing ? '🖥️ Screen Sharing Active' : 'WebRTC HD Video Stream · E2E Encrypted'}
                </span>
                {isCallRecording && (
                  <span className="px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                    <CircleDot className="w-3.5 h-3.5 text-rose-400" /> Recording {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Live Closed Captions / Speech Subtitles Ticker */}
              <div className="absolute bottom-4 left-4 right-32 p-2.5 rounded-xl bg-slate-950/85 border border-indigo-500/40 text-xs text-amber-200 font-sans backdrop-blur-md flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                <span className="truncate">
                  <strong className="text-indigo-300">{otherName}:</strong> "Hello! I am arrived at the Grand Hotel lobby near reception."
                </span>
              </div>

              <div className="absolute bottom-4 right-4 w-24 h-16 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                {isScreenSharing ? 'Screen Feed' : 'Your Camera'}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={toggleNoiseSuppression}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isNoiseSuppressionEnabled
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="AI Noise Suppression & Echo Filter"
              >
                {isNoiseSuppressionEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5" />}
                <span>AI Noise Filter: {isNoiseSuppressionEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isScreenSharing ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Screen Share"
              >
                <Monitor className="w-5 h-5" /> Share Screen
              </button>

              <button
                onClick={toggleCallRecording}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isCallRecording ? 'bg-rose-600 border-rose-500 text-white animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Record Session"
              >
                <CircleDot className="w-5 h-5" /> {isCallRecording ? 'Stop Recording' : 'Record Session'}
              </button>

              <button
                onClick={() => setVideoCallActive(false)}
                className="p-4 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 hover:bg-rose-500 ml-2"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
