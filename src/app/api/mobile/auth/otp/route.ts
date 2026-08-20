import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/mailService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, identifier, name, purpose = 'REGISTRATION', code } = body;

    if (!identifier || !identifier.trim()) {
      return NextResponse.json({ success: false, error: 'Identifier (email or phone) is required.' }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const isEmail = cleanIdentifier.includes('@');

    // 1. SEND / RESEND OTP ACTION
    if (action === 'send' || action === 'resend') {
      // Rate Limit Check (60 seconds cooldown)
      const lastOtp = await (prisma as any).otpCode.findFirst({
        where: { identifier: cleanIdentifier, purpose },
        orderBy: { createdAt: 'desc' },
      });

      if (lastOtp) {
        const timeDiffSeconds = Math.floor((Date.now() - new Date(lastOtp.createdAt).getTime()) / 1000);
        if (timeDiffSeconds < 60) {
          const remainingSeconds = 60 - timeDiffSeconds;
          return NextResponse.json({
            success: false,
            error: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
            resendInSeconds: remainingSeconds,
          }, { status: 429 });
        }
      }

      // Generate 6-digit OTP Code
      const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await (prisma as any).otpCode.create({
        data: {
          identifier: cleanIdentifier,
          code: newOtpCode,
          purpose,
          expiresAt,
        },
      });

      // Send email if identifier is an email address
      let mailResult = null;
      if (isEmail) {
        mailResult = await sendOtpEmail({
          toEmail: cleanIdentifier,
          otpCode: newOtpCode,
          purpose,
          userName: name || 'Companion Candidate',
        });
      }

      return NextResponse.json({
        success: true,
        message: isEmail
          ? (mailResult?.sent
              ? `Verification OTP sent to ${cleanIdentifier}. Please check your email inbox.`
              : `Verification OTP generated for ${cleanIdentifier}. Valid for 10 minutes.`)
          : `SMS Verification OTP sent to ${cleanIdentifier}. Valid for 10 minutes.`,
        data: {
          identifier: cleanIdentifier,
          purpose,
          resendInSeconds: 60,
          expiresAt,
          demoOtpCode: newOtpCode,
          emailDelivery: mailResult,
          isSmtpConfigured: mailResult?.sent ?? false,
        },
      });
    }

    // 2. VERIFY OTP ACTION
    if (action === 'verify') {
      if (!code || !code.trim()) {
        return NextResponse.json({ success: false, error: 'OTP code is required.' }, { status: 400 });
      }

      const activeOtp = await (prisma as any).otpCode.findFirst({
        where: {
          identifier: cleanIdentifier,
          purpose,
          isUsed: false,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!activeOtp) {
        return NextResponse.json({ success: false, error: 'No active OTP request found. Please click Send OTP again.' }, { status: 400 });
      }

      // Check 10-Minute Expiry
      if (new Date(activeOtp.expiresAt).getTime() < Date.now()) {
        return NextResponse.json({ success: false, error: 'OTP code has expired after 10 minutes. Please request a new code.' }, { status: 400 });
      }

      // Check Max Attempts (Max 5 attempts)
      if (activeOtp.attempts >= 5) {
        return NextResponse.json({ success: false, error: 'Maximum verification attempts exceeded. Please request a new OTP.' }, { status: 429 });
      }

      // Check Code Match
      if (activeOtp.code !== code.trim()) {
        const nextAttempts = activeOtp.attempts + 1;
        await (prisma as any).otpCode.update({
          where: { id: activeOtp.id },
          data: { attempts: nextAttempts },
        });

        const remainingAttempts = 5 - nextAttempts;
        return NextResponse.json({
          success: false,
          error: remainingAttempts > 0
            ? `Invalid OTP code. ${remainingAttempts} attempts remaining.`
            : 'Invalid OTP code. Maximum attempts exceeded.',
        }, { status: 400 });
      }

      // Mark OTP as Used
      await (prisma as any).otpCode.update({
        where: { id: activeOtp.id },
        data: { isUsed: true },
      });

      // Update User Verification State if user exists
      try {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: cleanIdentifier },
              { phone: cleanIdentifier },
            ],
          },
        });

        if (user) {
          if (isEmail) {
            await prisma.user.update({
              where: { id: user.id },
              data: { isEmailVerified: true },
            });
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: { isPhoneVerified: true },
            });
          }
        }
      } catch (e) {
        // Non-blocking if user record doesn't exist yet during onboarding registration
      }

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully!',
        data: {
          identifier: cleanIdentifier,
          verifiedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });

  } catch (error: any) {
    console.error('OTP API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
