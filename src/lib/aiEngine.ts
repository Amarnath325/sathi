import { UserProfile, Review } from './types';

export interface AIRecommendationOptions {
  category?: string;
  maxPrice?: number;
  minRating?: number;
  city?: string;
  verifiedOnly?: boolean;
  searchQuery?: string;
}

export interface RiskAnalysisResult {
  riskScore: number; // 0.0 (Safe) to 1.0 (Critical)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flags: string[];
  recommendation: 'APPROVE' | 'FLAG_FOR_MANUAL_REVIEW' | 'AUTO_BLOCK';
}

export interface ProfileQualityScore {
  overallScore: number; // 0 - 100
  photoQuality: number;
  bioCompleteness: number;
  verificationGrade: string;
  improvementTips: string[];
}

/**
 * AI Powered Smart Companion Recommendation Algorithm
 */
export function recommendCompanions(
  companions: UserProfile[],
  options: AIRecommendationOptions
): UserProfile[] {
  let scored = companions.map(comp => {
    let score = 100;

    // Filter matching
    if (options.category && !comp.categories.includes(options.category)) {
      score -= 50;
    }

    if (options.maxPrice && comp.hourlyRate > options.maxPrice) {
      score -= 40;
    }

    if (options.minRating && comp.ratingAvg < options.minRating) {
      score -= 30;
    }

    if (options.city && comp.city.toLowerCase() !== options.city.toLowerCase()) {
      score -= 20;
    }

    if (options.verifiedOnly && !comp.verificationBadge) {
      score -= 60;
    }

    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      const text = `${comp.name} ${comp.bio} ${comp.skills.join(' ')} ${comp.city}`.toLowerCase();
      if (!text.includes(q)) {
        score -= 25;
      } else {
        score += 15;
      }
    }

    // Boost high rated & verified companions
    score += comp.ratingAvg * 5;
    if (comp.verificationBadge) score += 10;
    if (comp.isAvailableNow) score += 8;

    return { companion: comp, score };
  });

  // Sort descending by AI score
  scored.sort((a, b) => b.score - a.score);

  return scored.map(item => item.companion);
}

/**
 * AI Fraud & Fake Profile Detection Scanner
 */
export function analyzeProfileRisk(profile: Partial<UserProfile>): RiskAnalysisResult {
  const flags: string[] = [];
  let riskScore = 0.05;

  if (!profile.verificationBadge && profile.kycStatus !== 'APPROVED') {
    riskScore += 0.25;
    flags.push('Unverified KYC document credentials');
  }

  if (!profile.photos || profile.photos.length < 2) {
    riskScore += 0.15;
    flags.push('Low count of authentic photos');
  }

  if (!profile.bio || profile.bio.length < 40) {
    riskScore += 0.10;
    flags.push('Bio description lacks sufficient detail');
  }

  // Detect suspicious prohibited keywords in bio
  const prohibitedKeywords = ['escort', 'cash only', 'off-platform', 'telegram', 'whatsapp only', 'wire transfer'];
  if (profile.bio) {
    const lowerBio = profile.bio.toLowerCase();
    for (const kw of prohibitedKeywords) {
      if (lowerBio.includes(kw)) {
        riskScore += 0.40;
        flags.push(`Prohibited security term detected: "${kw}"`);
      }
    }
  }

  let riskLevel: RiskAnalysisResult['riskLevel'] = 'LOW';
  let recommendation: RiskAnalysisResult['recommendation'] = 'APPROVE';

  if (riskScore >= 0.70) {
    riskLevel = 'CRITICAL';
    recommendation = 'AUTO_BLOCK';
  } else if (riskScore >= 0.35) {
    riskLevel = 'HIGH';
    recommendation = 'FLAG_FOR_MANUAL_REVIEW';
  } else if (riskScore >= 0.20) {
    riskLevel = 'MEDIUM';
    recommendation = 'FLAG_FOR_MANUAL_REVIEW';
  }

  return {
    riskScore: Math.min(1.0, Math.round(riskScore * 100) / 100),
    riskLevel,
    flags,
    recommendation
  };
}

/**
 * AI Profile Quality Scorer
 */
export function calculateProfileQualityScore(profile: UserProfile): ProfileQualityScore {
  let photoScore = Math.min(100, (profile.photos?.length || 1) * 33);
  let bioScore = Math.min(100, Math.round(((profile.bio?.length || 0) / 200) * 100));
  let overall = Math.round((photoScore * 0.4) + (bioScore * 0.3) + (profile.verificationBadge ? 30 : 10));

  const tips: string[] = [];
  if (photoScore < 80) tips.push('Add at least 3 high-resolution professional photos');
  if (bioScore < 70) tips.push('Expand bio description to 150+ words highlighting etiquette and hobbies');
  if (!profile.verificationBadge) tips.push('Complete Government ID & Live Selfie KYC verification');

  let grade = 'A+';
  if (overall < 60) grade = 'C';
  else if (overall < 80) grade = 'B+';
  else if (overall < 90) grade = 'A';

  return {
    overallScore: Math.min(100, overall),
    photoQuality: photoScore,
    bioCompleteness: bioScore,
    verificationGrade: grade,
    improvementTips: tips
  };
}
