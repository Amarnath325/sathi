'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'CUSTOMER' | 'VERIFIED_COMPANION' | 'ADMIN' | 'GUEST';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'RESTRICTED' | 'SUSPENDED' | 'BANNED';
export type UserRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DetailedUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  riskLevel: UserRiskLevel;
  riskScore: number;
  city: string;
  country: string;
  joinedDate: string;
  hourlyRate?: number;
  ratingAvg?: number;
  completedBookings?: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  walletBalance: number;
  avatar: string;
  bio?: string;
  isDeleted?: boolean;
}

interface UserStoreState {
  users: DetailedUserRecord[];
  isLoading: boolean;

  // Actions
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<DetailedUserRecord, 'id' | 'joinedDate'> & { id?: string }) => DetailedUserRecord;
  updateUser: (id: string, updates: Partial<DetailedUserRecord>) => void;
  deleteUser: (id: string) => void;
  setUserStatus: (id: string, status: UserStatus) => void;
  setUserRole: (id: string, role: UserRole) => void;
  importUsersFromCSV: (rows: Partial<DetailedUserRecord>[]) => void;
  clearAllUsers: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      // Empty by default — NO fake companion data
      users: [],
      isLoading: false,

      fetchUsers: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/admin/users?limit=100');
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            const formatted: DetailedUserRecord[] = data.data.map((u: any) => ({
              id: u.id,
              name: u.fullName || 'Platform User',
              email: u.email || '',
              phone: u.phone || '',
              role: (u.role as UserRole) || 'CUSTOMER',
              status: (u.accountFrozen ? 'SUSPENDED' : u.status || 'ACTIVE') as UserStatus,
              riskLevel: (u.riskLevel as UserRiskLevel) || 'LOW',
              riskScore: u.riskScore || 0.05,
              city: u.profile?.city || 'Mumbai',
              country: u.profile?.country || 'India',
              joinedDate: (u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString()).split('T')[0],
              hourlyRate: u.profile?.hourlyRate || 0,
              ratingAvg: u.profile?.ratingAvg || 5.0,
              completedBookings: u.profile?.completedBookings || 0,
              isEmailVerified: Boolean(u.isEmailVerified),
              isPhoneVerified: Boolean(u.isPhoneVerified),
              walletBalance: u.wallet?.balance || 0,
              avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
              bio: u.profile?.bio || '',
              isDeleted: Boolean(u.isDeleted)
            }));
            set({ users: formatted });
          }
        } catch (err) {
          console.warn('Failed to fetch users from /api/admin/users:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      addUser: (item) => {
        const id = item.id || `usr-${Date.now()}`;
        const newUser: DetailedUserRecord = {
          ...item,
          id,
          joinedDate: new Date().toISOString().split('T')[0],
          isDeleted: false
        };

        // Persist to DB asynchronously
        try {
          if (typeof window !== 'undefined') {
            fetch('/api/admin/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                city: newUser.city,
                country: newUser.country,
                hourlyRate: newUser.hourlyRate
              })
            }).catch(e => console.warn('DB user push warning:', e));
          }
        } catch (e) {
          console.warn('Failed to call /api/admin/users:', e);
        }

        set((state) => ({
          users: [newUser, ...state.users.filter(u => u.id !== id)]
        }));

        return newUser;
      },

      updateUser: (id: string, updates: Partial<DetailedUserRecord>) => {
        set((state) => {
          const updatedList = state.users.map((u) =>
            u.id === id ? { ...u, ...updates } : u
          );
          const user = updatedList.find(u => u.id === id);
          if (user && typeof window !== 'undefined') {
            fetch(`/api/admin/users/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName: user.name,
                phone: user.phone,
                role: user.role,
                riskLevel: user.riskLevel,
                accountFrozen: user.status === 'SUSPENDED' || user.status === 'BANNED',
                bio: user.bio,
                city: user.city,
                country: user.country,
                hourlyRate: user.hourlyRate
              })
            }).catch(e => console.warn('User update DB sync warning:', e));
          }
          return { users: updatedList };
        });
      },

      deleteUser: (id: string) => {
        set((state) => ({
          users: state.users.filter(u => u.id !== id)
        }));
        try {
          if (typeof window !== 'undefined') {
            fetch(`/api/admin/users/${id}`, { method: 'DELETE' }).catch(e => console.warn('DB delete warning:', e));
          }
        } catch (e) {
          console.warn('Delete API warning:', e);
        }
      },

      setUserStatus: (id: string, status: UserStatus) => {
        get().updateUser(id, { status });
      },

      setUserRole: (id: string, role: UserRole) => {
        get().updateUser(id, { role });
      },

      importUsersFromCSV: (rows: Partial<DetailedUserRecord>[]) => {
        const newUsers: DetailedUserRecord[] = rows.map((r, idx) => ({
          id: `usr-imp-${Date.now()}-${idx}`,
          name: r.name || 'Imported User',
          email: r.email || `imported.user.${Date.now()}.${idx}@example.com`,
          phone: r.phone || '+1 555-0100',
          role: (r.role as UserRole) || 'CUSTOMER',
          status: (r.status as UserStatus) || 'ACTIVE',
          riskLevel: (r.riskLevel as UserRiskLevel) || 'LOW',
          riskScore: 0.05,
          city: r.city || 'Global',
          country: r.country || 'International',
          joinedDate: new Date().toISOString().split('T')[0],
          isEmailVerified: true,
          isPhoneVerified: false,
          walletBalance: 100,
          avatar: r.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          isDeleted: false
        }));

        set((state) => ({
          users: [...newUsers, ...state.users]
        }));
      },

      clearAllUsers: () => set({ users: [] })
    }),
    {
      name: 'sathi_admin_users_live_v1'
    }
  )
);
