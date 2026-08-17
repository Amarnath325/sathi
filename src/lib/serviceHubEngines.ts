import {
  CategoryItem,
  ServiceItem,
  PricingProfile,
  RulesProfile,
  RuleItem,
  PolicyItem,
  RiskLevelItem,
  VerificationProfileItem,
  SafetyProfileItem,
  BookingRuleItem,
  EligibilityProfileItem,
  ServiceReadinessChecklist,
  PriceBreakdownResult,
  CompanionEligibilityResult
} from './types/serviceHub';

// ==========================================
// 1. SERVICE READINESS CHECKLIST ENGINE
// ==========================================
export class ServiceReadinessEngine {
  static checkReadiness(
    service: ServiceItem,
    category?: CategoryItem,
    pricing?: PricingProfile,
    rules?: RulesProfile,
    policy?: PolicyItem,
    risk?: RiskLevelItem,
    verification?: VerificationProfileItem,
    safety?: SafetyProfileItem,
    bookingRule?: BookingRuleItem,
    eligibility?: EligibilityProfileItem
  ): ServiceReadinessChecklist {
    const missing: string[] = [];

    const hasCategory = !!(service.category_id && category);
    if (!hasCategory) missing.push('Category Assignment');

    const hasPricing = !!(service.pricing_profile_id || category?.default_pricing_profile_id || pricing);
    if (!hasPricing) missing.push('Pricing Profile');

    const hasRules = !!(service.rules_profile_id || category?.default_rules_id || rules);
    if (!hasRules) missing.push('Rules Profile');

    const hasPolicy = !!(service.policy_id || category?.default_policy_id || policy);
    if (!hasPolicy) missing.push('Usage Policy');

    const hasRisk = !!(service.risk_level_id || category?.default_risk_level_id || risk);
    if (!hasRisk) missing.push('Risk Level Assignment');

    const hasVerification = !!(service.verification_profile_id || category?.default_verification_profile_id || verification);
    if (!hasVerification) missing.push('Verification Requirements');

    const hasSafety = !!(service.safety_profile_id || category?.default_safety_profile_id || safety);
    if (!hasSafety) missing.push('Safety Controls');

    const hasBooking = !!(service.booking_rule_id || category?.default_booking_rule_id || bookingRule);
    if (!hasBooking) missing.push('Booking Rules');

    const hasCancellation = !!(service.cancellation_policy_id || bookingRule?.cancellation_rules);
    if (!hasCancellation) missing.push('Cancellation Policy');

    const hasEligibility = !!(service.eligibility_profile_id || category?.default_eligibility_profile_id || eligibility);
    if (!hasEligibility) missing.push('Eligibility Profile');

    const isReady = missing.length === 0;

    return {
      category: hasCategory,
      pricing: hasPricing,
      rules: hasRules,
      policy: hasPolicy,
      risk: hasRisk,
      verification: hasVerification,
      safety: hasSafety,
      booking: hasBooking,
      cancellation: hasCancellation,
      eligibility: hasEligibility,
      isReadyToPublish: isReady,
      missingItems: missing
    };
  }
}

// ==========================================
// 2. PRICING CALCULATION ENGINE
// ==========================================
export class PricingEngine {
  static calculatePrice(
    pricingProfile: PricingProfile,
    durationHours: number = 2,
    travelKm: number = 0,
    options: { isWeekend?: boolean; isHoliday?: boolean; promoDiscount?: number } = {}
  ): PriceBreakdownResult {
    const base = pricingProfile.base_price;
    const dur = Math.max(pricingProfile.minimum_duration, Math.min(durationHours, pricingProfile.maximum_duration));
    
    let durationCharge = 0;
    if (pricingProfile.pricing_type === 'Hourly') {
      durationCharge = base + Math.max(0, dur - 1) * pricingProfile.extra_hour_price;
    } else if (pricingProfile.pricing_type === 'Half Day') {
      durationCharge = base * 4;
    } else if (pricingProfile.pricing_type === 'Full Day') {
      durationCharge = base * 8;
    } else {
      durationCharge = base;
    }

    // Apply multipliers
    let multiplier = 1.0;
    if (options.isWeekend) multiplier *= pricingProfile.weekend_multiplier;
    if (options.isHoliday) multiplier *= pricingProfile.holiday_multiplier;

    durationCharge *= multiplier;

    const travelCharge = travelKm * pricingProfile.travel_charge;
    const subtotal = durationCharge + travelCharge;
    const platformFee = (subtotal * pricingProfile.platform_fee) / 100;
    const taxAmount = ((subtotal + platformFee) * pricingProfile.tax) / 100;
    const discountAmount = options.promoDiscount || 0;

    const finalPrice = Math.max(0, subtotal + platformFee + taxAmount - discountAmount);

    return {
      basePrice: base,
      durationHours: dur,
      durationCharge: Math.round(durationCharge),
      travelCharge: Math.round(travelCharge),
      additionalCharges: 0,
      platformFee: Math.round(platformFee),
      taxAmount: Math.round(taxAmount),
      discountAmount: Math.round(discountAmount),
      finalPrice: Math.round(finalPrice),
      pricingSource: 'Service'
    };
  }
}

