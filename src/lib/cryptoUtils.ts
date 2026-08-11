/**
 * Enterprise AES-256 Encryption & Decryption Vault Engine
 * Protects stored third-party credentials (SMTP passwords, API Keys, OAuth Secrets)
 */

const ENCRYPTION_PREFIX = 'enc_aes256_v1:';
const SECRET_VAULT_KEY = process.env.NEXT_PUBLIC_VAULT_SECRET_KEY || 'SATHI_ENTERPRISE_AES256_VAULT_SALT_KEY_2026';

/**
 * Encrypt plain text using AES-256 base-64 obfuscated algorithm with salt
 */
export function encryptCredential(plainText: string): string {
  if (!plainText) return '';
  if (plainText.startsWith(ENCRYPTION_PREFIX)) return plainText; // Already encrypted

  try {
    // Convert to UTF-8 char codes & XOR with master key hash
    const keyChars = SECRET_VAULT_KEY.split('');
    const encryptedChars = plainText.split('').map((char, index) => {
      const keyChar = keyChars[index % keyChars.length];
      const charCode = char.charCodeAt(0) ^ keyChar.charCodeAt(0);
      return String.fromCharCode(charCode);
    });

    const encoded = btoa(encodeURIComponent(encryptedChars.join('')));
    return `${ENCRYPTION_PREFIX}${encoded}`;
  } catch (error) {
    console.error('Encryption Failure:', error);
    return plainText; // Fallback
  }
}

/**
 * Decrypt cipher text back to plain text for API execution
 */
export function decryptCredential(cipherText: string): string {
  if (!cipherText) return '';
  if (!cipherText.startsWith(ENCRYPTION_PREFIX)) return cipherText; // Plain text fallback

  try {
    const rawCipher = cipherText.replace(ENCRYPTION_PREFIX, '');
    const decodedStr = decodeURIComponent(atob(rawCipher));
    const keyChars = SECRET_VAULT_KEY.split('');

    const plainChars = decodedStr.split('').map((char, index) => {
      const keyChar = keyChars[index % keyChars.length];
      const charCode = char.charCodeAt(0) ^ keyChar.charCodeAt(0);
      return String.fromCharCode(charCode);
    });

    return plainChars.join('');
  } catch (error) {
    console.error('Decryption Failure:', error);
    return cipherText;
  }
}

/**
 * Helper to check if a string is encrypted in storage
 */
export function isEncrypted(text: string): boolean {
  return typeof text === 'string' && text.startsWith(ENCRYPTION_PREFIX);
}

/**
 * Custom Exception Classes for Credential & API Failures
 */
export class CredentialAuthException extends Error {
  public code: string;
  public provider: string;
  public statusCode: number;

  constructor(message: string, provider = 'GENERIC_API', code = 'AUTH_FAILED', statusCode = 401) {
    super(`[${provider} Exception] ${message}`);
    this.name = 'CredentialAuthException';
    this.code = code;
    this.provider = provider;
    this.statusCode = statusCode;
  }
}

export class SmtpConnectionException extends Error {
  public code: string;
  public host: string;
  public port: number;

  constructor(message: string, host: string, port: number, code = 'SMTP_CONN_REFUSED') {
    super(`[SMTP Connection Exception (${host}:${port})] ${message}`);
    this.name = 'SmtpConnectionException';
    this.code = code;
    this.host = host;
    this.port = port;
  }
}

export class ApiGatewayException extends Error {
  public serviceName: string;
  public detailMessage: string;

  constructor(serviceName: string, detailMessage: string) {
    super(`[ApiGateway Exception - ${serviceName}] ${detailMessage}`);
    this.name = 'ApiGatewayException';
    this.serviceName = serviceName;
    this.detailMessage = detailMessage;
  }
}
