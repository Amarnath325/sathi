import { NextResponse } from 'next/server';
import { encryptCredential, decryptCredential } from '@/lib/cryptoUtils';
import { prisma } from '@/lib/prisma';

const SETTING_KEY = 'smtp_email_config';

// In-memory runtime cache (populates only when form is submitted or fetched from DB)
let memorySmtpStore: any = null;

// GET: Fetch real SMTP credentials from Neon DB
export async function GET() {
  try {
    let dbRecord = null;
    try {
      dbRecord = await prisma.systemSetting.findUnique({
        where: { key: SETTING_KEY }
      });
    } catch (dbErr) {
      console.warn('Neon DB query warning:', dbErr);
    }

    let smtpData = null;

    if (dbRecord && dbRecord.value) {
      try {
        smtpData = JSON.parse(dbRecord.value);
      } catch (e) {
        console.error('Failed to parse DB JSON value:', e);
      }
    } else if (memorySmtpStore) {
      smtpData = memorySmtpStore;
    }

    if (!smtpData) {
      return NextResponse.json({
        success: true,
        configured: false,
        source: 'NO_CONFIG_FOUND',
        settings: null
      });
    }

    // Password in DB is stored encrypted with AES-256 (`enc_aes256_v1:...`)
    const rawEncryptedPass = smtpData.password || '';
    const decryptedPass = decryptCredential(rawEncryptedPass);

    return NextResponse.json({
      success: true,
      configured: true,
      source: dbRecord ? 'NEON_POSTGRES_DB' : 'MEMORY_CACHE',
      settings: {
        ...smtpData,
        password: decryptedPass, // Decrypted for admin view
        encryptedPasswordHash: rawEncryptedPass // Raw ciphertext saved in Neon DB
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch SMTP settings from DB: ${error?.message}` },
      { status: 500 }
    );
  }
}

// POST: Encrypt & Save user's form data into Neon DB
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

    // 1. Encrypt password using AES-256 before saving to DB
    const encryptedPassword = encryptCredential(password);

    // Dynamic payload directly constructed from form inputs
    const payloadToSave = {
      driver: driver || 'SMTP',
      host: host.trim(),
      port: Number(port) || 587,
      username: username.trim(),
      password: encryptedPassword, // Strictly saved in ENCRYPTED format in DB
      encryption: encryption || 'TLS',
      fromName: fromName ? fromName.trim() : 'Sathi Companion Connect',
      fromEmail: fromEmail ? fromEmail.trim() : username.trim(),
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
