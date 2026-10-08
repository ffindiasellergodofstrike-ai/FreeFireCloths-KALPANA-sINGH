import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { readCheckoutParameters, type CheckoutParameters } from '../src/lib/garena-checkout-access.js';
import { readCheckoutResultToken, type CheckoutOutcome } from './checkout-return.js';

export type CheckoutPageData = CheckoutParameters & { status?: CheckoutOutcome };

export const isCheckoutPath = (pathname: string) => /^\/garena-?checkout\/?$/i.test(pathname);

export function protectedHeaders(res: any) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
}

export function denyCheckout(res: any) {
  protectedHeaders(res);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.status(404).end('Not found');
}

// Duplicate query keys must stay duplicate. Object coercion must not collapse arrays.
export function requestParameters(query: Record<string, unknown> = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') params.append(key, value);
    else if (Array.isArray(value)) for (const item of value) params.append(key, String(item));
  }
  return params;
}

export async function servePrivateCheckout(req: any, res: any) {
  const params = requestParameters(req.query);
  let data: CheckoutPageData | null = null;
  let accessParameters: Record<string, string> | null = null;
  const resultTokens = params.getAll('result');
  if (resultTokens.length > 0) {
    const checkoutFields = ['pkg', 'diamonds', 'uid', 'nick', 'level'];
    if (resultTokens.length !== 1 || checkoutFields.some(field => params.has(field))) return denyCheckout(res);
    try {
      const result = await readCheckoutResultToken(resultTokens[0]);
      data = { ...result.checkout, status: result.status };
      accessParameters = { result: resultTokens[0] };
    } catch {
      return denyCheckout(res);
    }
  } else {
    data = readCheckoutParameters(params);
    if (data) accessParameters = { ...data };
  }
  // Apply the same rule to people and all user agents, including asset requests.
  if (req.method !== 'GET' || !data || !accessParameters) return denyCheckout(res);
  protectedHeaders(res);
  if (params.has('asset')) {
    if (params.getAll('asset').length !== 1 || params.get('asset') !== 'checkout.js') return denyCheckout(res);
    try {
      const js = await readFile(path.resolve('build/private-checkout/checkout.js'));
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      return res.status(200).end(js);
    } catch {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(503).end('Checkout unavailable');
    }
  }
  const nonce = randomBytes(18).toString('base64');
  const assetQuery = new URLSearchParams({ ...accessParameters, asset: 'checkout.js' });
  const assetUrl = '/api/private-checkout?' + assetQuery.toString();
  const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const escape = (text: string) => text.replace(/[&"<>]/g, char => ({ '&':'&amp;', '"':'&quot;', '<':'&lt;', '>':'&gt;' })[char]!);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src https: data:; connect-src 'self' https://*.googleapis.com; font-src https: data:; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`);
  return res.status(200).end(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow, noarchive"><title>Checkout</title></head><body style="margin:0"><div id="root"></div><script nonce="${nonce}">window.__CHECKOUT__=${json};</script><script nonce="${nonce}" src="${escape(assetUrl)}" defer></script></body></html>`);
}
