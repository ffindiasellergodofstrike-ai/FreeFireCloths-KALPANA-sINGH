import { sendOrderConfirmation } from '../lib/order-email';
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useCart } from '../context/CartContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const gid = searchParams.get('gid');
  const [status, setStatus] = useState<string>('Verifying payment...');
  const [emailStatus, setEmailStatus] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear any pending payment state on successful payment page
    sessionStorage.removeItem('pendingPayment');

    if (gid) {
      setStatus('Payment Successful!');
      
      // Handle order creation
      const pendingStr = localStorage.getItem('pendingPayGlocalOrder');
      if (pendingStr) {
        try {
          const pendingOrder = JSON.parse(pendingStr);
          // Make sure we haven't already processed this one or it's a mismatch
          if (pendingOrder.gid === gid || pendingOrder.gid === undefined) {
            if (db) {
              addDoc(collection(db, 'orders'), pendingOrder).then((docRef) => {
                setOrderId(pendingOrder.orderNumber?.toString() || docRef.id);
                void sendOrderConfirmation(gid).then(setEmailStatus);
              });
            }
            clearCart();
            localStorage.removeItem('pendingPayGlocalOrder');
          }
        } catch (e) {
          console.error("Error creating order:", e);
        }
      } else {
        // Order already processed or session cleared
        const existingOrderId = localStorage.getItem('lastSuccessfulOrderId');
        if (existingOrderId) {
          setOrderId(existingOrderId);
          void sendOrderConfirmation(gid).then(setEmailStatus);
        }
      }
    }
  }, [gid, clearCart]);

  // Store orderId in case of refresh
  useEffect(() => {
    if (orderId) {
      localStorage.setItem('lastSuccessfulOrderId', orderId);
    }
  }, [orderId]);

  return (
    <div className="container store-result" style={{ padding: '80px 24px', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="store-result-card" style={{ background: '#fff', padding: '48px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <i className="fa fa-check" style={{ fontSize: '36px', color: '#10b981' }}></i>
        </div>
        
        <h1 style={{ fontSize: '32px', marginBottom: '8px', fontFamily: 'var(--font-h)', fontWeight: '800', color: '#111827' }}>Payment Successful!</h1>
        <p style={{ color: '#4b5563', margin: '0 auto 24px', fontSize: '16px', lineHeight: '1.6' }}>
          Thank you for shopping with Free Fire Store. Your order has been placed securely.
        </p>

        {orderId && (
          <div style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '8px', padding: '16px', marginBottom: '32px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Number</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827', fontFamily: 'monospace' }}>#{orderId}</p>
          </div>
        )}

        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '32px' }}>{status}</p>

        {emailStatus && <p role="status" className="email-status">{emailStatus}</p>}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-outline btn-lg" style={{ flex: 1, minWidth: '180px' }}>RETURN TO HOME</Link>
          <Link to="/my-orders" className="btn btn-black btn-lg" style={{ flex: 1, minWidth: '180px' }}>VIEW MY ORDERS</Link>
        </div>
      </div>
    </div>
  );
}
