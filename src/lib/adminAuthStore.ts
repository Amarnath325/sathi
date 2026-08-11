import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminAccount {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'SECURITY_ADMIN' | 'COMPLIANCE_ADMIN';
  secretAccessKey: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLoginAt?: string;
  createdAt: string;
}

interface AdminAuthStoreState {
  adminsTable: AdminAccount[];
  globalSecretGatewayKey: string;
  verifyAdminAccount: (email: string, password: string, secretKey?: string) => { success: boolean; admin?: AdminAccount; message: string };
  addAdminAccount: (admin: Omit<AdminAccount, 'id' | 'createdAt'>) => void;
  updateGlobalSecretGatewayKey: (newKey: string) => void;
}

const INITIAL_ADMINS_TABLE: AdminAccount[] = [
  {
    id: 'super-admin-001',
    fullName: 'Super Admin Core',
    email: 'superadmin@sathi.com',
    passwordHash: 'Admin@123456',
    role: 'SUPER_ADMIN',
    secretAccessKey: 'SATHI_SECURE_SUPERADMIN_KEY_2026',
    status: 'ACTIVE',
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-01-01'
  },
  {
    id: 'admin-002',
    fullName: 'Executive Platform Admin',
    email: 'admin@sathi.com',
    passwordHash: 'Admin@123456',
    role: 'SUPER_ADMIN',
    secretAccessKey: 'SATHI_SECURE_SUPERADMIN_KEY_2026',
    status: 'ACTIVE',
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-01-10'
  },
  {
    id: 'sec-admin-003',
    fullName: 'Security Operations Head',
    email: 'security@sathi.com',
    passwordHash: 'Security@2026',
    role: 'SECURITY_ADMIN',
    secretAccessKey: 'SATHI_SECURE_SUPERADMIN_KEY_2026',
    status: 'ACTIVE',
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-02-01'
  }
];

export const useAdminAuthStore = create<AdminAuthStoreState>()(
  persist(
    (set, get) => ({
      adminsTable: INITIAL_ADMINS_TABLE,
      globalSecretGatewayKey: 'SATHI_SECURE_SUPERADMIN_KEY_2026',

      verifyAdminAccount: (email: string, password: string, secretKey?: string) => {
        const cleanEmail = email.trim().toLowerCase();
        const store = get();

        // 1. Secret Gateway URL Protection Check
        if (secretKey && secretKey !== store.globalSecretGatewayKey) {
          return { success: false, message: 'Invalid Gateway Access Key. Access Denied.' };
        }

        // 2. Query dedicated admins table
        const targetAdmin = store.adminsTable.find(
          (a) => a.email.toLowerCase() === cleanEmail && a.status === 'ACTIVE'
        );

        if (!targetAdmin) {
          return { success: false, message: 'Admin account not found in dedicated Admins directory.' };
        }

        if (targetAdmin.passwordHash !== password) {
          return { success: false, message: 'Incorrect Admin Security Password.' };
        }

        // Update last login timestamp
        set((state) => ({
          adminsTable: state.adminsTable.map((a) =>
            a.id === targetAdmin.id ? { ...a, lastLoginAt: new Date().toISOString() } : a
          )
        }));

        return {
          success: true,
          admin: targetAdmin,
          message: 'Super Admin Authentication Successful. Welcome to Command Center.'
        };
      },

      addAdminAccount: (newAdminData) =>
        set((state) => ({
          adminsTable: [
            ...state.adminsTable,
            {
              ...newAdminData,
              id: `admin-${Date.now()}`,
              createdAt: new Date().toISOString().split('T')[0]
            }
          ]
        })),

      updateGlobalSecretGatewayKey: (newKey: string) =>
        set({ globalSecretGatewayKey: newKey })
    }),
    {
      name: 'sathi-dedicated-admins-table'
    }
  )
);
