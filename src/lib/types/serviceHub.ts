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

export type SafetyControlState = 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL' | 'DISABLED' | 'Required' | 'Recommended' | 'Optional' | 'Disabled';

export type EligibilityStatus = 
  | 'ELIGIBLE' 
  | 'PENDING_VERIFICATION' 
  | 'PENDING_DOCUMENT' 
  | 'MANUAL_REVIEW' 
  | 'NOT_ELIGIBLE' 
  | 'SUSPENDED';

export interface CategoryItem {
  id: string;
  code?: string; // Category Code e.g. "CAT-EVT-01"
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
  // DB Primary Columns
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
  surge_rules?: Record<string, any>;
  cancellation_fee: number;
  no_show_fee: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdAt?: string;
  updatedAt?: string;

  // Extended 7-Section Hub Fields (Flattened or stored inside surge_rules JSONB)
  category_id?: string;
  category_name?: string;
  service_id?: string;
  service_name?: string;

  // Travel Extended
  travel_enabled?: boolean;
  travel_pricing_type?: 'Per KM' | 'Fixed' | 'Zone';
  free_distance_km?: number;
  max_travel_charge?: number;
  waiting_charge_per_hr?: number;
  parking_charge?: number;
  toll_charge?: number;
  other_charges?: number;

  // Dynamic Extended
  surge_multiplier?: number;
  peak_hours_start?: string;
  peak_hours_end?: string;
  demand_pricing_multiplier?: number;

  // Fees & Split Extended
  payment_gateway_fee?: number;
  companion_payout_rate?: number;

  // Discounts Extended
  discount_enabled?: boolean;
  discount_type?: 'Percentage' | 'Fixed Amount';
  discount_value?: number;
  discount_cap?: number;
  long_duration_discount?: number;

  // Advanced & Versioning Extended
  price_min_limit?: number;
  price_max_limit?: number;
  rounding_rule?: 'NO_ROUNDING' | 'ROUND_NEAREST_10' | 'ROUND_NEAREST_50' | 'ROUND_NEAREST_100';
  version?: string;
  effective_from?: string;
  effective_until?: string;
  pricing_snapshot_code?: string;
  historical_price_lock?: boolean;
}

export interface RuleCondition {
  id: string;
  field: string;
  operator: RuleOperator;
  value: string | number | boolean;
  logical_operator?: 'AND' | 'OR';
}

export interface RuleAuditLog {
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'VERSION_BUMP' | 'STATUS_CHANGE';
  author: string;
  note: string;
}

export interface RuleItem {
  id: string;
  code: string; // e.g. "RULE-DUR-01"
  name: string;
  description: string;
  rule_type: RuleType; // 'Duration Rule' | 'Location Rule' | 'Safety Rule' | 'Booking Rule' | 'Eligibility Rule'
  priority: number; // 1 (Highest) to 10 (Lowest)
  
  // 2. Scope & Mapping
  scope_type: 'GLOBAL' | 'CATEGORY' | 'SERVICE' | 'LOCATION';
  category_id?: string;
  category_name?: string;
  service_id?: string;
  service_name?: string;
  location_name?: string;

  // 3. Conditions
  condition_group_operator: 'AND' | 'OR';
  conditions: RuleCondition[];
  condition: string; // Legacy fallback
  operator: RuleOperator;
  value: string | number | boolean;

  // 4. Actions
  action: RuleAction; // 'REQUIRE_APPROVAL' | 'BLOCK' | 'WARN' | 'APPLY_DISCOUNT' | 'SURGE_PRICE'
  additional_requirements?: string[]; // e.g. ["IDENTITY_VERIFICATION", "GUARDIAN_CONSENT"]
  approval_level?: 'SYSTEM_AUTO' | 'ADMIN_MANUAL' | 'MANAGER_REVIEW';
  restriction_message?: string;

  // 5. Advanced Settings
  risk_level_required?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  verification_required?: boolean;
  allow_override?: boolean;
  override_role?: 'SUPER_ADMIN' | 'SUPPORT_LEAD' | 'OPERATIONS_MANAGER';
  validity_start?: string;
  validity_end?: string;
  escalation_action?: string;

