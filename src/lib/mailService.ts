import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { decryptCredential } from '@/lib/cryptoUtils';

export interface SendOtpOptions {
  toEmail: string;
  otpCode: string;
  purpose?: string;
  userName?: string;
}

export async function sendOtpEmail({ toEmail, otpCode, purpose = 'VERIFICATION', userName }: SendOtpOptions) {
  try {
    let smtpHost = process.env.SMTP_HOST;
    let smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    let smtpUser = process.env.SMTP_USER;
    let smtpPass = process.env.SMTP_PASS;
    let smtpFrom = process.env.SMTP_FROM || `"Sathi Companion Connect" <no-reply@sathi.app>`;

    // 1. Try loading Live DB SMTP Configuration (saved from Admin UI Vault)
    try {
      const dbConfig = await prisma.systemSetting.findUnique({
        where: { key: 'smtp_email_config' },
      });

      if (dbConfig && dbConfig.value) {
        const parsed = JSON.parse(dbConfig.value);
        if (parsed.host && parsed.username && parsed.password) {
          smtpHost = parsed.host;
          smtpPort = Number(parsed.port) || 587;
          smtpUser = parsed.username;
          smtpPass = decryptCredential(parsed.password); // Decrypt AES-256 stored password
          smtpFrom = parsed.fromEmail
            ? `"${parsed.fromName || 'Sathi Companion Connect'}" <${parsed.fromEmail}>`
            : smtpFrom;
        }
      }
    } catch (dbErr) {
      console.warn('[MailService] SystemSetting DB query fallback to ENV:', dbErr);
    }

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn(
        `[MailService] SMTP credentials missing in Database & .env. ` +
        `Skipping live email delivery for OTP ${otpCode} to ${toEmail}.`
      );
      return {
        success: false,
        sent: false,
        reason: 'SMTP_CONFIG_MISSING',
        message: 'SMTP credentials missing in Database & .env. OTP generated in database.',
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const displayName = userName ? userName : 'Valued User';
    const formattedPurpose = purpose.replace(/_/g, ' ');

    const mailOptions = {
      from: smtpFrom,
      to: toEmail,
      subject: `[Sathi] ${otpCode} is your Verification Code`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 30px; color: #f8fafc; border-radius: 12px; max-width: 500px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #6366f1; margin: 0;">Sathi Companion Connect</h2>
            <p style="color: #94a3b8; font-size: 12px;">Identity & Security Verification</p>
          </div>
          <div style="background-color: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155;">
            <p style="color: #cbd5e1; font-size: 14px; margin-top: 0;">Hello <strong>${displayName}</strong>,</p>
            <p style="color: #cbd5e1; font-size: 14px;">Your verification OTP for <strong>${formattedPurpose}</strong> is:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #fbbf24; background-color: #0f172a; padding: 12px 24px; border-radius: 8px; border: 1px solid #475569;">${otpCode}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">This code is valid for 10 minutes. Please do not share this OTP with anyone.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #64748b;">
            © 2026 Sathi Companion Connect. All rights reserved.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MailService] OTP email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);

    return {
      success: true,
      sent: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error(`[MailService] Failed to send email to ${toEmail}:`, error);
    return {
      success: false,
      sent: false,
      error: error.message || 'Failed to dispatch email via SMTP',
    };
  }
}
