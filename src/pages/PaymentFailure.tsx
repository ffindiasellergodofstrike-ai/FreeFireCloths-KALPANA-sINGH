import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('reason') || searchParams.get('error') || 'Transaction failed or was cancelled.';

  useEffect(() => {
    sessionStorage.removeItem('pendingPayment');
  }, []);

  return (
    <div className="container store-result" style={{ padding: '80px 24px', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="store-result-card" style={{ background: '#fff', padding: '48px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <i className="fa fa-times" style={{ fontSize: '36px', color: '#ef4444' }}></i>
        </div>
        
        <h1 style={{ fontSize: '32px', marginBottom: '8px', fontFamily: 'var(--font-h)', fontWeight: '800', color: '#111827' }}>Payment Failed</h1>
        <p style={{ color: '#4b5563', margin: '0 auto 16px', fontSize: '16px', lineHeight: '1.6' }}>
          Your payment was not completed. Check your payment status before retrying. If your bank shows a debit, contact us with the transaction reference.
        </p>

        <div style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '8px', padding: '16px', marginBottom: '32px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Reason / Code</p>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>{error}</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-outline btn-lg" style={{ flex: 1, minWidth: '180px' }}>RETURN TO HOME</Link>
          <Link to="/cart" className="btn btn-black btn-lg" style={{ flex: 1, minWidth: '180px' }}>TRY AGAIN</Link>
        </div>
      </div>
    </div>
  );
}