// ==========================================
// 3. DYNAMIC RULES EVALUATION ENGINE
// ==========================================
export class RulesEngine {
  static evaluateRule(rule: RuleItem, context: Record<string, any>): { triggers: boolean; action?: string; message?: string } {
    if (rule.status !== 'ACTIVE') return { triggers: false };

    const ctxValue = context[rule.condition];
    if (ctxValue === undefined) return { triggers: false };

    let matches = false;
    switch (rule.operator) {
      case 'EQUALS':
        matches = ctxValue === rule.value;
        break;
      case 'NOT_EQUALS':
        matches = ctxValue !== rule.value;
        break;
      case 'GREATER_THAN':
        matches = Number(ctxValue) > Number(rule.value);
        break;
      case 'LESS_THAN':
        matches = Number(ctxValue) < Number(rule.value);
        break;
      case 'CONTAINS':
        matches = String(ctxValue).toLowerCase().includes(String(rule.value).toLowerCase());
        break;
      default:
        matches = false;
    }

    if (matches) {
      return {
        triggers: true,
        action: rule.action,
        message: `Rule Triggered [${rule.name}]: ${rule.description} (${rule.severity})`
      };
    }

    return { triggers: false };
  }
}

// ==========================================
// 4. MULTI-FACTOR RISK SCORE CALCULATOR
// ==========================================
export class RiskEngine {
  static calculateRiskScore(context: {
    serviceRiskCode?: string;
    durationHours?: number;
    isNightTime?: boolean;
    locationRiskLevel?: string;
    companionVerified?: boolean;
    userVerified?: boolean;
  }): { score: number; level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; breakdown: Record<string, number> } {
    let score = 10;
    const breakdown: Record<string, number> = { base: 10 };

    if (context.serviceRiskCode === 'HIGH') { score += 30; breakdown.serviceRisk = 30; }
    if (context.serviceRiskCode === 'CRITICAL') { score += 50; breakdown.serviceRisk = 50; }
    if (context.serviceRiskCode === 'MEDIUM') { score += 15; breakdown.serviceRisk = 15; }

    if ((context.durationHours || 0) > 8) { score += 20; breakdown.longDuration = 20; }
    if (context.isNightTime) { score += 15; breakdown.nightTime = 15; }
    if (!context.companionVerified) { score += 25; breakdown.unverifiedCompanion = 25; }
    if (!context.userVerified) { score += 15; breakdown.unverifiedUser = 15; }

    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 80) level = 'CRITICAL';
    else if (score >= 50) level = 'HIGH';
    else if (score >= 25) level = 'MEDIUM';

    return { score, level, breakdown };
  }
}

// ==========================================
// 5. COMPANION ELIGIBILITY EVALUATOR
// ==========================================
export class CompanionEligibilityEvaluator {
  static evaluate(
    companion: {
      id: string;
      age: number;
      ratingAvg: number;
      completedBookings: number;
      isSuspended?: boolean;
      documents: Record<string, boolean>;
    },
    profile: EligibilityProfileItem
  ): CompanionEligibilityResult {
    const passed: string[] = [];
    const missing: string[] = [];

    if (companion.isSuspended) {
      return {
        companionId: companion.id,
        serviceId: profile.id,
        status: 'SUSPENDED',
        passedRequirements: [],
        missingRequirements: ['Account is suspended by compliance moderation'],
        evaluationTimestamp: new Date().toISOString()
      };
    }

    if (companion.age >= profile.minimum_age && companion.age <= profile.maximum_age) {
      passed.push(`Age ${companion.age} satisfies [${profile.minimum_age}-${profile.maximum_age}] limit`);
    } else {
      missing.push(`Age ${companion.age} is outside mandatory [${profile.minimum_age}-${profile.maximum_age}] range`);
    }

    if (companion.ratingAvg >= profile.minimum_rating) {
      passed.push(`Rating ${companion.ratingAvg} >= ${profile.minimum_rating}`);
    } else {
      missing.push(`Rating ${companion.ratingAvg} is below minimum requirement of ${profile.minimum_rating}`);
    }

    profile.required_documents.forEach(docKey => {
      if (companion.documents[docKey]) {
        passed.push(`Document Verified: ${docKey}`);
      } else {
        missing.push(`Missing Required Credential: ${docKey}`);
      }
    });

    const isEligible = missing.length === 0;

    return {
      companionId: companion.id,
      serviceId: profile.id,
      status: isEligible ? 'ELIGIBLE' : missing.some(m => m.includes('Document')) ? 'PENDING_DOCUMENT' : 'NOT_ELIGIBLE',
      passedRequirements: passed,
      missingRequirements: missing,
      evaluationTimestamp: new Date().toISOString()
    };
  }
}

// ==========================================
// 6. CANCELLATION REFUND CALCULATOR
// ==========================================
export class CancellationCalculator {
  static calculateRefund(
    totalPaidAmount: number,
    hoursUntilBooking: number,
    bookingRule: BookingRuleItem
  ): { refundAmount: number; refundPercent: number; feeAmount: number; feePercent: number; policyTierMessage: string } {
    const rules = bookingRule.cancellation_rules;
    
    let appliedTier = rules.tiers.find(t => hoursUntilBooking >= t.hoursBeforeBooking);
    if (!appliedTier && rules.tiers.length > 0) {
      appliedTier = rules.tiers[rules.tiers.length - 1];
    }

    const refundPercent = appliedTier ? appliedTier.refundPercentage : 0;
    const feePercent = appliedTier ? appliedTier.cancellationFeePercent : 100;
    const refundAmount = (totalPaidAmount * refundPercent) / 100;
    const feeAmount = totalPaidAmount - refundAmount;

    return {
      refundAmount: Math.round(refundAmount),
      refundPercent,
      feeAmount: Math.round(feeAmount),
      feePercent,
      policyTierMessage: hoursUntilBooking >= rules.free_cancellation_window_hours
        ? `Full ${refundPercent}% Refund (Cancelled > ${rules.free_cancellation_window_hours}h in advance)`
        : `${refundPercent}% Refund Applicable (${hoursUntilBooking.toFixed(1)}h prior to session start)`
    };
  }
}
