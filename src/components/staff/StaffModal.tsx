'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Sparkles, Key, Mail, Phone, Building } from 'lucide-react';
import { useStaffAccessStore, StaffMemberRecord, StaffDepartment, StaffShiftStatus } from '@/lib/staffAccessStore';
import { RoleType } from '@/lib/types';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: StaffMemberRecord | null;
}

export function StaffModal({ isOpen, onClose, staffToEdit }: StaffModalProps) {
  const { addStaffMember, updateStaffMember, roleDefinitions, permissionCatalog } = useStaffAccessStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<StaffDepartment>('OPERATIONS');
  const [designation, setDesignation] = useState('');
  const [assignedRole, setAssignedRole] = useState<RoleType>('MODERATOR');
  const [shiftStatus, setShiftStatus] = useState<StaffShiftStatus>('ON_DUTY');
  const [is2FAEnforced, setIs2FAEnforced] = useState(true);
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (staffToEdit) {
      setFullName(staffToEdit.fullName);
      setEmail(staffToEdit.email);
      setPhone(staffToEdit.phone || '');
      setDepartment(staffToEdit.department);
      setDesignation(staffToEdit.designation);
      setAssignedRole(staffToEdit.assignedRole);
      setShiftStatus(staffToEdit.shiftStatus);
      setIs2FAEnforced(staffToEdit.is2FAEnforced);
      setCustomPermissions(staffToEdit.customPermissions || []);
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setDepartment('OPERATIONS');
      setDesignation('');
      setAssignedRole('MODERATOR');
      setShiftStatus('ON_DUTY');
      setIs2FAEnforced(true);
      setCustomPermissions([]);
    }
  }, [staffToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleCustomPermission = (key: string) => {
    setCustomPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !designation) return;

    if (staffToEdit) {
      updateStaffMember(staffToEdit.id, {
        fullName,
        email,
        phone,
        department,
        designation,
        assignedRole,
        shiftStatus,
        is2FAEnforced,
        customPermissions,
      });
    } else {
      addStaffMember({
        userId: 'usr-' + Date.now(),
        fullName,
        email,
        phone: phone || '+1 (555) 000-1122',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        department,
        designation,
        assignedRole,
        shiftStatus,
        is2FAEnforced,
        mfaEnabled: false,
        lastLoginIp: '127.0.0.1',
        status: 'ACTIVE',
        customPermissions,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          {staffToEdit ? `Edit Staff Member: ${staffToEdit.employeeId}` : 'Onboard New Staff Member'}
        </h3>

        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300">Full Name *</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              required
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Work Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah.jenkins@sathi.io"
              required
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Official Designation *</label>
            <input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Escalation Lead"
              required
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Department & Role */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as StaffDepartment)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="EXECUTIVE">EXECUTIVE</option>
              <option value="OPERATIONS">OPERATIONS</option>
              <option value="TRUST_AND_SAFETY">TRUST_AND_SAFETY</option>
              <option value="FINANCE_AND_ESCROW">FINANCE_AND_ESCROW</option>
              <option value="VERIFICATION_KYC">VERIFICATION_KYC</option>
              <option value="CUSTOMER_SUPPORT">CUSTOMER_SUPPORT</option>
              <option value="ENGINEERING">ENGINEERING</option>
              <option value="LEGAL_AND_COMPLIANCE">LEGAL_AND_COMPLIANCE</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Assigned System Role</label>
            <select
              value={assignedRole}
              onChange={(e) => setAssignedRole(e.target.value as RoleType)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              {roleDefinitions.map((rd) => (
                <option key={rd.id} value={rd.role}>
                  {rd.title} ({rd.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Shift Status</label>
            <select
              value={shiftStatus}
              onChange={(e) => setShiftStatus(e.target.value as StaffShiftStatus)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="ON_DUTY">ON_DUTY</option>
              <option value="OFF_DUTY">OFF_DUTY</option>
              <option value="ON_CALL">ON_CALL</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
            </select>
          </div>
        </div>

        {/* 2FA Policy Switch */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Enforce 2FA Authentication</span>
            <span className="text-[10px] text-slate-400">Mandate OTP/Authenticator prompt on login</span>
          </div>
          <input
            type="checkbox"
            checked={is2FAEnforced}
            onChange={(e) => setIs2FAEnforced(e.target.checked)}
            className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
          />
        </div>

        {/* Custom Permission Overrides */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" /> Custom Specific Permission Overrides
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 rounded-2xl bg-slate-950 border border-slate-800">
            {permissionCatalog.map((perm) => {
              const checked = customPermissions.includes(perm.key);
              return (
                <label key={perm.key} className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCustomPermission(perm.key)}
                    className="accent-indigo-500 rounded"
                  />
                  <span className={checked ? 'text-amber-400 font-bold' : ''}>{perm.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90 shadow-lg"
          >
            {staffToEdit ? 'Save Changes' : 'Invite Staff Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
