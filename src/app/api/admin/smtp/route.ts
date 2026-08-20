import { NextResponse } from 'next/server';
import { encryptCredential, decryptCredential } from '@/lib/cryptoUtils';
import { prisma } from '@/lib/prisma';

const SETTING_KEY = 'smtp_email_config';

// In-memory runtime cache
let memorySmtpStore: any = null;

// GET: Fetch real SMTP credentials & per-driver vault from Neon DB
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

    let smtpData: any = null;

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
        settings: null,
        driverVault: {}
      });
    }

    // Password at root level
    const rawEncryptedPass = smtpData.password || '';
    const decryptedPass = decryptCredential(rawEncryptedPass);

    // Decrypt passwords inside driverVault map as well
    const rawVault = smtpData.driverVault || {};
    const decryptedVault: Record<string, any> = {};

    for (const [drvKey, drvConfig] of Object.entries<any>(rawVault)) {
      if (drvConfig) {
        decryptedVault[drvKey] = {
          ...drvConfig,
          password: drvConfig.password ? decryptCredential(drvConfig.password) : ''
        };
      }
    }

    // Ensure active driver's current config is also present in decryptedVault
    if (smtpData.driver) {
      decryptedVault[smtpData.driver] = {
        driver: smtpData.driver,
        host: smtpData.host || '',
        port: Number(smtpData.port) || 587,
        username: smtpData.username || '',
        password: decryptedPass,
        encryption: smtpData.encryption || 'TLS',
        fromName: smtpData.fromName || '',
        fromEmail: smtpData.fromEmail || '',
        isVerified: smtpData.isVerified ?? false
      };
    }

    return NextResponse.json({
      success: true,
      configured: true,
      source: dbRecord ? 'NEON_POSTGRES_DB' : 'MEMORY_CACHE',
      settings: {
        ...smtpData,
        password: decryptedPass,
        driverVault: decryptedVault
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch SMTP settings from DB: ${error?.message}` },
      { status: 500 }
    );
  }
}

// POST: Encrypt & Save driver-specific form data into Neon DB
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driver, host, port, username, password, encryption, fromName, fromEmail } = body;

    const driverKey = driver || 'SMTP';

    if (!host || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'SMTP Host, Username, and Password are required.' },
        { status: 400 }
      );
    }

    // 1. Encrypt password using AES-256 before saving to DB
    const encryptedPassword = encryptCredential(password);

    // Fetch existing settings to preserve other driver vault configurations
    let existingSettings: any = {};
    try {
      const dbRecord = await prisma.systemSetting.findUnique({
        where: { key: SETTING_KEY }
      });
      if (dbRecord && dbRecord.value) {
        existingSettings = JSON.parse(dbRecord.value) || {};
      } else if (memorySmtpStore) {
        existingSettings = memorySmtpStore;
      }
    } catch (e) {
      console.warn('Failed to read existing settings for vault merge:', e);
    }

    const existingVault = existingSettings.driverVault || {};

    // Dynamic payload for the specific active driver being saved
    const activeDriverPayload = {
      driver: driverKey,
      host: host.trim(),
      port: Number(port) || 587,
      username: username.trim(),
      password: encryptedPassword, // Encrypted hash in DB
      encryption: encryption || 'TLS',
      fromName: fromName ? fromName.trim() : '',
      fromEmail: fromEmail ? fromEmail.trim() : username.trim(),
      isVerified: true,
      lastSavedAt: new Date().toISOString()
    };

    // Update the specific driver in driverVault map
    const updatedVault = {
      ...existingVault,
      [driverKey]: activeDriverPayload
    };

    const payloadToSave = {
      ...activeDriverPayload,
      driverVault: updatedVault
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
          description: 'Encrypted Multi-Driver SMTP Credentials Vault'
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
        ? `SMTP credentials for ${driverKey} successfully encrypted with AES-256 & updated live in DB!`
        : `SMTP credentials for ${driverKey} encrypted with AES-256 and saved in server store.`,
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
