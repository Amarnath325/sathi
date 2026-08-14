import { NextResponse } from 'next/server';
import { encryptCredential, decryptCredential } from '@/lib/cryptoUtils';
import { prisma } from '@/lib/prisma';

const SETTING_KEY = 'smtp_email_config';

// Fallback in-memory store in case DB migration is running
let memorySmtpStore = {
  driver: 'SMTP',
  host: 'smtp-relay.brevo.com',
  port: 587,
  username: 'b57a23001@smtp-brevo.com',
  password: encryptCredential('xsmtpsib-7a2010ec3452cd9b655a0f238bd2eccdbc3847a9+10bdb821db38d558cb495bd-vw16czybY2hcYf5L'),
  encryption: 'TLS',
  fromName: 'Sathi Companion Connect',
  fromEmail: 'no-reply@sathi-connect.com',
  isVerified: true,
  lastSavedAt: new Date().toISOString()
};

// GET: Fetch SMTP credentials from Neon DB (Decrypts for authorized admin view)
export async function GET() {
  try {
    let dbRecord = null;
    try {
      dbRecord = await prisma.systemSetting.findUnique({
        where: { key: SETTING_KEY }
      });
    } catch (dbErr) {
      console.warn('Neon DB query warning (using fallback):', dbErr);
    }

    let smtpData = memorySmtpStore;

    if (dbRecord && dbRecord.value) {
      try {
        const parsed = JSON.parse(dbRecord.value);
        smtpData = { ...memorySmtpStore, ...parsed };
      } catch (e) {
        console.error('Failed to parse DB JSON value:', e);
      }
    }

    // Password in DB is encrypted with AES-256 (`enc_aes256_v1:...`)
    const rawEncryptedPass = smtpData.password;
    const decryptedPass = decryptCredential(rawEncryptedPass);

    return NextResponse.json({
      success: true,
      source: dbRecord ? 'NEON_POSTGRES_DB' : 'MEMORY_FALLBACK',
      settings: {
        ...smtpData,
        password: decryptedPass, // Decrypted for admin view
        encryptedPasswordHash: rawEncryptedPass // Raw cipher stored in Neon DB
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch SMTP settings from DB: ${error?.message}` },
      { status: 500 }
    );
  }
}

// POST: Encrypt & Save SMTP credentials into Neon DB
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driver, host, port, username, password, encryption, fromName, fromEmail } = body;

    if (!host || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'SMTP Host, Username, and Password are required.' },
        { status: 400 }
      );
    }

    // 1. Encrypt password using AES-256 before writing to Neon DB
    const encryptedPassword = encryptCredential(password);

    const payloadToSave = {
      driver: driver || 'SMTP',
      host,
      port: Number(port) || 587,
      username,
      password: encryptedPassword, // Strictly saved in ENCRYPTED format in DB
      encryption: encryption || 'TLS',
      fromName: fromName || 'Sathi Companion Connect',
      fromEmail: fromEmail || 'no-reply@sathi-connect.com',
      isVerified: true,
      lastSavedAt: new Date().toISOString()
    };

    memorySmtpStore = payloadToSave;

    // 2. Persist in Neon Postgres Database via Prisma SystemSetting table
    let dbSuccess = false;
    try {
      await prisma.systemSetting.upsert({
        where: { key: SETTING_KEY },
        update: {
          value: JSON.stringify(payloadToSave),
          category: 'COMMUNICATION',
          valueType: 'JSON',
          isEncrypted: true,
          updatedAt: new Date()
        },
        create: {
          key: SETTING_KEY,
          category: 'COMMUNICATION',
          value: JSON.stringify(payloadToSave),
          valueType: 'JSON',
          isEncrypted: true,
          description: 'Encrypted SMTP Credentials for Brevo/Custom Mail Gateway'
        }
      });
      dbSuccess = true;
    } catch (dbErr: any) {
      console.error('Neon DB Upsert Error:', dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      dbSynced: dbSuccess,
      message: dbSuccess
        ? 'SMTP credentials successfully encrypted with AES-256 & updated live in Neon PostgreSQL DB!'
        : 'SMTP credentials encrypted with AES-256 and saved in active server store.',
      savedEncryptedData: payloadToSave,
      decryptedViewPassword: password
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to encrypt and save to Neon DB: ${error?.message}` },
      { status: 500 }
    );
  }
}
