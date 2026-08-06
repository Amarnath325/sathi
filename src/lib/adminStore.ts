import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServiceCategory, SubCategoryItem, RiskLevel, BookingDetails, BookingStatus, EscrowStatus, LocationItem, GeofenceZone, PopularVenue, FinancialTransaction, PayoutRecord, PaymentGatewayConfig, PromoCodeItem, SosAlertItem, SosAlertStatus, SosAlertSeverity, IncidentReport, IncidentStatus, IncidentCategory, DisciplinaryAction, DisputeTicket, DisputeMessage, DisputeEvidence, DisputeStatus, ResolutionOutcome, Review, ReviewStatus, ReviewSentiment } from './types';
import { INITIAL_CATEGORIES } from './initialCategories';
import { INITIAL_BOOKINGS } from './initialBookings';
import { INITIAL_LOCATIONS } from './initialLocations';
import { INITIAL_TRANSACTIONS, INITIAL_PAYOUTS, INITIAL_GATEWAYS } from './initialPayments';
import { INITIAL_PROMOS } from './initialPromos';
import { INITIAL_SOS_ALERTS, INITIAL_INCIDENT_REPORTS } from './initialSafety';
import { MOCK_DISPUTES, MOCK_REVIEWS } from './mockData';



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
  sosAlerts: SosAlertItem[];
  incidentReports: IncidentReport[];
  disputes: DisputeTicket[];
  reviews: Review[];
  suspendedUserIds: string[];

  // Actions
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  fileDispute: (disputeData: Omit<DisputeTicket, 'id' | 'disputeRef' | 'filedAt' | 'updatedAt' | 'messages' | 'evidence'>) => DisputeTicket;
  addDisputeMessage: (disputeId: string, message: Omit<DisputeMessage, 'id' | 'disputeId' | 'sentAt'>) => void;
  resolveDispute: (disputeId: string, outcome: ResolutionOutcome, refundAmount?: number, penaltyAmount?: number, adminNotes?: string) => void;
  escalateDispute: (disputeId: string, reason: string) => void;

  // Review & Moderation Actions
  submitReview: (reviewData: Omit<Review, 'id' | 'reviewRef' | 'date' | 'sentiment' | 'sentimentScore' | 'status' | 'helpfulVotes'>) => Review;
  approveReview: (id: string, adminNotes?: string) => void;
  flagReview: (id: string, reason: string, flaggedBy?: 'AUTOMATED_PROFANITY_FILTER' | 'COMPANION' | 'COMMUNITY' | 'ADMIN') => void;
  rejectReview: (id: string, reason: string) => void;
  hideReview: (id: string) => void;
  addAdminReviewResponse: (id: string, adminResponse: string) => void;
  deleteReview: (id: string) => void;


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

  // Trust & Safety Actions
  triggerSosAlert: (alert: Omit<SosAlertItem, 'id' | 'alertRef' | 'triggeredAt' | 'status'>) => SosAlertItem;
  resolveSosAlert: (id: string, notes?: string, isFalseAlarm?: boolean) => void;
  dispatchResponders: (id: string, responderName: string, policeRef?: string) => void;
  createIncidentReport: (report: Omit<IncidentReport, 'id' | 'incidentRef' | 'filedAt' | 'status'>) => IncidentReport;
  updateIncidentStatus: (id: string, status: IncidentStatus, adminNotes?: string) => void;
  applySafetyDisciplinaryAction: (id: string, action: DisciplinaryAction, adminNotes?: string) => void;

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
      sosAlerts: INITIAL_SOS_ALERTS,
      incidentReports: INITIAL_INCIDENT_REPORTS,
      disputes: MOCK_DISPUTES,
      reviews: MOCK_REVIEWS,
      suspendedUserIds: [],

      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig }
        })),

      submitReview: (reviewData) => {
        // Automated profanity and spam check
        const text = reviewData.comment.toLowerCase();
        const containsSpam = text.includes('http://') || text.includes('https://') || text.includes('call me') || text.includes('fake') || text.includes('casino');
        const status: ReviewStatus = containsSpam ? 'FLAGGED' : 'PENDING_APPROVAL';
        const sentiment: ReviewSentiment = containsSpam ? 'SUSPICIOUS' : reviewData.rating >= 4 ? 'POSITIVE' : reviewData.rating === 3 ? 'NEUTRAL' : 'NEGATIVE';

        const newReview: Review = {
          ...reviewData,
          id: 'rev-' + Date.now(),
          reviewRef: 'REV-2026-' + Math.floor(1000 + Math.random() * 9000),
          date: new Date().toISOString(),
          helpfulVotes: 0,
          verifiedBooking: reviewData.verifiedBooking ?? true,
          sentimentScore: reviewData.rating / 5,
          sentiment,
          status,
          flaggedReason: containsSpam ? 'Automated spam/link detection rule triggered' : undefined,
          flaggedBy: containsSpam ? 'AUTOMATED_PROFANITY_FILTER' : undefined
        };

        set((state) => ({ reviews: [newReview, ...state.reviews] }));
        return newReview;
      },

      approveReview: (id, adminNotes) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'APPROVED',
                  adminNotes: adminNotes ? `${r.adminNotes || ''} | ${adminNotes}` : r.adminNotes,
                  moderatedAt: new Date().toISOString()
                }
              : r
          )
        })),

      flagReview: (id, reason, flaggedBy = 'ADMIN') =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'FLAGGED',
                  flaggedReason: reason,
                  flaggedBy,
                  sentiment: 'SUSPICIOUS',
                  moderatedAt: new Date().toISOString()
                }
              : r
          )
        })),

      rejectReview: (id, reason) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'REJECTED',
                  adminNotes: reason,
                  moderatedAt: new Date().toISOString()
                }
              : r
          )
        })),

      hideReview: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, status: 'HIDDEN', moderatedAt: new Date().toISOString() } : r
          )
        })),

      addAdminReviewResponse: (id, adminResponse) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, adminResponse, moderatedAt: new Date().toISOString() } : r
          )
        })),

      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id)
        })),


      fileDispute: (disputeData) => {
        const newDispute: DisputeTicket = {
          ...disputeData,
          id: 'disp-' + Date.now(),
          disputeRef: 'DSP-2026-' + Math.floor(1000 + Math.random() * 9000),
          status: 'OPEN_LODGED',
          evidence: [],
          messages: [],
          filedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({ disputes: [newDispute, ...state.disputes] }));
        return newDispute;
      },

      addDisputeMessage: (disputeId, msg) =>
        set((state) => ({
          disputes: state.disputes.map((d) =>
            d.id === disputeId
              ? {
                  ...d,
                  status: d.status === 'OPEN_LODGED' ? 'UNDER_ARBITRATION' : d.status,
                  updatedAt: new Date().toISOString(),
                  messages: [
                    ...d.messages,
                    {
                      ...msg,
                      id: 'msg-d-' + Date.now(),
                      disputeId,
                      sentAt: new Date().toISOString()
                    }
                  ]
                }
              : d
          )
        })),

      resolveDispute: (disputeId, outcome, refundAmount, penaltyAmount, adminNotes) =>
        set((state) => ({
          disputes: state.disputes.map((d) =>
            d.id === disputeId
              ? {
                  ...d,
                  status: outcome === 'FULL_REFUND_CUSTOMER' || outcome === 'PARTIAL_REFUND' ? 'RESOLVED_REFUNDED' : 'RESOLVED_DISMISSED',
                  resolutionOutcome: outcome,
                  refundAmountIssued: refundAmount || 0,
                  penaltyDeducted: penaltyAmount || 0,
                  adminNotes: adminNotes ? `${d.adminNotes || ''} | ${adminNotes}` : d.adminNotes,
                  escrowStatus: outcome === 'FULL_REFUND_CUSTOMER' || outcome === 'PARTIAL_REFUND' ? 'REFUNDED' : 'RELEASED',
                  resolvedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              : d
          )
        })),

      escalateDispute: (disputeId, reason) =>
        set((state) => ({
          disputes: state.disputes.map((d) =>
            d.id === disputeId
              ? {
                  ...d,
                  status: 'ESCALATED_MANAGEMENT',
                  adminNotes: `${d.adminNotes || ''} | Escalated: ${reason}`,
                  updatedAt: new Date().toISOString()
                }
              : d
          )
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

      triggerSosAlert: (alertData) => {
        const newAlert: SosAlertItem = {
          ...alertData,
          id: 'sos-' + Date.now(),
          alertRef: 'SOS-2026-' + Math.floor(1000 + Math.random() * 9000),
          triggeredAt: new Date().toISOString(),
          status: 'ACTIVE_DISPATCH'
        };
        set((state) => ({ sosAlerts: [newAlert, ...state.sosAlerts] }));
        return newAlert;
      },

      resolveSosAlert: (id, notes, isFalseAlarm) =>
        set((state) => ({
          sosAlerts: state.sosAlerts.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: isFalseAlarm ? 'FALSE_ALARM' : 'RESOLVED_SAFE',
                  resolvedAt: new Date().toISOString(),
                  notes: notes ? `${a.notes || ''} | Resolution: ${notes}` : a.notes
                }
              : a
          )
        })),

      dispatchResponders: (id, responderName, policeRef) =>
        set((state) => ({
          sosAlerts: state.sosAlerts.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: policeRef ? 'POLICE_NOTIFIED' : 'RESPONDER_EN_ROUTE',
                  assignedResponder: responderName,
                  policeDispatchRef: policeRef || a.policeDispatchRef
                }
              : a
          )
        })),

      createIncidentReport: (reportData) => {
        const newReport: IncidentReport = {
          ...reportData,
          id: 'inc-' + Date.now(),
          incidentRef: 'INC-2026-' + Math.floor(1000 + Math.random() * 9000),
          filedAt: new Date().toISOString(),
          status: 'PENDING_AUDIT'
        };
        set((state) => ({ incidentReports: [newReport, ...state.incidentReports] }));
        return newReport;
      },

      updateIncidentStatus: (id, status, adminNotes) =>
        set((state) => ({
          incidentReports: state.incidentReports.map((inc) =>
            inc.id === id
              ? {
                  ...inc,
                  status,
                  adminNotes: adminNotes ? `${inc.adminNotes || ''} | ${adminNotes}` : inc.adminNotes,
                  resolvedAt: status === 'RESOLVED' || status === 'ACTION_TAKEN' || status === 'DISMISSED' ? new Date().toISOString() : inc.resolvedAt
                }
              : inc
          )
        })),

      applySafetyDisciplinaryAction: (id, disciplinaryAction, adminNotes) =>
        set((state) => {
          const report = state.incidentReports.find((inc) => inc.id === id);
          let updatedSuspendedUserIds = [...state.suspendedUserIds];
          if (report && (disciplinaryAction === 'TEMPORARY_SUSPENSION' || disciplinaryAction === 'PERMANENT_BAN')) {
            if (!updatedSuspendedUserIds.includes(report.targetId)) {
              updatedSuspendedUserIds.push(report.targetId);
            }
          }

          return {
            suspendedUserIds: updatedSuspendedUserIds,
            incidentReports: state.incidentReports.map((inc) =>
              inc.id === id
                ? {
                    ...inc,
                    disciplinaryAction,
                    status: disciplinaryAction === 'NONE' ? inc.status : 'ACTION_TAKEN',
                    adminNotes: adminNotes ? `${inc.adminNotes || ''} | Disciplinary Action: ${disciplinaryAction}. ${adminNotes}` : inc.adminNotes,
                    resolvedAt: new Date().toISOString()
                  }
                : inc
            )
          };
        }),

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
