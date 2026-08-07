'use client';

import React, { useState } from 'react';
import { UserCheck, Shield, Lock, Phone, Mail, MoreVertical, Edit3, Trash2, ShieldAlert, CheckCircle2, AlertTriangle, Key, Search, Filter } from 'lucide-react';
import { useStaffAccessStore, StaffMemberRecord, StaffDepartment, StaffShiftStatus, StaffStatus } from '@/lib/staffAccessStore';

const SHIFT_BADGES: Record<StaffShiftStatus, { label: string; color: string }> = {
  ON_DUTY: { label: '🟢 On Duty', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  OFF_DUTY: { label: '⚪ Off Duty', color: 'bg-slate-800 text-slate-400 border-slate-700' },
  ON_CALL: { label: '🟡 On Call', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  ON_LEAVE: { label: '🔴 On Leave', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
};

const DEPARTMENT_NAMES: Record<StaffDepartment, string> = {
  EXECUTIVE: 'Executive C-Suite',
  OPERATIONS: 'Platform Operations',
  TRUST_AND_SAFETY: 'Trust & Safety Dispatch',
  FINANCE_AND_ESCROW: 'Finance & Escrow',
  VERIFICATION_KYC: 'KYC & Verification',
  CUSTOMER_SUPPORT: 'Customer Support',
  ENGINEERING: 'Core Engineering',
  LEGAL_AND_COMPLIANCE: 'Legal & Compliance',
};

interface StaffDirectoryTableProps {
  onEditStaff: (staff: StaffMemberRecord) => void;
  onOpenInviteModal: () => void;
}

export function StaffDirectoryTable({ onEditStaff, onOpenInviteModal }: StaffDirectoryTableProps) {
  const { staffList, toggleStaffStatus, deleteStaffMember } = useStaffAccessStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredStaff = staffList.filter((s) => {
    const deptMatch = filterDepartment === 'ALL' || s.department === filterDepartment;
    const stMatch = filterStatus === 'ALL' || s.status === filterStatus;
    const qMatch =
      !searchQuery.trim() ||
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase());

    return deptMatch && stMatch && qMatch;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name, ID, or designation..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {Object.keys(DEPARTMENT_NAMES).map((dept) => (
              <option key={dept} value={dept}>
                {DEPARTMENT_NAMES[dept as StaffDepartment]}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Department & Designation</th>
                <th className="p-4">Role & Permissions</th>
                <th className="p-4">Shift Status</th>
                <th className="p-4">2FA Security</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-sans">
                    No staff members match the selected search & filter parameters.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const shift = SHIFT_BADGES[staff.shiftStatus];
                  return (
                    <tr key={staff.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.avatar}
                            alt={staff.fullName}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-white text-xs">{staff.fullName}</div>
                            <div className="text-[10px] text-indigo-400 font-mono">{staff.employeeId}</div>
                            <div className="text-[10px] text-slate-500">{staff.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="p-4">
                        <div className="font-bold text-slate-200">{staff.designation}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {DEPARTMENT_NAMES[staff.department]}
                        </div>
                      </td>

                      {/* Role & Permissions */}
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                          {staff.assignedRole}
                        </span>
                        {staff.customPermissions.length > 0 && (
                          <div className="text-[9px] text-amber-400 mt-1 font-bold">
                            +{staff.customPermissions.length} custom overrides
                          </div>
                        )}
                      </td>

                      {/* Shift */}
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${shift.color}`}>
                          {shift.label}
                        </span>
                      </td>

                      {/* 2FA */}
                      <td className="p-4">
                        {staff.mfaEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> 2FA Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                            <AlertTriangle className="w-3 h-3" /> 2FA Pending
                          </span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="p-4">
                        <select
                          value={staff.status}
                          onChange={(e) => toggleStaffStatus(staff.id, e.target.value as StaffStatus)}
                          className={`text-[10px] font-bold rounded-lg px-2 py-1 border bg-slate-950 focus:outline-none ${
                            staff.status === 'ACTIVE'
                              ? 'text-emerald-400 border-emerald-500/30'
                              : staff.status === 'SUSPENDED'
                              ? 'text-rose-400 border-rose-500/30'
                              : 'text-slate-500 border-slate-800'
                          }`}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditStaff(staff)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Staff Member"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteStaffMember(staff.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Deactivate Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
