import crypto from 'node:crypto';
import { PRODUCTS } from '../src/data/products.js';

export interface Receipt {
  version: 1; issued: number; expires: number; gid: string; merchantTxnId: string; orderNumber: string;
  email: string; total: number;
  customer: { firstName: string; lastName: string; address: string; city: string; state: string; pincode: string; phone: string };
  items: { id: number; name: string; size: string; color: string; qty: number; price: number }[];
}
const clean = (v: unknown, max = 200) => String(v || '').replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, max);
const secret = () => process.env.ORDER_EMAIL_SECRET || '';
const mac = (payload: string) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

// Created only after PayGlocal returns a real GID from initiation. Never exposed as an endpoint.
export function createReceiptToken(body: any, gid: string, merchantTxnId: string, now = Date.now()): string | null {
  if (secret().length < 32 || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || body.source === 'garena') return null;
  const email = clean(body.customerData?.email, 254);
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || !Number.isFinite(Number(body.amount)) || Number(body.amount) <= 0) return null;
  const total = Math.round(Number(body.amount) * 100) / 100;
  if (!Number.isFinite(total) || total <= 0) return null;
  const customer = Object.fromEntries(['firstName','lastName','address','city','state','pincode','phone'].map(key => [key, clean(body.customerData?.[key])])) as Receipt['customer'];
  let items: Receipt['items'] = [];
  if (Array.isArray(body.items) && body.items.length > 0 && body.items.length <= 50) {
    for (const item of body.items) {
      const product = PRODUCTS.find(p => p.id === Number(item.id));
      const qty = Number(item.qty);
      if (!product || !Number.isInteger(qty) || qty < 1 || qty > 100 || !product.sizes.includes(item.size)) { items = []; break; }
      items.push({ id: product.id, name: product.name, price: product.price, qty, size: clean(item.size, 30), color: clean(item.color, 60) });
    }
    if (Math.round(items.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) !== Math.round(total * 100)) items = [];
  }
  const receipt: Receipt = { version: 1, issued: now, expires: now + 23 * 60 * 60 * 1000, gid, merchantTxnId,
    orderNumber: /^\d{6}$/.test(String(body.orderNumber)) ? String(body.orderNumber) : merchantTxnId,
    email, total, customer, items };
  const payload = Buffer.from(JSON.stringify(receipt)).toString('base64url');
  return `${payload}.${mac(payload)}`;
}
export function readReceiptToken(token: unknown, now = Date.now()): Receipt {
  if (typeof token !== 'string' || token.length > 40000 || secret().length < 32) throw Error('Invalid receipt');
  const parts = token.split('.');
  if (parts.length !== 2) throw Error('Invalid receipt');
  const signature = Buffer.from(parts[1], 'base64url');
  const expected = Buffer.from(mac(parts[0]), 'base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(signature, expected)) throw Error('Invalid receipt');
  const receipt = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')) as Receipt;
  if (receipt.version !== 1 || receipt.expires <= now || receipt.issued > now || !/^[\w-]+$/.test(receipt.gid) || !/^[\w-]+$/.test(receipt.merchantTxnId)) throw Error('Expired or invalid receipt');
  return receipt;
}
