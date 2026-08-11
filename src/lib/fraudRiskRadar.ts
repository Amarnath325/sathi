import { DisputeTicket } from './types';

export interface FraudRiskAnalysis {
  riskScore: number; // 0 to 100
  riskCategory: 'LOW_RISK' | 'ELEVATED_RISK' | 'HIGH_RISK_FRAUD';
  riskColor: string;
  riskBadges: string[];
  recommendation: string;
}

/**
 * Calculates Fraud Risk & Chargeback Threat level for a dispute ticket.
 */
export function evaluateFraudRisk(dispute: DisputeTicket): FraudRiskAnalysis {
  const { customerId, disputedAmount, category, reason, detailedDescription } = dispute;

  let riskScore = 12;
  const riskBadges: string[] = [];

  const text = `${reason} ${detailedDescription}`.toLowerCase();

  // High amount check
  if (disputedAmount >= 300) {
    riskScore += 25;
    riskBadges.push('High Escrow Value ($300+)');
  }

  // Cash / off-platform claim
  if (category === 'UNAUTHORIZED_FEE' || text.includes('cash') || text.includes('card')) {
    riskScore += 30;
    riskBadges.push('Off-Platform Payment Risk');
  }

  // Chargeback threat keywords
  if (text.includes('bank') || text.includes('chargeback') || text.includes('lawyer') || text.includes('sue')) {
    riskScore += 35;
    riskBadges.push('External Chargeback Threat');
  }

  // Simulated repeat dispute lookup based on customer ID hash
  if (customerId.includes('1') || customerId.includes('3')) {
    riskScore += 20;
    riskBadges.push('Repeat Dispute History (30 Days)');
  }

  riskScore = Math.min(99, riskScore);

  let riskCategory: FraudRiskAnalysis['riskCategory'] = 'LOW_RISK';
  let riskColor = 'emerald';
  let recommendation = 'Low risk profile. Proceed with standard arbitration.';

  if (riskScore >= 70) {
    riskCategory = 'HIGH_RISK_FRAUD';
    riskColor = 'rose';
    recommendation = 'HIGH FRAUD THREAT: Verify identity documents & GPS logs before approving refund.';
  } else if (riskScore >= 40) {
    riskCategory = 'ELEVATED_RISK';
    riskColor = 'amber';
    recommendation = 'Elevated Risk: Check user\'s past 3 booking completion receipts.';
  }

  if (riskBadges.length === 0) {
    riskBadges.push('Verified Account History');
  }

  return {
    riskScore,
    riskCategory,
    riskColor,
    riskBadges,
    recommendation
  };
}
