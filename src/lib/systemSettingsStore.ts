import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SettingCategory = 'GENERAL' | 'FINANCE' | 'COMMUNICATION' | 'STORAGE' | 'MAINTENANCE' | 'SECURITY';

export interface GeneralSettings {
  appName: string;
  supportEmail: string;
  defaultCurrency: 'USD' | 'INR' | 'EUR' | 'GBP';
  timezone: string;
  logoUrl: string;
  termsUrl: string;
  privacyUrl: string;
}

export interface FinanceSettings {
  commissionRatePercent: number;
  minPayoutThresholdUsd: number;
  cancellationFeePercent: number;
  taxRegistrationNumber: string;
  escrowHoldDays: number;
  autoPayoutEnabled: boolean;
}

export interface CommunicationSettings {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioSenderPhone: string;
  sendgridSmtpHost: string;
  sendgridSmtpPort: number;
  sendgridSenderEmail: string;
  firebaseFcmKey: string;
  webhookSecretKey: string;
}

export interface StorageSettings {
  storageProvider: 'AWS_S3' | 'CLOUDFLARE_R2' | 'LOCAL_FS';
  s3BucketName: string;
  s3Region: string;
  cdnEndpointUrl: string;
  dailyBackupSchedule: string;
  backupRetentionDays: number;
}

export interface MaintenanceSettings {
  isMaintenanceActive: boolean;
  outageMessage: string;
  affectedServices: string[];
  scheduledStart: string | null;
  scheduledEnd: string | null;
}

export interface SecuritySettings {
  corsOrigins: string[];
  rateLimitRequestsPerMin: number;
  encryptionSalt: string;
  jwtExpiryHours: number;
}

interface SystemSettingsStore {
  // Config Categories
  general: GeneralSettings;
  finance: FinanceSettings;
  communication: CommunicationSettings;
  storage: StorageSettings;
  maintenance: MaintenanceSettings;
  security: SecuritySettings;

  // Actions
  updateGeneralSettings: (updates: Partial<GeneralSettings>) => void;
  updateFinanceSettings: (updates: Partial<FinanceSettings>) => void;
  updateCommunicationSettings: (updates: Partial<CommunicationSettings>) => void;
  updateStorageSettings: (updates: Partial<StorageSettings>) => void;
  updateMaintenanceSettings: (updates: Partial<MaintenanceSettings>) => void;
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => void;

  toggleMaintenanceMode: () => void;
  testProviderConnection: (provider: 'TWILIO' | 'SENDGRID' | 'AWS_S3') => Promise<{ success: boolean; message: string }>;
  resetCategoryDefaults: (category: SettingCategory) => void;
}

const INITIAL_GENERAL: GeneralSettings = {
  appName: 'Sathi ERP — Enterprise Companion Platform',
  supportEmail: 'support@sathi.io',
  defaultCurrency: 'USD',
  timezone: 'America/Los_Angeles (UTC-7)',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
  termsUrl: 'https://sathi.io/terms',
  privacyUrl: 'https://sathi.io/privacy',
};

const INITIAL_FINANCE: FinanceSettings = {
  commissionRatePercent: 12.5,
  minPayoutThresholdUsd: 50.0,
  cancellationFeePercent: 5.0,
  taxRegistrationNumber: 'EIN-99-4012901',
  escrowHoldDays: 3,
  autoPayoutEnabled: true,
};

const INITIAL_COMMUNICATION: CommunicationSettings = {
  twilioAccountSid: 'AC_live_90184499120481239123',
  twilioAuthToken: '••••••••••••••••••••••••••••••••',
  twilioSenderPhone: '+1 (800) 555-0199',
  sendgridSmtpHost: 'smtp.sendgrid.net',
  sendgridSmtpPort: 587,
  sendgridSenderEmail: 'noreply@sathi.io',
  firebaseFcmKey: 'AAAA_live_fcm_key_99014120912',
  webhookSecretKey: 'whsec_9910481290148123',
};

const INITIAL_STORAGE: StorageSettings = {
  storageProvider: 'AWS_S3',
  s3BucketName: 'sathi-production-us-west-2',
  s3Region: 'us-west-2',
  cdnEndpointUrl: 'https://cdn.sathi.io',
  dailyBackupSchedule: '0 2 * * * (2:00 AM UTC)',
  backupRetentionDays: 90,
};

const INITIAL_MAINTENANCE: MaintenanceSettings = {
  isMaintenanceActive: false,
  outageMessage: '⚠️ Sathi ERP system undergoing scheduled database maintenance. Emergency SOS remains operational.',
  affectedServices: ['COMPANION_SEARCH', 'REVIEWS_API'],
  scheduledStart: null,
  scheduledEnd: null,
};

const INITIAL_SECURITY: SecuritySettings = {
  corsOrigins: ['https://sathi.io', 'https://admin.sathi.io', 'http://localhost:3000'],
  rateLimitRequestsPerMin: 600,
  encryptionSalt: 'sal_live_990141209128',
  jwtExpiryHours: 24,
};

export const useSystemSettingsStore = create<SystemSettingsStore>()(
  persist(
    (set, get) => ({
      general: INITIAL_GENERAL,
      finance: INITIAL_FINANCE,
      communication: INITIAL_COMMUNICATION,
      storage: INITIAL_STORAGE,
      maintenance: INITIAL_MAINTENANCE,
      security: INITIAL_SECURITY,

      updateGeneralSettings: (updates) =>
        set((state) => ({ general: { ...state.general, ...updates } })),

      updateFinanceSettings: (updates) =>
        set((state) => ({ finance: { ...state.finance, ...updates } })),

      updateCommunicationSettings: (updates) =>
        set((state) => ({ communication: { ...state.communication, ...updates } })),

      updateStorageSettings: (updates) =>
        set((state) => ({ storage: { ...state.storage, ...updates } })),

      updateMaintenanceSettings: (updates) =>
        set((state) => ({ maintenance: { ...state.maintenance, ...updates } })),

      updateSecuritySettings: (updates) =>
        set((state) => ({ security: { ...state.security, ...updates } })),

      toggleMaintenanceMode: () =>
        set((state) => ({
          maintenance: {
            ...state.maintenance,
            isMaintenanceActive: !state.maintenance.isMaintenanceActive,
          },
        })),

      testProviderConnection: async (provider) => {
        // Simulate live API test handshake
        await new Promise((res) => setTimeout(res, 800));
        return {
          success: true,
          message: `🟢 Connection to ${provider} API endpoints verified successfully! Response latency: 42ms.`,
        };
      },

      resetCategoryDefaults: (category) => {
        if (category === 'GENERAL') set({ general: INITIAL_GENERAL });
        if (category === 'FINANCE') set({ finance: INITIAL_FINANCE });
        if (category === 'COMMUNICATION') set({ communication: INITIAL_COMMUNICATION });
        if (category === 'STORAGE') set({ storage: INITIAL_STORAGE });
        if (category === 'MAINTENANCE') set({ maintenance: INITIAL_MAINTENANCE });
        if (category === 'SECURITY') set({ security: INITIAL_SECURITY });
      },
    }),
    {
      name: 'companion-system-settings-store',
    }
  )
);
