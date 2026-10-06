import { readReceiptToken } from '../server/order-receipt';
import { deliverOrderEmail } from '../server/email-delivery';

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  let receipt;
  try { receipt=readReceiptToken(req.body?.receipt); }
  catch { return res.status(400).json({ error:'Invalid or expired receipt' }); }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return res.status(503).json({ error:'Order email is not configured' });
  try {
    // An independently fetched gateway response is required; callback/query/localStorage flags are not proof.
    const response = await fetch(`https://api.payglocal.in/gl/v1/payments/${encodeURIComponent(receipt.gid)}/status`, {
      headers:{'x-gl-merchantid':process.env.PAYGLOCAL_MERCHANT_ID || '', 'x-gl-kid':process.env.PAYGLOCAL_PRIVATE_KEY_ID || ''}, signal:AbortSignal.timeout(10000)
    });
    if (!response.ok) return res.status(502).json({ error:'Payment confirmation is temporarily unavailable' });
    const payment=await response.json();
    if (!['SENT_FOR_CAPTURE','CAPTURED','PAID'].includes(payment.data?.status)) return res.status(409).json({ error:'Payment is not confirmed' });
    if ((payment.gid && payment.gid!==receipt.gid) || (payment.data?.gid && payment.data.gid!==receipt.gid) || (payment.data?.merchantTxnId && payment.data.merchantTxnId!==receipt.merchantTxnId)) return res.status(409).json({ error:'Payment reference mismatch' });
    await deliverOrderEmail({ ...receipt, payment: 'online' }, `order-confirmation/${receipt.gid}`);
    return res.json({ sent: true });
  } catch { return res.status(502).json({ error:'Order email is temporarily unavailable' }); }
}
