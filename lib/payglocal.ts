import * as jose from 'jose';

/**
 * PayGlocal API Base URLs
 */
export const PAYGLOCAL_ENDPOINTS = {
  uat: {
    paycollect: 'https://api.uat.payglocal.in/gl/v1/payments/initiate/paycollect',
    status: (gid: string) => `https://api.uat.payglocal.in/gl/v1/payments/${gid}/status`,
  },
  prod: {
    paycollect: 'https://api.prod.payglocal.in/gl/v1/payments/initiate/paycollect',
    status: (gid: string) => `https://api.prod.payglocal.in/gl/v1/payments/${gid}/status`,
  },
};

/**
 * Helper to safely read PayGlocal environment variables.
 * Primary variable names use single underscore (e.g. PAYGLOCAL_MERCHANT_ID).
 * Fallback supports double-underscore names (e.g. PAYGLOCAL__MERCHANT_ID) if accidentally set in Vercel.
 */
export function getPayGlocalEnv(
  key:
    | 'PAYGLOCAL_MERCHANT_ID'
    | 'PAYGLOCAL_PVT_KEY_KID'
    | 'PAYGLOCAL_PRIVATE_KEY'
    | 'PAYGLOCAL_PUBLIC_CERT'
): string {
  const single = process.env[key];
  if (single && single.trim()) return single.trim();

  const doubleKey = key.replace('PAYGLOCAL_', 'PAYGLOCAL__');
  const double = process.env[doubleKey];
  if (double && double.trim()) return double.trim();

  return '';
}

/**
 * Get active endpoint based on environment
 */
export function getPayGlocalEndpoints() {
  return PAYGLOCAL_ENDPOINTS.prod;
}

/**
 * Interfaces for PayGlocal API Payloads & Responses
 */
export interface PayCollectPayload {
  merchantTxnId: string;
  merchantUniqueId: string;
  paymentData: {
    totalAmount: string; // e.g. "100.00"
    txnCurrency: 'INR';
  };
  merchantCallbackURL: string;
  riskData: {
    customerData?: {
      merchantAssignedCustomerId?: string;
      customerName?: string;
      mobileNumber?: string;
    };
    shippingData: {
      addressCountry: 'IN';
      emailId: string;
      addressLine1?: string;
      addressCity?: string;
      addressState?: string;
      addressZip?: string;
    };
  };
}

export interface PayCollectResponseData {
  redirectUrl?: string;
  gid?: string;
  statusUrl?: string;
  status?: string;
  merchantUniqueId?: string;
  merchantTxnId?: string;
}

export interface PayCollectResponse {
  status: 'CREATED' | 'SUCCESS' | 'FAILED' | string;
  data?: PayCollectResponseData;
  error?: {
    code: string;
    message: string;
    description?: string;
  };
}

export interface PayGlocalCallbackPayload {
  status: string;
  gid: string;
  merchantUniqueId?: string;
  merchantTxnId?: string;
  iat?: number;
  [key: string]: unknown;
}

export interface PayGlocalStatusResponse {
  status?: string;
  gid?: string;
  merchantTxnId?: string;
  merchantUniqueId?: string;
  data?: {
    gid: string;
    status: string;
    amount?: string;
    currency?: string;
    [key: string]: unknown;
  };
  error?: unknown;
}

export interface PayGlocalConfigStatus {
  isValid: boolean;
  missingVars: string[];
  invalidVars: string[];
  details: {
    PAYGLOCAL_MERCHANT_ID: { set: boolean };
    PAYGLOCAL_PVT_KEY_KID: { set: boolean };
    PAYGLOCAL_PRIVATE_KEY: { set: boolean; validPemHeader: boolean };
    PAYGLOCAL_PUBLIC_CERT: { set: boolean; validPemHeader: boolean };
  };
}

/**
 * Utility function to normalize PEM keys (handling single line escaped \n strings and outer quotes)
 */
export function cleanPem(pem: string): string {
  if (!pem) return '';
  let cleaned = pem.trim();

  // Strip outer double or single quotes if wrapped
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Handle literal escaped '\n'
  if (cleaned.includes('\\n')) {
    cleaned = cleaned.replace(/\\n/g, '\n');
  }

  // Ensure header and footer have proper newlines if stuck on single line with spaces
  if (!cleaned.includes('\n')) {
    cleaned = cleaned
      .replace(/-----BEGIN PRIVATE KEY-----/g, '-----BEGIN PRIVATE KEY-----\n')
      .replace(/-----END PRIVATE KEY-----/g, '\n-----END PRIVATE KEY-----')
      .replace(/-----BEGIN RSA PRIVATE KEY-----/g, '-----BEGIN RSA PRIVATE KEY-----\n')
      .replace(/-----END RSA PRIVATE KEY-----/g, '\n-----END RSA PRIVATE KEY-----')
      .replace(/-----BEGIN CERTIFICATE-----/g, '-----BEGIN CERTIFICATE-----\n')
      .replace(/-----END CERTIFICATE-----/g, '\n-----END CERTIFICATE-----')
      .replace(/-----BEGIN PUBLIC KEY-----/g, '-----BEGIN PUBLIC KEY-----\n')
      .replace(/-----END PUBLIC KEY-----/g, '\n-----END PUBLIC KEY-----');
  }

  return cleaned.trim();
}

/**
 * Diagnostic check to validate presence and basic formatting of PayGlocal environment variables.
 * NEVER returns secret key contents.
 */
