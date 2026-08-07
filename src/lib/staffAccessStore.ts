import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoleType, RiskLevel } from './types';

export type StaffDepartment =
  | 'EXECUTIVE'
  | 'OPERATIONS'
  | 'TRUST_AND_SAFETY'
  | 'FINANCE_AND_ESCROW'
  | 'VERIFICATION_KYC'
  | 'CUSTOMER_SUPPORT'
  | 'ENGINEERING'
  | 'LEGAL_AND_COMPLIANCE';

export type StaffShiftStatus = 'ON_DUTY' | 'OFF_DUTY' | 'ON_CALL' | 'ON_LEAVE';
export type StaffStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface PermissionDefinition {
  key: string; // e.g. 'users:read', 'escrow:release'
  name: string;
  domain: 'USERS' | 'BOOKINGS' | 'PAYMENTS' | 'SAFETY' | 'REVIEWS' | 'NOTIFICATIONS' | 'STAFF' | 'SYSTEM';
  description: string;
}

export interface StaffMemberRecord {
  id: string;
  employeeId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  department: StaffDepartment;
  designation: string;
  assignedRole: RoleType;
  customPermissions: string[]; // overrides or additions
  shiftStatus: StaffShiftStatus;
  is2FAEnforced: boolean;
  mfaEnabled: boolean;
  lastLoginAt: string;
  lastLoginIp: string;
  status: StaffStatus;
  joinedDate: string;
}

export interface RoleMatrixDefinition {
  id: string;
  role: RoleType;
  title: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
}

export interface SecurityAuditRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  riskLevel: RiskLevel;
  isAuthorized: boolean;
  timestamp: string;
  details?: Record<string, any>;
}

export interface ActiveStaffSession {
  id: string;
  staffId: string;
  staffName: string;
  device: string;
  ipAddress: string;
  location: string;
  loginAt: string;
  lastActiveAt: string;
  isCurrentSession: boolean;
}

interface StaffAccessStore {
  // State
  staffList: StaffMemberRecord[];
  roleDefinitions: RoleMatrixDefinition[];
  permissionCatalog: PermissionDefinition[];
  auditLogs: SecurityAuditRecord[];
  activeSessions: ActiveStaffSession[];
  global2faPolicyEnforced: boolean;

  // Actions - Staff Directory
  addStaffMember: (staffData: Omit<StaffMemberRecord, 'id' | 'employeeId' | 'joinedDate' | 'lastLoginAt'>) => StaffMemberRecord;
  updateStaffMember: (id: string, updates: Partial<StaffMemberRecord>) => void;
  deleteStaffMember: (id: string) => void;
  toggleStaffStatus: (id: string, newStatus: StaffStatus) => void;
  updateStaffPermissions: (id: string, customPermissions: string[]) => void;

  // Actions - Role & Matrix
  updateRolePermissions: (role: RoleType, permissionKeys: string[]) => void;
  createCustomRole: (role: RoleType, title: string, description: string, permissions: string[]) => RoleMatrixDefinition;
  deleteCustomRole: (role: RoleType) => void;

  // Actions - Security & Sessions
  terminateSession: (sessionId: string) => void;
  toggleGlobal2FA: () => void;
  logAccessAction: (log: Omit<SecurityAuditRecord, 'id' | 'timestamp'>) => SecurityAuditRecord;
}

