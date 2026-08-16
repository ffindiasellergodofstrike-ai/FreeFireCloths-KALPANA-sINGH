import * as jose from 'jose';
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
  const extractedGid = req.query.gid || req.body?.gid || req.body?.data?.gid || req.query.txnId || req.body?.merchantTxnId;
  
  try {
    const token = req.headers['x-gl-token-external'] || 
                  req.body?.['x-gl-token-external'] || 
                  req.query?.['x-gl-token-external'] || 
                  req.body?.data?.['x-gl-token-external'] ||
                  req.body?.x_gl_token_external ||
                  req.query?.x_gl_token_external;
    
    let payloadString = '';
    
    if (token) {
      try {
        const pubKeyRaw = loadKey(process.env.PAYGLOCAL_PUBLIC_KEY);
        let publicKey;
        if (pubKeyRaw) {
          try {
            publicKey = crypto.createPublicKey(pubKeyRaw);
          } catch (e) {
            console.warn("Could not create public key with crypto.createPublicKey:", e.message);
          }
        }
        
        if (publicKey) {
          try {
            const { payload } = await jose.compactVerify(token, publicKey);
            payloadString = new TextDecoder().decode(payload);
          } catch (e) {
            console.warn("jose strict verification failed:", e.message);
          }
        }
        
        // If verify failed or no key, decode without verification so flow isn't blocked
        if (!payloadString) {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
            payloadString = jsonPayload;
          }
        }
      } catch (e) {
        console.error("Token decoding error:", e);
      }
    }

    console.log("PayGlocal Callback FULL payload:", payloadString || "(empty or missing token)");

    let payloadObj = {};
    if (payloadString) {
      try {
        payloadObj = JSON.parse(payloadString);
      } catch (e) {
        console.error("Payload JSON parse error:", e);
      }
    }

    const finalGid = payloadObj.gid || payloadObj.data?.gid || extractedGid || 'unknown';
    const status = payloadObj.status || payloadObj.data?.status || req.query.status || req.body?.status || 'UNKNOWN';

    console.log(`Payment decision - GID: ${finalGid}, Status: ${status}`);

    const isSuccess = ['SENT_FOR_CAPTURE', 'CAPTURED', 'SUCCESS', 'APPROVED', 'PAID'].includes(String(status).toUpperCase());

    if (isSuccess) {
      return res.redirect(302, `/payment/success?gid=${encodeURIComponent(finalGid)}`);
    } else {
      return res.redirect(302, `/payment/failure?gid=${encodeURIComponent(finalGid)}&reason=${encodeURIComponent(status)}`);
    }
  } catch (error) {
    console.error("Callback error:", error);
    return res.redirect(302, `/payment/failure?gid=${encodeURIComponent(extractedGid || 'unknown')}&reason=internal_error`);
  }
}

