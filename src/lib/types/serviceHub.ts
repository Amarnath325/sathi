export type ServicePublishStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'APPROVED' 
  | 'PUBLISHED' 
  | 'SUSPENDED' 
  | 'ARCHIVED';

export type PricingType = 
  | 'Hourly' 
  | 'Half Day' 
  | 'Full Day' 
  | 'Per Session' 
  | 'Per Event' 
  | 'Per KM' 
  | 'Fixed Price' 
  | 'Custom Quote';

export type RuleType = 
  | 'Age Rule' 
  | 'Location Rule' 
  | 'Duration Rule' 
  | 'Booking Rule' 
  | 'Availability Rule' 
  | 'Travel Rule' 
  | 'Communication Rule' 
  | 'Identity Rule' 
  | 'Safety Rule' 
  | 'Document Rule' 
  | 'Payment Rule' 
  | 'Prohibited Activity Rule';

export type RuleOperator = 
  | 'EQUALS' 
  | 'NOT_EQUALS' 
  | 'GREATER_THAN' 
  | 'LESS_THAN' 
  | 'CONTAINS' 
  | 'IN' 
  | 'NOT_IN';

export type RuleAction = 
  | 'WARNING' 
  | 'BLOCK' 
  | 'REQUIRE_APPROVAL' 
  | 'REQUIRE_VERIFICATION' 
  | 'REQUIRE_ADDITIONAL_INFO';

export type RuleSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskLevelCode = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type VerificationLevel = 'Basic' | 'Standard' | 'Enhanced' | 'Restricted';

export type SafetyControlState = 'Enabled' | 'Disabled' | 'Required' | 'Optional';

export type EligibilityStatus = 
  | 'ELIGIBLE' 
  | 'PENDING_VERIFICATION' 
  | 'PENDING_DOCUMENT' 
  | 'MANUAL_REVIEW' 
  | 'NOT_ELIGIBLE' 
  | 'SUSPENDED';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  description: string;
  icon: string;
  image?: string;
  banner_image?: string;
  display_order: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  is_featured: boolean;
  minimum_age: number;
  default_pricing_profile_id?: string;
  default_rules_id?: string;
  default_policy_id?: string;
  default_risk_level_id?: string;
  default_verification_profile_id?: string;
  default_safety_profile_id?: string;
  default_booking_rule_id?: string;
  default_eligibility_profile_id?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  serviceCount?: number;
}

