import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { generateJWEAndJWS } = require('payglocal-js-client');
import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  projectId: "decent-mender-ps58c",
  appId: "1:134667879526:web:6344d03d471759695a99a7",
  apiKey: "AIzaSyAwGxwrPlILW_e8rRbQT9mUknO60eykHcU",
  authDomain: "decent-mender-ps58c.firebaseapp.com"
};

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {}, "ai-studio-freefirestorekal-702a13f3-140c-4606-a79e-635f306fba9f");
} catch (e) {
  const firebaseApp = require('firebase/app');
  const firestore = require('firebase/firestore');
  const app = firebaseApp.getApp();
  db = firestore.getFirestore(app, "ai-studio-freefirestorekal-702a13f3-140c-4606-a79e-635f306fba9f");
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  try {
    const { amount, customerData, items } = req.body;
    
    if (!amount || !customerData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const merchantTxnId = `PG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const host = req.headers.host || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
    
    const payload = {
      merchantTxnId,
      paymentData: {
        totalAmount: amount.toFixed(2).toString(),
        txnCurrency: "INR"
      },
      billingData: {
        firstName: customerData.firstName || "Customer",
        lastName: customerData.lastName || "",
        emailId: customerData.email || "guest@example.com",
        phoneNumber: customerData.phone || "9999999999",
        addressCountry: "IN"
      },
      merchantCallbackURL: `${protocol}://${host}/api/payglocal/callback?txnId=${merchantTxnId}`
    };

    function normalizePem(k) {
      if (!k) throw new Error('PayGlocal key env var is empty');
      let pem = k.includes('-----BEGIN') && k.includes('\n')
        ? k
        : k.replace(/\\n/g, '\n');
      if (!pem.includes('-----BEGIN')) throw new Error('PayGlocal key malformed');
      return pem.trim();
    }

    const privateKey = normalizePem(process.env.PAYGLOCAL_PRIVATE_KEY);
    const publicKey  = normalizePem(process.env.PAYGLOCAL_PUBLIC_KEY);

    const { jweToken, jwsToken } = await generateJWEAndJWS({
      payload,
      publicKey,
      privateKey,
      merchantId: process.env.PAYGLOCAL_MERCHANT_ID,
      privateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID,
      publicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID
    });

    const initRes = await fetch("https://api.payglocal.in/gl/v1/payments/initiate/paycollect", {
      method: "POST",
      headers: {
        "Content-Type": process.env.PAYGLOCAL_CONTENT_TYPE || "application/json",
        "x-gl-token-external": jwsToken,
        "x-gl-merchantid": process.env.PAYGLOCAL_MERCHANT_ID,
        "x-gl-kid": process.env.PAYGLOCAL_PRIVATE_KEY_ID
      },
      body: jweToken
    });

    if (!initRes.ok) {
      const errTxt = await initRes.text();
      console.error("PayGlocal Init Error:", errTxt);
      return res.status(initRes.status).json({ error: 'Payment gateway error', details: errTxt });
    }

    const data = await initRes.json();
    const gid = data.gid;
    const redirectUrl = data.data?.redirectUrl;

    if (!gid || !redirectUrl) {
      return res.status(500).json({ error: 'Invalid response from PayGlocal', data });
    }

    const orderDoc = doc(db, 'payglocal_orders', merchantTxnId);
    await setDoc(orderDoc, {
      merchantTxnId,
      gid,
      amount,
      customerData,
      items: items || [],
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return res.json({ redirectUrl, gid, merchantTxnId });

  } catch (error) {
    console.error("Initiate error:", error);
    return res.status(500).json({ error: error.message });
  }
}
