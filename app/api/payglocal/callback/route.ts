import { NextRequest, NextResponse } from 'next/server';
import {
  verifyCallbackToken,
  createJWS,
  getPayGlocalEndpoints,
  PayGlocalStatusResponse,
} from '@/lib/payglocal';

export async function POST(req: NextRequest) {
  const siteUrl = 'https://www.garenaofficialfreefire.shop';

  try {
    // PayGlocal callback sends application/x-www-form-urlencoded
    const formData = await req.formData();
    const token = formData.get('x-gl-token') as string | null;
    const directGid = formData.get('gid') as string | null;

    if (!token && !directGid) {
      console.error('Callback received without x-gl-token or gid');
      return NextResponse.redirect(`${siteUrl}/checkout/failed?status=MISSING_TOKEN`, 303);
    }

    let status = 'UNKNOWN';
    let gid = directGid || '';
    let isValidToken = false;

    // Verify token using PayGlocal public certificate
    if (token) {
      const decodedPayload = await verifyCallbackToken(token);
      if (decodedPayload) {
        isValidToken = true;
        status = decodedPayload.status || 'UNKNOWN';
        gid = decodedPayload.gid || gid;
      }
    }

    // Fallback to Get Status API if token verification failed or was incomplete but gid exists
    if (!isValidToken && gid) {
      console.warn('Callback token validation failed. Attempting status API fallback for GID:', gid);
      try {
        const merchantId = process.env.PAYGLOCAL_MERCHANT_ID || '';
        const kid = process.env.PAYGLOCAL_PVT_KEY_KID || '';
        const jwsToken = await createJWS(merchantId, kid);
        const endpoints = getPayGlocalEndpoints();

        const statusRes = await fetch(endpoints.status(gid), {
          method: 'GET',
          headers: {
            'X-GL-TOKEN-EXTERNAL': jwsToken,
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

    // List of successful payment statuses in PayGlocal
    const successfulStatuses = ['SUCCESS', 'SENT_FOR_CAPTURE', 'CAPTURED'];

    if (successfulStatuses.includes(status.toUpperCase())) {
      return NextResponse.redirect(`${siteUrl}/checkout/success?gid=${encodeURIComponent(gid)}`, 303);
    } else {
      return NextResponse.redirect(
        `${siteUrl}/checkout/failed?gid=${encodeURIComponent(gid)}&status=${encodeURIComponent(status)}`,
        303
      );
    }
  } catch (error) {
    console.error('Error handling PayGlocal callback:', error);
    return NextResponse.redirect(`${siteUrl}/checkout/failed?status=SERVER_ERROR`, 303);
  }
}