const PERMISSION_CATALOG: PermissionDefinition[] = [
  // USERS
  { key: 'users:read', name: 'View User Profiles', domain: 'USERS', description: 'View customer and companion profiles' },
  { key: 'users:write', name: 'Edit User Details', domain: 'USERS', description: 'Modify user metadata, rates, and info' },
  { key: 'users:suspend', name: 'Suspend/Ban Users', domain: 'USERS', description: 'Freeze accounts and issue disciplinary actions' },

  // BOOKINGS
  { key: 'bookings:read', name: 'View Bookings', domain: 'BOOKINGS', description: 'Access booking records & location logs' },
  { key: 'bookings:cancel', name: 'Cancel Bookings', domain: 'BOOKINGS', description: 'Administrative force-cancel booking' },
  { key: 'bookings:override', name: 'Override Booking Status', domain: 'BOOKINGS', description: 'Manually force status transition' },

  // PAYMENTS
  { key: 'payments:read', name: 'View Financial Txns', domain: 'PAYMENTS', description: 'Read transaction logs & escrow ledger' },
  { key: 'escrow:release', name: 'Release Escrow Payout', domain: 'PAYMENTS', description: 'Authorize payout release to companions' },
  { key: 'escrow:refund', name: 'Process Customer Refund', domain: 'PAYMENTS', description: 'Authorize refund from escrow lock' },

  // SAFETY & SOS
  { key: 'safety:sos_dispatch', name: 'Dispatch SOS Responders', domain: 'SAFETY', description: 'Trigger emergency police & responder dispatch' },
  { key: 'safety:incident_audit', name: 'Audit Incident Reports', domain: 'SAFETY', description: 'Investigate harassment & safety reports' },

  // REVIEWS
  { key: 'reviews:moderate', name: 'Moderate Reviews', domain: 'REVIEWS', description: 'Approve, flag, or reject user feedback' },
  { key: 'reviews:respond', name: 'Post Official Response', domain: 'REVIEWS', description: 'Write official admin response on reviews' },

  // NOTIFICATIONS
  { key: 'notifications:broadcast', name: 'Send System Broadcasts', domain: 'NOTIFICATIONS', description: 'Dispatch platform-wide multi-channel broadcasts' },

  // STAFF & RBAC
  { key: 'staff:read', name: 'View Staff Directory', domain: 'STAFF', description: 'View employee list & shift statuses' },
  { key: 'staff:write', name: 'Manage Staff Members', domain: 'STAFF', description: 'Add, edit, or remove staff accounts' },
  { key: 'staff:rbac_matrix', name: 'Modify Permission Matrix', domain: 'STAFF', description: 'Grant/revoke role permissions' },

  // SYSTEM
  { key: 'system:config', name: 'Modify Platform Settings', domain: 'SYSTEM', description: 'Update commission, taxes, maintenance mode' },
  { key: 'system:audit_logs', name: 'View Security Audit Logs', domain: 'SYSTEM', description: 'Audit staff action logs and IP records' },
];

const INITIAL_ROLE_DEFINITIONS: RoleMatrixDefinition[] = [
  {
    id: 'rd-1',
    role: 'SUPER_ADMIN',
    title: 'Super Administrator',
    description: 'Full unrestricted access across all ERP systems, financial ledgers, and staff settings',
    permissions: PERMISSION_CATALOG.map((p) => p.key),
    isCustom: false,
  },
  {
    id: 'rd-2',
    role: 'ADMIN',
    title: 'Platform Administrator',
    description: 'Executive management of bookings, users, promos, locations, and safety dispatch',
    permissions: [
      'users:read', 'users:write', 'users:suspend',
      'bookings:read', 'bookings:cancel', 'bookings:override',
      'payments:read', 'escrow:release', 'escrow:refund',
      'safety:sos_dispatch', 'safety:incident_audit',
      'reviews:moderate', 'reviews:respond',
      'notifications:broadcast',
      'staff:read', 'system:audit_logs'
    ],
    isCustom: false,
  },
  {
    id: 'rd-3',
    role: 'MODERATOR',
    title: 'Content & Review Moderator',
    description: 'Responsible for reviewing community feedback, profanity filtering, and dispute messaging',
    permissions: ['users:read', 'bookings:read', 'reviews:moderate', 'reviews:respond', 'safety:incident_audit'],
    isCustom: false,
  },
  {
    id: 'rd-4',
    role: 'SUPPORT_TEAM',
    title: 'Customer Support Lead',
    description: 'Frontline support handling user disputes, booking inquiries, and cancellations',
    permissions: ['users:read', 'bookings:read', 'bookings:cancel', 'payments:read', 'reviews:moderate'],
    isCustom: false,
  },
  {
    id: 'rd-5',
    role: 'VERIFICATION_TEAM',
    title: 'KYC & Verification Specialist',
    description: 'Auditing government IDs, passports, liveness scores, and issuing verified badges',
    permissions: ['users:read', 'users:write'],
    isCustom: false,
  },
];

