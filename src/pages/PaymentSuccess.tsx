import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const gid = searchParams.get('gid');
  const [status, setStatus] = useState<string>('Verifying payment...');

  useEffect(() => {
    if (gid) {
      fetch(`/api/payglocal/status?gid=${gid}`)
        .then(res => res.json())
        .then(data => {
          if (data.isPaid) {
            setStatus('Payment Successful!');
          } else {
            setStatus('Payment verification pending or failed. Status: ' + (data.status || 'Unknown'));
          }
        })
        .catch(() => setStatus('Could not verify payment automatically. Please check your orders.'));
    }
  }, [gid]);

  return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh' }}>
      <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <i className="fa fa-check" style={{ fontSize: '36px', color: '#166534' }}></i>
      </div>
      <h1 style={{ fontSize: '28px', marginBottom: '12px', fontFamily: 'var(--font-h)' }}>ORDER SECURED!</h1>
      <p style={{ color: 'var(--gray)', maxWidth: '480px', margin: '0 auto 12px', fontSize: '15px' }}>
        Thank you for shopping with Garena Official Free Fire Store. Your order has been placed successfully and will be delivered to your address soon.
      </p>
      <p style={{ color: '#000', fontWeight: 'bold', marginBottom: '32px' }}>{status}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-black btn-lg">RETURN TO HOME</Link>
        <Link to="/my-orders" className="btn btn-outline btn-lg">VIEW MY ORDERS</Link>
      </div>
    </div>
  );
}
