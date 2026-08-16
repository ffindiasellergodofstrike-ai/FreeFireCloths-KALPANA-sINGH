import { generateJWS } from 'payglocal-js-client';
import crypto from 'crypto';

function loadKey(raw) {
  if (!raw) return '';
  let k = raw.trim();
  if (!k.includes('-----BEGIN')) {
    k = Buffer.from(k, 'base64').toString('utf8').trim();
  }
  k = k.replace(/\\n/g, '\n');
  return k;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const { gid } = req.query;
  
  if (!gid) {
    return res.status(400).json({ error: 'missing gid' });
  }

  try {
    const headers = {
      "x-gl-merchantid": process.env.PAYGLOCAL_MERCHANT_ID,
      "x-gl-kid": process.env.PAYGLOCAL_PRIVATE_KEY_ID
    };

    const statusRes = await fetch(`https://api.payglocal.in/gl/v1/payments/${gid}/status`, {
      method: "GET",
      headers
    });

    if (!statusRes.ok) {
      const err = await statusRes.text();
      return res.status(500).json({ error: 'status_api_failed', details: err });
    }

    const data = await statusRes.json();
    const status = data.data?.status;
    const isPaid = status === 'SENT_FOR_CAPTURE' || status === 'CAPTURED' || status === 'PAID';

    return res.json({ status, isPaid, raw: data });
  } catch (error) {
    console.error("Status check error:", error);
    return res.status(500).json({ error: 'internal_error' });
  }
}
