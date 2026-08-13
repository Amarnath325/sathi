import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// GET Handler: Handles Deep Link Email Verification
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({
        success: false,
        status: 'INVALID',
        error: 'Verification token is missing.',
      }, { status: 400 });
    }

    const verificationRecord = await (prisma as any).emailVerificationToken.findUnique({
      where: { token },
    });

    if (!verificationRecord) {
      return NextResponse.json({
        success: false,
        status: 'EXPIRED',
        error: 'Verification token is invalid or has expired. Please request a new verification email.',
        canResend: true,
      }, { status: 400 });
    }

    // Check if token is expired (24 hours)
    if (new Date(verificationRecord.expiresAt).getTime() < Date.now()) {
      await (prisma as any).emailVerificationToken.delete({ where: { id: verificationRecord.id } });
      return NextResponse.json({
        success: false,
        status: 'EXPIRED',
        error: 'Verification link has expired. Please request a new verification link.',
        canResend: true,
      }, { status: 400 });
    }

    // Update User verification state in Database
    const updatedUser = await prisma.user.update({
      where: { id: verificationRecord.userId },
      data: {
        isEmailVerified: true,
        status: 'ACTIVE',
      } as any,
    });

    // Clean up used token
    await (prisma as any).emailVerificationToken.delete({ where: { id: verificationRecord.id } });

    // Return verification state payload with Flutter deep link schema
    return NextResponse.json({
      success: true,
      status: 'VERIFIED',
      message: 'Email address verified successfully. Account activated.',
      deepLinkUrl: `sathi://verify-email?status=success&email=${encodeURIComponent(updatedUser.email)}`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isEmailVerified: true,
        status: (updatedUser as any).status,
      },
    });
  } catch (error: any) {
    console.error('Deep Link Verification Error:', error);
    return NextResponse.json({ success: false, status: 'ERROR', error: error.message || 'Internal Verification Error' }, { status: 500 });
  }
}

// POST Handler: Handles Send Link, Resend, and Change Email Actions
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId, email, newEmail } = body;

    // 1. SEND / RESEND VERIFICATION LINK
    if (action === 'send-link' || action === 'resend') {
      const targetEmail = (email || '').trim().toLowerCase();
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(userId ? [{ id: userId }] : []),
            ...(targetEmail ? [{ email: targetEmail }] : []),
          ],
        },
      });

      if (!user) {
        return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 });
      }

      if (user.isEmailVerified) {
        return NextResponse.json({
          success: true,
          status: 'VERIFIED',
          message: 'Email address is already verified.',
        });
      }

      // Generate Secure Verification Token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await (prisma as any).emailVerificationToken.create({
        data: {
          userId: user.id,
          email: user.email,
          token,
          expiresAt,
        },
      });

      const verificationUrl = `https://sathi-mocha.vercel.app/api/mobile/auth/verify-email?token=${token}`;

      return NextResponse.json({
        success: true,
        status: 'PENDING',
        message: 'Verification email link sent successfully.',
        data: {
          email: user.email,
          verificationUrl,
          expiresAt,
        },
      });
    }

    // 2. CHANGE EMAIL ACTION
    if (action === 'change-email') {
      if (!userId) {
        return NextResponse.json({ success: false, error: 'User ID is required to change email.' }, { status: 400 });
      }
      if (!newEmail || !newEmail.trim()) {
        return NextResponse.json({ success: false, error: 'New email address is required.' }, { status: 400 });
      }

      const formattedNewEmail = newEmail.trim().toLowerCase();
      const existingUser = await prisma.user.findUnique({ where: { email: formattedNewEmail } });
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ success: false, error: 'This email address is already in use by another account.' }, { status: 400 });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email: formattedNewEmail,
          isEmailVerified: false,
          status: 'PENDING_VERIFICATION',
        } as any,
      });

      // Generate New Verification Token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await (prisma as any).emailVerificationToken.create({
        data: {
          userId: updatedUser.id,
          email: updatedUser.email,
          token,
          expiresAt,
        },
      });

      const verificationUrl = `https://sathi-mocha.vercel.app/api/mobile/auth/verify-email?token=${token}`;

      return NextResponse.json({
        success: true,
        status: 'PENDING',
        message: 'Email address updated successfully. Verification link sent to new email.',
        data: {
          email: updatedUser.email,
          verificationUrl,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid verification action parameter.' }, { status: 400 });
  } catch (error: any) {
    console.error('Email Verification Action Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Verification Error' }, { status: 500 });
  }
}
