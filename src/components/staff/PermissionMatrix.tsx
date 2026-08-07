'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Check, Plus, Key, Sparkles, RefreshCw } from 'lucide-react';
import { useStaffAccessStore, RoleMatrixDefinition } from '@/lib/staffAccessStore';
import { RoleType } from '@/lib/types';

export function PermissionMatrix() {
  const { roleDefinitions, permissionCatalog, updateRolePermissions, createCustomRole } = useStaffAccessStore();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [customRoleDesc, setCustomRoleDesc] = useState('');

  // Group permissions by domain
  const domains = Array.from(new Set(permissionCatalog.map((p) => p.domain)));

  const handleTogglePermission = (role: RoleType, permKey: string, isGranted: boolean) => {
    const roleDef = roleDefinitions.find((r) => r.role === role);
    if (!roleDef) return;

    if (role === 'SUPER_ADMIN') return; // Super admin cannot lose permissions

    let newPerms: string[];
    if (isGranted) {
      newPerms = roleDef.permissions.filter((k) => k !== permKey);
    } else {
      newPerms = [...roleDef.permissions, permKey];
    }

    updateRolePermissions(role, newPerms);
  };

  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleName || !customRoleTitle) return;

    const roleKey = customRoleName.toUpperCase().replace(/\s+/g, '_') as RoleType;
    createCustomRole(roleKey, customRoleTitle, customRoleDesc, []);
    setCustomRoleName('');
    setCustomRoleTitle('');
    setCustomRoleDesc('');
    setShowRoleModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> System Role & Permission Access Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure granular action capabilities for each platform role across 8 security domains
          </p>
        </div>

        <button
          onClick={() => setShowRoleModal(true)}
          className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      {/* Permission Matrix Table */}
      <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 min-w-[220px]">Permission Action</th>
                {roleDefinitions.map((rd) => (
                  <th key={rd.id} className="p-4 text-center min-w-[130px]">
                    <div className="font-extrabold text-white">{rd.title}</div>
                    <div className="text-[9px] text-indigo-400 font-mono mt-0.5">{rd.role}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {domains.map((domain) => {
                const domainPerms = permissionCatalog.filter((p) => p.domain === domain);
                return (
                  <React.Fragment key={domain}>
                    {/* Domain Section Header */}
                    <tr className="bg-slate-950/60">
                      <td
                        colSpan={roleDefinitions.length + 1}
                        className="px-4 py-2 text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest border-y border-slate-800/80"
                      >
                        ⚡ Domain: {domain} ({domainPerms.length} permissions)
                      </td>
                    </tr>

                    {/* Permissions rows */}
                    {domainPerms.map((perm) => (
                      <tr key={perm.key} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-xs">{perm.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{perm.key}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{perm.description}</div>
                        </td>

                        {roleDefinitions.map((rd) => {
                          const isGranted = rd.permissions.includes(perm.key);
                          const isSuperAdmin = rd.role === 'SUPER_ADMIN';

                          return (
                            <td key={rd.id} className="p-4 text-center align-middle">
                              <button
                                disabled={isSuperAdmin}
                                onClick={() => handleTogglePermission(rd.role, perm.key, isGranted)}
                                className={`w-6 h-6 rounded-lg inline-flex items-center justify-center transition-all ${
                                  isGranted
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                                    : 'bg-slate-950 border border-slate-800 text-transparent hover:border-slate-600'
                                } ${isSuperAdmin ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateRoleSubmit}
            className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Create Custom Security Role
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300">Role Identifier Key</label>
              <input
                value={customRoleName}
                onChange={(e) => setCustomRoleName(e.target.value)}
                placeholder="e.g. DISPUTE_ARBITRATOR"
                required
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Display Title</label>
              <input
                value={customRoleTitle}
                onChange={(e) => setCustomRoleTitle(e.target.value)}
                placeholder="e.g. Lead Dispute Arbitrator"
                required
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Role Description</label>
              <textarea
                value={customRoleDesc}
                onChange={(e) => setCustomRoleDesc(e.target.value)}
                rows={2}
                placeholder="Responsibilities and access scope..."
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-extrabold hover:opacity-90"
              >
                Create Role
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
