import { createHash } from 'node:crypto';
import { deliverEmail } from './email-delivery.js';

const clean = (value: unknown, max = 120) => typeof value === 'string'
  ? value.replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, max)
  : '';
const emailKey = (email: string, createdAt: number) => createHash('sha256').update(`${email}/${createdAt}`).digest('hex');

export class WelcomeEmailError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export type WelcomeEmailJob = {
  email: string;
  name: string;
  createdAt: number;
};

export interface WelcomeEmailStore {
  reserve(email: string, now: number): Promise<WelcomeEmailJob>;
}

export function welcomeEmailMessage(name: string) {
  const safeName = clean(name) || 'there';
  const htmlName = safeName.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
  return {
    subject: 'Welcome to Free Fire Store!',
    html: `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body style="margin:0;background:#f7f3ed;color:#33291f;font-family:Arial,sans-serif"><table role="presentation" style="width:100%;max-width:620px;margin:0 auto;background:#fffdf9;border-collapse:collapse"><tr><td style="padding:32px 24px"><p style="font-weight:bold;letter-spacing:2px">FREE FIRE STORE</p><h1 style="font:32px Georgia,serif">A warm welcome, ${htmlName}!</h1><p>We’re happy you’re here. Your account has been created, and you’re all set to explore the collection.</p><p>Thanks for joining our community. We hope you find something you love!</p><p style="margin-top:32px">With thanks,<br/><strong>Free Fire Store</strong></p></td></tr></table></body></html>`,
    text: `Welcome to Free Fire Store, ${safeName}!\n\nWe’re happy you’re here. Your account has been created, and you’re all set to explore the collection.\n\nThanks for joining our community. We hope you find something you love!\n\nWith thanks,\nFree Fire Store`,
  };
}

export function createWelcomeEmailStore(readUser: (email: string) => Promise<unknown>): WelcomeEmailStore {
  return {
    reserve: async (email, now) => {
      const user = await readUser(email);
      if (!user || typeof user !== 'object') throw new WelcomeEmailError(404, 'Account not found');
      const profile = user as Record<string, unknown>;
      const createdAt = typeof profile.createdAt === 'string' ? Date.parse(profile.createdAt) : NaN;
      if (typeof profile.email !== 'string' || profile.email.toLowerCase() !== email
        || !Number.isFinite(createdAt) || createdAt > now + 60000 || createdAt < now - 15 * 60000) {
        throw new WelcomeEmailError(404, 'New account not found');
      }
      return {
        email,
        name: clean(profile.name),
        createdAt,
      };
    },
  };
}

export async function sendWelcomeEmail(
  store: WelcomeEmailStore,
  email: string,
  now = Date.now(),
  send = (to: string, name: string, key: string) => deliverEmail(to, key, welcomeEmailMessage(name)),
) {
  const job = await store.reserve(email, now);
  await send(job.email, job.name, `welcome/${emailKey(job.email, job.createdAt)}`);
}
