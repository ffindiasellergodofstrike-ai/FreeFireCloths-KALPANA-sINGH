import { emailConfigured } from '../server/email-delivery.js';
import { CodEmailError, confirmCodEmail } from '../server/cod-email.js';
import { codEmailStore } from '../server/cod-email-store.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const id = req.body?.orderId;
  if (typeof id !== 'string' || !/^[A-Za-z0-9]{20}$/.test(id)) return res.status(400).json({ error: 'Invalid order reference' });
  if (!emailConfigured()) return res.status(503).json({ error: 'Order email is not configured' });
  try {
    await confirmCodEmail(codEmailStore(), id);
    return res.json({ sent: true });
  } catch (error) {
    if (error instanceof CodEmailError) return res.status(error.status).json({ error: error.message });
    console.error('COD email confirmation failed:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(503).json({ error: 'Order email is temporarily unavailable. Your order remains saved.' });
  }
}
