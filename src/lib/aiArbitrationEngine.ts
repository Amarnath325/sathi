import { DisputeTicket, ResolutionOutcome } from './types';

export interface AIArbitrationResult {
  confidenceScore: number; // 0 - 100
  recommendedOutcome: ResolutionOutcome;
  recommendedRefundPercentage: number;
  recommendedRefundAmount: number;
  recommendedPenaltyAmount: number;
  evidenceMatchScore: number;
  timelineVerdict: string;
  riskFactors: string[];
  keyFindings: string[];
  aiSummary: string;
  suggestedActionLabel: string;
}

/**
 * Analyzes a DisputeTicket using simulated AI NLP & Timeline Matching.
 */
export function analyzeDisputeWithAI(dispute: DisputeTicket): AIArbitrationResult {
  const { category, reason, detailedDescription, evidence, messages, disputedAmount } = dispute;

  const combinedText = `${reason} ${detailedDescription} ${messages.map(m => m.message).join(' ')}`.toLowerCase();
  
  const customerEvidenceCount = evidence.filter(e => e.uploaderRole === 'CUSTOMER').length;
  const companionEvidenceCount = evidence.filter(e => e.uploaderRole === 'COMPANION').length;

  let confidenceScore = 85;
  let evidenceMatchScore = 78;
  let recommendedOutcome: ResolutionOutcome = 'FULL_REFUND_CUSTOMER';
  let recommendedRefundPercentage = 100;
  let recommendedPenaltyAmount = 0;
  const riskFactors: string[] = [];
  const keyFindings: string[] = [];

  // Keyword / Intent analysis
  const hasLateMention = combinedText.includes('late') || combinedText.includes('delay') || combinedText.includes('minutes');
  const hasNoShowMention = category === 'NO_SHOW' || combinedText.includes('no show') || combinedText.includes('didn\'t show') || combinedText.includes('waited');
  const hasCashFeeMention = category === 'UNAUTHORIZED_FEE' || combinedText.includes('cash') || combinedText.includes('tip') || combinedText.includes('fee');
  const hasTrafficJustification = combinedText.includes('traffic') || combinedText.includes('accident') || combinedText.includes('bridge');

  // Category specific logic
  if (hasNoShowMention) {
    confidenceScore = 96;
    evidenceMatchScore = 92;
    recommendedOutcome = 'FULL_REFUND_CUSTOMER';
    recommendedRefundPercentage = 100;
    recommendedPenaltyAmount = Math.round(disputedAmount * 0.2); // 20% penalty for no-show
    keyFindings.push('Companion failed to appear at designated location.');
    keyFindings.push('Zero active check-in timestamp found for companion.');
    riskFactors.push('High Severity: Unannounced No-Show violates Sathi Escrow Policy 3.1.');
  } else if (hasCashFeeMention) {
    confidenceScore = 94;
    evidenceMatchScore = 89;
    recommendedOutcome = 'FULL_REFUND_CUSTOMER';
    recommendedRefundPercentage = 100;
    recommendedPenaltyAmount = 50;
    keyFindings.push('Companion requested out-of-app cash payment during service.');
    riskFactors.push('Direct policy violation: Off-platform payment demand detected.');
  } else if (hasLateMention && hasTrafficJustification) {
    confidenceScore = 88;
    evidenceMatchScore = 85;
    recommendedOutcome = 'PARTIAL_REFUND';
    recommendedRefundPercentage = 50;
    keyFindings.push('Companion arrived late due to documented traffic, but notified customer.');
    keyFindings.push('Partial service was delivered for a reduced duration.');
    riskFactors.push('Service reduction: 45-minute delay impacted overall duration.');
  } else if (category === 'SERVICE_QUALITY') {
    confidenceScore = 82;
    evidenceMatchScore = 80;
    recommendedOutcome = 'PARTIAL_REFUND';
    recommendedRefundPercentage = 75;
    keyFindings.push('Timelines show partial fulfillment with verified arrival timestamp.');
    keyFindings.push(`Customer provided ${customerEvidenceCount} evidence attachments.`);
  } else {
    confidenceScore = 80;
    evidenceMatchScore = 75;
    recommendedOutcome = 'RELEASE_COMPANION';
    recommendedRefundPercentage = 0;
    keyFindings.push('Evidence uploaded does not conclusively demonstrate breach of service agreement.');
  }

  // Evidence score boosts
  if (customerEvidenceCount > 0 && companionEvidenceCount > 0) {
    confidenceScore = Math.min(99, confidenceScore + 5);
    evidenceMatchScore = Math.min(98, evidenceMatchScore + 10);
    keyFindings.push('Bi-directional evidence provided by both Customer and Companion.');
  }

  const recommendedRefundAmount = Math.round((disputedAmount * recommendedRefundPercentage) / 100);

  let timelineVerdict = 'Timestamps verified via GPS & chat logs.';
  if (hasLateMention) {
    timelineVerdict = 'GPS entrance logs confirm arrival discrepancy vs contracted start time.';
  } else if (hasNoShowMention) {
    timelineVerdict = 'GPS logs confirm customer waited 40+ minutes with no companion check-in.';
  }

  let suggestedActionLabel = 'Issue 100% Full Refund to Customer';
  if (recommendedRefundPercentage === 50) {
    suggestedActionLabel = 'Issue 50% Fair Split Refund';
  } else if (recommendedRefundPercentage === 75) {
    suggestedActionLabel = 'Issue 75% Refund & Release 25%';
  } else if (recommendedRefundPercentage === 0) {
    suggestedActionLabel = 'Dismiss Dispute & Release Payout';
  }

  const aiSummary = `AI Neural Arbitration evaluated Dispute #${dispute.disputeRef}. Based on ${evidence.length} evidence uploads and ${messages.length} thread messages, the engine calculated an evidence match score of ${evidenceMatchScore}%. Verdict recommends ${suggestedActionLabel} ($${recommendedRefundAmount}).`;

  return {
    confidenceScore,
    recommendedOutcome,
    recommendedRefundPercentage,
    recommendedRefundAmount,
    recommendedPenaltyAmount,
    evidenceMatchScore,
    timelineVerdict,
    riskFactors,
    keyFindings,
    aiSummary,
    suggestedActionLabel
  };
}
