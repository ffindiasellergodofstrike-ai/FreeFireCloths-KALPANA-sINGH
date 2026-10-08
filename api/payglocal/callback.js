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

async function redirectGarenaResult(res, query, status, gid, callbackTxnId = '') {
  return res.redirect(302, `/GarenaCheckout?status=${encodeURIComponent(status)}`);
}

async function getRawBody(req) {
  if (typeof req.rawBody === 'string') return req.rawBody;
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString('utf8');
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');

  if (req.readable && typeof req.on === 'function') {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks).toString('utf8');
    } catch (err) {
      console.warn("Could not read stream:", err);
    }
  }

  if (req.body && typeof req.body === 'object') {
    try {
      return JSON.stringify(req.body);
    } catch (e) {
      return '';
    }
  }
  return '';
}

export default async function handler(req, res) {
  try {
    const rawBody = await getRawBody(req);
    const contentType = req.headers['content-type'] || 'none';
    const query = req.query || {};
    const isGarenaCheckout = query.src === 'garena';

    let parsedBody = {};
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      parsedBody = { ...req.body };
    } else if (rawBody) {
      const trimmed = rawBody.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          parsedBody = JSON.parse(trimmed);
        } catch (e) {}
      } else {
        try {
          const params = new URLSearchParams(trimmed);
          parsedBody = Object.fromEntries(params.entries());
        } catch (e) {}
      }
    }

    // 2. Log ALL of this server-side
    console.log("=== PAYGLOCAL CALLBACK DEBUG ===");
    console.log("req.method:", req.method);
    console.log("content-type header:", contentType);
    console.log("RAW body string:", rawBody);
    console.log("parsed body object:", parsedBody, "| Keys:", Object.keys(parsedBody));
    console.log("req.query:", query, "| Keys:", Object.keys(query));

    const headers = req.headers || {};

    // 3. Find the token by checking in exact order
    const token = parsedBody['x-gl-token'] ||
                  parsedBody['x-gl-token-external'] ||
                  parsedBody['token'] ||
                  query['x-gl-token'] ||
                  query['x-gl-token-external'] ||
                  headers['x-gl-token-external'] ||
                  headers['x-gl-token'] ||
                  null;

    // 5. If NO token found anywhere
    if (!token) {
      console.log("NO TOKEN FROM PAYGLOCAL", {
        method: req.method,
        contentType,
        rawBody,
        parsedBody,
        parsedBodyKeys: Object.keys(parsedBody),
        query,
        queryKeys: Object.keys(query)
      });
      if (isGarenaCheckout) {
        try { return await redirectGarenaResult(res, query, 'failed', 'missing-token'); }
        catch { return res.redirect(302, '/payment/failure?reason=invalid_return'); }
      }
      return res.redirect(302, '/payment/failure?reason=no_token');
    }

    // A payment result is trusted only when PayGlocal's JWS signature verifies.
    let payloadString = '';
    try {
      const pubKeyRaw = loadKey(process.env.PAYGLOCAL_PUBLIC_KEY);
      if (!pubKeyRaw) throw new Error('PayGlocal public key is not configured');
      const publicKey = crypto.createPublicKey(pubKeyRaw);
      const { payload } = await jose.compactVerify(token, publicKey);
      payloadString = new TextDecoder().decode(payload);
    } catch (e) {
      console.error("PayGlocal callback verification failed:", e.message);
      if (isGarenaCheckout) {
        try { return await redirectGarenaResult(res, query, 'failed', 'unverified'); }
        catch { return res.redirect(302, '/payment/failure?reason=invalid_callback'); }
      }
      return res.redirect(302, '/payment/failure?reason=invalid_callback');
    }

    console.log("PayGlocal Callback FULL decoded payload:", payloadString);

    let payloadObj = {};
    if (payloadString) {
      try {
        payloadObj = JSON.parse(payloadString);
      } catch (e) {
        console.error("Payload JSON parse error:", e);
      }
    }

    const gid = payloadObj.gid || payloadObj.data?.gid || query.gid || parsedBody.gid || 'unknown';
    const status = payloadObj.status || payloadObj.data?.status || 'UNKNOWN';
    const callbackTxnId = payloadObj.merchantTxnId || payloadObj.data?.merchantTxnId || '';

    console.log(`PayGlocal Payment Decision - GID: ${gid}, Status: ${status}, isGarena: ${isGarenaCheckout}`);

    const isSuccess = ['SENT_FOR_CAPTURE', 'CAPTURED', 'SUCCESS', 'APPROVED', 'PAID'].includes(String(status).toUpperCase());

    if (isGarenaCheckout) {
      return redirectGarenaResult(res, query, isSuccess ? 'success' : 'failed', String(gid), String(callbackTxnId));
    }

    // Default E-Commerce website redirects
    if (isSuccess) {
      return res.redirect(302, `/payment/success?gid=${encodeURIComponent(gid)}`);
    } else {
      return res.redirect(302, `/payment/failure?gid=${encodeURIComponent(gid)}&reason=${encodeURIComponent(status)}`);
    }
  } catch (error) {
    console.error("Callback handler exception:", error);
    return res.redirect(302, '/payment/failure?reason=internal_error');
  }
}


