import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createJWS, getPayGlocalEndpoints, getPayGlocalEnv } from '../../lib/payglocal.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const gid = req.query.gid as string;

    if (!gid) {
      return res
        .status(400)
        .json({ success: false, error: 'GID parameter is required' });
    }

    const merchantId = getPayGlocalEnv('PAYGLOCAL_MERCHANT_ID');
    const kid = getPayGlocalEnv('PAYGLOCAL_PVT_KEY_KID');

    if (!merchantId || !kid) {
      return res.status(500).json({
        success: false,
        error: 'Missing Merchant ID or Private Key KID',
      });
    }

    const jwsToken = await createJWS(merchantId, kid);
    const endpoints = getPayGlocalEndpoints();

    const response = await fetch(endpoints.status(gid), {
      method: 'GET',
      headers: {
        'x-gl-token-external': jwsToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'Failed to fetch transaction status',
        details: data,
      });
    }

    return res.status(200).json({ success: true, gid, data });
  } catch (error: unknown) {
    const err = error as Error;
    return res
      .status(500)
      .json({ success: false, error: err.message || 'Internal error' });
  }
}
