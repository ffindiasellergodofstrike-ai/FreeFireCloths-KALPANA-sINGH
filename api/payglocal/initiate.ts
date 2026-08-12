import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  createJWS,
  createJWE,
  getPayGlocalEndpoints,
  PayCollectPayload,
  PayCollectResponse,
} from '../../lib/payglocal';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { amount, email, customerId, orderId } = req.body || {};

    if (!amount || !email) {
      return res.status(400).json({
        success: false,
        error: 'Amount and email are required parameters.',
      });
    }

    const merchantId = process.env.PAYGLOCAL_MERCHANT_ID;
    const kid = process.env.PAYGLOCAL_PVT_KEY_KID;
    const callbackUrl = 'https://www.garenaofficialfreefire.shop/api/payglocal/callback';

    if (!merchantId || !kid || merchantId.includes('your_mid') || kid.includes('your_private_key')) {
      return res.status(500).json({
        success: false,
        error:
          'Missing or placeholder PAYGLOCAL_MERCHANT_ID or PAYGLOCAL_PVT_KEY_KID. Please set your real keys in Vercel Environment Variables.',
      });
    }

    const cleanOrderId = orderId
      ? String(orderId).replace(/^gl-/i, '')
      : `ORD-${Date.now()}`;
    const merchantUniqueId = crypto.randomUUID();

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

    // Create JWS & JWE
    const jwsToken = await createJWS(merchantId, kid);
    const jweBody = await createJWE(payload as unknown as Record<string, unknown>);

    const endpoints = getPayGlocalEndpoints();

    const payglocalResponse = await fetch(endpoints.paycollect, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/jose',
        'X-GL-TOKEN-EXTERNAL': jwsToken,
      },
      body: jweBody,
    });

    const responseText = await payglocalResponse.text();
    let responseData: PayCollectResponse;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error('Non-JSON response from PayGlocal:', responseText);
      return res.status(502).json({
        success: false,
        error: 'Invalid response from PayGlocal gateway',
        details: responseText,
      });
    }

    if (!payglocalResponse.ok || responseData.status === 'FAILED') {
      return res.status(400).json({
        success: false,
        error:
          responseData.error?.message ||
          'Payment initiation failed with PayGlocal',
        details: responseData,
      });
    }

    const redirectUrl = responseData.data?.redirectUrl;
    const gid = responseData.data?.gid;

    return res.status(200).json({
      success: true,
      redirectUrl,
      gid,
      merchantTxnId: cleanOrderId,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error initiating PayGlocal payment:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while processing payment',
    });
  }
}
