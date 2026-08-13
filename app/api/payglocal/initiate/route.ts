import { NextRequest, NextResponse } from 'next/server';
import {
  createJWS,
  createJWE,
  getPayGlocalEndpoints,
  getPayGlocalEnv,
  validatePayGlocalConfig,
  PayCollectPayload,
  PayCollectResponse,
} from '@/lib/payglocal';

export async function POST(req: NextRequest) {
  try {
    const configStatus = validatePayGlocalConfig();
    if (!configStatus.isValid) {
      const issues = [
        ...configStatus.missingVars.map((v) => `Missing ${v}`),
        ...configStatus.invalidVars.map((v) => `Invalid ${v}`),
      ];
      return NextResponse.json(
        {
          success: false,
          error: `Server configuration error: ${issues.join(
            ', '
          )}. Please configure these environment variables in Vercel Environment Variables.`,
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { amount, email, customerId, orderId } = body;

    if (!amount || !email) {
      return NextResponse.json(
        { success: false, error: 'Amount and email are required parameters.' },
        { status: 400 }
      );
    }

    const merchantId = getPayGlocalEnv('PAYGLOCAL_MERCHANT_ID');
    const kid = getPayGlocalEnv('PAYGLOCAL_PVT_KEY_KID');
    const callbackUrl = 'https://www.garenaofficialfreefire.shop/api/payglocal/callback';

    // Ensure merchantTxnId is unique and does NOT start with "gl-"
    const cleanOrderId = orderId ? String(orderId).replace(/^gl-/i, '') : `ORD-${Date.now()}`;
    const merchantUniqueId = crypto.randomUUID();

    // Build minimum PayCollect Payload according to PayGlocal specification
    const payload: PayCollectPayload = {
      merchantTxnId: cleanOrderId,
      merchantUniqueId: merchantUniqueId,
      paymentData: {
        totalAmount: Number(amount).toFixed(2),
        txnCurrency: 'INR',
      },
      merchantCallbackURL: callbackUrl,
      riskData: {
        customerData: {
          merchantAssignedCustomerId: customerId || `cust_${Date.now()}`,
        },
        shippingData: {
          addressCountry: 'IN',
          emailId: email,
        },
      },
    };

    // Step 1: Create JWE (Encrypted payload using PayGlocal Public Cert)
    const jweBody = await createJWE(payload as unknown as Record<string, unknown>);

    // Step 2: Create JWS (Signed token over JWE body using Private Key)
    const jwsToken = await createJWS(merchantId, kid, jweBody);

    // Step 3: Call PayGlocal PayCollect API Endpoint
    const endpoints = getPayGlocalEndpoints();

    const payglocalResponse = await fetch(endpoints.paycollect, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/jose',
        'X-GL-TOKEN-EXTERNAL': jwsToken,
        'x-gl-token-external': jwsToken,
      },
      body: jweBody,
    });

    const responseText = await payglocalResponse.text();
    let responseData: PayCollectResponse;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error('Non-JSON response from PayGlocal:', responseText);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response from PayGlocal gateway',
          details: responseText,
        },
        { status: 502 }
      );
    }

    if (!payglocalResponse.ok || responseData.status === 'FAILED') {
      return NextResponse.json(
        {
          success: false,
          error: responseData.error?.message || 'Payment initiation failed with PayGlocal',
          details: responseData,
        },
        { status: 400 }
      );
    }

    const redirectUrl = responseData.data?.redirectUrl;
    const gid = responseData.data?.gid;

    return NextResponse.json({
      success: true,
      redirectUrl,
      gid,
      merchantTxnId: cleanOrderId,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error initiating PayGlocal payment:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error while processing payment',
      },
      { status: 500 }
    );
  }
}

