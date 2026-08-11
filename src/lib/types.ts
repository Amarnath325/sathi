export type RoleType = 
  | 'GUEST' 
  | 'CUSTOMER' 
  | 'VERIFIED_COMPANION' 
  | 'ADMIN' 
  | 'SUPER_ADMIN' 
  | 'MODERATOR' 
  | 'SUPPORT_TEAM' 
  | 'VERIFICATION_TEAM';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type DocumentType = 
  | 'GOVERNMENT_ID' 
  | 'PASSPORT' 
  | 'DRIVING_LICENSE' 
  | 'SELFIE_LIVE' 
  | 'ADDRESS_PROOF' 
  | 'BANK_VERIFICATION' 
  | 'POLICE_CLEARANCE';

export type BookingStatus = 
  | 'PENDING_APPROVAL' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'ESCROW_LOCKED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'DISPUTED';

export type PaymentMethod = 'STRIPE' | 'RAZORPAY' | 'WALLET' | 'UPI' | 'CREDIT_CARD';

export type EscrowStatus = 'HELD' | 'RELEASED_TO_COMPANION' | 'REFUNDED_TO_USER' | 'PARTIAL_REFUND';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CompanionStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export type SortOption = 'rating_desc' | 'price_asc' | 'price_desc' | 'newest' | 'most_booked';

// Availability slot: 7 days x 24 hours grid
export type AvailabilityGrid = {
  [day: string]: number[]; // day: 'Mon'|'Tue'... value: array of hours 0-23
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: RoleType;
  age: number;
  gender: string;
  city: string;
  country: string;
  avatar: string;
  photos: string[];
  categories: string[];
  skills: string[];
  languages: string[];
  bio: string;
  hourlyRate: number;
  dailyRate?: number;
  weeklyRate?: number;
  education?: string;
  experienceYears?: number;
  ratingAvg: number;
  ratingCount: number;
  completedBookings: number;
  status?: CompanionStatus;
  verificationBadge: boolean;
  isAvailableNow: boolean;
  availability?: AvailabilityGrid;
  responseTimeMin?: number;
  suspendedReason?: string;
  joinedDate?: string;
  createdAt?: string;
  kycStatus?: string;
  riskScore?: number;
  riskLevel?: RiskLevel;
  totalEarnings?: number;
  socialLinks?: { instagram?: string; linkedin?: string; twitter?: string; facebook?: string };
}




export interface CompanionFilter {
  searchQuery?: string;
  search?: string;
  selectedCategories?: string[];
  category?: string;
  city: string;
  gender: string;
  priceRange?: [number, number];
  minRate?: number;
  maxRate?: number;
  minRating: number;
  onlyVerified?: boolean;
  verifiedOnly?: boolean;
  onlyAvailableNow?: boolean;
  availableNow?: boolean;
  status?: string;
  sortBy: SortOption;
}

export interface BookingDetails {
  id: string;
  bookingNumber: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  companionId: string;
  companionName: string;
  companionAvatar?: string;
  category: string;
  subCategory?: string;
  date?: string;
  startTime: string;
  endTime?: string;

  durationHours: number;
  locationName?: string;
  locationAddress?: string;
  specialNotes?: string;
  hourlyRate: number;
  baseAmount?: number;
  subtotal?: number;

  platformFee: number;
  escrowFee?: number;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  escrowStatus: EscrowStatus;
  createdAt: string;
  updatedAt?: string;
}



export type Booking = BookingDetails;

export interface VerificationDocument {
  id: string;
  userId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  livenessScore?: number;
  selfieMatchScore?: number;
  status: VerificationStatus;
  rejectionReason?: string;
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'TEXT' | 'IMAGE' | 'VOICE_NOTE' | 'LOCATION';
  timestamp: string;
  isRead: boolean;
  encrypted: boolean;
}

export interface PanicAlert {
  id: string;
  userId: string;
  userName: string;
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
  resolved: boolean;
}

export type ReviewStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'FLAGGED' | 'REJECTED' | 'HIDDEN';
export type ReviewSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'SUSPICIOUS';

export interface ReviewSubRatings {
  punctuality: number;
  behavior: number;
  communication: number;
  authenticity: number;
}