const INITIAL_STAFF_MEMBERS: StaffMemberRecord[] = [
  {
    id: 'stf-001',
    employeeId: 'EMP-2026-001',
    userId: 'user-admin-01',
    fullName: 'Alexander Vance',
    email: 'alexander.vance@sathi.io',
    phone: '+1 (555) 019-2831',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    department: 'EXECUTIVE',
    designation: 'Chief Technology Officer',
    assignedRole: 'SUPER_ADMIN',
    customPermissions: [],
    shiftStatus: 'ON_DUTY',
    is2FAEnforced: true,
    mfaEnabled: true,
    lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastLoginIp: '192.168.1.104',
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
  {
    id: 'stf-002',
    employeeId: 'EMP-2026-002',
    userId: 'user-staff-02',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@sathi.io',
    phone: '+1 (555) 018-9922',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    department: 'TRUST_AND_SAFETY',
    designation: 'Head of Emergency Dispatch',
    assignedRole: 'ADMIN',
    customPermissions: ['safety:sos_dispatch', 'safety:incident_audit'],
    shiftStatus: 'ON_DUTY',
    is2FAEnforced: true,
    mfaEnabled: true,
    lastLoginAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    lastLoginIp: '10.0.4.12',
    status: 'ACTIVE',
    joinedDate: '2026-02-01',
  },
  {
    id: 'stf-003',
    employeeId: 'EMP-2026-003',
    userId: 'user-staff-03',
    fullName: 'Marcus Brody',
    email: 'marcus.brody@sathi.io',
    phone: '+1 (555) 017-3341',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    department: 'FINANCE_AND_ESCROW',
    designation: 'Lead Escrow Arbitrator',
    assignedRole: 'ADMIN',
    customPermissions: ['escrow:release', 'escrow:refund'],
    shiftStatus: 'ON_CALL',
    is2FAEnforced: true,
    mfaEnabled: false,
    lastLoginAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    lastLoginIp: '172.16.0.45',
    status: 'ACTIVE',
    joinedDate: '2026-03-10',
  },
  {
    id: 'stf-004',
    employeeId: 'EMP-2026-004',
    userId: 'user-staff-04',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@sathi.io',
    phone: '+1 (555) 016-8820',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    department: 'VERIFICATION_KYC',
    designation: 'KYC Document Specialist',
    assignedRole: 'VERIFICATION_TEAM',
    customPermissions: [],
    shiftStatus: 'OFF_DUTY',
    is2FAEnforced: true,
    mfaEnabled: true,
    lastLoginAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    lastLoginIp: '192.168.2.18',
    status: 'ACTIVE',
    joinedDate: '2026-04-12',
  },
];

const INITIAL_AUDIT_LOGS: SecurityAuditRecord[] = [
  {
    id: 'log-sec-101',
    staffId: 'stf-001',
    staffName: 'Alexander Vance',
    staffEmail: 'alexander.vance@sathi.io',
    action: 'PERMISSION_MATRIX_UPDATED',
    resource: 'Role#MODERATOR',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    riskLevel: 'MEDIUM',
    isAuthorized: true,
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'log-sec-102',
    staffId: 'stf-002',
    staffName: 'Priya Sharma',
    staffEmail: 'priya.sharma@sathi.io',
    action: 'EMERGENCY_SOS_DISPATCHED',
    resource: 'SosAlert#SOS-2026-9912',
    ipAddress: '10.0.4.12',
    userAgent: 'Sathi ERP Native Guard v2.4',
    riskLevel: 'HIGH',
    isAuthorized: true,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'log-sec-103',
    staffId: 'stf-003',
    staffName: 'Marcus Brody',
    staffEmail: 'marcus.brody@sathi.io',
    action: 'ESCROW_PAYOUT_RELEASED',
    resource: 'Booking#CC-2026-8812',
    ipAddress: '172.16.0.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    riskLevel: 'LOW',
    isAuthorized: true,
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'log-sec-104',
    staffId: 'stf-004',
    staffName: 'Elena Rostova',
    staffEmail: 'elena.rostova@sathi.io',
    action: 'FAILED_PERMISSION_ACCESS_ATTEMPT',
    resource: 'FinancialLedger#TXN-9021',
    ipAddress: '192.168.2.18',
    userAgent: 'Chrome/124.0.0.0',
    riskLevel: 'CRITICAL',
    isAuthorized: false,
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

const INITIAL_ACTIVE_SESSIONS: ActiveStaffSession[] = [
  {
    id: 'sess-1',
    staffId: 'stf-001',
    staffName: 'Alexander Vance',
    device: 'Windows 11 PC (Chrome 125)',
    ipAddress: '192.168.1.104',
    location: 'San Francisco, USA',
    loginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastActiveAt: new Date().toISOString(),
    isCurrentSession: true,
  },
  {
    id: 'sess-2',
    staffId: 'stf-002',
    staffName: 'Priya Sharma',
    device: 'MacBook Pro (Safari 17)',
    ipAddress: '10.0.4.12',
    location: 'New York, USA',
    loginAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    lastActiveAt: new Date(Date.now() - 60000 * 12).toISOString(),
    isCurrentSession: false,
  },
  {
    id: 'sess-3',
    staffId: 'stf-003',
    staffName: 'Marcus Brody',
    device: 'iPad Pro (Mobile Safari)',
    ipAddress: '172.16.0.45',
    location: 'Chicago, USA',
    loginAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    lastActiveAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    isCurrentSession: false,
  },
];

export const useStaffAccessStore = create<StaffAccessStore>()(
  persist(
    (set, get) => ({
      staffList: INITIAL_STAFF_MEMBERS,
      roleDefinitions: INITIAL_ROLE_DEFINITIONS,
      permissionCatalog: PERMISSION_CATALOG,
      auditLogs: INITIAL_AUDIT_LOGS,
      activeSessions: INITIAL_ACTIVE_SESSIONS,
      global2faPolicyEnforced: true,

      addStaffMember: (staffData) => {
        const id = 'stf-' + Date.now();
        const empNum = Math.floor(100 + Math.random() * 900);
        const employeeId = `EMP-2026-${empNum}`;
        const newStaff: StaffMemberRecord = {
          ...staffData,
          id,
          employeeId,
          joinedDate: new Date().toISOString().split('T')[0],
          lastLoginAt: new Date().toISOString(),
        };

        set((state) => ({
          staffList: [newStaff, ...state.staffList],
        }));

        get().logAccessAction({
          staffId: 'stf-001',
          staffName: 'Alexander Vance',
          staffEmail: 'alexander.vance@sathi.io',
          action: 'STAFF_MEMBER_CREATED',
          resource: `Staff#${employeeId}`,
          ipAddress: '192.168.1.104',
          userAgent: 'Mozilla/5.0 ERP Portal',
          riskLevel: 'MEDIUM',
          isAuthorized: true,
        });

        return newStaff;
      },

      updateStaffMember: (id, updates) => {
        set((state) => ({
          staffList: state.staffList.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteStaffMember: (id) => {
        set((state) => ({
          staffList: state.staffList.filter((s) => s.id !== id),
        }));
      },

      toggleStaffStatus: (id, newStatus) => {
        set((state) => ({
          staffList: state.staffList.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
        }));
      },

      updateStaffPermissions: (id, customPermissions) => {
        set((state) => ({
          staffList: state.staffList.map((s) => (s.id === id ? { ...s, customPermissions } : s)),
        }));
      },

      updateRolePermissions: (role, permissionKeys) => {
        set((state) => ({
          roleDefinitions: state.roleDefinitions.map((rd) =>
            rd.role === role ? { ...rd, permissions: permissionKeys } : rd
          ),
        }));

        get().logAccessAction({
          staffId: 'stf-001',
          staffName: 'Alexander Vance',
          staffEmail: 'alexander.vance@sathi.io',
          action: 'ROLE_PERMISSIONS_UPDATED',
          resource: `Role#${role}`,
          ipAddress: '192.168.1.104',
          userAgent: 'Mozilla/5.0 ERP Portal',
          riskLevel: 'HIGH',
          isAuthorized: true,
        });
      },

      createCustomRole: (role, title, description, permissions) => {
        const id = 'rd-' + Date.now();
        const newRole: RoleMatrixDefinition = {
          id,
          role,
          title,
          description,
          permissions,
          isCustom: true,
        };

        set((state) => ({
          roleDefinitions: [...state.roleDefinitions, newRole],
        }));

        return newRole;
      },

      deleteCustomRole: (role) => {
        set((state) => ({
          roleDefinitions: state.roleDefinitions.filter((rd) => rd.role !== role),
        }));
      },

      terminateSession: (sessionId) => {
        set((state) => ({
          activeSessions: state.activeSessions.filter((sess) => sess.id !== sessionId),
        }));
      },

      toggleGlobal2FA: () => {
        set((state) => ({
          global2faPolicyEnforced: !state.global2faPolicyEnforced,
        }));
      },

      logAccessAction: (logData) => {
        const id = 'log-sec-' + Date.now();
        const newLog: SecurityAuditRecord = {
          ...logData,
          id,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs],
        }));

        return newLog;
      },
    }),
    {
      name: 'companion-staff-access-store',
    }
  )
);
