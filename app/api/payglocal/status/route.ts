import { NextRequest, NextResponse } from 'next/server';
import { createJWS, getPayGlocalEndpoints } from '@/lib/payglocal';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gid = searchParams.get('gid');

    if (!gid) {
      return NextResponse.json(
        { success: false, error: 'GID parameter is required' },
        { status: 400 }
      );
    }

    const merchantId = process.env.PAYGLOCAL_MERCHANT_ID;
    const kid = process.env.PAYGLOCAL_PVT_KEY_KID;

    if (!merchantId || !kid) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing Merchant ID or Private Key KID' },
        { status: 500 }
      );
    }

    // Step 1: Generate JWS auth token
    const jwsToken = await createJWS(merchantId, kid);

    // Step 2: Call PayGlocal Status Endpoint
    const endpoints = getPayGlocalEndpoints();

    const response = await fetch(endpoints.status(gid), {
      method: 'GET',
      headers: {
        'X-GL-TOKEN-EXTERNAL': jwsToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch transaction status from PayGlocal', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      gid,
      data,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error checking PayGlocal transaction status:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
