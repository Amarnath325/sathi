import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServiceCategory, SubCategoryItem, RiskLevel, BookingDetails, BookingStatus, EscrowStatus, LocationItem, GeofenceZone, PopularVenue, FinancialTransaction, PayoutRecord, PaymentGatewayConfig, PromoCodeItem } from './types';
import { INITIAL_CATEGORIES } from './initialCategories';
import { INITIAL_BOOKINGS } from './initialBookings';
import { INITIAL_LOCATIONS } from './initialLocations';
import { INITIAL_TRANSACTIONS, INITIAL_PAYOUTS, INITIAL_GATEWAYS } from './initialPayments';
import { INITIAL_PROMOS } from './initialPromos';

export interface SystemConfig {
  platformFeePercent: number;
  escrowHoldingFeePercent: number;
  gstTaxPercent: number;
  require2FAForAdmin: boolean;
  autoApproveVerifiedKYC: boolean;
  maxDailyBookingsPerCompanion: number;
  maxBookingHoursPerSession: number;
  emergencySosBroadcastRadiusKm: number;
  maintenanceMode: boolean;
  minAgeLimit: number;
  allowCashOnDelivery: boolean;
  requireKYCBeforeBooking: boolean;
  autoSOSDispatch?: boolean;
  instantChatEnabled?: boolean;
}


interface AdminStore {
  config: SystemConfig;
  promos: PromoCodeItem[];
  categories: ServiceCategory[];
  bookings: BookingDetails[];
  locations: LocationItem[];
  transactions: FinancialTransaction[];
  payouts: PayoutRecord[];
  gateways: PaymentGatewayConfig[];
  suspendedUserIds: string[];

  // Actions
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  addPromoCode: (promo: Omit<PromoCodeItem, 'id' | 'usageCount'>) => PromoCodeItem;
  updatePromoCode: (id: string, updates: Partial<PromoCodeItem>) => void;
  togglePromoCode: (id: string) => void;
  deletePromoCode: (id: string) => void;
  validatePromoCode: (code: string, bookingAmount: number, categoryId?: string) => { isValid: boolean; discountAmount: number; finalAmount: number; error?: string; promo?: PromoCodeItem };


  // Category Actions
  addCategory: (cat: Omit<ServiceCategory, 'id' | 'companionCount' | 'createdAt'>) => void;
  updateCategory: (id: string, cat: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
  toggleCategoryFeatured: (id: string) => void;
  addSubCategory: (categoryId: string, sub: Omit<SubCategoryItem, 'id'>) => void;
  deleteSubCategory: (categoryId: string, subId: string) => void;

  // Booking Actions
  addBooking: (booking: Omit<BookingDetails, 'id' | 'createdAt' | 'bookingNumber'>) => BookingDetails;
  updateBookingStatus: (id: string, status: BookingStatus, escrowStatus?: EscrowStatus) => void;
  releaseEscrow: (id: string) => void;
  refundBooking: (id: string, reason?: string) => void;
  cancelBooking: (id: string, reason?: string) => void;
  updateBookingDetails: (id: string, details: Partial<BookingDetails>) => void;

  // Location Actions
  addLocation: (loc: Omit<LocationItem, 'id' | 'createdAt' | 'updatedAt'>) => LocationItem;
  updateLocation: (id: string, updates: Partial<LocationItem>) => void;
  deleteLocation: (id: string) => void;
  toggleLocationActive: (id: string) => void;
  updateLocationSurge: (id: string, surgePricingMultiplier: number) => void;
  addGeofenceZone: (locationId: string, zone: Omit<GeofenceZone, 'id'>) => void;
  addPopularVenue: (locationId: string, venue: Omit<PopularVenue, 'id'>) => void;

  // Payment & Finance Actions
  addTransaction: (txn: Omit<FinancialTransaction, 'id' | 'createdAt' | 'transactionRef'>) => FinancialTransaction;
  processPayout: (companionId: string, companionName: string, bankName: string, accountNumberMasked: string, amount: number) => PayoutRecord;
  processRefund: (transactionId: string, reason?: string) => void;
  toggleGateway: (gatewayId: string) => void;
  updateGatewayConfig: (gatewayId: string, updates: Partial<PaymentGatewayConfig>) => void;

  toggleUserSuspension: (userId: string) => void;
}



export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      config: {
        platformFeePercent: 10,
        escrowHoldingFeePercent: 5,
        gstTaxPercent: 8,
        require2FAForAdmin: true,
        autoApproveVerifiedKYC: true,
        maxDailyBookingsPerCompanion: 3,
        maxBookingHoursPerSession: 12,
        emergencySosBroadcastRadiusKm: 5,
        maintenanceMode: false,
        minAgeLimit: 18,
        allowCashOnDelivery: false,
        requireKYCBeforeBooking: true,
        autoSOSDispatch: true,
        instantChatEnabled: true,
      },

