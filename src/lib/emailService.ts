import nodemailer from 'nodemailer';

export interface SendOtpResult {
  sent: boolean;
  method: 'smtp' | 'ethereal' | 'simulated';
  previewUrl?: string;
  code?: string;
  error?: string;
}

/**
 * Sends a 6-digit OTP email to the candidate's email address.
 * Uses real SMTP if credentials exist in process.env.
 * Automatically falls back to Ethereal Test Account / Simulated Mode if SMTP is missing.
 */
export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  recipientName: string = 'Companion Candidate'
): Promise<SendOtpResult> {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@sathi.io';

    // 1. If SMTP credentials exist in .env, send via real SMTP
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Companion Connect" <${smtpFrom}>`,
        to: toEmail,
        subject: `Your Verification OTP: ${otpCode} - Companion Connect`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800;">Companion Connect</h2>
              <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Secure Email Verification</p>
            </div>
            <p style="color: #1e293b; font-size: 14px;">Hello ${recipientName},</p>
            <p style="color: #475569; font-size: 13px; line-height: 1.5;">
              Use the 6-digit One-Time Password (OTP) below to verify your email address for your Companion Application.
            </p>
            <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
              <span style="font-size: 34px; font-weight: 800; font-family: monospace; letter-spacing: 8px; color: #4f46e5;">${otpCode}</span>
            </div>
            <p style="color: #ef4444; font-size: 12px; font-weight: bold; text-align: center;">
              ⏰ This OTP will expire in 10 minutes.
            </p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
              If you did not request this OTP, please ignore this email.
            </p>
          </div>
        `,
      });
      console.log(`[SMTP OTP SUCCESS] Real email sent to ${toEmail}`);
      return { sent: true, method: 'smtp' };
    }

    // 2. Fallback to Ethereal Test Account if no SMTP settings in .env
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await testTransporter.sendMail({
        from: `"Companion Connect (Test)" <${testAccount.user}>`,
        to: toEmail,
        subject: `Your Verification OTP: ${otpCode} - Companion Connect`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; background-color: #ffffff;">
            <h2 style="color: #4f46e5; margin: 0; font-size: 24px;">Companion Connect</h2>
            <p>Your 6-Digit OTP is: <strong style="font-size: 28px; color: #4f46e5; font-family: monospace;">${otpCode}</strong></p>
            <p style="color: red;">Valid for 10 minutes.</p>
          </div>
        `,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      console.log(`[ETHEREAL TEST OTP] Sent to ${toEmail} | Code: ${otpCode} | Preview: ${previewUrl}`);
      return { sent: true, method: 'ethereal', previewUrl, code: otpCode };
    } catch (e) {
      console.log(`[SIMULATED OTP DISPATCH] Sent to ${toEmail} | Code: ${otpCode}`);
      return { sent: true, method: 'simulated', code: otpCode };
    }

  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return { sent: false, method: 'simulated', error: (error as Error).message, code: otpCode };
  }
}
