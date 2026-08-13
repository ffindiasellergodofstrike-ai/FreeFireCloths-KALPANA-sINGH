import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  verifyCallbackToken,
  createJWS,
  getPayGlocalEndpoints,
  getPayGlocalEnv,
} from '../../lib/payglocal.js';
import type { PayGlocalStatusResponse } from '../../lib/payglocal.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const siteUrl = 'https://www.garenaofficialfreefire.shop';

  try {
    const token = req.body?.['x-gl-token'];
    const directGid = req.body?.gid;

    let status = 'UNKNOWN';
    let gid = directGid || '';
    let isValidToken = false;

    if (token) {
      const decodedPayload = await verifyCallbackToken(token);
      if (decodedPayload) {
        isValidToken = true;
        status = decodedPayload.status || 'UNKNOWN';
        gid = decodedPayload.gid || gid;
      }
    }

    // Fallback check
    if (!isValidToken && gid) {
      try {
        const merchantId = getPayGlocalEnv('PAYGLOCAL_MERCHANT_ID');
        const kid = getPayGlocalEnv('PAYGLOCAL_PVT_KEY_KID');
        const jwsToken = await createJWS(merchantId, kid);
        const endpoints = getPayGlocalEndpoints();

        const statusRes = await fetch(endpoints.status(gid), {
          method: 'GET',
          headers: {
            'x-gl-token-external': jwsToken,
          },
        });

        if (statusRes.ok) {
          const statusData: PayGlocalStatusResponse = await statusRes.json();
          status = statusData.status || statusData.data?.status || 'UNKNOWN';
        }
      } catch (fallbackErr) {
        console.error('Fallback status API check failed:', fallbackErr);
      }
    }

    const successfulStatuses = ['SUCCESS', 'SENT_FOR_CAPTURE', 'CAPTURED'];

    if (successfulStatuses.includes(status.toUpperCase())) {
      return res.redirect(
        303,
        `${siteUrl}/checkout/success?gid=${encodeURIComponent(gid)}`
      );
    } else {
      return res.redirect(
        303,
        `${siteUrl}/checkout/failed?gid=${encodeURIComponent(
          gid
        )}&status=${encodeURIComponent(status)}`
      );
    }
  } catch (error) {
    console.error('Error handling PayGlocal callback:', error);
    return res.redirect(303, `${siteUrl}/checkout/failed?status=SERVER_ERROR`);
  }
}
