import crypto from 'node:crypto';
import { deliverEmail } from './email-delivery.js';

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export class ContactValidationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]!));

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 3;
const ipHits = new Map<string, number[]>();
const emailHits = new Map<string, number[]>();

export function resetContactRateLimits() {
  ipHits.clear();
  emailHits.clear();
}

function pruneHits(store: Map<string, number[]>, key: string, now: number): number[] {
  const recent = (store.get(key) || []).filter(ts => now - ts < WINDOW_MS);
  if (recent.length) store.set(key, recent);
  else store.delete(key);
  return recent;
}

export function checkContactRateLimit(ip: string, email: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
  const ipKey = ip || 'unknown';
  const emailKey = email.toLowerCase();
  const recentIp = pruneHits(ipHits, ipKey, now);
  const recentEmail = pruneHits(emailHits, emailKey, now);

  if (recentIp.length >= MAX_PER_IP || recentEmail.length >= MAX_PER_EMAIL) {
    const oldest = Math.min(
      recentIp.length >= MAX_PER_IP ? recentIp[0] : Infinity,
      recentEmail.length >= MAX_PER_EMAIL ? recentEmail[0] : Infinity,
    );
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  ipHits.set(ipKey, [...recentIp, now]);
  emailHits.set(emailKey, [...recentEmail, now]);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function validateContactInput(raw: unknown): ContactPayload {
  if (!raw || typeof raw !== 'object') {
    throw new ContactValidationError('Invalid request payload.');
  }
  const body = raw as Record<string, unknown>;

  if (
    (typeof body.website === 'string' && body.website.trim().length > 0) ||
    (typeof body.company === 'string' && body.company.trim().length > 0)
  ) {
    throw new ContactValidationError('Invalid submission.');
  }

  const name = typeof body.name === 'string' ? body.name.replace(/[\r\n]+/g, ' ').trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.replace(/[\r\n]+/g, ' ').trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.replace(/[\r\n]+/g, ' ').trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || name.length > 100) {
    throw new ContactValidationError('Please enter your full name (2–100 characters).');
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || email.length > 254) {
    throw new ContactValidationError('Please enter a valid email address.');
  }
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (phone.length > 20 || digits.length < 7 || digits.length > 15 || !/^[+\d()\s-]+$/.test(phone)) {
      throw new ContactValidationError('Please enter a valid phone number.');
    }
  }
  if (subject.length < 2 || subject.length > 120) {
    throw new ContactValidationError('Please select or enter a subject.');
  }
  if (message.length < 10 || message.length > 3000) {
    throw new ContactValidationError('Please enter a message between 10 and 3000 characters.');
  }
  const urlCount = (message.match(/https?:\/\/|www\./gi) || []).length;
  if (urlCount > 3) {
    throw new ContactValidationError('Message contains too many links.');
  }

  return { name, email, phone, subject, message };
}

export function formatContactEmail(input: ContactPayload) {
  const emailSubject = `[ffstreetwear Contact] ${input.subject} — ${input.name}`;
  const html = `<!doctype html>
<html>
<body style="font-family:Arial,sans-serif;color:#111827;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="margin:0 0 12px;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">New Customer Inquiry — ffstreetwear</h2>
  <p style="margin:6px 0;"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
  <p style="margin:6px 0;"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
  <p style="margin:6px 0;"><strong>Phone:</strong> ${escapeHtml(input.phone || 'Not provided')}</p>
  <p style="margin:6px 0;"><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
  <div style="margin-top:16px;padding:14px;background:#f9fafb;border:1px solid #e5e7eb;white-space:pre-wrap;">${escapeHtml(input.message)}</div>
</body>
</html>`;
  const text = [
    'New Customer Inquiry — ffstreetwear',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || 'Not provided'}`,
    `Subject: ${input.subject}`,
    '',
    input.message,
  ].join('\n');

  return { subject: emailSubject, html, text, replyTo: input.email };
}

export async function submitContactInquiry(
  input: ContactPayload,
  send = deliverEmail,
) {
  const supportInbox = (process.env.CONTACT_TO_EMAIL || 'support@ffstreetwear.shop').trim();
  const key = `contact/${crypto.randomUUID()}`;
  await send(supportInbox, key, formatContactEmail(input));
}
