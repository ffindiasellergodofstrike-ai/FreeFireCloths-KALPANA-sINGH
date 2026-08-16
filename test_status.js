import { createRequire } from 'module';
import * as dotenv from 'dotenv';
dotenv.config();
const require = createRequire(import.meta.url);
const { generateJWS } = require('payglocal-js-client');
const crypto = require('crypto');

function loadKey(raw) {
  if (!raw) return '';
  let k = raw.trim();
  if (!k.includes('-----BEGIN')) {
    k = Buffer.from(k, 'base64').toString('utf8').trim();
  }
  k = k.replace(/\\n/g, '\n');
  return k;
}

async function testStatus() {
  const gid = "12345"; // Just a dummy
  let privateKey = loadKey(process.env.PAYGLOCAL_PRIVATE_KEY);
  if (privateKey.includes('BEGIN RSA PRIVATE KEY')) {
    privateKey = crypto.createPrivateKey(privateKey).export({ type: 'pkcs8', format: 'pem' });
  }
  
  const merchantId = process.env.PAYGLOCAL_MERCHANT_ID;
  const privateKeyId = process.env.PAYGLOCAL_PRIVATE_KEY_ID;

  // Try with JWS empty JSON
  const jws2 = await generateJWS({ payload: "{}", privateKey, privateKeyId });
  let res = await fetch(`https://api.payglocal.in/gl/v1/payments/${gid}/status/`, {
    headers: {
      "x-gl-merchantid": merchantId,
      "x-gl-kid": privateKeyId,
      "x-gl-token-external": jws2,
      "Content-Type": "application/json"
    }
  });
  console.log("With JWS empty JSON:", res.status, await res.text());

  // Try without token but different content type? No.
}

testStatus();
