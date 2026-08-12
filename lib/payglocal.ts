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
 * Get active endpoint based on environment variable PAYGLOCAL_ENV
 */
export function getPayGlocalEndpoints() {
  // Hardcoded to production as requested
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
  status: string; // e.g., SENT_FOR_CAPTURE, SUCCESS, FAILURE, ISSUER_DECLINE, CUSTOMER_CANCELLED
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

/**
 * Utility function to normalize PEM keys (handling single line escaped \n strings)
 */
function cleanPem(pem: string): string {
  if (!pem) return '';
  let cleaned = pem.trim();
  // Handle single line env variable with escaped \n
  if (cleaned.includes('\\n')) {
    cleaned = cleaned.replace(/\\n/g, '\n');
  }
  // Strip outer quotes if present
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned;
}

/**
 * 1. loadPrivateKey - Import PKCS8 RSA private key from environment for JWS signing
 */
export async function loadPrivateKey(): Promise<unknown> {
  const pvtKeyPem = cleanPem(process.env.PAYGLOCAL_PRIVATE_KEY || '');
  if (!pvtKeyPem || pvtKeyPem.includes('your_private_key_kid') || pvtKeyPem.includes('...')) {
    throw new Error('Missing or placeholder PAYGLOCAL_PRIVATE_KEY in environment variables. Please add your real PayGlocal Private Key in Vercel Environment Variables.');
  }

  try {
    // Import PKCS8 Private Key for RS256 algorithm
    return await jose.importPKCS8(pvtKeyPem, 'RS256');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Jose PKCS8 Import Error:', error);
    throw new Error('Invalid PayGlocal Private Key format in environment variables. Please ensure the full PKCS8 PEM key is pasted into Vercel Environment Variables.');
  }
}

/**
 * 2. loadPublicCert - Import SPKI / X.509 public key/cert for JWE encryption or JWS verification
 */
export async function loadPublicCert(
  alg: 'RSA-OAEP-256' | 'RS256' = 'RSA-OAEP-256'
): Promise<unknown> {
  const certPem = cleanPem(process.env.PAYGLOCAL_PUBLIC_CERT || '');
  if (!certPem || certPem.includes('your_mid_here') || certPem.includes('...')) {
    throw new Error('Missing or placeholder PAYGLOCAL_PUBLIC_CERT in environment variables. Please add your real PayGlocal Public Certificate in Vercel Environment Variables.');
  }

  try {
    if (certPem.includes('BEGIN CERTIFICATE')) {
      // Import X509 Certificate
      return await jose.importX509(certPem, alg);
    } else {
      // Import SPKI Public Key
      return await jose.importSPKI(certPem, alg);
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Jose Public Cert Import Error:', error);
    throw new Error('Invalid PayGlocal Public Certificate format in environment variables. Please ensure the full Certificate is pasted into Vercel Environment Variables.');
  }
}

/**
 * 3. createJWS - Sign JWT payload with merchant private key
 * JWS Header requirements:
 * - alg: RS256
 * - kid: {private-key-kid}
 * - issued-by: "MERCHANT"
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
 * JWE Header requirements:
 * - alg: RSA-OAEP-256
 * - enc: A256GCM
 */
export async function createJWE(payload: Record<string, unknown> | PayCollectPayload): Promise<string> {
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
export async function verifyCallbackToken(token: string): Promise<PayGlocalCallbackPayload | null> {
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
