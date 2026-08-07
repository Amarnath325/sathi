import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoleType } from './types';

export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXECUTE' | 'AUTHENTICATE' | 'AUTHORIZE_OVERRIDE' | 'EXPORT';
export type AuditChecksumStatus = 'VALID' | 'CORRUPTED' | 'TAMPERED';
export type AuditDomain =
  | 'FINANCE_AND_ESCROW'
  | 'TRUST_AND_SAFETY'
  | 'STAFF_RBAC'
  | 'SYSTEM_CONFIG'
  | 'USERS'
  | 'BOOKINGS'
  | 'REVIEWS'
  | 'KYC_VERIFICATION';

export interface AuditTrailRecord {
  id: string;
  sequenceNumber: number;
  previousHash: string;
  currentHash: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: RoleType;
  action: AuditAction;
  resourceDomain: AuditDomain;
  resourceId: string;
  payload: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  checksumStatus: AuditChecksumStatus;
  timestamp: string;
}

export interface RetentionPolicyRecord {
  id: string;
  domain: AuditDomain;
  retentionDays: number;
  autoArchive: boolean;
  coldStorageEnabled: boolean;
  complianceStandard: 'SOC2_TYPE_II' | 'HIPAA' | 'GDPR' | 'PCI_DSS';
  updatedAt: string;
}

export interface ComplianceExportJob {
  id: string;
  requestedBy: string;
  domainFilter: string;
  startDate: string;
  endDate: string;
  format: 'CSV' | 'JSON' | 'PDF_REPORT' | 'CRYPTOGRAPHIC_PROOF';
  fileUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

interface AuditLogsStore {
  // State
  auditLogs: AuditTrailRecord[];
  retentionPolicies: RetentionPolicyRecord[];
  exportJobs: ComplianceExportJob[];
  isChainVerified: boolean;
  lastVerificationResult: {
    totalChecked: number;
    validCount: number;
    corruptedCount: number;
    verifiedAt: string;
  } | null;

