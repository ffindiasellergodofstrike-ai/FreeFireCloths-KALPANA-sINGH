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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { txnId } = req.query;
  
  if (!txnId) {
    return res.redirect('/payment/failure?error=missing_txn_id');
  }

  try {
    const orderRef = doc(db, 'payglocal_orders', txnId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return res.redirect('/payment/failure?error=order_not_found');
    }

    const orderData = orderSnap.data();
    const gid = orderData.gid;

    const statusRes = await fetch(`https://api.payglocal.in/gl/v1/payments/${gid}/status/`, {
      method: "GET",
      headers: {
        "x-gl-merchantid": process.env.PAYGLOCAL_MERCHANT_ID,
        "x-gl-kid": process.env.PAYGLOCAL_PRIVATE_KEY_ID
      }
    });

    if (!statusRes.ok) {
      return res.redirect(`/payment/failure?gid=${gid}&error=status_api_failed`);
    }

    const data = await statusRes.json();
    const status = data.data?.status;

    if (status === 'SENT_FOR_CAPTURE' || status === 'CAPTURED' || status === 'PAID') {
      if (orderData.status !== 'paid') {
        await updateDoc(orderRef, { status: 'paid', paidAt: new Date().toISOString() });
      }
      return res.redirect(`/payment/success?gid=${gid}`);
    } else {
      if (orderData.status !== 'failed') {
        await updateDoc(orderRef, { status: 'failed', failedAt: new Date().toISOString() });
      }
      return res.redirect(`/payment/failure?gid=${gid}`);
    }

  } catch (error) {
    console.error("Callback error:", error);
    return res.redirect('/payment/failure?error=internal_error');
  }
}
