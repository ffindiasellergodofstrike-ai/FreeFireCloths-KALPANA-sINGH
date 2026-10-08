import crypto from 'node:crypto';
import { CompactEncrypt, compactDecrypt } from 'jose';
import { readCheckoutParameters, type CheckoutParameters } from '../src/lib/garena-checkout-access.js';

export type CheckoutOutcome = 'success' | 'failed';

export interface CheckoutReturnState {
  version: 1;
  kind: 'return';
  issued: number;
  expires: number;
  merchantTxnId: string;
  checkout: CheckoutParameters;
}

export interface CheckoutResultState extends Omit<CheckoutReturnState, 'kind'> {
  kind: 'result';
  status: CheckoutOutcome;
  gid: string;
}

function encryptionKey() {
  const secret = process.env.CHECKOUT_RETURN_SECRET || process.env.ORDER_EMAIL_SECRET || process.env.PAYGLOCAL_PRIVATE_KEY || '';
  if (secret.length < 32) throw new Error('Checkout return secret is not configured');
  return crypto.createHash('sha256').update('ffstreetwear:checkout-return:v1\0').update(secret).digest();
}

function validateCheckout(value: unknown): CheckoutParameters {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid checkout return');
  const fields = ['pkg', 'diamonds', 'uid', 'nick', 'level'] as const;
  const params = new URLSearchParams();
  for (const field of fields) {
    const item = (value as Record<string, unknown>)[field];
    if (typeof item !== 'string') throw new Error('Invalid checkout return');
    params.set(field, item);
  }
  const checkout = readCheckoutParameters(params);
  if (!checkout) throw new Error('Invalid checkout return');
  return checkout;
}

function validateCommon(value: any, kind: 'return' | 'result', now: number) {
  if (!value || value.version !== 1 || value.kind !== kind) throw new Error('Invalid checkout return');
  if (!Number.isSafeInteger(value.issued) || !Number.isSafeInteger(value.expires) || value.issued > now + 30_000 || value.expires <= now) throw new Error('Expired checkout return');
  if (typeof value.merchantTxnId !== 'string' || !/^PG-[0-9]+-[0-9]+$/.test(value.merchantTxnId)) throw new Error('Invalid checkout return');
  return { ...value, checkout: validateCheckout(value.checkout) };
}

async function encrypt(value: object) {
  return new CompactEncrypt(new TextEncoder().encode(JSON.stringify(value)))
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', typ: 'checkout-return+jwe' })
    .encrypt(encryptionKey());
}

async function decrypt(token: unknown) {
  if (typeof token !== 'string' || token.length < 50 || token.length > 5000) throw new Error('Invalid checkout return');
  const { plaintext } = await compactDecrypt(token, encryptionKey());
  return JSON.parse(new TextDecoder().decode(plaintext));
}

export async function createCheckoutReturnToken(checkout: CheckoutParameters, merchantTxnId: string, now = Date.now()) {
  const state: CheckoutReturnState = {
    version: 1,
    kind: 'return',
    issued: now,
    expires: now + 2 * 60 * 60 * 1000,
    merchantTxnId,
    checkout: validateCheckout(checkout),
  };
  return encrypt(state);
}

export async function readCheckoutReturnToken(token: unknown, now = Date.now()): Promise<CheckoutReturnState> {
  return validateCommon(await decrypt(token), 'return', now) as CheckoutReturnState;
}

export async function createCheckoutResultToken(state: CheckoutReturnState, status: CheckoutOutcome, gid: string, now = Date.now()) {
  if (status !== 'success' && status !== 'failed') throw new Error('Invalid checkout result');
  if (typeof gid !== 'string' || gid.length < 1 || gid.length > 200 || /[\x00-\x1f\x7f]/.test(gid)) throw new Error('Invalid checkout result');
  const result: CheckoutResultState = {
    version: 1,
    kind: 'result',
    issued: now,
    expires: now + 10 * 60 * 1000,
    merchantTxnId: state.merchantTxnId,
    checkout: validateCheckout(state.checkout),
    status,
    gid,
  };
  return encrypt(result);
}

export async function readCheckoutResultToken(token: unknown, now = Date.now()): Promise<CheckoutResultState> {
  const result = validateCommon(await decrypt(token), 'result', now) as CheckoutResultState;
  if (result.status !== 'success' && result.status !== 'failed') throw new Error('Invalid checkout result');
  if (typeof result.gid !== 'string' || result.gid.length < 1 || result.gid.length > 200 || /[\x00-\x1f\x7f]/.test(result.gid)) throw new Error('Invalid checkout result');
  return result;
}
