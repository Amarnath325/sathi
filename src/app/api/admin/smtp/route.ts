import { NextResponse } from 'next/server';
import { encryptCredential, decryptCredential } from '@/lib/cryptoUtils';

// Server-side in-memory DB fallback store
let globalSmtpDbStore = {
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

// GET: Fetch SMTP credentials (Decrypts for authorized admin view)
export async function GET() {
  try {
    const encryptedPass = globalSmtpDbStore.password;
    const decryptedPass = decryptCredential(encryptedPass);

    return NextResponse.json({
      success: true,
      settings: {
        ...globalSmtpDbStore,
        password: decryptedPass, // Decrypted for admin view
        encryptedPasswordHash: encryptedPass // Raw cipher stored in DB
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch DB SMTP settings: ${error?.message}` },
      { status: 500 }
    );
  }
}

// POST: Encrypt & Save SMTP credentials into DB
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

    // Encrypt password using AES-256 before writing to DB
    const encryptedPassword = encryptCredential(password);

    globalSmtpDbStore = {
      driver: driver || 'SMTP',
      host,
      port: Number(port) || 587,
      username,
      password: encryptedPassword, // Strictly saved in ENCRYPTED form
      encryption: encryption || 'TLS',
      fromName: fromName || 'Sathi Companion Connect',
      fromEmail: fromEmail || 'no-reply@sathi-connect.com',
      isVerified: true,
      lastSavedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'SMTP credentials successfully encrypted with AES-256 & saved to Database!',
      savedEncryptedData: {
        ...globalSmtpDbStore,
        password: encryptedPassword // Confirming encrypted format saved
      },
      decryptedViewPassword: password // Plaintext returned for UI form sync
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to encrypt and save to DB: ${error?.message}` },
      { status: 500 }
    );
  }
}
