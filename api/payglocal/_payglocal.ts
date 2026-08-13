import * as jose from 'jose';
import { createPrivateKey, createPublicKey, createHash } from 'node:crypto';

export const PAYGLOCAL_ENDPOINTS = {
  prod: {
    paycollect: 'https://api.prod.payglocal.in/gl/v1/payments/initiate/paycollect',
    paydirect: 'https://api.prod.payglocal.in/gl/v1/payments/initiate',
    status: (gid: string) => `https://api.prod.payglocal.in/gl/v1/payments/${gid}/status`,
  },
  uat: {
    paycollect: 'https://api.uat.payglocal.in/gl/v1/payments/initiate/paycollect',
    paydirect: 'https://api.uat.payglocal.in/gl/v1/payments/initiate',
    status: (gid: string) => `https://api.uat.payglocal.in/gl/v1/payments/${gid}/status`,
  },
};

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

export function getPayGlocalEndpoints() {
  const env = (process.env.PAYGLOCAL_ENV || '').toLowerCase();
  if (env === 'uat' || env === 'test') {
    return PAYGLOCAL_ENDPOINTS.uat;
  }
  return PAYGLOCAL_ENDPOINTS.prod;
}

export interface PayCollectPayload {
  merchantTxnId: string;
  merchantUniqueId: string;
  paymentData: {
    totalAmount: string;
    txnCurrency: string;
  };
  merchantCallbackURL: string;
  riskData?: {
    customerData?: {
      merchantAssignedCustomerId?: string;
    };
    shippingData?: {
      addressCountry?: string;
      emailId?: string;
    };
  };
}

export interface PayCollectResponse {
  gid?: string;
  status?: string;
  message?: string;
  timestamp?: string;
  reasonCode?: string;
  data?: {
    redirectUrl?: string;
    statusUrl?: string;
    gid?: string;
  };
  error?: {
    code?: string;
    message?: string;
  };
}

export interface PayGlocalCallbackPayload {
  status: string;
  gid: string;
  merchantUniqueId?: string;
  merchantTxnId?: string;
  iat?: number;
}

