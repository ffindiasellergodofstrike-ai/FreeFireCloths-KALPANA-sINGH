export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const { gid } = req.query;
  
  if (!gid) {
    return res.status(400).json({ error: 'missing gid' });
  }

  try {
    const statusRes = await fetch(`https://api.payglocal.in/gl/v1/payments/${gid}/status/`, {
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

    return res.json({ status, isPaid, raw: data });

  } catch (error) {
    console.error("Status check error:", error);
    return res.status(500).json({ error: 'internal_error' });
  }
}
