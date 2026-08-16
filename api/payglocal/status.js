import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

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
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const { gid, txnId } = req.query;
  
  if (!gid && !txnId) {
    return res.status(400).json({ error: 'missing gid or txnId' });
  }

  try {
    let finalGid = gid;
    let orderRef;
    let orderData;

    if (txnId) {
      orderRef = doc(db, 'payglocal_orders', txnId);
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        orderData = orderSnap.data();
        finalGid = orderData.gid;
      }
    }

    if (!finalGid) {
       return res.status(404).json({ error: 'order not found' });
    }

    const statusRes = await fetch(`https://api.payglocal.in/gl/v1/payments/${finalGid}/status/`, {
      method: "GET",
      headers: {
        "x-gl-merchantid": process.env.PAYGLOCAL_MERCHANT_ID,
        "x-gl-kid": process.env.PAYGLOCAL_PRIVATE_KEY_ID
      }
    });

    if (!statusRes.ok) {
      return res.status(500).json({ error: 'status_api_failed' });
    }

    const data = await statusRes.json();
    const status = data.data?.status;

    const isPaid = status === 'SENT_FOR_CAPTURE' || status === 'CAPTURED' || status === 'PAID';

    if (orderData && orderRef) {
      const targetStatus = isPaid ? 'paid' : (status === 'FAILED' ? 'failed' : orderData.status);
      if (orderData.status !== targetStatus && (targetStatus === 'paid' || targetStatus === 'failed')) {
        await updateDoc(orderRef, { status: targetStatus });
      }
    }

    return res.json({ status, isPaid, raw: data });

  } catch (error) {
    console.error("Status check error:", error);
    return res.status(500).json({ error: 'internal_error' });
  }
}