export interface ServiceItem {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  slug: string;
  short_description?: string;
  description: string;
  icon: string;
  image?: string;
  display_order: number;
  status: ServicePublishStatus;
  is_featured: boolean;
  minimum_age: number;
  maximum_age: number;
  online_allowed: boolean;
  offline_allowed: boolean;
  location_required: boolean;
  duration_required: boolean;
  risk_level_id?: string;
  pricing_profile_id?: string;
  rules_profile_id?: string;
  policy_id?: string;
  verification_profile_id?: string;
  safety_profile_id?: string;
  booking_rule_id?: string;
  cancellation_policy_id?: string;
  eligibility_profile_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingProfile {
  id: string;
  name: string;
  pricing_type: PricingType;
  base_price: number;
  currency: string;
  minimum_duration: number;
  maximum_duration: number;
  extra_hour_price: number;
  travel_charge: number;
  platform_fee: number;
  companion_commission: number;
  tax: number;
  weekend_multiplier: number;
  holiday_multiplier: number;
  surge_enabled: boolean;
  surge_rules?: {
    peakHoursStart?: string;
    peakHoursEnd?: string;
    surgeMultiplier?: number;
  };
  cancellation_fee: number;
  no_show_fee: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface RuleItem {
  id: string;
  name: string;
  rule_type: RuleType;
  description: string;
  condition: string; // e.g. "duration_hours"
  operator: RuleOperator;
  value: string | number | boolean;
  action: RuleAction;
  severity: RuleSeverity;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface RulesProfile {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  rules: RuleItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PolicyVersionItem {
  version: number;
  effective_from: string;
  effective_until?: string;
  description: string;
  prohibited_activity_text?: string;
}

export interface PolicyItem {
  id: string;
  name: string;
  description: string;
  version: number;
  status: 'DRAFT' | 'PUBLISHED' | 'DEACTIVATED';
  effective_from: string;
  effective_until?: string;
  minimum_age: number;
  kyc_required: boolean;
  background_check_required: boolean;
  emergency_contact_required: boolean;
  public_location_only: boolean;
  live_location_required: boolean;
  sos_required: boolean;
  chat_moderation_required: boolean;
  incident_reporting_enabled: boolean;
  consent_required: boolean;
  prohibited_activity_text?: string;
  versions?: PolicyVersionItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RiskLevelItem {
  id: string;
  name: string;
  code: RiskLevelCode;
  score: number;
  description: string;
  color: string;
  verification_level: VerificationLevel;
  monitoring_level: string;
  manual_approval_required: boolean;
  live_location_required: boolean;
  emergency_contact_required: boolean;
  sos_required: boolean;
  maximum_booking_duration: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface VerificationProfileItem {
  id: string;
  name: string;
  description: string;
  verification_level: VerificationLevel;
  status: 'ACTIVE' | 'INACTIVE';
  requirements: {
    email: boolean;
    mobile: boolean;
    government_id: boolean;
    selfie: boolean;
    face_match: boolean;
    address: boolean;
    background_check: boolean;
    emergency_contact: boolean;
    additional_document: boolean;
    manual_review: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SafetyProfileItem {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  controls: {
    sos: SafetyControlState;
    emergency_contact: SafetyControlState;
    live_location: SafetyControlState;
    periodic_checkin: SafetyControlState;
    booking_start_checkin: SafetyControlState;
    booking_end_checkout: SafetyControlState;
    geofence: SafetyControlState;
    safe_location_requirement: SafetyControlState;
    public_place_requirement: SafetyControlState;
    emergency_notification: SafetyControlState;
    admin_emergency_escalation: SafetyControlState;
    incident_reporting: SafetyControlState;
    chat_monitoring: SafetyControlState;
    location_monitoring: SafetyControlState;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CancellationTierRule {
  hoursBeforeBooking: number;
  refundPercentage: number;
  cancellationFeePercent: number;
}

export interface BookingRuleItem {
  id: string;
  name: string;
  min_advance_hours: number;
  max_advance_days: number;
  min_duration_hours: number;
  max_duration_hours: number;
  same_day_allowed: boolean;
  instant_booking_allowed: boolean;
  companion_approval_required: boolean;
  user_approval_required: boolean;
  cancellation_rules: {
    free_cancellation_window_hours: number;
    tiers: CancellationTierRule[];
    no_show_refund_percent: number;
  };
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface EligibilityProfileItem {
  id: string;
  name: string;
  description: string;
  minimum_age: number;
  maximum_age: number;
  minimum_rating: number;
  minimum_bookings_done: number;
  required_documents: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceReadinessChecklist {
  category: boolean;
  pricing: boolean;
  rules: boolean;
  policy: boolean;
  risk: boolean;
  verification: boolean;
  safety: boolean;
  booking: boolean;
  cancellation: boolean;
  eligibility: boolean;
  isReadyToPublish: boolean;
  missingItems: string[];
}

export interface PriceBreakdownResult {
  basePrice: number;
  durationHours: number;
  durationCharge: number;
  travelCharge: number;
  additionalCharges: number;
  platformFee: number;
  taxAmount: number;
  discountAmount: number;
  finalPrice: number;
  pricingSource: 'Service' | 'Category' | 'Global Default';
}

export interface CompanionEligibilityResult {
  companionId: string;
  serviceId: string;
  status: EligibilityStatus;
  passedRequirements: string[];
  missingRequirements: string[];
  evaluationTimestamp: string;
}

export interface ServiceHubAuditEntry {
  id: string;
  admin_id: string;
  module: string;
  entity_id: string;
  action: string;
  old_value?: any;
  new_value?: any;
  ip_address: string;
  timestamp: string;
}