  // Actions
  appendAuditLog: (logData: Omit<AuditTrailRecord, 'id' | 'sequenceNumber' | 'previousHash' | 'currentHash' | 'checksumStatus' | 'timestamp'>) => AuditTrailRecord;
  verifyChainIntegrity: () => boolean;
  updateRetentionPolicy: (domain: AuditDomain, updates: Partial<RetentionPolicyRecord>) => void;
  createExportJob: (jobData: Omit<ComplianceExportJob, 'id' | 'status' | 'fileUrl' | 'createdAt'>) => ComplianceExportJob;
}

// Simple deterministic hash simulation for SHA-256 chain demo
function computeSHA256(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${hex}${hex}${hex}`.substring(0, 64);
}

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

const INITIAL_LOGS: AuditTrailRecord[] = [
  {
    id: 'aud-101',
    sequenceNumber: 1,
    previousHash: GENESIS_HASH,
    currentHash: computeSHA256('1' + GENESIS_HASH + 'SYSTEM_INIT'),
    actorId: 'stf-001',
    actorName: 'Alexander Vance',
    actorEmail: 'alexander.vance@sathi.io',
    actorRole: 'SUPER_ADMIN',
    action: 'EXECUTE',
    resourceDomain: 'SYSTEM_CONFIG',
    resourceId: 'System#Genesis',
    payload: { event: 'System initialization & cryptographic genesis block created' },
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
    checksumStatus: 'VALID',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'aud-102',
    sequenceNumber: 2,
    previousHash: computeSHA256('1' + GENESIS_HASH + 'SYSTEM_INIT'),
    currentHash: computeSHA256('2' + computeSHA256('1' + GENESIS_HASH + 'SYSTEM_INIT') + 'ESCROW_RELEASE'),
    actorId: 'stf-003',
    actorName: 'Marcus Brody',
    actorEmail: 'marcus.brody@sathi.io',
    actorRole: 'ADMIN',
    action: 'AUTHORIZE_OVERRIDE',
    resourceDomain: 'FINANCE_AND_ESCROW',
    resourceId: 'EscrowPayout#CC-2026-8812',
    payload: { amount: '$1,450.00', companionId: 'cmp-9901', overrideReason: 'Dispute arbitrated in companion favor' },
    ipAddress: '172.16.0.45',
    userAgent: 'Sathi ERP Native Admin v2.4',
    checksumStatus: 'VALID',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'aud-103',
    sequenceNumber: 3,
    previousHash: computeSHA256('2' + computeSHA256('1' + GENESIS_HASH + 'SYSTEM_INIT') + 'ESCROW_RELEASE'),
    currentHash: computeSHA256('3' + computeSHA256('2' + computeSHA256('1' + GENESIS_HASH + 'SYSTEM_INIT') + 'ESCROW_RELEASE') + 'SOS_DISPATCH'),
    actorId: 'stf-002',
    actorName: 'Priya Sharma',
    actorEmail: 'priya.sharma@sathi.io',
    actorRole: 'ADMIN',
    action: 'EXECUTE',
    resourceDomain: 'TRUST_AND_SAFETY',
    resourceId: 'SosIncident#SOS-2026-9912',
    payload: { dispatchUnit: 'LAPD Central Dispatch', responderCode: 'UNIT-404', lat: 34.0522, lng: -118.2437 },
    ipAddress: '10.0.4.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    checksumStatus: 'VALID',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const INITIAL_RETENTION_POLICIES: RetentionPolicyRecord[] = [
  {
    id: 'ret-1',
    domain: 'FINANCE_AND_ESCROW',
    retentionDays: 2555, // 7 years
    autoArchive: true,
    coldStorageEnabled: true,
    complianceStandard: 'SOC2_TYPE_II',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ret-2',
    domain: 'TRUST_AND_SAFETY',
    retentionDays: 1825, // 5 years
    autoArchive: true,
    coldStorageEnabled: true,
    complianceStandard: 'HIPAA',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ret-3',
    domain: 'STAFF_RBAC',
    retentionDays: 1095, // 3 years
    autoArchive: true,
    coldStorageEnabled: false,
    complianceStandard: 'SOC2_TYPE_II',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ret-4',
    domain: 'USERS',
    retentionDays: 365, // 1 year
    autoArchive: true,
    coldStorageEnabled: false,
    complianceStandard: 'GDPR',
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_EXPORT_JOBS: ComplianceExportJob[] = [
  {
    id: 'job-exp-001',
    requestedBy: 'Alexander Vance (CTO)',
    domainFilter: 'FINANCE_AND_ESCROW',
    startDate: '2026-01-01',
    endDate: '2026-08-01',
    format: 'CRYPTOGRAPHIC_PROOF',
    fileUrl: '/exports/audit_proof_2026_08_01.json',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const useAuditLogsStore = create<AuditLogsStore>()(
  persist(
    (set, get) => ({
      auditLogs: INITIAL_LOGS,
      retentionPolicies: INITIAL_RETENTION_POLICIES,
      exportJobs: INITIAL_EXPORT_JOBS,
      isChainVerified: true,
      lastVerificationResult: {
        totalChecked: INITIAL_LOGS.length,
        validCount: INITIAL_LOGS.length,
        corruptedCount: 0,
        verifiedAt: new Date().toISOString(),
      },

      appendAuditLog: (logData) => {
        const { auditLogs } = get();
        const sequenceNumber = auditLogs.length + 1;
        const previousHash = auditLogs.length > 0 ? auditLogs[auditLogs.length - 1].currentHash : GENESIS_HASH;

        const timestamp = new Date().toISOString();
        const rawPayload = JSON.stringify(logData.payload);
        const currentHash = computeSHA256(`${sequenceNumber}${previousHash}${logData.actorId}${logData.action}${logData.resourceId}${rawPayload}`);

        const newLog: AuditTrailRecord = {
          ...logData,
          id: 'aud-' + Date.now(),
          sequenceNumber,
          previousHash,
          currentHash,
          checksumStatus: 'VALID',
          timestamp,
        };

        set((state) => ({
          auditLogs: [...state.auditLogs, newLog],
        }));

        return newLog;
      },

      verifyChainIntegrity: () => {
        const { auditLogs } = get();
        let validCount = 0;
        let corruptedCount = 0;

        for (let i = 0; i < auditLogs.length; i++) {
          const entry = auditLogs[i];
          const expectedPrevHash = i === 0 ? GENESIS_HASH : auditLogs[i - 1].currentHash;

          if (entry.previousHash === expectedPrevHash && entry.checksumStatus === 'VALID') {
            validCount++;
          } else {
            corruptedCount++;
          }
        }

        const isVerified = corruptedCount === 0;

        set({
          isChainVerified: isVerified,
          lastVerificationResult: {
            totalChecked: auditLogs.length,
            validCount,
            corruptedCount,
            verifiedAt: new Date().toISOString(),
          },
        });

        return isVerified;
      },

      updateRetentionPolicy: (domain, updates) => {
        set((state) => ({
          retentionPolicies: state.retentionPolicies.map((rp) =>
            rp.domain === domain ? { ...rp, ...updates, updatedAt: new Date().toISOString() } : rp
          ),
        }));
      },

      createExportJob: (jobData) => {
        const id = 'job-exp-' + Date.now();
        const newJob: ComplianceExportJob = {
          ...jobData,
          id,
          fileUrl: `/exports/audit_${jobData.format.toLowerCase()}_${Date.now()}.${
            jobData.format === 'JSON' || jobData.format === 'CRYPTOGRAPHIC_PROOF' ? 'json' : jobData.format === 'CSV' ? 'csv' : 'pdf'
          }`,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          exportJobs: [newJob, ...state.exportJobs],
        }));

        return newJob;
      },
    }),
    {
      name: 'companion-audit-logs-store',
    }
  )
);
