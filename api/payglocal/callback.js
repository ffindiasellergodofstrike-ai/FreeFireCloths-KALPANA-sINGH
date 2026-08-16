import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { db } from './firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { txnId } = req.query;
  
  if (!txnId) {
    return res.redirect('/payment/failure?error=missing_txn_id');
  }

  try {
    const orderRef = db.collection('payglocal_orders').doc(txnId);
    const orderSnap = await orderRef.get();

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
        await orderRef.update({ status: 'paid', paidAt: new Date().toISOString() });
      }
      return res.redirect(`/payment/success?gid=${gid}`);
    } else {
      if (orderData.status !== 'failed') {
        await orderRef.update({ status: 'failed', failedAt: new Date().toISOString() });
      }
      return res.redirect(`/payment/failure?gid=${gid}`);
    }

  } catch (error) {
    console.error("Callback error:", error);
    return res.redirect('/payment/failure?error=internal_error');
  }
}
