import { orderMessage, type OrderEmail } from './order-message.js';

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}
export async function deliverEmail(
  to: string,
  key: string,
  message: { subject: string; html: string; text: string; replyTo?: string },
) {
  if (!emailConfigured()) throw new Error('Email is not configured');
  const endpoint = (process.env.RESEND_BASE_URL || 'https://api.resend.com').replace(/\/$/, '');
  const payload: Record<string, unknown> = {
    from: `ffstreetwear <${process.env.RESEND_FROM_EMAIL}>`,
    to: [to],
    subject: message.subject,
    html: message.html,
    text: message.text,
  };
  if (message.replyTo) payload.reply_to = message.replyTo;
  const response = await fetch(`${endpoint}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Email delivery request failed');
}

export function deliverOrderEmail(order: OrderEmail, key: string) {
  return deliverEmail(order.email, key, orderMessage(order));
}