export interface PayGlocalStatusResponse {
  gid?: string;
  status?: string;
  message?: string;
  data?: {
    status?: string;
    detailedMessage?: string;
    Amount?: string;
    Currency?: string;
    merchantTxnId?: string;
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

export function cleanPem(pem: string): string {
  if (!pem) return '';
  let cleaned = pem.trim();

  // Strip wrapping double or single quotes if present
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Handle literal escaped newlines (e.g. \n) and carriage returns
  cleaned = cleaned.replace(/\\n/g, '\n').replace(/\r/g, '');

  // Ensure header and footer have proper newlines if stuck on single line
  if (!cleaned.includes('\n')) {
    cleaned = cleaned
      .replace(/-----BEGIN PRIVATE KEY-----/g, '-----BEGIN PRIVATE KEY-----\n')
      .replace(/-----END PRIVATE KEY-----/g, '\n-----END PRIVATE KEY-----')
      .replace(/-----BEGIN RSA PRIVATE KEY-----/g, '-----BEGIN RSA PRIVATE KEY-----\n')
      .replace(/-----END RSA PRIVATE KEY-----/g, '\n-----END RSA PRIVATE KEY-----')
      .replace(/-----BEGIN CERTIFICATE-----/g, '-----BEGIN CERTIFICATE-----\n')
      .replace(/-----END CERTIFICATE-----/g, '\n-----END CERTIFICATE-----')
      .replace(/-----BEGIN PUBLIC KEY-----/g, '-----BEGIN PUBLIC KEY-----\n')
      .replace(/-----END PUBLIC KEY-----/g, '\n-----END PUBLIC KEY-----')
      .replace(/-----BEGIN RSA PUBLIC KEY-----/g, '-----BEGIN RSA PUBLIC KEY-----\n')
      .replace(/-----END RSA PUBLIC KEY-----/g, '\n-----END RSA PUBLIC KEY-----');
  }

  return cleaned.trim();
}

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
    cleanedPubCert.includes('-----BEGIN PUBLIC KEY-----') ||
    cleanedPubCert.includes('-----BEGIN RSA PUBLIC KEY-----');

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

export async function loadPrivateKey(): Promise<unknown> {
  const rawKey = getPayGlocalEnv('PAYGLOCAL_PRIVATE_KEY');
  const pvtKeyPem = cleanPem(rawKey);

  if (!pvtKeyPem || pvtKeyPem.includes('your_private_key') || pvtKeyPem.includes('...')) {
    throw new Error('PAYGLOCAL_PRIVATE_KEY is missing or contains placeholder text.');
  }

  try {
    // node:crypto createPrivateKey converts PKCS#1 (BEGIN RSA PRIVATE KEY) and PKCS#8 automatically
    const keyObject = createPrivateKey({
      key: pvtKeyPem,
      format: 'pem',
    });
    // Export as PKCS#8 PEM string so jose can parse it without error regardless of original format
    const pkcs8Pem = keyObject.export({ format: 'pem', type: 'pkcs8' }) as string;
    return await jose.importPKCS8(pkcs8Pem, 'RS256');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Jose/Crypto Private Key Import Error:', error);
    throw new Error(
      `Invalid PAYGLOCAL_PRIVATE_KEY format: ${error.message}`
    );
  }
}

export async function loadPublicCert(
  alg: 'RSA-OAEP-256' | 'RS256' = 'RSA-OAEP-256'
): Promise<unknown> {
  const rawCert = getPayGlocalEnv('PAYGLOCAL_PUBLIC_CERT');
  const certPem = cleanPem(rawCert);

  if (!certPem || certPem.includes('your_mid_here') || certPem.includes('...')) {
    throw new Error('PAYGLOCAL_PUBLIC_CERT is missing or contains placeholder text.');
  }

  try {
    // Try node:crypto createPublicKey first, which handles X.509 certs, SPKI public keys, and PKCS#1 public keys
    const pubKeyObj = createPublicKey({
      key: certPem,
      format: 'pem',
    });
    const spkiPem = pubKeyObj.export({ format: 'pem', type: 'spki' }) as string;
    return await jose.importSPKI(spkiPem, alg);
  } catch {
    // Fallback directly to jose helpers if createPublicKey fails
    try {
      if (certPem.includes('-----BEGIN CERTIFICATE-----')) {
        return await jose.importX509(certPem, alg);
      } else {
        return await jose.importSPKI(certPem, alg);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Jose Public Cert Import Error:', error);
      throw new Error(
        `Invalid PAYGLOCAL_PUBLIC_CERT format: ${error.message}`
      );
    }
  }
}

export async function createJWS(
  merchantId: string,
  kid: string,
  bodyPayload: string = '',
  useDigest: boolean = false
): Promise<string> {
  const privateKey = (await loadPrivateKey()) as Parameters<jose.CompactSign['sign']>[0];
  const encoder = new TextEncoder();

  let payloadToSign = bodyPayload;
  let isDigestedStr = 'false';

  if (useDigest && bodyPayload) {
    payloadToSign = createHash('sha256').update(bodyPayload, 'utf8').digest('hex');
    isDigestedStr = 'true';
  }

  return await new jose.CompactSign(encoder.encode(payloadToSign))
    .setProtectedHeader({
      alg: 'RS256',
      kid,
      'issued-by': 'MERCHANT',
      'is-digested': isDigestedStr,
    })
    .sign(privateKey);
}

export async function createJWE(
  payload: Record<string, unknown> | PayCollectPayload
): Promise<string> {
  const publicCert = (await loadPublicCert('RSA-OAEP-256')) as Parameters<jose.CompactEncrypt['encrypt']>[0];
  const encoder = new TextEncoder();
  const plaintext = encoder.encode(JSON.stringify(payload));

  return await new jose.CompactEncrypt(plaintext)
    .setProtectedHeader({
      alg: 'RSA-OAEP-256',
      enc: 'A256GCM',
    })
    .encrypt(publicCert);
}

export async function verifyCallbackToken(
  token: string
): Promise<PayGlocalCallbackPayload | null> {
  try {
    const publicCert = await loadPublicCert('RS256');
    const { payload } = await jose.jwtVerify(token, publicCert, {
      algorithms: ['RS256'],
    });

    return payload as unknown as PayGlocalCallbackPayload;
  } catch (err) {
    console.error('Failed to verify PayGlocal callback JWS token:', err);
    return null;
  }
}

