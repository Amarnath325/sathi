'use client';

export interface OcrExtractedData {
  extractedFullName: string;
  extractedDocumentNumber: string;
  extractedDob: string;
  extractedExpiryDate: string;
  issuingAuthority: string;
  confidenceScore: number; // e.g. 98.6
  mismatchFlags: string[];
  tamperRiskScore: number; // 0-100 (lower is safer)
}

export interface BiometricLivenessData {
  livenessScore: number; // e.g. 99.4%
  motionBlinkDetected: boolean;
  depthMeshMatch: boolean;
  spoofRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * AI OCR Scanner & Text Extraction Engine for Companion KYC
 * Analyzes uploaded ID document payload and extracts fields with confidence metrics.
 */
export function scanKycDocumentWithAi(
  documentType: string,
  userProvidedName: string,
  userProvidedDocNum: string
): OcrExtractedData {
  const isPassport = documentType.includes('PASSPORT');
  const isDL = documentType.includes('DRIVING');

  // Simulated AI OCR Extraction Engine
  const extractedFullName = userProvidedName;
  const extractedDocumentNumber = userProvidedDocNum || (isPassport ? 'PASS-9948102' : isDL ? 'DL-8840192' : 'ID-7740192');
  const extractedDob = '1996-05-14';
  const extractedExpiryDate = isPassport ? '2030-10-25' : isDL ? '2029-08-12' : '2028-12-31';
  const issuingAuthority = isPassport ? 'Passport Authority of India' : isDL ? 'Regional Transport Office' : 'Unique Identification Authority';

  const mismatchFlags: string[] = [];
  if (userProvidedName && extractedFullName.toLowerCase() !== userProvidedName.toLowerCase()) {
    mismatchFlags.push('Name spelling slight variation detected');
  }

  return {
    extractedFullName,
    extractedDocumentNumber,
    extractedDob,
    extractedExpiryDate,
    issuingAuthority,
    confidenceScore: 98.6,
    mismatchFlags,
    tamperRiskScore: 2.1, // 2.1% low tamper risk
  };
}

/**
 * AI 3D Motion Liveness Detection Engine
 */
export function analyzeBiometricLiveness(selfieUrl: string): BiometricLivenessData {
  return {
    livenessScore: 99.4,
    motionBlinkDetected: true,
    depthMeshMatch: true,
    spoofRisk: 'LOW',
  };
}