  // 6. Review & Audit
  version: string; // e.g. "v1.0"
  severity: RuleSeverity;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
  audit_history?: RuleAuditLog[];
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

export type PolicyCategoryDomain = 'General' | 'Booking' | 'Safety' | 'Conduct & Restrictions' | 'Cancellation & Disputes';

export interface PolicyVersionItem {
  version: number;
  effective_from: string;
  effective_until?: string;
  description: string;
  prohibited_activity_text?: string;
  published_by?: string;
}

export interface PolicyItem {
  id: string;
  code: string; // e.g. "POL-GEN-01", "POL-SAF-01"
  name: string;
  policy_domain: PolicyCategoryDomain;
  description: string;
  
  // Category & Service Relation Mapping
  scope_type: 'GLOBAL' | 'CATEGORY' | 'SERVICE' | 'LOCATION';
  category_id?: string;
  category_name?: string;
  service_id?: string;
  service_name?: string;

  // Version & Status
  version: number;
  status: 'DRAFT' | 'PUBLISHED' | 'DEACTIVATED';
  effective_from: string;
  effective_until?: string;

  // 1. General Policy
  eligibility_text?: string;
  minimum_age: number;
  kyc_required: boolean;
  background_check_required: boolean;
  consent_required: boolean;
  allowed_categories_text?: string;
  time_location_rules_text?: string;
  general_restrictions_text?: string;

  // 2. Booking Policy
  min_duration_hours?: number;
  max_duration_hours?: number;
  advance_booking_hours?: number;
  same_day_booking_allowed?: boolean;
  approval_required_for_booking?: boolean;
  extension_allowed?: boolean;
  rescheduling_allowed?: boolean;
  payment_requirement?: 'FULL_ADVANCE' | 'PARTIAL_DEPOSIT' | 'POST_PAY';

  // 3. Safety Policy
  public_location_only: boolean;
  live_location_required: boolean;
  check_in_out_required?: boolean;
  periodic_check_in_interval_mins?: number;
  sos_required: boolean;
  emergency_contact_required: boolean;
  night_booking_restricted?: boolean;
  restricted_locations_text?: string;
  auto_sos_escalation_minutes?: number;

  // 4. Conduct & Restrictions Policy
  companion_rules_text?: string;
  customer_rules_text?: string;
  prohibited_activity_text?: string;
  restricted_services_text?: string;
  communication_rules_text?: string;
  zero_tolerance_violations_text?: string;
  chat_moderation_required: boolean;
  incident_reporting_enabled: boolean;

  // 5. Cancellation & Disputes Policy
  customer_cancellation_rules_text?: string;
  companion_cancellation_rules_text?: string;
  no_show_policy_text?: string;
  refund_rules_text?: string;
  complaint_protocol_text?: string;
  incident_escalation_text?: string;
  dispute_resolution_text?: string;
  enforcement_type?: 'STRICT_BLOCK' | 'WARNING_ACKNOWLEDGEMENT' | 'MANUAL_REVIEW';
  exceptions_allowed?: boolean;
  exception_process_text?: string;

  // History & Audit
  approval_status?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  approved_by?: string;
  approved_at?: string;
  versions?: PolicyVersionItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RiskFactorWeight {
  factor_name: 'Service Risk' | 'Duration Risk' | 'Time Risk' | 'Location Risk' | 'User Risk' | 'Verification Risk' | 'Booking Risk';
  weight_score: number; // 0 to 100
  enabled: boolean;
  notes?: string;
}

export interface RiskLevelItem {
  id: string;
  code: RiskLevelCode; // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  name: string;
  description: string;
  score_min: number; // e.g. 0
  score_max: number; // e.g. 25
  score?: number; // Legacy score
  color: string; // 'emerald' | 'amber' | 'orange' | 'purple'
  status: 'ACTIVE' | 'INACTIVE';

  // Category & Service Relation Mapping
  scope_type: 'GLOBAL' | 'CATEGORY' | 'SERVICE';
  category_id?: string;
  category_name?: string;
  service_id?: string;
  service_name?: string;

  // 2. Risk Factors
  factors: {
    service_risk: RiskFactorWeight;
    duration_risk: RiskFactorWeight;
    time_risk: RiskFactorWeight;
    location_risk: RiskFactorWeight;
    user_risk: RiskFactorWeight;
    verification_risk: RiskFactorWeight;
    booking_risk: RiskFactorWeight;
  };

