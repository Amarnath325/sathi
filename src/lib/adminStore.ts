import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServiceCategory, SubCategoryItem, RiskLevel } from './types';
import { INITIAL_CATEGORIES } from './initialCategories';

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

interface AdminStore {
  config: SystemConfig;
  promos: PromoCodeItem[];
  categories: ServiceCategory[];
  suspendedUserIds: string[];

  // Actions
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  addPromoCode: (promo: Omit<PromoCodeItem, 'id' | 'usageCount'>) => void;
  togglePromoCode: (id: string) => void;
  deletePromoCode: (id: string) => void;

  // Category Actions
  addCategory: (cat: Omit<ServiceCategory, 'id' | 'companionCount' | 'createdAt'>) => void;
  updateCategory: (id: string, cat: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
  toggleCategoryFeatured: (id: string) => void;
  addSubCategory: (categoryId: string, sub: Omit<SubCategoryItem, 'id'>) => void;
  deleteSubCategory: (categoryId: string, subId: string) => void;

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
      categories: INITIAL_CATEGORIES,
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

      // Category Actions
      addCategory: (cat) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              ...cat,
              id: 'c-' + Date.now(),
              slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
              companionCount: 0,
              createdAt: new Date().toISOString().split('T')[0],
              subcategories: cat.subcategories || []
            }
          ]
        })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id)
        })),

      toggleCategory: (id) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
        })),

      toggleCategoryFeatured: (id) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, isFeatured: !c.isFeatured } : c))
        })),

      addSubCategory: (categoryId, sub) =>
        set((state) => ({
          categories: state.categories.map((c) => {
            if (c.id === categoryId) {
              const newSub: SubCategoryItem = { ...sub, id: 'sub-' + Date.now() };
              return { ...c, subcategories: [...(c.subcategories || []), newSub] };
            }
            return c;
          })
        })),

      deleteSubCategory: (categoryId, subId) =>
        set((state) => ({
          categories: state.categories.map((c) => {
            if (c.id === categoryId) {
              return { ...c, subcategories: (c.subcategories || []).filter(s => s.id !== subId) };
            }
            return c;
          })
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
