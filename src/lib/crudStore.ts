'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean; // Soft delete flag
  deletedAt?: string | null;
}

export interface DynamicCompanionItem extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  city: string;
  country: string;
  state?: string;
  pincode?: string;
  age: number;
  gender?: string;
  avatar?: string;
  photos?: string[];
  hourlyRate: number;
  dailyRate?: number;
  weeklyRate?: number;
  ratingAvg: number;
  ratingCount?: number;
  completedBookings?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  category: string;
  categories?: string[];
  skills?: string[];
  languages?: string[];
  bio?: string;
  createdSource?: 'ADMIN' | 'USER_REGISTERED';
  aadhaarNumber?: string;
  kycStatus?: string;
  verificationBadge?: boolean;
  isAvailableNow?: boolean;
  responseTimeMin?: number;
  availability?: Record<string, number[]>;
}


export interface DynamicBookingItem extends BaseEntity {
  bookingRef: string;
  clientName: string;
  companionName: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'ESCROW_LOCKED' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED';
}

export interface DynamicKYCItem extends BaseEntity {
  userId: string;
  name: string;
  email: string;
  docType: string;
  matchScore: number;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DynamicDisputeItem extends BaseEntity {
  bookingRef: string;
  clientName: string;
  companionName: string;
  amount: number;
  reason: string;
  disputeStatus: 'HELD' | 'REFUNDED_100' | 'REFUNDED_50' | 'RELEASED';
}

interface CrudStoreState {
  companions: DynamicCompanionItem[];
  bookings: DynamicBookingItem[];
  kycQueue: DynamicKYCItem[];
  disputes: DynamicDisputeItem[];
  selectedIds: string[];

