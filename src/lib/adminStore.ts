'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SystemConfig {
  platformFeePercent: number;
  escrowHoldingFeePercent: number;
  gstTaxPercent: number;
  require2FAForAdmin: boolean;
  requireKYCBeforeBooking: boolean;
  autoSOSDispatch: boolean;
  instantChatEnabled: boolean;
  maintenanceMode: boolean;
}

export interface PromoCodeItem {
  id: string;
  code: string;
  discountPercent: number;
  flatDiscount: number;
  expiryDate: string;
  usageCount: number;
  isActive: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isActive: boolean;
}

interface AdminStore {
  config: SystemConfig;
  promos: PromoCodeItem[];
  categories: CategoryItem[];
  suspendedUserIds: string[];
  
  // Actions
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  addPromoCode: (promo: Omit<PromoCodeItem, 'id' | 'usageCount'>) => void;
  togglePromoCode: (id: string) => void;
  deletePromoCode: (id: string) => void;
  addCategory: (cat: Omit<CategoryItem, 'id'>) => void;
  toggleCategory: (id: string) => void;
  toggleUserSuspension: (userId: string) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      config: {
        platformFeePercent: 10,
        escrowHoldingFeePercent: 5,
        gstTaxPercent: 8,
        require2FAForAdmin: true,
        requireKYCBeforeBooking: true,
        autoSOSDispatch: true,
        instantChatEnabled: true,
        maintenanceMode: false,
      },
      promos: [
        { id: 'p-1', code: 'WELCOME10', discountPercent: 10, flatDiscount: 0, expiryDate: '2026-12-31', usageCount: 1420, isActive: true },
        { id: 'p-2', code: 'SAFETYFIRST', discountPercent: 0, flatDiscount: 20, expiryDate: '2026-10-15', usageCount: 890, isActive: true },
        { id: 'p-3', code: 'VIP2026', discountPercent: 15, flatDiscount: 0, expiryDate: '2026-11-30', usageCount: 310, isActive: true },
      ],
      categories: [
        { id: 'c-1', name: 'Event Companion', description: 'Gala, Corporate & Weddings', iconName: 'Users', isActive: true },
        { id: 'c-2', name: 'Travel & City Guide', description: 'Explore cities safely', iconName: 'Compass', isActive: true },
        { id: 'c-3', name: 'Elderly Assistance', description: 'Gentle companionship & care', iconName: 'Heart', isActive: true },
        { id: 'c-4', name: 'Study & Work Buddy', description: 'Productivity & focus', iconName: 'BookOpen', isActive: true },
        { id: 'c-5', name: 'Fitness & Sports', description: 'Gym, Running & Yoga', iconName: 'Activity', isActive: true },
        { id: 'c-6', name: 'Gaming & Esport', description: 'Co-op online gaming', iconName: 'Gamepad', isActive: true },
      ],
      suspendedUserIds: [],

      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig }
        })),

      addPromoCode: (promo) =>
        set((state) => ({
          promos: [
            ...state.promos,
            { ...promo, id: 'p-' + Date.now(), usageCount: 0 }
          ]
        })),

      togglePromoCode: (id) =>
        set((state) => ({
          promos: state.promos.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
        })),

      deletePromoCode: (id) =>
        set((state) => ({
          promos: state.promos.filter((p) => p.id !== id)
        })),

      addCategory: (cat) =>
        set((state) => ({
          categories: [...state.categories, { ...cat, id: 'c-' + Date.now() }]
        })),

      toggleCategory: (id) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
        })),

      toggleUserSuspension: (userId) =>
        set((state) => ({
          suspendedUserIds: state.suspendedUserIds.includes(userId)
            ? state.suspendedUserIds.filter((id) => id !== userId)
            : [...state.suspendedUserIds, userId]
        }))
    }),
    {
      name: 'companion-admin-dynamic-store'
    }
  )
);