export interface Review {
  id: string;
  reviewRef: string;
  bookingId?: string;
  bookingNumber?: string;
  authorId?: string;
  authorName: string;
  authorAvatar: string;
  authorEmail?: string;
  companionId: string;
  companionName?: string;
  companionAvatar?: string;
  rating: number;
  subRatings?: ReviewSubRatings;
  category: string;
  comment: string;
  helpfulVotes: number;
  date: string;
  verifiedBooking: boolean;
  sentimentScore: number;
  sentiment: ReviewSentiment;
  status: ReviewStatus;
  flaggedReason?: string;
  flaggedBy?: 'AUTOMATED_PROFANITY_FILTER' | 'COMPANION' | 'COMMUNITY' | 'ADMIN';
  adminNotes?: string;
  adminResponse?: string;
  mediaUrls?: string[];
  moderatedAt?: string;
}


export interface SubCategoryItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  requiredVerification: boolean;
  safetyPolicy?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  bannerUrl?: string;
  riskLevel: RiskLevel;
  baseRateMultiplier: number;
  minAgeLimit: number;
  isFeatured: boolean;
  isActive: boolean;
  companionCount: number;
  subcategories: SubCategoryItem[];
  safetyPolicy?: string;
  createdAt?: string;
}

export interface ServicePolicy {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  rules: string[];
  termsAndConditions: string;
  requiredDocuments: DocumentType[];
  emergencyDispatchTrigger: boolean;
}

export type LocationRiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type LocationMetroTier = 'TIER_1_METRO' | 'TIER_2_REGIONAL' | 'TIER_3_LOCAL';

export interface GeofenceZone {
  id: string;
  name: string;
  radiusKm: number;
  safetyScore: number;
  venueTypes: string[];
  isHighAlert?: boolean;
}

