import { createRequire } from 'module';
import * as dotenv from 'dotenv';
dotenv.config();
const require = createRequire(import.meta.url);
const { generateJWS } = require('payglocal-js-client');
const crypto = require('crypto');

function loadKey(raw) {
  if (!raw) throw new Error('KEY ENV EMPTY');
  let k = raw.trim();
  if (!k.includes('-----BEGIN')) {
    k = Buffer.from(k, 'base64').toString('utf8').trim();
  }
  k = k.replace(/\\n/g, '\n');
  return k;
}

async function test() {
  try {
    let privateKey = loadKey(process.env.PAYGLOCAL_PRIVATE_KEY);
    if (privateKey.includes('BEGIN RSA PRIVATE KEY')) {
      privateKey = crypto.createPrivateKey(privateKey).export({ type: 'pkcs8', format: 'pem' });
    }
    const token = await generateJWS({
      payload: "", 
      privateKey,
      privateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID
    });
    console.log("Token:", token.substring(0, 50));
  } catch (e) {
    console.error("error:", e);
  }
}
test();
