import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { db } from './firebaseAdmin.js';

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
      orderRef = db.collection('payglocal_orders').doc(txnId);
      const orderSnap = await orderRef.get();
      if (orderSnap.exists) {
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
        await orderRef.update({ status: targetStatus });
      }
    }

    return res.json({ status, isPaid, raw: data });

  } catch (error) {
    console.error("Status check error:", error);
    return res.status(500).json({ error: 'internal_error' });
  }
}
