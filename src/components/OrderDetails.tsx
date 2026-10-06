import React from 'react';
export interface OrderDetailsData {
  paymentMethod?: string;
  gid?: string;
  merchantTxnId?: string;
  userEmail?: string;
  shippingAddress?: { firstName?: string; lastName?: string; address?: string; city?: string; state?: string; pincode?: string; phone?: string; email?: string };
  trackingNumber?: string;
  courier?: string;
}
export default function OrderDetails({ order }: { order: OrderDetailsData }) {
  const a = order.shippingAddress;
  return <details className="order-details"><summary>Payment & delivery details <span aria-hidden="true">+</span></summary>
    <div className="order-details-grid">
      <section><h4>Deliver to</h4>{a ? <address>{[a.firstName, a.lastName].filter(Boolean).join(' ')}<br />{a.address}<br />{[a.city, a.state, a.pincode].filter(Boolean).join(', ')}<br />{a.phone}<br />{a.email || order.userEmail}</address> : <p>No delivery address was saved with this order. Contact us for assistance.</p>}</section>
      <section><h4>Payment</h4><p>{order.paymentMethod || 'Not recorded'}</p>{order.merchantTxnId && <p><strong>Transaction ID</strong><br /><code>{order.merchantTxnId}</code></p>}{order.gid && <p><strong>PayGlocal GID</strong><br /><code>{order.gid}</code></p>}</section>
      <section><h4>Delivery</h4>{order.trackingNumber ? <p>{order.courier}<br />Tracking: {order.trackingNumber}</p> : <p>Tracking details will appear when available. See your order status above for the latest update.</p>}</section>
    </div>
  </details>;
}