      promos: INITIAL_PROMOS,
      categories: INITIAL_CATEGORIES,
      bookings: INITIAL_BOOKINGS,
      locations: INITIAL_LOCATIONS,
      transactions: INITIAL_TRANSACTIONS,
      payouts: INITIAL_PAYOUTS,
      gateways: INITIAL_GATEWAYS,
      suspendedUserIds: [],

      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig }
        })),

      addPromoCode: (promo) => {
        const newPromo: PromoCodeItem = {
          ...promo,
          id: 'p-' + Date.now(),
          usageCount: 0,
          createdAt: new Date().toISOString()
        };
        set((state) => ({ promos: [newPromo, ...state.promos] }));
        return newPromo;
      },

      updatePromoCode: (id, updates) =>
        set((state) => ({
          promos: state.promos.map((p) => (p.id === id ? { ...p, ...updates } : p))
        })),

      togglePromoCode: (id) =>
        set((state) => ({
          promos: state.promos.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
        })),

      deletePromoCode: (id) =>
        set((state) => ({
          promos: state.promos.filter((p) => p.id !== id)
        })),

      validatePromoCode: (code, bookingAmount, categoryId) => {
        const currentPromos = get().promos;

        const found = currentPromos.find(p => p.code.toUpperCase() === code.trim().toUpperCase());

        if (!found) {
          return { isValid: false, discountAmount: 0, finalAmount: bookingAmount, error: 'Invalid coupon code' };
        }

        if (!found.isActive) {
          return { isValid: false, discountAmount: 0, finalAmount: bookingAmount, error: 'This promo code is currently inactive' };
        }

        const today = new Date().toISOString().split('T')[0];
        if (found.expiryDate && found.expiryDate < today) {
          return { isValid: false, discountAmount: 0, finalAmount: bookingAmount, error: 'This coupon code has expired' };
        }

        if (found.usageLimit && found.usageCount >= found.usageLimit) {
          return { isValid: false, discountAmount: 0, finalAmount: bookingAmount, error: 'Coupon usage limit reached' };
        }

        if (bookingAmount < found.minBookingAmount) {
          return { isValid: false, discountAmount: 0, finalAmount: bookingAmount, error: `Minimum booking amount of $${found.minBookingAmount} required for this coupon` };
        }

        let discount = 0;
        if (found.discountType === 'PERCENTAGE' || found.discountPercent) {
          const pct = found.discountValue || found.discountPercent || 0;
          discount = (bookingAmount * pct) / 100;
          if (found.maxDiscountLimit && discount > found.maxDiscountLimit) {
            discount = found.maxDiscountLimit;
          }
        } else {
          discount = found.discountValue || found.flatDiscount || 0;
        }

        discount = Math.min(discount, bookingAmount);
        const finalAmount = Math.max(0, bookingAmount - discount);

        return {
          isValid: true,
          discountAmount: Math.round(discount),
          finalAmount: Math.round(finalAmount),
          promo: found
        };
      },


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

      addBooking: (booking) => {
        const id = 'bk-' + Date.now();
        const bookingNumber = 'CC-2026-' + Math.floor(1000 + Math.random() * 9000);
        const createdAt = new Date().toISOString();
        const newBooking: BookingDetails = {
          ...booking,
          id,
          bookingNumber,
          createdAt,
          updatedAt: createdAt
        };
        set((state) => ({
          bookings: [newBooking, ...state.bookings]
        }));
        return newBooking;
      },

      updateBookingStatus: (id, status, escrowStatus) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id || b.bookingNumber === id
              ? {
                  ...b,
                  status,
                  ...(escrowStatus ? { escrowStatus } : {}),
                  updatedAt: new Date().toISOString()
                }
              : b
          )
        })),

      releaseEscrow: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id || b.bookingNumber === id
              ? {
                  ...b,
                  status: 'COMPLETED',
                  escrowStatus: 'RELEASED_TO_COMPANION',
                  updatedAt: new Date().toISOString()
                }
              : b
          )
        })),

      refundBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id || b.bookingNumber === id
              ? {
                  ...b,
                  status: 'CANCELLED',
                  escrowStatus: 'REFUNDED_TO_USER',
                  updatedAt: new Date().toISOString()
                }
              : b
          )
        })),

      cancelBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id || b.bookingNumber === id
              ? {
                  ...b,
                  status: 'CANCELLED',
                  escrowStatus: 'REFUNDED_TO_USER',
                  updatedAt: new Date().toISOString()
                }
              : b
          )
        })),

      updateBookingDetails: (id, details) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id || b.bookingNumber === id
              ? { ...b, ...details, updatedAt: new Date().toISOString() }
              : b
          )
        })),

      // Location Action Implementations
      addLocation: (loc) => {
        const id = 'loc-' + Date.now();
        const createdAt = new Date().toISOString();
        const newLoc: LocationItem = {
          ...loc,
          id,
          createdAt,
          updatedAt: createdAt
        };
        set((state) => ({
          locations: [newLoc, ...state.locations]
        }));
        return newLoc;
      },

      updateLocation: (id, updates) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...updates, updatedAt: new Date().toISOString() } : loc
          )
        })),

      deleteLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id)
        })),

      toggleLocationActive: (id) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, isActive: !loc.isActive, updatedAt: new Date().toISOString() } : loc
          )
        })),

      updateLocationSurge: (id, surgePricingMultiplier) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, surgePricingMultiplier, updatedAt: new Date().toISOString() } : loc
          )
        })),

      addGeofenceZone: (locationId, zone) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === locationId
              ? {
                  ...loc,
                  geofencedZones: [...loc.geofencedZones, { ...zone, id: 'gz-' + Date.now() }],
                  updatedAt: new Date().toISOString()
                }
              : loc
          )
        })),

      addPopularVenue: (locationId, venue) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === locationId
              ? {
                  ...loc,
                  popularVenues: [...loc.popularVenues, { ...venue, id: 'pv-' + Date.now() }],
                  updatedAt: new Date().toISOString()
                }
              : loc
          )
        })),

      addTransaction: (txn) => {
        const newTxn: FinancialTransaction = {
          ...txn,
          id: 'txn-' + Date.now(),
          transactionRef: 'TXN-2026-' + Math.floor(1000 + Math.random() * 9000),
          createdAt: new Date().toISOString()
        };
        set((state) => ({ transactions: [newTxn, ...state.transactions] }));
        return newTxn;
      },

      processPayout: (companionId, companionName, bankName, accountNumberMasked, amount) => {
        const newPayout: PayoutRecord = {
          id: 'po-' + Date.now(),
          payoutRef: 'PO-2026-' + Math.floor(1000 + Math.random() * 9000),
          companionId,
          companionName,
          bankName,
          accountNumberMasked,
          amount,
          status: 'PAID',
          processedAt: new Date().toISOString()
        };
        set((state) => ({ payouts: [newPayout, ...state.payouts] }));
        return newPayout;
      },

      processRefund: (transactionId, reason) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transactionId
              ? { ...t, status: 'REFUNDED', notes: reason ? `${t.notes || ''} | Refunded: ${reason}` : t.notes }
              : t
          )
        })),

      toggleGateway: (gatewayId) =>
        set((state) => ({
          gateways: state.gateways.map((g) =>
            g.id === gatewayId ? { ...g, isEnabled: !g.isEnabled } : g
          )
        })),

      updateGatewayConfig: (gatewayId, updates) =>
        set((state) => ({
          gateways: state.gateways.map((g) =>
            g.id === gatewayId ? { ...g, ...updates } : g
          )
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
