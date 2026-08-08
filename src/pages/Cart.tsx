import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQty, getTotalPrice, cartCount } = useCart();
  const [couponCode, setCouponEmail] = useState('');

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const emoji = (cat: string) => cat === 'men' ? '👕' : cat === 'women' ? '👗' : '💻';

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.success('COUPON APPLIED!');
      setCouponEmail('');
    } else {
      toast.error('Please enter a coupon code.');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div id="cart-page-root">
      <div className="page-hero">
        <div className="container">
          <h1>Shopping Bag</h1>
          <p id="cartPageSubtitle">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px 60px' }}>
        {cart.length === 0 ? (
          <div id="cartPgEmpty" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛍️</div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>YOUR BAG IS EMPTY</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>Looks like you haven't added anything yet.</p>
            <button className="btn btn-black btn-lg" onClick={() => navigate('/collections/all')}>START SHOPPING</button>
          </div>
        ) : (
          <div className="cart-pg-layout" id="cartPgLayout">
            {/* Cart Items List */}
            <div id="cartPgItems">
               {cart.map((item) => (
                <div className="cart-pg-item" key={item.key}>
                  <Link to={`/product/${item.id}`} style={{ display: 'block', flexShrink: 0 }}>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="cart-pg-img" 
                        style={{ objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`ph ph-${item.cat === 'electronics' ? 'elec' : item.cat} cart-pg-img`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                        {emoji(item.cat)}
                      </div>
                    )}
                  </Link>
                  <div style={{ flex: 1 }}>
                    <div className="cpi-top">
                      <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="cpi-name" style={{ cursor: 'pointer' }}>{item.name}</div>
                      </Link>
                      <button className="cpi-remove" onClick={() => removeFromCart(item.key)}>REMOVE</button>
                    </div>
                    <div className="cpi-meta">Size: {item.size} &nbsp;|&nbsp; {item.cat.toUpperCase()}</div>
                    <div className="cpi-bottom">
                      <div className="cpi-qty">
                        <button onClick={() => updateQty(item.key, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)}>+</button>
                      </div>
                      <div className="cpi-price">{fmt(item.price * item.qty)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary" id="orderSummary">
              <div className="os-title">ORDER SUMMARY</div>
              <div className="os-row">
                <span>Subtotal</span>
                <span id="osSub">{fmt(getTotalPrice())}</span>
              </div>
              <div className="os-row">
                <span>Shipping</span>
                <span style={{ color: '#166534', fontFamily: 'var(--font-h)', fontWeight: 700 }}>FREE</span>
              </div>
              <div className="os-ship">✓ FREE EXPRESS SHIPPING APPLIED</div>
              
              <div className="coupon-row">
                <input 
                  type="text" 
                  placeholder="COUPON CODE" 
                  value={couponCode}
                  onChange={(e) => setCouponEmail(e.target.value)}
                />
                <button onClick={handleApplyCoupon}>APPLY</button>
              </div>

              <div className="os-row total">
                <span>TOTAL</span>
                <span id="osTotal">{fmt(getTotalPrice())}</span>
              </div>

              <button className="btn btn-black btn-full btn-lg" onClick={handleCheckout}>
                PROCEED TO CHECKOUT
              </button>
              <button className="btn btn-outline btn-full" style={{ marginTop: '10px' }} onClick={() => navigate('/collections/all')}>
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
