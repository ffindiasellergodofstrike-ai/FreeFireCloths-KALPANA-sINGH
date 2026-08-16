import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error') || 'Transaction failed or was cancelled.';

  return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh' }}>
      <div style={{ width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <i className="fa fa-times" style={{ fontSize: '36px', color: '#991b1b' }}></i>
      </div>
      <h1 style={{ fontSize: '28px', marginBottom: '12px', fontFamily: 'var(--font-h)' }}>PAYMENT FAILED</h1>
      <p style={{ color: 'var(--gray)', maxWidth: '480px', margin: '0 auto 32px', fontSize: '15px' }}>
        Unfortunately, your payment could not be processed. ({error})<br/><br/>
        No charges were made to your account. You can try placing the order again.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/cart" className="btn btn-black btn-lg">RETURN TO CART</Link>
        <Link to="/" className="btn btn-outline btn-lg">RETURN TO HOME</Link>
      </div>
    </div>
  );
}