export function validatePayGlocalConfig(): PayGlocalConfigStatus {
  const merchantId = getPayGlocalEnv('PAYGLOCAL_MERCHANT_ID');
  const kid = getPayGlocalEnv('PAYGLOCAL_PVT_KEY_KID');
  const pvtKey = getPayGlocalEnv('PAYGLOCAL_PRIVATE_KEY');
  const pubCert = getPayGlocalEnv('PAYGLOCAL_PUBLIC_CERT');

  const missingVars: string[] = [];
  const invalidVars: string[] = [];

  if (!merchantId || merchantId.includes('your_mid')) {
    missingVars.push('PAYGLOCAL_MERCHANT_ID');
  }

  if (!kid || kid.includes('your_private_key')) {
    missingVars.push('PAYGLOCAL_PVT_KEY_KID');
  }

  const cleanedPvtKey = cleanPem(pvtKey);
  const hasPvtHeader =
    cleanedPvtKey.includes('-----BEGIN PRIVATE KEY-----') ||
    cleanedPvtKey.includes('-----BEGIN RSA PRIVATE KEY-----');

  if (!pvtKey) {
    missingVars.push('PAYGLOCAL_PRIVATE_KEY');
  } else if (!hasPvtHeader || pvtKey.includes('your_private_key') || pvtKey.includes('...')) {
    invalidVars.push('PAYGLOCAL_PRIVATE_KEY');
  }

  const cleanedPubCert = cleanPem(pubCert);
  const hasCertHeader =
    cleanedPubCert.includes('-----BEGIN CERTIFICATE-----') ||
    cleanedPubCert.includes('-----BEGIN PUBLIC KEY-----');

  if (!pubCert) {
    missingVars.push('PAYGLOCAL_PUBLIC_CERT');
  } else if (!hasCertHeader || pubCert.includes('your_mid_here') || pubCert.includes('...')) {
    invalidVars.push('PAYGLOCAL_PUBLIC_CERT');
  }

  const isValid = missingVars.length === 0 && invalidVars.length === 0;

  return {
    isValid,
    missingVars,
    invalidVars,
    details: {
      PAYGLOCAL_MERCHANT_ID: { set: Boolean(merchantId) },
      PAYGLOCAL_PVT_KEY_KID: { set: Boolean(kid) },
      PAYGLOCAL_PRIVATE_KEY: { set: Boolean(pvtKey), validPemHeader: hasPvtHeader },
      PAYGLOCAL_PUBLIC_CERT: { set: Boolean(pubCert), validPemHeader: hasCertHeader },
    },
  };
}

/**
 * 1. loadPrivateKey - Import PKCS8 RSA private key from environment for JWS signing
 */
export async function loadPrivateKey(): Promise<unknown> {
  const rawKey = getPayGlocalEnv('PAYGLOCAL_PRIVATE_KEY');
  const pvtKeyPem = cleanPem(rawKey);

  if (!pvtKeyPem || pvtKeyPem.includes('your_private_key') || pvtKeyPem.includes('...')) {
    throw new Error('PAYGLOCAL_PRIVATE_KEY is missing or contains placeholder text.');
  }

  try {
    return await jose.importPKCS8(pvtKeyPem, 'RS256');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Jose PKCS8 Import Error:', error);
    throw new Error(
      'Invalid PAYGLOCAL_PRIVATE_KEY format. Please ensure the full PKCS#8 PEM private key is set.'
    );
  }
}

/**
 * 2. loadPublicCert - Import SPKI / X.509 public key/cert for JWE encryption or JWS verification
 */
export async function loadPublicCert(
  alg: 'RSA-OAEP-256' | 'RS256' = 'RSA-OAEP-256'
): Promise<unknown> {
  const rawCert = getPayGlocalEnv('PAYGLOCAL_PUBLIC_CERT');
  const certPem = cleanPem(rawCert);

  if (!certPem || certPem.includes('your_mid_here') || certPem.includes('...')) {
    throw new Error('PAYGLOCAL_PUBLIC_CERT is missing or contains placeholder text.');
  }

  try {
    if (certPem.includes('BEGIN CERTIFICATE')) {
      return await jose.importX509(certPem, alg);
    } else {
      return await jose.importSPKI(certPem, alg);
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Jose Public Cert Import Error:', error);
    throw new Error(
      'Invalid PAYGLOCAL_PUBLIC_CERT format. Please ensure the full X.509 Certificate or SPKI PEM is set.'
    );
  }
}

/**
 * 3. createJWS - Sign JWT payload with merchant private key
 */
export async function createJWS(merchantId: string, kid: string): Promise<string> {
  const privateKey = await loadPrivateKey();

  const jws = await new jose.SignJWT({
    merchantId: merchantId,
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({
      alg: 'RS256',
      kid: kid,
      'issued-by': 'MERCHANT',
      typ: 'JWT',
    })
    .sign(privateKey);

  return jws;
}

/**
 * 4. createJWE - Encrypt PayCollect payload with PayGlocal public certificate
 */
export async function createJWE(
  payload: Record<string, unknown> | PayCollectPayload
): Promise<string> {
  const publicCert = await loadPublicCert('RSA-OAEP-256');
  const encoder = new TextEncoder();
  const plaintext = encoder.encode(JSON.stringify(payload));

  const jwe = await new jose.CompactEncrypt(plaintext)
    .setProtectedHeader({
      alg: 'RSA-OAEP-256',
      enc: 'A256GCM',
    })
    .encrypt(publicCert);

  return jwe;
}

/**
 * 5. verifyCallbackToken - Verify token posted to merchant callback by PayGlocal
 */
export async function verifyCallbackToken(
  token: string
): Promise<PayGlocalCallbackPayload | null> {
  try {
    const publicCert = await loadPublicCert('RS256');
    const { payload } = await jose.jwtVerify(token, publicCert, {
      algorithms: ['RS256'],
    });

    return payload as PayGlocalCallbackPayload;
  } catch (error) {
    console.error('Callback token verification failed:', error);
    return null;
  }
}

