/**
 * COMPANION CONNECT — PROHIBITED SERVICES & RISK POLICY ENGINE
 * Admin-controlled service evaluation engine with LOW, MEDIUM, HIGH risk levels and safety controls.
 */

export type RiskLevelType = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ServicePolicyItem {
  serviceId: string;
  serviceName: string;
  categoryName: string;
  riskLevel: RiskLevelType;
  allowed: boolean;
  requiresVerification: boolean;
  requiresAdminApproval: boolean;
  requiresLocation: boolean;
  requiresAgeVerification: boolean;
  prohibitedKeywords: string[];
  safetyControls: string[];
}

// Master Admin Service Catalog Matrix
export const MASTER_SERVICE_CATALOG: ServicePolicyItem[] = [
  // LOW RISK SERVICES
  {
    serviceId: 'SRV-CONV-01',
    serviceName: 'Conversation Partner',
    categoryName: 'Companionship',
    riskLevel: 'LOW',
    allowed: true,
    requiresVerification: true,
    requiresAdminApproval: false,
    requiresLocation: false,
    requiresAgeVerification: true,
    prohibitedKeywords: ['sexual', 'intimate', 'escort', 'massages', 'dating'],
    safetyControls: ['In-app Chat Moderation', 'Standard User Rating']
  },
  {
    serviceId: 'SRV-STUDY-02',
    serviceName: 'Study Partner',
    categoryName: 'Academic & Learning',
    riskLevel: 'LOW',
    allowed: true,
    requiresVerification: true,
    requiresAdminApproval: false,
    requiresLocation: false,
    requiresAgeVerification: true,
    prohibitedKeywords: ['cheating', 'exam proxy', 'academic fraud'],
    safetyControls: ['Library & Public Campus Location Guidelines']
  },
  {
    serviceId: 'SRV-GAME-03',
    serviceName: 'Gaming Partner',
    categoryName: 'Entertainment & Gaming',
    riskLevel: 'LOW',
    allowed: true,
    requiresVerification: false,
    requiresAdminApproval: false,
    requiresLocation: false,
    requiresAgeVerification: true,
    prohibitedKeywords: ['gambling', 'real money wagering', 'account selling'],
    safetyControls: ['Voice Chat Recording Logging', 'Platform Escrow']
  },

  // MEDIUM RISK SERVICES
  {
    serviceId: 'SRV-TRAVEL-04',
    serviceName: 'Travel Companion',
    categoryName: 'Travel & Exploration',
    riskLevel: 'MEDIUM',
    allowed: true,
    requiresVerification: true,
    requiresAdminApproval: false,
    requiresLocation: true,
    requiresAgeVerification: true,
    prohibitedKeywords: ['overnight sharing', 'unregistered transit'],
    safetyControls: ['Real-Time GPS Trip Sharing', 'Emergency SOS Trigger', 'Itinerary Check-In']
  },
  {
    serviceId: 'SRV-ELDER-05',
    serviceName: 'Elderly Support & Assistance',
    categoryName: 'Care & Assistance',
    riskLevel: 'MEDIUM',
    allowed: true,
    requiresVerification: true,
    requiresAdminApproval: true,
    requiresLocation: true,
    requiresAgeVerification: true,
    prohibitedKeywords: ['medical administration', 'nursing care', 'prescriptions'],
    safetyControls: ['Medical Disclaimer Consent', 'Emergency Family Contact Verification']
  },
  {
    serviceId: 'SRV-FIT-06',
    serviceName: 'Fitness & Workout Partner',
    categoryName: 'Health & Sports',
    riskLevel: 'MEDIUM',
    allowed: true,
    requiresVerification: true,
    requiresAdminApproval: false,
    requiresLocation: true,
    requiresAgeVerification: true,
    prohibitedKeywords: ['supplements sales', 'steroids', 'physical contact'],
    safetyControls: ['Public Gym / Park Verification']
  },

  // HIGH RISK SERVICES (REQUIRES ENHANCED SAFETY CONTROLS)
  {
    serviceId: 'SRV-OVERNIGHT-07',
    serviceName: 'Overnight Event Assistance',
    categoryName: 'Event & Gala Support',
    riskLevel: 'HIGH',
    allowed: true,
    requiresVerification: true,
    requiresAdminApproval: true,
    requiresLocation: true,
    requiresAgeVerification: true,
    prohibitedKeywords: ['hotel room sharing', 'private residence stay'],
    safetyControls: [
      'Mandatory Police Clearance Upload',
      'Dual Companion & User Identity Verification',
      'Active GPS Location Beacon',
      '24/7 Safety Desk Monitoring'
    ]
  },
  {
    serviceId: 'SRV-DIST-08',
    serviceName: 'Long-Distance Intercity Travel Partner',
    categoryName: 'Travel & Mobility',
    riskLevel: 'HIGH',
    allowed: true,
    requiresVerification: true,
    requiresAdminApproval: true,
    requiresLocation: true,
    requiresAgeVerification: true,
    prohibitedKeywords: ['border crossing without docs', 'unlicensed vehicle'],
    safetyControls: [
      'Ticket & Transit Proof Log',
      'Continuous Geofence Tracking',
      'Automatic Hourly Check-In Prompts'
    ]
  }
];

export class ServicePolicyEngine {
  /**
   * Evaluates whether a proposed service request is allowed under platform policies
   */
  public static evaluateServiceRequest(serviceName: string, description: string = ''): {
    allowed: boolean;
    riskLevel: RiskLevelType;
    reason?: string;
    matchedPolicy?: ServicePolicyItem;
    violations: string[];
  } {
    const textToScan = `${serviceName} ${description}`.toLowerCase();
    const violations: string[] = [];

    // Strictly Prohibited Terms Scanner (Zero-Tolerance Engine)
    const ZERO_TOLERANCE_TERMS = [
      'sexual', 'escort', 'prostitution', 'nude', 'erotic', 'happy ending',
      'drugs', 'cocaine', 'marijuana sale', 'weapon', 'violent', 'harass',
      'trafficking', 'exploit', 'underage', 'minor sex'
    ];

    for (const term of ZERO_TOLERANCE_TERMS) {
      if (textToScan.includes(term)) {
        violations.push(`Violation of Trust & Safety Policy: Contains prohibited term "${term}"`);
      }
    }

    if (violations.length > 0) {
      return {
        allowed: false,
        riskLevel: 'CRITICAL',
        reason: 'Service description violates platform Terms of Service (Strictly Prohibited Non-Legal Services).',
        violations
      };
    }

    // Match against Master Catalog
    const matchedPolicy = MASTER_SERVICE_CATALOG.find(s => 
      s.serviceName.toLowerCase() === serviceName.toLowerCase() ||
      serviceName.toLowerCase().includes(s.serviceName.toLowerCase())
    );

    if (!matchedPolicy) {
      return {
        allowed: true,
        riskLevel: 'MEDIUM',
        matchedPolicy: {
          serviceId: 'SRV-CUSTOM-GENERAL',
          serviceName: serviceName,
          categoryName: 'General Assistance',
          riskLevel: 'MEDIUM',
          allowed: true,
          requiresVerification: true,
          requiresAdminApproval: true,
          requiresLocation: true,
          requiresAgeVerification: true,
          prohibitedKeywords: ZERO_TOLERANCE_TERMS,
          safetyControls: ['Standard Chat Moderation', 'Location Verification']
        },
        violations: []
      };
    }

    return {
      allowed: matchedPolicy.allowed,
      riskLevel: matchedPolicy.riskLevel,
      matchedPolicy,
      violations: []
    };
  }
}
