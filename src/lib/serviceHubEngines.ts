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
    options: {
      isWeekend?: boolean;
      isHoliday?: boolean;
      isPeakHours?: boolean;
      waitingHours?: number;
      promoDiscount?: number;
    } = {}
  ): PriceBreakdownResult {
    const base = pricingProfile.base_price || 0;
    
    // 1. Duration Clamp
    const minDur = pricingProfile.minimum_duration || 1;
    const maxDur = pricingProfile.maximum_duration || 12;
    const dur = Math.max(minDur, Math.min(durationHours, maxDur));
    
    // 2. Base Duration Charge
    let durationCharge = 0;
    if (pricingProfile.pricing_type === 'Hourly') {
      durationCharge = base + Math.max(0, dur - 1) * (pricingProfile.extra_hour_price || 0);
    } else if (pricingProfile.pricing_type === 'Half Day') {
      durationCharge = base * 4;
    } else if (pricingProfile.pricing_type === 'Full Day') {
      durationCharge = base * 8;
    } else {
      durationCharge = base;
    }

    // 3. Travel Charges
    let billableTravelKm = 0;
    let travelCharge = 0;
    if (pricingProfile.travel_enabled !== false && travelKm > 0) {
      const freeDist = pricingProfile.free_distance_km || 0;
      billableTravelKm = Math.max(0, travelKm - freeDist);
      if (pricingProfile.travel_pricing_type === 'Fixed') {
        travelCharge = pricingProfile.travel_charge || 0;
      } else {
        const calculatedTravel = billableTravelKm * (pricingProfile.travel_charge || 0);
        const maxTravel = pricingProfile.max_travel_charge || 99999;
        travelCharge = Math.min(calculatedTravel, maxTravel);
      }
    }

    // 4. Extras (Waiting, Parking, Toll, Other)
    const waitingHours = options.waitingHours || 0;
    const waitingCharge = waitingHours * (pricingProfile.waiting_charge_per_hr || 0);
    const parkingTollCharges = (pricingProfile.parking_charge || 0) + (pricingProfile.toll_charge || 0) + (pricingProfile.other_charges || 0);

    const grossSubtotal = durationCharge + travelCharge + waitingCharge + parkingTollCharges;

    // 5. Dynamic Multipliers (Weekend, Holiday, Surge)
    let totalMultiplier = 1.0;
    if (options.isWeekend) totalMultiplier *= (pricingProfile.weekend_multiplier || 1.0);
    if (options.isHoliday) totalMultiplier *= (pricingProfile.holiday_multiplier || 1.0);
    if (pricingProfile.surge_enabled && options.isPeakHours) {
      totalMultiplier *= (pricingProfile.surge_multiplier || 1.2);
    }

    const multiplierCharge = grossSubtotal * (totalMultiplier - 1.0);
    const totalAfterMultipliers = grossSubtotal + multiplierCharge;

    // 6. Fees (Platform & Payment Gateway)
    const platformFee = (totalAfterMultipliers * (pricingProfile.platform_fee || 0)) / 100;
    const gatewayFee = (totalAfterMultipliers * (pricingProfile.payment_gateway_fee || 0)) / 100;

    // 7. Taxes
    const taxBase = totalAfterMultipliers + platformFee + gatewayFee;
    const taxAmount = (taxBase * (pricingProfile.tax || 0)) / 100;

    const grossTotalBeforeDiscount = taxBase + taxAmount;

    // 8. Discounts & Caps
    let discountAmount = 0;
    let discountCapApplied = false;
    if (pricingProfile.discount_enabled || options.promoDiscount) {
      if (pricingProfile.discount_type === 'Percentage') {
        discountAmount = (grossTotalBeforeDiscount * (pricingProfile.discount_value || 0)) / 100;
      } else {
        discountAmount = pricingProfile.discount_value || 0;
      }

      if (dur >= 4 && pricingProfile.long_duration_discount) {
        discountAmount += (grossTotalBeforeDiscount * pricingProfile.long_duration_discount) / 100;
      }

      if (options.promoDiscount) {
        discountAmount += options.promoDiscount;
      }

      if (pricingProfile.discount_cap && discountAmount > pricingProfile.discount_cap) {
        discountAmount = pricingProfile.discount_cap;
        discountCapApplied = true;
      }
    }

    // 9. Final Price Calculation & Limits
    let rawFinal = Math.max(0, grossTotalBeforeDiscount - discountAmount);

    if (pricingProfile.price_min_limit && rawFinal < pricingProfile.price_min_limit) {
      rawFinal = pricingProfile.price_min_limit;
    }
    if (pricingProfile.price_max_limit && rawFinal > pricingProfile.price_max_limit) {
      rawFinal = pricingProfile.price_max_limit;
    }

    // 10. Rounding Rule
    let roundedPrice = rawFinal;
    const rule = pricingProfile.rounding_rule || 'ROUND_NEAREST_10';
    if (rule === 'ROUND_NEAREST_10') {
      roundedPrice = Math.round(rawFinal / 10) * 10;
    } else if (rule === 'ROUND_NEAREST_50') {
      roundedPrice = Math.round(rawFinal / 50) * 50;
    } else if (rule === 'ROUND_NEAREST_100') {
      roundedPrice = Math.round(rawFinal / 100) * 100;
    } else {
      roundedPrice = Math.round(rawFinal);
    }

    // 11. Companion Commission & Payout Split
    const payoutRate = pricingProfile.companion_payout_rate || (100 - (pricingProfile.companion_commission || 15));
    const companionPayoutAmount = Math.round((roundedPrice * payoutRate) / 100);
    const companionCommissionAmount = Math.round(roundedPrice - companionPayoutAmount);

    // 12. Snapshot Code
    const snapshotCode = pricingProfile.pricing_snapshot_code || `SNAP-${(pricingProfile.version || 'v1.0').toUpperCase()}-${pricingProfile.id.slice(-4)}`;

    return {
      basePrice: base,
      durationHours: dur,
      durationCharge: Math.round(durationCharge),
      travelKm,
      billableTravelKm,
      travelCharge: Math.round(travelCharge),
      waitingCharge: Math.round(waitingCharge),
      parkingTollCharges: Math.round(parkingTollCharges),
      grossSubtotal: Math.round(grossSubtotal),
      weekendHolidaySurgeMultiplier: Number(totalMultiplier.toFixed(2)),
      multiplierCharge: Math.round(multiplierCharge),
      platformFee: Math.round(platformFee),
      gatewayFee: Math.round(gatewayFee),
      taxAmount: Math.round(taxAmount),
      grossTotalBeforeDiscount: Math.round(grossTotalBeforeDiscount),
      discountAmount: Math.round(discountAmount),
      discountCapApplied,
      finalPrice: Math.round(rawFinal),
      roundedPrice,
      companionPayoutAmount,
      companionCommissionAmount,
      pricingVersion: pricingProfile.version || 'v1.0',
      effectiveFrom: pricingProfile.effective_from || new Date().toISOString().split('T')[0],
      snapshotCode,
      historicalPriceLock: pricingProfile.historical_price_lock ?? true,
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
