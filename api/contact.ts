import { emailConfigured } from '../server/email-delivery.js';
import {
  checkContactRateLimit,
  ContactValidationError,
  submitContactInquiry,
  validateContactInput,
} from '../server/contact.js';

function readClientIp(req: any): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let input;
  try {
    input = validateContactInput(req.body);
  } catch (error) {
    if (error instanceof ContactValidationError) {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(400).json({ error: 'Invalid contact request.' });
  }

  const rate = checkContactRateLimit(readClientIp(req), input.email);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({
      error: 'Too many messages sent recently. Please try again later or email support@ffstreetwear.shop.',
    });
  }

  if (!emailConfigured()) {
    return res.status(503).json({
      error: 'Contact email service is not configured. Please email support@ffstreetwear.shop or call +91-7393845435 directly.',
    });
  }

  try {
    await submitContactInquiry(input);
    return res.status(200).json({
      sent: true,
      message: `Message sent! We'll reply to ${input.email} within 24 hours.`,
    });
  } catch (error) {
    console.error('Contact form email failed:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(503).json({
      error: 'Unable to send your message right now. Please email support@ffstreetwear.shop or call +91-7393845435.',
    });
  }
}
