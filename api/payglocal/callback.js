export default async function handler(req, res) {
  // Try to find gid from query or body
  const gid = req.query.gid || req.body?.gid || req.body?.data?.gid || req.query.txnId; // If txnId is passed but it's actually gid?
  
  // Actually, PayGlocal might pass gid in the response. We will grab it:
  const extractedGid = req.query.gid || req.body?.gid || req.body?.data?.gid;

  if (!extractedGid) {
    // If we only have txnId and no gid, we might have to fail unless PayGlocal API accepts txnId in the URL
    const fallbackId = req.query.txnId || 'unknown';
    // Let's try calling status API with whatever ID we have (txnId or gid)
    // The Status API usually expects gid. Let's try with fallbackId.
  }

  const finalGid = extractedGid || req.query.txnId;

  if (!finalGid) {
    return res.redirect('/payment/failure?error=missing_gid');
  }

  try {
    const statusRes = await fetch(`https://api.payglocal.in/gl/v1/payments/${finalGid}/status/`, {
      method: "GET",
      headers: {
        "x-gl-merchantid": process.env.PAYGLOCAL_MERCHANT_ID,
        "x-gl-kid": process.env.PAYGLOCAL_PRIVATE_KEY_ID
      }
    });

    if (!statusRes.ok) {
      return res.redirect(`/payment/failure?gid=${finalGid}&error=status_api_failed`);
    }

    const data = await statusRes.json();
    const status = data.data?.status;

    if (status === 'SENT_FOR_CAPTURE' || status === 'CAPTURED' || status === 'PAID') {
      return res.redirect(`/payment/success?gid=${data.data?.gid || finalGid}`);
    } else {
      return res.redirect(`/payment/failure?gid=${data.data?.gid || finalGid}`);
    }

  } catch (error) {
    console.error("Callback error:", error);
    return res.redirect('/payment/failure?error=internal_error');
  }
}
