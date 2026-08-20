import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { decryptCredential } from '@/lib/cryptoUtils';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { toEmail, subject, bodyHtml, smtpConfig } = body;

    if (!toEmail || !subject) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Recipient Email and Subject line are required.',
          exceptionCode: 'INVALID_PAYLOAD'
        },
        { status: 400 }
      );
    }

    let host = smtpConfig?.host;
    let port = Number(smtpConfig?.port) || 587;
    let username = smtpConfig?.username;
    let password = smtpConfig?.password ? decryptCredential(smtpConfig.password) : '';
    let fromName = smtpConfig?.fromName || 'Sathi Companion Connect';
    let fromEmail = smtpConfig?.fromEmail || username;

    // Fallback: If not passed directly or empty, fetch from Neon DB SystemSetting table
    if (!host || !username || !password) {
      try {
        const dbRecord = await prisma.systemSetting.findUnique({
          where: { key: 'smtp_email_config' }
        });
        if (dbRecord && dbRecord.value) {
          const parsed = JSON.parse(dbRecord.value);
          host = host || parsed.host;
          port = port || Number(parsed.port) || 587;
          username = username || parsed.username;
          password = password || decryptCredential(parsed.password);
          fromName = fromName || parsed.fromName;
          fromEmail = fromEmail || parsed.fromEmail || username;
        }
      } catch (err) {
        console.warn('[EmailSendAPI] SystemSetting DB query error:', err);
      }
    }

    if (!host || !username || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'SMTP credentials missing. Please enter and save Host, Username, and Password in the SMTP Gateway Vault first.',
          exceptionCode: 'MISSING_CREDENTIALS'
        },
        { status: 400 }
      );
    }

    // Initialize Real Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: host.trim(),
      port: port,
      secure: port === 465,
      auth: {
        user: username.trim(),
        pass: password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail.trim(),
      subject: subject || '⚡ Sathi Live SMTP Connection Verification',
      html: bodyHtml || `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 24px; color: #f8fafc; border-radius: 12px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #6366f1; text-align: center;">Sathi Companion Connect</h2>
          <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">
            <p style="color: #4ade80; font-weight: bold; font-size: 16px;">✓ Live SMTP Handshake Verified!</p>
            <p style="color: #cbd5e1; font-size: 13px;">Test mail successfully transmitted via host <strong>${host}:${port}</strong>.</p>
          </div>
          <p style="text-align: center; font-size: 11px; color: #64748b; margin-top: 16px;">© 2026 Sathi Companion Connect</p>
        </div>
      `
    };

    // Attempt Live Dispatch via Nodemailer
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailSendAPI] Test email dispatched successfully to ${toEmail}. Message ID: ${info.messageId}`);

    return NextResponse.json({
      success: true,
      message: `Success! Live test email dispatched to ${toEmail} via ${host}:${port}.`,
      messageId: info.messageId,
      deliveredAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[EmailSendAPI] Nodemailer Transmission Exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `SMTP Gateway Error: ${error?.message || 'Failed to dispatch email via Nodemailer transport.'}`,
        exceptionCode: error?.code || 'SMTP_TRANSMISSION_FAILED'
      },
      { status: 500 }
    );
  }
}
