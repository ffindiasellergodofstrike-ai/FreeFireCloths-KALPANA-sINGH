import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validatePayGlocalConfig } from '../../lib/payglocal.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const configStatus = validatePayGlocalConfig();

  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    configStatus,
  });
}