  // 3. Risk Rules & Required Controls
  required_verification_tier: 'Basic' | 'Standard' | 'Enhanced' | 'Restricted';
  verification_level?: VerificationLevel; // Legacy fallback
  monitoring_level: 'Standard' | 'Enhanced' | 'Continuous' | 'RealTime_Audit';
  manual_approval_required: boolean;
  live_location_required: boolean;
  emergency_contact_required: boolean;
  sos_required: boolean;
  periodic_checkin_mins?: number;
  maximum_booking_duration: number;

  // Escalation & Threshold Rules
  escalation_action: 'AUTO_BLOCK' | 'EMERGENCY_OPS_ALERT' | 'IMMEDIATE_ESCALATION' | 'STANDARD_MONITOR';
  escalation_target_role?: 'OPS_LEAD' | 'SAFETY_DESK' | 'SUPER_ADMIN';

  createdAt?: string;
  updatedAt?: string;
}

export type VerificationLevelTier = 'Basic' | 'Standard' | 'Enhanced' | 'Restricted';

export interface VerificationCheckDetail {
  enabled: boolean;
  required: boolean; // Required vs Optional
  expiry_days?: number;
  re_verification_trigger?: 'ANNUAL' | 'QUARTERLY' | 'POST_INCIDENT' | 'ON_DEMAND';
  accepted_documents_text?: string;
}

export interface VerificationProfileItem {
  id: string;
  code: string; // e.g. "VER-BAS-01", "VER-STD-02"
  name: string;
  description: string;
  profile_tier: VerificationLevelTier;
  verification_level?: VerificationLevel; // Legacy fallback
  status: 'ACTIVE' | 'INACTIVE';
  
  // Category & Service Relation Mapping
  scope_type: 'GLOBAL' | 'CATEGORY' | 'SERVICE';
  category_id?: string;
  category_name?: string;
  service_id?: string;
  service_name?: string;

  // 2. Verification Checks
  checks: {
    identity: VerificationCheckDetail;
    contact: VerificationCheckDetail;
    face: VerificationCheckDetail;
    address: VerificationCheckDetail;
    background: VerificationCheckDetail;
    emergency: VerificationCheckDetail;
    additional_documents: VerificationCheckDetail;
  };

