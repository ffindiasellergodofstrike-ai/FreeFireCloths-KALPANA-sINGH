import { orderMessage, type OrderEmail } from './order-message.js';

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}
export async function deliverOrderEmail(order: OrderEmail, key: string) {
  if (!emailConfigured()) throw new Error('Email is not configured');
  const endpoint = (process.env.RESEND_BASE_URL || 'https://api.resend.com').replace(/\/$/, '');
  const response = await fetch(`${endpoint}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify({ from: `Free Fire Store <${process.env.RESEND_FROM_EMAIL}>`, to: [order.email], ...orderMessage(order) }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Email delivery request failed');
}
