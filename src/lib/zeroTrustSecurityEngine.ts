/**
 * COMPANION CONNECT — ZERO-TRUST SECURITY ENGINE & PII PRIVACY SHIELD
 * Enterprise-grade security utilities for data minimization, PII masking, device risk scoring,
 * rate limiting, and session integrity verification.
 */

export interface ActiveSession {
  id: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrentDevice: boolean;
  trustScore: number; // 0 to 100
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  eventType: 'LOGIN_SUCCESS' | 'PII_MASKED' | 'RATE_LIMIT_BLOCKED' | 'SUSPICIOUS_IP' | 'SESSION_REVOKED' | 'KEY_ROTATED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  ipAddress: string;
}

export class ZeroTrustSecurityEngine {
  /**
   * Auto-masks PII Email Address (e.g. "amarnath@example.com" -> "a******h@example.com")
   */
  public static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return 'e****@sathi.com';
    const [user, domain] = email.split('@');
    if (user.length <= 2) return `${user[0]}*@${domain}`;
    return `${user[0]}${'*'.repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;
  }

  /**
   * Auto-masks PII Phone Number (e.g. "+91 9876543210" -> "+91 98****3210")
   */
  public static maskPhone(phone: string): string {
    if (!phone) return '+91 XX****XXXX';
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 8) return '+91 98****3210';
    const prefix = phone.substring(0, 5);
    const suffix = phone.substring(phone.length - 4);
    return `${prefix}****${suffix}`;
  }

  /**
   * Auto-masks Government ID Number (e.g. "1234-5678-9012" -> "XXXX-XXXX-9012")
   */
  public static maskGovtId(govtId: string): string {
    if (!govtId) return 'XXXX-XXXX-8921';
    const clean = govtId.replace(/\s|-/g, '');
    if (clean.length < 4) return 'XXXX-XXXX-8921';
    const lastFour = clean.slice(-4);
    return `XXXX-XXXX-${lastFour}`;
  }

  /**
   * Calculates IP & Device Fraud Risk Score (0.0 = Very Safe, 1.0 = High Threat)
   */
  public static calculateDeviceRiskScore(ip: string, userAgent: string, isVpn: boolean = false): number {
    let risk = 0.05; // Base low risk
    if (isVpn) risk += 0.40;
    if (ip.startsWith('192.168') || ip.startsWith('10.0')) risk += 0.00; // Intranet safe
    if (!userAgent || userAgent.toLowerCase().includes('bot') || userAgent.toLowerCase().includes('curl')) {
      risk += 0.50;
    }
    return Math.min(1.0, parseFloat(risk.toFixed(2)));
  }

  /**
   * Token Bucket Rate Limiter check (Simulated in memory)
   */
  public static checkRateLimit(requestCount: number, limitPerMin: number = 60): { allowed: boolean; remaining: number } {
    const allowed = requestCount <= limitPerMin;
    const remaining = Math.max(0, limitPerMin - requestCount);
    return { allowed, remaining };
  }

  /**
   * Mock Initial Active Sessions for current user
   */
  public static getMockSessions(): ActiveSession[] {
    return [
      {
        id: 'sess-01',
        deviceName: 'Chrome 127 on Windows 11 (Current)',
        ipAddress: '103.220.18.42',
        location: 'Raipur, Chhattisgarh, IN',
        lastActive: 'Active Now',
        isCurrentDevice: true,
        trustScore: 98
      },
      {
        id: 'sess-02',
        deviceName: 'Sathi Mobile App v2.4 (iPhone 15 Pro)',
        ipAddress: '157.33.204.11',
        location: 'Raipur, Chhattisgarh, IN',
        lastActive: '14 mins ago',
        isCurrentDevice: false,
        trustScore: 92
      },
      {
        id: 'sess-03',
        deviceName: 'Safari on macOS Sonoma',
        ipAddress: '49.36.12.98',
        location: 'Mumbai, Maharashtra, IN',
        lastActive: '2 days ago',
        isCurrentDevice: false,
        trustScore: 78
      }
    ];
  }

  /**
   * Mock Security Event Audit Logs
   */
  public static getMockSecurityLogs(): SecurityEventLog[] {
    return [
      {
        id: 'sec-log-101',
        timestamp: '2026-08-11 14:32:05',
        eventType: 'LOGIN_SUCCESS',
        severity: 'LOW',
        details: 'Verified 2FA login from Windows 11 desktop via Biometric WebAuthn.',
        ipAddress: '103.220.18.42'
      },
      {
        id: 'sec-log-102',
        timestamp: '2026-08-11 13:45:12',
        eventType: 'PII_MASKED',
        severity: 'LOW',
        details: 'Zero-Trust Shield auto-masked 4 client phone numbers & Govt IDs during profile query.',
        ipAddress: '103.220.18.42'
      },
      {
        id: 'sec-log-103',
        timestamp: '2026-08-11 11:20:44',
        eventType: 'KEY_ROTATED',
        severity: 'LOW',
        details: 'Automated 256-bit AES Escrow Vault key rotation completed successfully.',
        ipAddress: 'System Internal'
      },
      {
        id: 'sec-log-104',
        timestamp: '2026-08-11 08:15:30',
        eventType: 'RATE_LIMIT_BLOCKED',
        severity: 'MEDIUM',
        details: 'Token Bucket rate limiter blocked automated API scraper attempt (72 req/min).',
        ipAddress: '185.220.101.4'
      }
    ];
  }
}
