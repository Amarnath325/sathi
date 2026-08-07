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

export const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set) => ({
      isLoggedIn: true, // Default active session for demo
      user: {
        id: 'usr-201',
        name: 'Alex Mercer',
        email: 'alex.mercer@example.com',
        phone: '+1 (415) 892-3011',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        role: 'USER',
      },
      login: (userData) =>
        set((state) => ({
          isLoggedIn: true,
          user: {
            id: userData?.id || 'usr-201',
            name: userData?.name || 'Alex Mercer',
            email: userData?.email || 'alex.mercer@example.com',
            phone: userData?.phone || '+1 (415) 892-3011',
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
