import { emailConfigured } from '../server/email-delivery.js';
import { createWelcomeEmailStore, sendWelcomeEmail, WelcomeEmailError } from '../server/account-welcome.js';
import { readPublicUser } from '../server/firebase-public.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (!emailConfigured()) return res.status(503).json({ error: 'Welcome email is not configured' });
  try {
    await sendWelcomeEmail(createWelcomeEmailStore(readPublicUser), email);
    return res.json({ sent: true });
  } catch (error) {
    if (error instanceof WelcomeEmailError) return res.status(error.status).json({ error: error.message });
    console.error('Account welcome email failed:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(503).json({ error: 'Your account was created, but the welcome email could not be sent.' });
  }
}