  // Legacy fallback boolean requirements
  requirements?: {
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

  // 3. Verification Governance Rules
  applicability_roles: ('COMPANION' | 'CLIENT' | 'AGENT')[];
  applicability_trigger?: 'ALL_USERS' | 'HIGH_RISK_BOOKINGS' | 'NIGHT_BOOKINGS';
  expiry_duration_days: number;
  re_verification_policy: 'ANNUAL_RENEWAL' | 'QUARTERLY_RECHECK' | 'POST_INCIDENT_MANDATORY';
  failure_action: 'AUTO_SUSPEND' | 'BLOCK_BOOKINGS' | 'FLAG_FOR_REVIEW';
  max_retry_attempts: number;
  manual_review_required: boolean;
  auto_approval_enabled: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface SafetyProfileItem {
  id: string;
  code: string; // e.g. "SAF-STD-01", "SAF-MAX-02"
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';

  // Category & Service Relation Mapping
  scope_type: 'GLOBAL' | 'CATEGORY' | 'SERVICE';
  category_id?: string;
  category_name?: string;
  service_id?: string;
  service_name?: string;

  // 1. Safety Controls
  controls: {
    sos: SafetyControlState;
    emergency_contact: SafetyControlState;
    live_location: SafetyControlState;
    periodic_checkin: SafetyControlState;
    booking_start_checkin: SafetyControlState;
    booking_end_checkout: SafetyControlState;
    safe_location_requirement: SafetyControlState;
    public_place_requirement: SafetyControlState;
    location_monitoring: SafetyControlState;
  };

  // 2. Safety Automation
  automation: {
    geofence: SafetyControlState;
    emergency_notification: SafetyControlState;
    admin_emergency_escalation: SafetyControlState;
    incident_reporting: SafetyControlState;
    chat_monitoring: SafetyControlState;
  };

  // 3. Emergency & Incident Protocols
  emergency_protocols: {
    sos_dispatch_mode: 'AUTO_POLICE_AND_CONTACTS' | 'OPS_DESK_REVIEW' | 'CONTACTS_ONLY';
    emergency_escalation_queue: 'SAFETY_DESK' | 'OPS_MANAGER' | 'POLICE_HOTLINE';
    incident_response_sla_mins: number;
    auto_contact_dispatch_delay_seconds: number;
    response_rules_matrix_text: string;
  };

  // 4. Security & Audit Settings
  audit_settings: {
    log_all_events: boolean;
    export_logs_enabled: boolean;
    retention_days: number;
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
  code: string; // e.g. "BKG-STD-01", "BKG-FLX-02"
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';

  // Category & Service Relation Mapping
  scope_type: 'GLOBAL' | 'CATEGORY' | 'SERVICE';
  category_id?: string;
  category_name?: string;
  service_id?: string;
  service_name?: string;

  // 1. Booking Rules
  booking_rules: {
    min_advance_hours: number;
    max_advance_days: number;
    instant_booking_allowed: boolean;
    min_duration_hours: number;
    max_duration_hours: number;
    extension_allowed: boolean;
    max_extension_hours: number;
    rescheduling_allowed: boolean;
    reschedule_cutoff_hours: number;
    companion_approval_required: boolean;
    admin_approval_required: boolean;
  };

  // 2. Cancellation Rules
  cancellation_rules: {
    free_cancellation_window_mins: number;
    customer_cancellation_allowed: boolean;
    companion_cancellation_penalty_score: number;
    companion_reassignment_enabled: boolean;
    tiers: CancellationTierRule[];
    no_show_grace_period_mins: number;
    no_show_fee_percent: number;
    emergency_cancellation_allowed: boolean;
    emergency_cancellation_policy_text: string;
  };

  // 3. Refund Rules
  refund_rules: {
    refund_schedule: 'INSTANT_PAYMENT_METHOD' | 'THREE_TO_FIVE_DAYS' | 'WALLET_CREDIT';
    platform_fee_non_refundable: boolean;
    platform_fee_percent: number;
    gateway_fee_retention_percent: number;
    partial_refund_enabled: boolean;
    partial_refund_formula_text: string;
    auto_refund_processing: boolean;
  };

  // Legacy fallback fields
  min_advance_hours?: number;
  max_advance_days?: number;
  min_duration_hours?: number;
  max_duration_hours?: number;
  same_day_allowed?: boolean;
  instant_booking_allowed?: boolean;
  companion_approval_required?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export type EligibilityTier = 'Basic' | 'Standard' | 'Enhanced' | 'Restricted';

export interface EligibilityProfileItem {
  id: string;
  code: string; // e.g. "ELG-BAS-01", "ELG-VIP-02"
  name: string;
  description: string;
  tier: EligibilityTier;
  status: 'ACTIVE' | 'INACTIVE';

  // Category & Service Relation Mapping
  scope_type: 'GLOBAL' | 'CATEGORY' | 'SERVICE';
  category_id?: string;
  category_name?: string;
  service_id?: string;
  service_name?: string;

  // 2. Eligibility Rules
  rules: {
    min_age: number;
    max_age: number;
    min_rating: number;
    required_verification_level: 'Basic' | 'Standard' | 'Enhanced' | 'Restricted';
    required_documents: string[];
    min_completed_sessions: number;
    require_good_account_standing: boolean;
    max_active_strikes_allowed: number;
    restricted_services_text: string;
  };

  // 3. Evaluator Config
  evaluator: {
    auto_evaluation_enabled: boolean;
    manual_override_allowed_roles: string[];
    re_evaluation_interval_days: number;
  };

  // Legacy fallback fields
  minimum_age?: number;
  maximum_age?: number;
  minimum_rating?: number;
  minimum_bookings_done?: number;

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
  travelKm: number;
  billableTravelKm: number;
  travelCharge: number;
  waitingCharge: number;
  parkingTollCharges: number;
  grossSubtotal: number;
  weekendHolidaySurgeMultiplier: number;
  multiplierCharge: number;
  platformFee: number;
  gatewayFee: number;
  taxAmount: number;
  grossTotalBeforeDiscount: number;
  discountAmount: number;
  discountCapApplied: boolean;
  finalPrice: number;
  roundedPrice: number;
  companionPayoutAmount: number;
  companionCommissionAmount: number;
  pricingVersion: string;
  effectiveFrom: string;
  snapshotCode: string;
  historicalPriceLock: boolean;
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
