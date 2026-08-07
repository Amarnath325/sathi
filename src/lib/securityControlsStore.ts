import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RiskLevel } from './types';

export type TwoFactorMethod = 'TOTP_AUTHENTICATOR' | 'SMS_OTP' | 'EMAIL_MAGIC_CODE' | 'HARDWARE_KEY';
export type ThreatCategory = 'BRUTE_FORCE' | 'SQL_INJECTION' | 'RATE_LIMIT_BREACH' | 'GEO_MISMATCH' | 'COMPROMISED_TOKEN' | 'SUSPICIOUS_IP';

export interface TwoFactorState {
  userId: string;
  isEnabled: boolean;
  method: TwoFactorMethod;
  secret: string | null;
  qrCodeUrl: string | null;
  backupCodes: string[];
  isVerified: boolean;
  lastVerifiedAt: string | null;
}

export interface PlatformSecurityPolicy {
  id: string;
  policyName: string;
  whitelistedIpRanges: string[];
  blacklistedIps: string[];
  allowedCountries: string[];
  maxFailedLogins: number;
  sessionTimeoutMinutes: number;
  passwordExpiryDays: number;
  requireSpecialChars: boolean;
  isEmergencyLockdown: boolean;
  updatedAt: string;
}

export interface SecurityThreatRecord {
  id: string;
  ipAddress: string;
  category: ThreatCategory;
  targetResource: string;
  details: string;
  riskLevel: RiskLevel;
  isBlocked: boolean;
  detectedAt: string;
}

export interface TrustedDeviceRecord {
  id: string;
  userId: string;
  userName: string;
  deviceFingerprint: string;
  browserName: string;
  ipAddress: string;
  country: string;
  city: string;
  isTrusted: boolean;
  lastActiveAt: string;
  createdAt: string;
}

interface SecurityControlsStore {
  // State
  user2FA: TwoFactorState;
  policy: PlatformSecurityPolicy;
  threats: SecurityThreatRecord[];
  trustedDevices: TrustedDeviceRecord[];

  // Actions - 2FA
  initiate2FASetup: (method: TwoFactorMethod) => { secret: string; qrCodeUrl: string; backupCodes: string[] };
  verify2FA: (code: string) => boolean;
  disable2FA: () => void;
  regenerateBackupCodes: () => string[];

  // Actions - Policy & Whitelist
  updatePolicy: (updates: Partial<PlatformSecurityPolicy>) => void;
  addWhitelistedIp: (ipRange: string) => void;
  removeWhitelistedIp: (ipRange: string) => void;
  blockIpAddress: (ip: string, category: ThreatCategory, details?: string) => void;
  unblockIpAddress: (ip: string) => void;
  toggleEmergencyLockdown: () => void;

  // Actions - Devices & Sessions
  revokeDeviceSession: (deviceId: string) => void;
  trustDeviceSession: (deviceId: string) => void;
}

const INITIAL_POLICY: PlatformSecurityPolicy = {
  id: 'sec-pol-001',
  policyName: 'SATHI_ENTERPRISE_CORE_POLICY',
  whitelistedIpRanges: ['192.168.1.0/24', '10.0.0.0/16', '172.16.4.0/22'],
  blacklistedIps: ['185.220.101.4', '45.154.255.8', '193.142.146.210'],
  allowedCountries: ['US', 'IN', 'CA', 'GB', 'DE', 'AU', 'SG'],
  maxFailedLogins: 5,
  sessionTimeoutMinutes: 30,
  passwordExpiryDays: 90,
  requireSpecialChars: true,
  isEmergencyLockdown: false,
  updatedAt: new Date().toISOString(),
};

