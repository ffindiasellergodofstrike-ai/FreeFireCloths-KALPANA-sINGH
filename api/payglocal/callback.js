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
  const extractedGid = req.query.gid || req.body?.gid || req.body?.data?.gid;
  const finalGid = extractedGid || req.query.txnId;
  
  if (!finalGid) {
    return res.redirect('/payment/failure?error=missing_gid');
  }

  try {
    const headers = {
      "x-gl-merchantid": process.env.PAYGLOCAL_MERCHANT_ID,
      "x-gl-kid": process.env.PAYGLOCAL_PRIVATE_KEY_ID
    };

    // No trailing slash!
    const statusRes = await fetch(`https://api.payglocal.in/gl/v1/payments/${finalGid}/status`, {
      method: "GET",
      headers
    });

    if (!statusRes.ok) {
      const errTxt = await statusRes.text();
      const safeErr = encodeURIComponent(errTxt.substring(0, 150));
      
      // Fallback: If PayGlocal sent status directly in callback query or body, let's use it as a last resort
      const directStatus = req.query.status || req.body?.status || req.body?.data?.status;
      if (directStatus === 'SENT_FOR_CAPTURE' || directStatus === 'CAPTURED' || directStatus === 'PAID') {
         return res.redirect(`/payment/success?gid=${finalGid}&fallback=true`);
      }
      
      return res.redirect(`/payment/failure?gid=${finalGid}&error=status_api_failed_${safeErr}`);
    }

    const data = await statusRes.json();
    const status = data.data?.status;

    if (status === 'SENT_FOR_CAPTURE' || status === 'CAPTURED' || status === 'PAID') {
      return res.redirect(`/payment/success?gid=${data.data?.gid || finalGid}`);
    } else {
      return res.redirect(`/payment/failure?gid=${data.data?.gid || finalGid}&error=${status || 'payment_failed'}`);
    }
  } catch (error) {
    console.error("Callback error:", error);
    return res.redirect('/payment/failure?error=internal_error');
  }
}
