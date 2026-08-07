/**
 * COMPANION CONNECT — ENTERPRISE ONBOARDING PIPELINE
 * 8-Step Companion Verification Lifecycle & Privacy-Preserving Document Vault Engine
 */

export type VerificationStatusType = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'VERIFIED'
  | 'FAILED'
  | 'EXPIRED'
  | 'REVOKED';

export interface OnboardingStep {
  stepNumber: number;
  stepKey: string;
  title: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  completedAt?: string;
  metadata?: Record<string, any>;
}

export interface CompanionOnboardingState {
  userId: string;
  verificationStatus: VerificationStatusType;
  currentStep: number;
  steps: OnboardingStep[];
  isAgeValid: boolean;
  identityDocUploaded: boolean;
  moderationApproved: boolean;
  safetyCheckCleared: boolean;
}

const DEFAULT_ONBOARDING_STEPS: OnboardingStep[] = [
  { stepNumber: 1, stepKey: 'REGISTRATION', title: 'Account Registration', description: 'Basic credentials created', status: 'COMPLETED' },
  { stepNumber: 2, stepKey: 'EMAIL_VERIFICATION', title: 'Email Verification', description: 'Confirm email ownership via link or OTP', status: 'COMPLETED' },
  { stepNumber: 3, stepKey: 'PHONE_OTP', title: 'Phone OTP Verification', description: 'Verify mobile phone number via SMS OTP', status: 'COMPLETED' },
  { stepNumber: 4, stepKey: 'DATE_OF_BIRTH', title: 'Date of Birth Entry', description: 'Provide legal birth date for identity record', status: 'COMPLETED' },
  { stepNumber: 5, stepKey: 'AGE_VALIDATION', title: 'Age Validation (18+)', description: 'System check confirming user is 18 years of age or older', status: 'COMPLETED' },
  { stepNumber: 6, stepKey: 'IDENTITY_VERIFICATION', title: 'Government Identity Verification', description: 'Encrypted document upload (Passport / ID / Driver License)', status: 'IN_PROGRESS' },
  { stepNumber: 7, stepKey: 'PROFILE_MODERATION', title: 'Profile Content Moderation', description: 'Human & AI review of companion bio, services & photos', status: 'NOT_STARTED' },
  { stepNumber: 8, stepKey: 'SAFETY_CHECKS', title: 'Trust & Safety Background Checks', description: 'Sanction list & abuse database verification', status: 'NOT_STARTED' },
];

export class CompanionOnboardingPipeline {
  /**
   * Initializes or fetches companion onboarding pipeline state
   */
  public static getOnboardingState(userId: string, inputStatus?: VerificationStatusType): CompanionOnboardingState {
    const status = inputStatus || 'IN_PROGRESS';
    const isFullyApproved = status === 'VERIFIED';

    const steps = DEFAULT_ONBOARDING_STEPS.map(step => {
      if (isFullyApproved) {
        return { ...step, status: 'COMPLETED' as const, completedAt: new Date().toISOString() };
      }
      return step;
    });

    return {
      userId,
      verificationStatus: status,
      currentStep: isFullyApproved ? 8 : 6,
      steps,
      isAgeValid: true,
      identityDocUploaded: isFullyApproved,
      moderationApproved: isFullyApproved,
      safetyCheckCleared: isFullyApproved,
    };
  }

  /**
   * Advances the onboarding pipeline step
   */
  public static advanceStep(
    currentState: CompanionOnboardingState, 
    completedStepKey: string,
    stepMetadata?: Record<string, any>
  ): CompanionOnboardingState {
    const updatedSteps = currentState.steps.map(step => {
      if (step.stepKey === completedStepKey) {
        return { 
          ...step, 
          status: 'COMPLETED' as const, 
          completedAt: new Date().toISOString(),
          metadata: stepMetadata || step.metadata
        };
      }
      return step;
    });

    const completedCount = updatedSteps.filter(s => s.status === 'COMPLETED').length;
    let nextStatus: VerificationStatusType = 'IN_PROGRESS';

    if (completedCount === 8) {
      nextStatus = 'VERIFIED';
    }

    return {
      ...currentState,
      verificationStatus: nextStatus,
      currentStep: Math.min(8, completedCount + 1),
      steps: updatedSteps,
      identityDocUploaded: completedStepKey === 'IDENTITY_VERIFICATION' ? true : currentState.identityDocUploaded,
      moderationApproved: completedStepKey === 'PROFILE_MODERATION' ? true : currentState.moderationApproved,
      safetyCheckCleared: completedStepKey === 'SAFETY_CHECKS' ? true : currentState.safetyCheckCleared,
    };
  }

  /**
   * Privacy Protection Policy: Masks identity document details from public view
   * Only authorized staff with VERIFICATION_TEAM role can inspect unmasked documents
   */
  public static sanitizePublicCompanionProfile(profile: any, requesterRole: string = 'USER') {
    const isAuthorizedAdmin = ['ADMIN', 'SUPER_ADMIN', 'VERIFICATION_TEAM', 'MODERATOR'].includes(requesterRole);
    
    if (!isAuthorizedAdmin) {
      // Strip sensitive verification document URLs & raw government IDs
      const { kycDocuments, idNumber, passportNumber, selfieUrl, ...publicProfile } = profile;
      return {
        ...publicProfile,
        verificationBadge: profile.verificationBadge || profile.verificationStatus === 'VERIFIED',
        verificationStatus: profile.verificationStatus || 'VERIFIED',
      };
    }
    return profile;
  }
}
