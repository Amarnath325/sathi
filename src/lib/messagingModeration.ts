/**
 * COMPANION CONNECT — REAL-TIME CHAT MODERATION & ANTI-BYPASS FILTER
 * Scans, flags, and redacts unauthorized contact exchange attempts prior to booking confirmation.
 */

export interface MessageModerationResult {
  isClean: boolean;
  containsContactExchange: boolean;
  containsProhibitedContent: boolean;
  sanitizedContent: string;
  flaggedCategories: string[];
  rejectionReason?: string;
}

export class MessagingModerationEngine {
  /**
   * Scans a chat message for contact exchange attempts or policy violations
   */
  public static moderateMessage(content: string, isBookingConfirmed: boolean = false): MessageModerationResult {
    let sanitizedContent = content;
    const flaggedCategories: string[] = [];
    let containsContactExchange = false;
    let containsProhibitedContent = false;

    // Pattern 1: Phone Numbers (Standard, spaced, Obfuscated e.g. "98 76 54 32 10" or "nine eight seven...")
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}|\b\d{10}\b/gi;
    const obfuscatedPhoneRegex = /\b(zero|one|two|three|four|five|six|seven|eight|nine)[\s\S]{1,50}(zero|one|two|three|four|five|six|seven|eight|nine)\b/gi;

    // Pattern 2: Email Addresses (e.g. alex@gmail.com, alex [at] yahoo [dot] com)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
    const obfuscatedEmailRegex = /[a-zA-Z0-9._%+-]+[\s]*(\[at\]|at|@)[\s]*[a-zA-Z0-9.-]+[\s]*(\[dot\]|dot|\.)[\s]*[a-zA-Z]{2,}/gi;

    // Pattern 3: External Payment Handles & Social Messaging Links (UPI, CashApp, Venmo, WhatsApp, Telegram)
    const paymentRegex = /\b([a-zA-Z0-9._-]+@(upi|okicici|okhdfcbank|okaxis|ybl)|cash\.app|\$[a-zA-Z0-9_]+|venmo\.com|paypal\.me|t\.me\/|wa\.me\/|instagram\.com\/)\b/gi;

    // Pattern 4: Zero-Tolerance Prohibited Terms (Sexual / Illegal Solicitation)
    const prohibitedTermsRegex = /\b(escort|prostitution|nude|erotic|happy ending|cocaine|drugs|weapons|cash outside platform)\b/gi;

    // Check Prohibited Terms first
    if (prohibitedTermsRegex.test(content)) {
      containsProhibitedContent = true;
      flaggedCategories.push('PROHIBITED_SERVICE_SOLICITATION');
      return {
        isClean: false,
        containsContactExchange: false,
        containsProhibitedContent: true,
        sanitizedContent: '[MESSAGE BLOCKED: Violates Companion Connect Trust & Safety Policy]',
        flaggedCategories,
        rejectionReason: 'Message contains prohibited content or off-platform solicitation.'
      };
    }

    // Contact Exchange Enforcement (Active UNTIL Booking is CONFIRMED)
    if (!isBookingConfirmed) {
      if (phoneRegex.test(content) || obfuscatedPhoneRegex.test(content)) {
        containsContactExchange = true;
        flaggedCategories.push('PHONE_NUMBER_EXCHANGE');
        sanitizedContent = sanitizedContent.replace(phoneRegex, '[REDACTED: Phone number hidden until booking is confirmed]');
      }

      if (emailRegex.test(content) || obfuscatedEmailRegex.test(content)) {
        containsContactExchange = true;
        flaggedCategories.push('EMAIL_ADDRESS_EXCHANGE');
        sanitizedContent = sanitizedContent.replace(emailRegex, '[REDACTED: Email hidden until booking is confirmed]');
      }

      if (paymentRegex.test(content)) {
        containsContactExchange = true;
        flaggedCategories.push('DIRECT_PAYMENT_BYPASS');
        sanitizedContent = sanitizedContent.replace(paymentRegex, '[REDACTED: External payment handle hidden. All payments must use Platform Escrow]');
      }
    }

    return {
      isClean: !containsContactExchange && !containsProhibitedContent,
      containsContactExchange,
      containsProhibitedContent,
      sanitizedContent,
      flaggedCategories
    };
  }
}