export interface PopularVenue {
  id: string;
  name: string;
  address: string;
  category: string;
  safetyRating: number;
  isPartnerVenue: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface LocationItem {
  id: string;
  name: string;
  state?: string;
  country: string;
  countryCode: string;
  tier: LocationMetroTier;
  riskTier: LocationRiskTier;
  surgePricingMultiplier: number;
  isActive: boolean;
  companionCount: number;
  coordinates: { lat: number; lng: number };
  coverImageUrl?: string;
  geofencedZones: GeofenceZone[];
  popularVenues: PopularVenue[];
  emergencyContactPhone: string;
  policeHelpline: string;
  safetyProtocolNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionType = 
  | 'BOOKING_ESCROW_LOCK' 
  | 'COMPANION_PAYOUT' 
  | 'CUSTOMER_REFUND' 
  | 'PLATFORM_FEE_CREDIT' 
  | 'WALLET_TOPUP' 
  | 'CHARGEBACK_DISPUTE';

export type TransactionStatus = 
  | 'COMPLETED' 
  | 'PENDING' 
  | 'HELD_IN_ESCROW' 
  | 'FAILED' 
  | 'REFUNDED';

export interface FinancialTransaction {
  id: string;
  transactionRef: string;
  bookingId?: string;
  bookingNumber?: string;
  userId: string;
  userName: string;
  companionId?: string;
  companionName?: string;
  type: TransactionType;
  amount: number;
  platformFee: number;
  escrowFee: number;
  gstTax: number;
  netPayoutAmount: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  gatewayRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PayoutRecord {
  id: string;
  payoutRef: string;
  companionId: string;
  companionName: string;
  companionAvatar?: string;
  bankName: string;
  accountNumberMasked: string;
  ifscOrRoutingCode?: string;
  amount: number;
  status: 'PROCESSING' | 'PAID' | 'FAILED';
  processedAt: string;
  transactionRef?: string;
}

export interface PaymentGatewayConfig {
  id: string;
  provider: PaymentMethod;
  name: string;
  isEnabled: boolean;
  merchantId: string;
  environment: 'SANDBOX' | 'PRODUCTION';
  transactionFeePercent: number;
  supportedCurrencies: string[];
  lastPingStatus?: 'HEALTHY' | 'DEGRADED' | 'DOWN';
}

export type DiscountType = 'PERCENTAGE' | 'FLAT_AMOUNT';

export interface PromoCodeItem {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  discountPercent?: number;
  flatDiscount?: number;
  minBookingAmount: number;
  maxDiscountLimit?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom?: string;
  expiryDate: string;
  applicableCategories?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export type SosAlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_EMERGENCY';
export type SosAlertStatus = 'ACTIVE_DISPATCH' | 'RESPONDER_EN_ROUTE' | 'POLICE_NOTIFIED' | 'RESOLVED_SAFE' | 'FALSE_ALARM';

export interface SosAlertItem {
  id: string;
  alertRef: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userPhone?: string;
  companionId?: string;
  companionName?: string;
  companionPhone?: string;
  bookingId?: string;
  bookingNumber?: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  severity: SosAlertSeverity;
  status: SosAlertStatus;
  triggeredAt: string;
  resolvedAt?: string;
  assignedResponder?: string;
  policeDispatchRef?: string;
  notes?: string;
  liveAudioFeedActive?: boolean;
  safeWordTriggered?: string;
}

export type IncidentSeverity = 'MINOR' | 'MODERATE' | 'SERIOUS' | 'CRITICAL';
export type IncidentCategory = 
  | 'HARASSMENT' 
  | 'STALKING' 
  | 'NO_SHOW_ISOLATION' 
  | 'SUBSTANCE_ABUSE' 
  | 'IDENTITY_MISMATCH' 
  | 'PAYMENT_EXTORTION' 
  | 'SAFE_WORD_TRIGGERED';

export type IncidentStatus = 'PENDING_AUDIT' | 'INVESTIGATING' | 'RESOLVED' | 'ACTION_TAKEN' | 'DISMISSED';
export type DisciplinaryAction = 'NONE' | 'WARNING_ISSUED' | 'ESCROW_FROZEN' | 'TEMPORARY_SUSPENSION' | 'PERMANENT_BAN' | 'LAW_ENFORCEMENT_ESCALATION';

export interface IncidentReport {
  id: string;
  incidentRef: string;
  reporterId: string;
  reporterName: string;
  reporterRole: 'COMPANION' | 'CUSTOMER' | 'SYSTEM_AUTOMATION';
  targetId: string;
  targetName: string;
  targetRole: 'COMPANION' | 'CUSTOMER';
  bookingId?: string;
  bookingNumber?: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  description: string;
  evidenceUrls?: string[];
  status: IncidentStatus;
  disciplinaryAction: DisciplinaryAction;
  adminNotes?: string;
  filedAt: string;
  resolvedAt?: string;
}

// ==========================================
// ⚖️ DISPUTE & RESOLUTION MODULE TYPES
// ==========================================
export type DisputeCategory = 
  | 'NO_SHOW' 
  | 'SERVICE_QUALITY' 
  | 'INAPPROPRIATE_BEHAVIOR' 
  | 'UNAUTHORIZED_FEE' 
  | 'TIMELINESS' 
  | 'SAFETY_VIOLATION' 
  | 'OTHER';

export type DisputeStatus = 
  | 'OPEN_LODGED' 
  | 'UNDER_ARBITRATION' 
  | 'EVIDENCE_REQUIRED' 
  | 'RESOLVED_REFUNDED' 
  | 'RESOLVED_DISMISSED' 
  | 'ESCALATED_MANAGEMENT' 
  | 'CLOSED';

export type ResolutionOutcome = 
  | 'FULL_REFUND_CUSTOMER' 
  | 'PARTIAL_REFUND' 
  | 'RELEASE_COMPANION' 
  | 'COMPANION_PENALIZED' 
  | 'MUTUAL_SETTLEMENT' 
  | 'DISMISSED';

export interface DisputeEvidence {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'AUDIO' | 'PDF' | 'VIDEO';
  uploadedBy: string;
  uploaderRole: 'CUSTOMER' | 'COMPANION' | 'ADMIN';
  uploadedAt: string;
}

export interface DisputeMessage {
  id: string;
  disputeId: string;
  senderId: string;
  senderName: string;
  senderRole: 'CUSTOMER' | 'COMPANION' | 'ADMIN';
  senderAvatar?: string;
  message: string;
  isArbitratorNote?: boolean;
  attachments?: string[];
  sentAt: string;
}

export interface DisputeTicket {
  id: string;
  disputeRef: string;
  bookingId: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  companionId: string;
  companionName: string;
  companionEmail: string;
  companionAvatar?: string;
  disputedAmount: number;
  escrowStatus: 'HELD' | 'REFUNDED' | 'RELEASED' | 'FROZEN';
  category: DisputeCategory;
  reason: string;
  detailedDescription: string;
  status: DisputeStatus;
  resolutionOutcome?: ResolutionOutcome;
  refundAmountIssued?: number;
  penaltyDeducted?: number;
  assignedArbitrator?: string;
  adminNotes?: string;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  settlementOffer?: {
    proposedBy: 'CUSTOMER' | 'COMPANION';
    amount: number;
    note: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    proposedAt: string;
  };
  filedAt: string;
  updatedAt: string;
  resolvedAt?: string;
}





