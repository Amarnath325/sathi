import { NextResponse } from 'next/server';
import { decryptCredential, CredentialAuthException, SmtpConnectionException } from '@/lib/cryptoUtils';

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

    if (!smtpConfig || !smtpConfig.host || !smtpConfig.username) {
      const exc = new CredentialAuthException(
        'SMTP Host, Port, and Username configuration missing in database/store.',
        smtpConfig?.driver || 'SMTP',
        'MISSING_CREDENTIALS',
        400
      );
      return NextResponse.json(
        { 
          success: false, 
          message: exc.message,
          exceptionCode: exc.code,
          provider: exc.provider
        },
        { status: 400 }
      );
    }

    // Decrypt password in memory if cipher string
    const rawPassword = decryptCredential(smtpConfig.password);

    // Validate Password & Connection Simulation
    if (!rawPassword || rawPassword === 'INVALID_PASS') {
      const authExc = new CredentialAuthException(
        `SMTP Authentication Failed (535): Invalid username (${smtpConfig.username}) or password credentials for host ${smtpConfig.host}.`,
        smtpConfig.driver,
        'SMTP_535_AUTH_FAILED',
        401
      );

      return NextResponse.json(
        {
          success: false,
          message: authExc.message,
          exceptionCode: authExc.code,
          provider: authExc.provider
        },
        { status: 401 }
      );
    }

    // Simulate Port / Connection Check
    if (smtpConfig.port !== 587 && smtpConfig.port !== 465 && smtpConfig.port !== 25) {
      const connExc = new SmtpConnectionException(
        `Connection Refused: Unable to establish TLS socket handshake on port ${smtpConfig.port}. Allowed ports: 587, 465, 25.`,
        smtpConfig.host,
        smtpConfig.port,
        'SMTP_PORT_REFUSED'
      );

      return NextResponse.json(
        {
          success: false,
          message: connExc.message,
          exceptionCode: connExc.code,
          host: connExc.host,
          port: connExc.port
        },
        { status: 502 }
      );
    }

    // Simulated successful TLS transmission response
    const transmissionId = `msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    return NextResponse.json({
      success: true,
      message: `Email successfully transmitted to ${toEmail} via AES-256 decrypted ${smtpConfig.driver} gateway (${smtpConfig.host}:${smtpConfig.port}).`,
      transmissionId,
      deliveredAt: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: `Unhandled Exception: ${error?.message || 'Gateway Internal Exception'}`,
        exceptionCode: 'SYSTEM_INTERNAL_EXCEPTION'
      },
      { status: 500 }
    );
  }
}
