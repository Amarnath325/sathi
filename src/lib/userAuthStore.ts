import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'VERIFIED_COMPANION' | 'ADMIN';
  token?: string;
}

interface UserAuthState {
  isLoggedIn: boolean;
  user: UserSession | null;
  login: (userData?: Partial<UserSession>) => void;
  logout: () => void;
}

export const PRECONFIGURED_ACCOUNTS = [
  {
    email: 'client@sathi.com',
    password: 'password123',
    name: 'Valued Client',
    role: 'USER' as const,
    id: 'usr-client-101',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  },
  {
    email: 'companion@sathi.com',
    password: 'password123',
    name: 'Sophia Chen',
    role: 'VERIFIED_COMPANION' as const,
    id: 'comp-101',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  },
  {
    email: 'admin@sathi.com',
    password: 'admin123',
    name: 'Enterprise Admin',
    role: 'ADMIN' as const,
    id: 'usr-admin-001',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80'
  }
];

export const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (userData) =>
        set((state) => ({
          isLoggedIn: true,
          user: {
            id: userData?.id || 'usr-client-101',
            name: userData?.name || 'Valued Client',
            email: userData?.email || 'client@sathi.com',
            phone: userData?.phone || '+91 9876543210',
            avatar: userData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            role: userData?.role || 'USER',
          },
        })),
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
        }),
    }),
    {
      name: 'sathi-user-auth-session',
    }
  )
);