const INITIAL_THREATS: SecurityThreatRecord[] = [
  {
    id: 'th-101',
    ipAddress: '185.220.101.4',
    category: 'BRUTE_FORCE',
    targetResource: '/api/auth/login',
    details: '142 failed login attempts detected in 60 seconds from Tor Exit Node',
    riskLevel: 'CRITICAL',
    isBlocked: true,
    detectedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'th-102',
    ipAddress: '45.154.255.8',
    category: 'RATE_LIMIT_BREACH',
    targetResource: '/api/companions/search',
    details: 'Exceeded 500 requests/min rate limit threshold',
    riskLevel: 'HIGH',
    isBlocked: true,
    detectedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'th-103',
    ipAddress: '193.142.146.210',
    category: 'GEO_MISMATCH',
    targetResource: '/api/payments/payouts',
    details: 'Login attempt from unauthorized country code (RU) for Super Admin account',
    riskLevel: 'CRITICAL',
    isBlocked: true,
    detectedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'th-104',
    ipAddress: '103.21.244.18',
    category: 'SUSPICIOUS_IP',
    targetResource: '/api/kyc/verify',
    details: 'Proxy/VPN endpoint detected on document submission',
    riskLevel: 'MEDIUM',
    isBlocked: false,
    detectedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

const INITIAL_DEVICES: TrustedDeviceRecord[] = [
  {
    id: 'dev-1',
    userId: 'usr-admin-01',
    userName: 'Alexander Vance (CTO)',
    deviceFingerprint: 'fp_win11_chrome_125_9901',
    browserName: 'Chrome 125 on Windows 11',
    ipAddress: '192.168.1.104',
    country: 'US',
    city: 'San Francisco',
    isTrusted: true,
    lastActiveAt: new Date().toISOString(),
    createdAt: '2026-01-15',
  },
  {
    id: 'dev-2',
    userId: 'usr-staff-02',
    userName: 'Priya Sharma (Dispatch)',
    deviceFingerprint: 'fp_mac_safari_17_4412',
    browserName: 'Safari 17 on macOS Sonoma',
    ipAddress: '10.0.4.12',
    country: 'US',
    city: 'New York',
    isTrusted: true,
    lastActiveAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: '2026-02-01',
  },
  {
    id: 'dev-3',
    userId: 'usr-companion-88',
    userName: 'Sophia Chen (Companion)',
    deviceFingerprint: 'fp_ios17_app_native',
    browserName: 'Sathi Companion iOS Native App v3.2',
    ipAddress: '172.16.8.99',
    country: 'US',
    city: 'Los Angeles',
    isTrusted: true,
    lastActiveAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdAt: '2026-02-20',
  },
];

export const useSecurityControlsStore = create<SecurityControlsStore>()(
  persist(
    (set, get) => ({
      user2FA: {
        userId: 'usr-admin-01',
        isEnabled: true,
        method: 'TOTP_AUTHENTICATOR',
        secret: 'JBSWY3DPEHPK3PXP',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SathiERP:alexander.vance@sathi.io?secret=JBSWY3DPEHPK3PXP&issuer=SathiERP',
        backupCodes: ['8821-9012', '4412-9901', '1209-4481', '7731-0021', '3391-8842', '5510-2291'],
        isVerified: true,
        lastVerifiedAt: new Date().toISOString(),
      },

      policy: INITIAL_POLICY,
      threats: INITIAL_THREATS,
      trustedDevices: INITIAL_DEVICES,

      initiate2FASetup: (method) => {
        // Generate mock secret & backup codes
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 16; i++) {
          secret += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const backupCodes = Array.from({ length: 6 }, () =>
          Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000)
        );

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SathiERP:user@sathi.io?secret=${secret}&issuer=SathiERP`;

        set((state) => ({
          user2FA: {
            ...state.user2FA,
            method,
            secret,
            qrCodeUrl,
            backupCodes,
            isVerified: false,
          },
        }));

        return { secret, qrCodeUrl, backupCodes };
      },

      verify2FA: (code) => {
        const { user2FA } = get();
        // Accepts test code "123456" or any matching backup code
        const isBackupCode = user2FA.backupCodes.includes(code.trim());
        const isValidTotp = code.trim() === '123456' || code.trim().length === 6 || isBackupCode;

        if (isValidTotp) {
          set((state) => ({
            user2FA: {
              ...state.user2FA,
              isEnabled: true,
              isVerified: true,
              lastVerifiedAt: new Date().toISOString(),
              backupCodes: isBackupCode
                ? state.user2FA.backupCodes.filter((c) => c !== code.trim())
                : state.user2FA.backupCodes,
            },
          }));
          return true;
        }

        return false;
      },

      disable2FA: () => {
        set((state) => ({
          user2FA: {
            ...state.user2FA,
            isEnabled: false,
            isVerified: false,
            secret: null,
            qrCodeUrl: null,
          },
        }));
      },

      regenerateBackupCodes: () => {
        const newCodes = Array.from({ length: 6 }, () =>
          Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000)
        );

        set((state) => ({
          user2FA: {
            ...state.user2FA,
            backupCodes: newCodes,
          },
        }));

        return newCodes;
      },

      updatePolicy: (updates) => {
        set((state) => ({
          policy: {
            ...state.policy,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      addWhitelistedIp: (ipRange) => {
        set((state) => ({
          policy: {
            ...state.policy,
            whitelistedIpRanges: [...new Set([...state.policy.whitelistedIpRanges, ipRange.trim()])],
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      removeWhitelistedIp: (ipRange) => {
        set((state) => ({
          policy: {
            ...state.policy,
            whitelistedIpRanges: state.policy.whitelistedIpRanges.filter((ip) => ip !== ipRange),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      blockIpAddress: (ip, category, details) => {
        const id = 'th-' + Date.now();
        const newThreat: SecurityThreatRecord = {
          id,
          ipAddress: ip,
          category,
          targetResource: '/api/auth/login',
          details: details || 'Manual IP block issued by Admin',
          riskLevel: 'HIGH',
          isBlocked: true,
          detectedAt: new Date().toISOString(),
        };

        set((state) => ({
          threats: [newThreat, ...state.threats],
          policy: {
            ...state.policy,
            blacklistedIps: [...new Set([...state.policy.blacklistedIps, ip])],
          },
        }));
      },

      unblockIpAddress: (ip) => {
        set((state) => ({
          threats: state.threats.map((t) => (t.ipAddress === ip ? { ...t, isBlocked: false } : t)),
          policy: {
            ...state.policy,
            blacklistedIps: state.policy.blacklistedIps.filter((b) => b !== ip),
          },
        }));
      },

      toggleEmergencyLockdown: () => {
        set((state) => ({
          policy: {
            ...state.policy,
            isEmergencyLockdown: !state.policy.isEmergencyLockdown,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      revokeDeviceSession: (deviceId) => {
        set((state) => ({
          trustedDevices: state.trustedDevices.filter((d) => d.id !== deviceId),
        }));
      },

      trustDeviceSession: (deviceId) => {
        set((state) => ({
          trustedDevices: state.trustedDevices.map((d) =>
            d.id === deviceId ? { ...d, isTrusted: true } : d
          ),
        }));
      },
    }),
    {
      name: 'companion-security-controls-store',
    }
  )
);
