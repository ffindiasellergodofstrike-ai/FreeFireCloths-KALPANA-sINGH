import { createHash } from 'node:crypto';
import { deliverEmail } from './email-delivery.js';
import { firebaseAdminDatabase } from './cod-email-store.js';

const clean = (value: unknown, max = 120) => typeof value === 'string'
  ? value.replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, max)
  : '';
const emailKey = (email: string) => createHash('sha256').update(email).digest('hex');

export class WelcomeEmailError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export type WelcomeEmailJob = {
  email: string;
  name: string;
  sent: boolean;
  expires: number;
  leaseUntil: number;
};

export interface WelcomeEmailStore {
  reserve(email: string, now: number): Promise<WelcomeEmailJob>;
  complete(email: string): Promise<void>;
  release(email: string): Promise<void>;
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

export function createWelcomeEmailStore(db: ReturnType<typeof firebaseAdminDatabase>): WelcomeEmailStore {
  const jobRef = (email: string) => db.collection('_order_email_delivery').doc(`welcome-${emailKey(email)}`);
  return {
    reserve: (email, now) => db.runTransaction(async transaction => {
      const userRef = db.collection('users').doc(email);
      const ref = jobRef(email);
      const [userSnapshot, existingSnapshot] = await Promise.all([
        transaction.get(userRef),
        transaction.get(ref),
      ]);

      if (existingSnapshot.exists) {
        const job = existingSnapshot.data() as WelcomeEmailJob;
        if (job.sent) return job;
        if (job.expires <= now) throw new WelcomeEmailError(410, 'Welcome email retry period has ended');
        if (job.leaseUntil > now) throw new WelcomeEmailError(409, 'Welcome email is already being sent');
        transaction.update(ref, { leaseUntil: now + 45000 });
        return job;
      }

      if (!userSnapshot.exists) throw new WelcomeEmailError(404, 'Account not found');
      const user = userSnapshot.data();
      const createdAt = typeof user?.createdAt === 'string' ? Date.parse(user.createdAt) : NaN;
      if (typeof user?.email !== 'string' || user.email.toLowerCase() !== email
        || !Number.isFinite(createdAt) || createdAt > now + 60000 || createdAt < now - 15 * 60000) {
        throw new WelcomeEmailError(404, 'New account not found');
      }
      const job: WelcomeEmailJob = {
        email,
        name: clean(user.name),
        sent: false,
        expires: now + 23 * 3600000,
        leaseUntil: now + 45000,
      };
      transaction.create(ref, job);
      return job;
    }),
    complete: async email => { await jobRef(email).update({ sent: true, leaseUntil: 0 }); },
    release: async email => { await jobRef(email).update({ leaseUntil: 0 }); },
  };
}

export async function sendWelcomeEmail(
  store: WelcomeEmailStore,
  email: string,
  now = Date.now(),
  send = (to: string, name: string, key: string) => deliverEmail(to, key, welcomeEmailMessage(name)),
) {
  const job = await store.reserve(email, now);
  if (job.sent) return;
  try {
    await send(job.email, job.name, `welcome/${emailKey(job.email)}`);
    await store.complete(email);
  } catch (error) {
    await store.release(email).catch(() => {});
    throw error;
  }
}
