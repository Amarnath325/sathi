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
