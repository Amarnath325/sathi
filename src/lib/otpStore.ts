/**
 * COMPANION CONNECT — DATABASE OTP PERSISTENCE STORE
 * Manages OTP records, expiration timestamps (10 mins), verification checks,
 * and post-verification nullification (otpCode = null).
 */

export interface OtpRecord {
  phone: string;
  otpCode: string | null; // Nullified after successful verification!
  expiresAt: number; // Unix timestamp in ms
  isVerified: boolean;
  attempts: number;
  createdAt: string;
}

// In-memory Database table simulation for OTP records
const OTP_DB_TABLE: Map<string, OtpRecord> = new Map();

export class OtpStore {
  /**
   * Generates a new 6-digit OTP, saves it in DB, and sets 10-minute expiry
   */
  public static createOtpRecord(phone: string): OtpRecord {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 Minutes validity

    const record: OtpRecord = {
      phone: cleanPhone,
      otpCode: generatedCode,
      expiresAt,
      isVerified: false,
      attempts: 0,
      createdAt: new Date().toISOString()
    };

    OTP_DB_TABLE.set(cleanPhone, record);
    console.log(`[OTP DB] Saved OTP record for ${cleanPhone}: Code = ${generatedCode}, ExpiresAt = ${new Date(expiresAt).toLocaleTimeString()}`);
    return record;
  }

  /**
   * Retrieves active OTP record for a phone number
   */
  public static getOtpRecord(phone: string): OtpRecord | undefined {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    return OTP_DB_TABLE.get(cleanPhone);
  }

  /**
   * Verifies an entered OTP code against DB record.
   * On success: NULLIFIES the otpCode in DB (otpCode = null) and sets isVerified = true.
   */
  public static verifyOtpCode(phone: string, inputCode: string): { success: boolean; error?: string } {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const record = OTP_DB_TABLE.get(cleanPhone);

    if (!record) {
      return { success: false, error: 'No OTP requested for this phone number. Please request a new code.' };
    }

    if (record.isVerified) {
      return { success: false, error: 'This OTP has already been verified and used.' };
    }

    if (!record.otpCode) {
      return { success: false, error: 'OTP record is nullified. Please request a fresh OTP.' };
    }

    if (Date.now() > record.expiresAt) {
      // Nullify expired code
      record.otpCode = null;
      return { success: false, error: 'OTP code has expired (validity: 10 mins). Please click resend.' };
    }

    record.attempts += 1;

    if (record.attempts > 5) {
      record.otpCode = null; // Lock & nullify
      return { success: false, error: 'Too many failed verification attempts. OTP has been invalidated.' };
    }

    if (record.otpCode !== inputCode.trim()) {
      return { success: false, error: `Incorrect OTP! You entered "${inputCode}". Please check your SMS.` };
    }

    // SUCCESSFUL VERIFICATION -> NULLIFY OTP IN DB AS REQUESTED!
    record.otpCode = null;
    record.isVerified = true;
    OTP_DB_TABLE.set(cleanPhone, record);

    console.log(`[OTP DB] OTP verified & NULLIFIED successfully for ${cleanPhone}. Record status: isVerified = true, otpCode = null.`);
    return { success: true };
  }

  /**
   * Manually nullify/delete OTP record
   */
  public static nullifyOtpRecord(phone: string): void {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const record = OTP_DB_TABLE.get(cleanPhone);
    if (record) {
      record.otpCode = null;
      record.isVerified = true;
    }
  }
}