  // Generic CRUD Actions for Companions
  addCompanion: (item: Omit<DynamicCompanionItem, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isDeleted'>) => void;
  updateCompanion: (id: string, updates: Partial<DynamicCompanionItem>) => void;
  toggleCompanionActive: (id: string) => void;
  softDeleteCompanion: (id: string) => void;
  restoreCompanion: (id: string) => void;
  permanentDeleteCompanion: (id: string) => void;

  // Bulk Actions
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  bulkSoftDeleteCompanions: () => void;
  bulkRestoreCompanions: () => void;
  bulkToggleActiveCompanions: (status: boolean) => void;

  // Import / Export Helpers
  importCompanionsFromCSV: (data: Partial<DynamicCompanionItem>[]) => void;
  exportToCSV: (filename: string, rows: object[]) => void;
  downloadSampleCSV: (filename: string, headers: string[]) => void;
}

export const useCrudStore = create<CrudStoreState>()(
  persist(
    (set, _get) => ({
      companions: [
        { id: 'usr-101', name: 'Sophia Chen', email: 'sophia.c@example.com', city: 'New York', country: 'USA', age: 26, hourlyRate: 75, ratingAvg: 4.95, status: 'ACTIVE', category: 'Event Companion', isActive: true, isDeleted: false, createdAt: '2026-01-15', updatedAt: '2026-08-01' },
        { id: 'usr-102', name: 'Marcus Brody', email: 'marcus.b@example.com', city: 'London', country: 'UK', age: 29, hourlyRate: 85, ratingAvg: 4.88, status: 'ACTIVE', category: 'Travel & City Guide', isActive: true, isDeleted: false, createdAt: '2026-02-10', updatedAt: '2026-08-02' },
        { id: 'usr-103', name: 'Elena Rostova', email: 'elena.r@example.com', city: 'Paris', country: 'France', age: 24, hourlyRate: 90, ratingAvg: 4.98, status: 'ACTIVE', category: 'Fashion & Shopping Partner', isActive: true, isDeleted: false, createdAt: '2026-03-05', updatedAt: '2026-08-03' },
        { id: 'usr-104', name: 'Aarav Sharma', email: 'aarav.s@example.com', city: 'Mumbai', country: 'India', age: 27, hourlyRate: 60, ratingAvg: 4.92, status: 'ACTIVE', category: 'Elderly Assistance', isActive: true, isDeleted: false, createdAt: '2026-04-12', updatedAt: '2026-08-04' }
      ],
      bookings: [
        { id: 'bk-1', bookingRef: 'CC-8812', clientName: 'David K.', companionName: 'Sophia Chen', amount: 240, date: '2026-08-10', status: 'ESCROW_LOCKED', isActive: true, isDeleted: false, createdAt: '2026-08-03', updatedAt: '2026-08-03' },
        { id: 'bk-2', bookingRef: 'CC-8813', clientName: 'Sarah M.', companionName: 'Marcus Brody', amount: 170, date: '2026-08-12', status: 'COMPLETED', isActive: true, isDeleted: false, createdAt: '2026-08-01', updatedAt: '2026-08-02' }
      ],
      kycQueue: [
        { id: 'kyc-1', userId: 'usr-101', name: 'Sophia Chen', email: 'sophia.c@example.com', docType: 'Passport', matchScore: 98.4, verificationStatus: 'PENDING', isActive: true, isDeleted: false, createdAt: '2026-08-04', updatedAt: '2026-08-04' }
      ],
      disputes: [
        { id: 'dsp-1', bookingRef: 'CC-9941', clientName: 'David K.', companionName: 'Elena Rostova', amount: 240, reason: 'Late arrival', disputeStatus: 'HELD', isActive: true, isDeleted: false, createdAt: '2026-08-04', updatedAt: '2026-08-04' }
      ],
      selectedIds: [],

      // Companion Single Actions
      addCompanion: (item: Omit<DynamicCompanionItem, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isDeleted'>) =>
        set((state: CrudStoreState) => ({
          companions: [
            ...state.companions,
            {
              ...item,
              id: 'usr-' + Date.now(),
              createdAt: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString().split('T')[0],
              isActive: true,
              isDeleted: false
            }
          ]
        })),

      updateCompanion: (id: string, updates: Partial<DynamicCompanionItem>) =>
        set((state: CrudStoreState) => ({
          companions: state.companions.map((c: DynamicCompanionItem) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : c
          )
        })),

      toggleCompanionActive: (id: string) =>
        set((state: CrudStoreState) => ({
          companions: state.companions.map((c: DynamicCompanionItem) =>
            c.id === id ? { ...c, isActive: !c.isActive, status: !c.isActive ? 'ACTIVE' : 'INACTIVE' } : c
          )
        })),

      softDeleteCompanion: (id: string) =>
        set((state: CrudStoreState) => ({
          companions: state.companions.map((c: DynamicCompanionItem) =>
            c.id === id ? { ...c, isDeleted: true, deletedAt: new Date().toISOString() } : c
          )
        })),

      restoreCompanion: (id: string) =>
        set((state: CrudStoreState) => ({
          companions: state.companions.map((c: DynamicCompanionItem) =>
            c.id === id ? { ...c, isDeleted: false, deletedAt: null } : c
          )
        })),

      permanentDeleteCompanion: (id: string) =>
        set((state: CrudStoreState) => ({
          companions: state.companions.filter((c: DynamicCompanionItem) => c.id !== id)
        })),

      // Selection & Bulk
      toggleSelection: (id: string) =>
        set((state: CrudStoreState) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((item: string) => item !== id)
            : [...state.selectedIds, id]
        })),

      selectAll: (ids: string[]) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),

      bulkSoftDeleteCompanions: () =>
        set((state: CrudStoreState) => ({
          companions: state.companions.map((c: DynamicCompanionItem) =>
            state.selectedIds.includes(c.id) ? { ...c, isDeleted: true, deletedAt: new Date().toISOString() } : c
          ),
          selectedIds: []
        })),

      bulkRestoreCompanions: () =>
        set((state: CrudStoreState) => ({
          companions: state.companions.map((c: DynamicCompanionItem) =>
            state.selectedIds.includes(c.id) ? { ...c, isDeleted: false, deletedAt: null } : c
          ),
          selectedIds: []
        })),

      bulkToggleActiveCompanions: (status: boolean) =>
        set((state: CrudStoreState) => ({
          companions: state.companions.map((c: DynamicCompanionItem) =>
            state.selectedIds.includes(c.id) ? { ...c, isActive: status, status: status ? 'ACTIVE' : 'INACTIVE' } : c
          ),
          selectedIds: []
        })),

      // Import / Export
      importCompanionsFromCSV: (rows: Partial<DynamicCompanionItem>[]) =>
        set((state: CrudStoreState) => ({
          companions: [
            ...state.companions,
            ...rows.map((row: Partial<DynamicCompanionItem>, idx: number) => ({
              id: 'imp-' + Date.now() + '-' + idx,
              name: row.name || 'Imported User',
              email: row.email || `imported${idx}@example.com`,
              city: row.city || 'Global',
              country: row.country || 'International',
              age: Number(row.age) || 25,
              hourlyRate: Number(row.hourlyRate) || 70,
              ratingAvg: 5.0,
              status: 'ACTIVE' as const,
              category: row.category || 'General Companion',
              isActive: true,
              isDeleted: false,
              createdAt: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString().split('T')[0]
            }))
          ]
        })),

      exportToCSV: (filename: string, rows: object[]) => {
        if (!rows || !rows.length) return;
        const headers = Object.keys(rows[0]).join(',');
        const csvContent =
          'data:text/csv;charset=utf-8,' +
          headers +
          '\n' +
          rows.map((r: object) => Object.values(r).map((v: any) => `"${v}"`).join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

      downloadSampleCSV: (filename: string, headers: string[]) => {
        const sampleRow = headers.map((h: string) => `Sample_${h}`).join(',');
        const csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + sampleRow;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${filename}_sample_template.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }),
    {
      name: 'companion-universal-crud-store'
    }
  )
);
