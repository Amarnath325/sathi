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
  hourlyRate: number;
  dailyRate?: number;
  weeklyRate?: number;
  ratingAvg: number;
  ratingCount: number;
  completedBookings: number;
  verificationBadge: boolean;
  kycStatus: VerificationStatus;
  bio: string;
  isAvailableNow: boolean;
  responseTimeMin: number;
  riskScore: number;
  riskLevel: RiskLevel;
  experienceYears?: number;
  education?: string;
  status?: CompanionStatus;
  suspendedReason?: string;
  availability?: AvailabilityGrid;
  createdAt?: string;
  totalEarnings?: number;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface CompanionFilter {
  search: string;
  category: string;
  city: string;
  gender: string;
  minRate: number;
  maxRate: number;
  minRating: number;
  availableNow: boolean;
  verifiedOnly: boolean;
  status: CompanionStatus | '';
  sortBy: SortOption;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  userName: string;
  companionId: string;
  companionName: string;
  companionAvatar: string;
  category: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  locationAddress: string;
  specialNotes?: string;
  hourlyRate: number;
  baseAmount: number;
  escrowFee: number;
  platformFee: number;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  escrowStatus: EscrowStatus;
  createdAt: string;
}

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

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  companionId: string;
  rating: number;
  category: string;
  comment: string;
  helpfulVotes: number;
  date: string;
  verifiedBooking: boolean;
  sentimentScore: number;
}
