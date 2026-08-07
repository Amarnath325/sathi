'use client';

import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Lock, ScrollText, Key, Plus, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StaffDirectoryTable } from '@/components/staff/StaffDirectoryTable';
import { PermissionMatrix } from '@/components/staff/PermissionMatrix';
import { SecurityAuditLogs } from '@/components/staff/SecurityAuditLogs';
import { SessionControl } from '@/components/staff/SessionControl';
import { StaffModal } from '@/components/staff/StaffModal';
import { useStaffAccessStore, StaffMemberRecord } from '@/lib/staffAccessStore';

export default function AdminStaffAccessPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'matrix' | 'logs' | 'sessions'>('directory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMemberRecord | null>(null);

  const { staffList, auditLogs, activeSessions } = useStaffAccessStore();

  const onDutyCount = staffList.filter((s) => s.shiftStatus === 'ON_DUTY').length;
  const mfaEnforcedCount = staffList.filter((s) => s.is2FAEnforced).length;
  const mfaPct = staffList.length > 0 ? Math.round((mfaEnforcedCount / staffList.length) * 100) : 100;

  const handleOpenInvite = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff: StaffMemberRecord) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" /> Staff & Access Control (RBAC)
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Enterprise v2.4 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage internal staff directory, role permission matrix, shift status, security audit trail, and 2FA policies
            </p>
          </div>

          <button
            onClick={handleOpenInvite}
            className="px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold flex items-center gap-1.5 hover:opacity-90 shadow-xl shadow-indigo-600/30 shrink-0"
          >
            <Plus className="w-4 h-4" /> Onboard Staff Member
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Total Staff</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{staffList.length}</div>
            <div className="text-[10px] text-slate-500 font-mono">Across 8 departments</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Active On-Duty</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">{onDutyCount} Staff</div>
            <div className="text-[10px] text-slate-500 font-mono">Live on active shift</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>2FA Compliance</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{mfaPct}%</div>
            <div className="text-[10px] text-slate-500 font-mono">{mfaEnforcedCount} / {staffList.length} staff enforced</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Security Audit Logs</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{auditLogs.length}</div>
            <div className="text-[10px] text-slate-500 font-mono">Real-time IP action tracking</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          {[
            { id: 'directory', label: '👥 Staff Directory', icon: <Users className="w-4 h-4" /> },
            { id: 'matrix', label: '🛡️ Permission Matrix', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'logs', label: '📜 Security Audit Trail', icon: <ScrollText className="w-4 h-4" /> },
            { id: 'sessions', label: '🔑 Session & Security Control', icon: <Key className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'directory' && (
            <StaffDirectoryTable onEditStaff={handleEditStaff} onOpenInviteModal={handleOpenInvite} />
          )}
          {activeTab === 'matrix' && <PermissionMatrix />}
          {activeTab === 'logs' && <SecurityAuditLogs />}
          {activeTab === 'sessions' && <SessionControl />}
        </div>

        {/* Invite / Edit Modal */}
        <StaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staffToEdit={editingStaff}
        />
      </div>
    </div>
  );
}
