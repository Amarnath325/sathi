/**
 * COMPANION CONNECT — 9-FACTOR MARKETPLACE MATCHING ENGINE & SAFETY GATE
 * Computes composite match scores with a mandatory Safety Gate rule.
 */

export interface SearchCriteria {
  location: string;
  serviceCategory: string;
  date?: string;
  timeSlot?: string;
  maxDistanceKm?: number;
  maxHourlyRate?: number;
  minRating?: number;
  requiredLanguages?: string[];
  requiredSkills?: string[];
}

export interface CompanionCandidate {
  id: string;
  name: string;
  avatar: string;
  city: string;
  distanceKm: number;
  hourlyRate: number;
  ratingAvg: number;
  ratingCount: number;
  completedBookings: number;
  cancellationRatePercent: number;
  responseTimeMin: number;
  categories: string[];
  languages: string[];
  skills: string[];
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FAILED' | 'EXPIRED';
  isIdentityVerified: boolean;
  safetyRiskScore: number; // 0.0 (Safe) to 1.0 (High Risk)
  isAvailableForDate: boolean;
  isAvailableForTime: boolean;
  rawComp?: any;
}

export interface MatchScoreResult {
  candidateId: string;
  totalMatchScore: number; // 0 to 100
  passedSafetyGate: boolean;
  safetyGateReason?: string;
  breakdown: {
    locationScore: number;     // max 20
    serviceScore: number;      // max 20
    availabilityScore: number; // max 15
    skillScore: number;        // max 10
    languageScore: number;     // max 10
    ratingScore: number;       // max 10
    reliabilityScore: number;  // max 10
    responseScore: number;     // max 5
    safetyScore: number;       // max 10
  };
}

export class MarketplaceMatchingEngine {
  /**
   * Calculates the composite 9-Factor Match Score for a companion candidate
   */
  public static calculateMatchScore(candidate: CompanionCandidate, criteria: SearchCriteria): MatchScoreResult {
    // ----------------------------------------------------
    // SAFETY GATE CHECK (HARD ENFORCEMENT RULE)
    // Safety acts as a gate, not merely another ranking feature.
    // Unverified accounts or high-risk accounts (>0.35) fail the gate.
    // ----------------------------------------------------
    let passedSafetyGate = true;
    let safetyGateReason = undefined;

    if (candidate.verificationStatus !== 'VERIFIED' && !candidate.isIdentityVerified) {
      passedSafetyGate = false;
      safetyGateReason = 'Failed Safety Gate: Identity Verification Pending or Unverified.';
    } else if (candidate.safetyRiskScore > 0.35) {
      passedSafetyGate = false;
      safetyGateReason = 'Failed Safety Gate: High Trust & Safety Risk Index Flagged.';
    } else if (candidate.cancellationRatePercent > 25.0) {
      passedSafetyGate = false;
      safetyGateReason = 'Failed Safety Gate: Excessive Cancellation Rate.';
    }

    // 1. Location Score (Max 20 pts)
    let locationScore = 0;
    if (criteria.location && candidate.city.toLowerCase().includes(criteria.location.toLowerCase())) {
      locationScore = 20;
    } else {
      const dist = candidate.distanceKm || 10;
      locationScore = Math.max(0, 20 - Math.floor(dist * 0.8));
    }

    // 2. Service Compatibility Score (Max 20 pts)
    let serviceScore = 0;
    if (criteria.serviceCategory) {
      const match = candidate.categories.some(c => 
        c.toLowerCase().includes(criteria.serviceCategory.toLowerCase()) ||
        criteria.serviceCategory.toLowerCase().includes(c.toLowerCase())
      );
      serviceScore = match ? 20 : 5;
    } else {
      serviceScore = 20;
    }

    // 3. Availability Score (Max 15 pts)
    let availabilityScore = 0;
    if (candidate.isAvailableForDate && candidate.isAvailableForTime) {
      availabilityScore = 15;
    } else if (candidate.isAvailableForDate) {
      availabilityScore = 10;
    } else {
      availabilityScore = 5;
    }

    // 4. Skill Match Score (Max 10 pts)
    let skillScore = 10;
    if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
      const matches = criteria.requiredSkills.filter(s => 
        candidate.skills.some(cs => cs.toLowerCase() === s.toLowerCase())
      ).length;
      skillScore = Math.round((matches / criteria.requiredSkills.length) * 10);
    }

    // 5. Language Score (Max 10 pts)
    let languageScore = 10;
    if (criteria.requiredLanguages && criteria.requiredLanguages.length > 0) {
      const matches = criteria.requiredLanguages.filter(l => 
        candidate.languages.some(cl => cl.toLowerCase() === l.toLowerCase())
      ).length;
      languageScore = Math.round((matches / criteria.requiredLanguages.length) * 10);
    }

    // 6. Rating Score (Max 10 pts)
    const ratingScore = Math.round((candidate.ratingAvg / 5.0) * 10);

    // 7. Reliability & Completion Score (Max 10 pts)
    const completionRate = Math.max(0, 100 - candidate.cancellationRatePercent);
    const reliabilityScore = Math.round((completionRate / 100) * 10);

    // 8. Response Time Score (Max 5 pts)
    let responseScore = 5;
    if (candidate.responseTimeMin <= 15) responseScore = 5;
    else if (candidate.responseTimeMin <= 45) responseScore = 3;
    else responseScore = 1;

    // 9. Safety Score (Max 10 pts)
    let safetyScore = 10;
    if (candidate.safetyRiskScore <= 0.05) safetyScore = 10;
    else if (candidate.safetyRiskScore <= 0.20) safetyScore = 7;
    else safetyScore = 3;

    const rawTotal = 
      locationScore + 
      serviceScore + 
      availabilityScore + 
      skillScore + 
      languageScore + 
      ratingScore + 
      reliabilityScore + 
      responseScore + 
      safetyScore;

    // Hard Penalty if Safety Gate Failed
    const totalMatchScore = passedSafetyGate ? Math.min(100, rawTotal) : Math.min(30, rawTotal);

    return {
      candidateId: candidate.id,
      totalMatchScore,
      passedSafetyGate,
      safetyGateReason,
      breakdown: {
        locationScore,
        serviceScore,
        availabilityScore,
        skillScore,
        languageScore,
        ratingScore,
        reliabilityScore,
        responseScore,
        safetyScore
      }
    };
  }

  /**
   * Ranks list of companion candidates based on composite Match Score & Safety Gate
   */
  public static rankCandidates(candidates: CompanionCandidate[], criteria: SearchCriteria) {
    const scoredList = candidates.map(c => ({
      candidate: c,
      matchResult: this.calculateMatchScore(c, criteria)
    }));

    // Sort: Passed Safety Gate candidates FIRST, then by highest Total Match Score
    scoredList.sort((a, b) => {
      if (a.matchResult.passedSafetyGate !== b.matchResult.passedSafetyGate) {
        return a.matchResult.passedSafetyGate ? -1 : 1;
      }
      return b.matchResult.totalMatchScore - a.matchResult.totalMatchScore;
    });

    return scoredList;
  }
}
