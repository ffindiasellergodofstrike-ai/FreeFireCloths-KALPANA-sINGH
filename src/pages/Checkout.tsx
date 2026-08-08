import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, clearCart, getTotalPrice, cartCount } = useCart();
  const { user } = useAuth();
  
  const statusParam = searchParams.get('status');
  const messageParam = searchParams.get('message');
  
  const { product: directProduct, size: directSize, qty: directQty } = location.state || {};
  
  const [showLoginModal, setShowLoginModal] = useState(false);

  const checkoutItems = directProduct 
    ? [{ 
        key: `${directProduct.id}-${directSize}`,
        id: directProduct.id, 
        name: directProduct.name, 
        price: directProduct.price, 
        cat: directProduct.cat,
        size: directSize || 'M', 
        qty: directQty || 1
      }] 
    : cart;

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
    phone: user?.mobile || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
      if (directProduct?.id) {
        localStorage.setItem('redirect_product_id', String(directProduct.id));
      }
    } else {
      setShowLoginModal(false);
      setFormData(prev => ({ 
        ...prev, 
        email: user.email || '',
        firstName: user.name ? user.name.split(' ')[0] : prev.firstName,
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : prev.lastName,
        phone: user.mobile || prev.phone
      }));
    }
  }, [user, directProduct]);

  const [paymentType, setPaymentType] = useState<'pod' | 'card'>('pod');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCardInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (statusParam === 'success') {
      if (!directProduct) clearCart();
      setIsSuccess(true);
      toast.success('Order confirmed!');
    } else if (statusParam === 'failure' || statusParam === 'error') {
      toast.error(messageParam || 'Error processing order. Please try again.');
    }
  }, [statusParam, messageParam, directProduct]);

  if (checkoutItems.length === 0 && !isSuccess) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛍️</div>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>YOUR CART IS EMPTY</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '28px' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-black btn-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = directProduct ? directProduct.price : getTotalPrice();
  const grandTotal = subtotal; // Free delivery is standard

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.pincode || !formData.phone) {
      toast.error('⚠ Please fill in all shipping details.');
      return;
    }

    if (paymentType === 'card') {
      if (!cardData.cardNumber.trim() || !cardData.cardName.trim() || !cardData.expiry.trim() || !cardData.cvv.trim()) {
        toast.error('⚠ Please enter complete Credit / Debit Card details.');
        return;
      }
    }

    setIsProcessing(true);
    const loadingToast = toast.loading(paymentType === 'card' ? 'Processing Credit Card payment...' : 'Securing order details...');
    
    try {
      const orderNumber = Math.floor(Math.random() * 900000) + 100000;
      
      if (db) {
        try {
          await addDoc(collection(db, 'orders'), {
            userId: user?.uid || user?.email || 'guest',
            userEmail: formData.email,
            items: checkoutItems,
            total: grandTotal,
            status: paymentType === 'card' ? 'Order Placed (Prepaid - Credit Card)' : 'Order Placed (COD)',
            paymentMethod: paymentType === 'card' ? 'Credit Card / Online Payment' : 'Cash on Delivery (COD)',
            shippingAddress: formData,
            orderNumber,
            createdAt: new Date().toISOString()
          });
        } catch (e) {
          console.log('Firestore write notice:', e);
        }
      }

      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        if (!directProduct) clearCart();
        toast.dismiss(loadingToast);
        toast.success('FREE FIRE STORE Order Confirmed!');
      }, 1000);
    } catch (error: any) {
      setIsProcessing(false);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'An error occurred during checkout.');
    }
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const emoji = (cat: string) => cat === 'men' ? '👕' : cat === 'women' ? '👗' : '💻';

  if (isSuccess) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <i className="fa fa-check" style={{ fontSize: '36px', color: '#166534' }}></i>
        </div>
        <h1 style={{ fontSize: '28px', marginBottom: '12px', fontFamily: 'var(--font-h)' }}>ORDER SECURED!</h1>
        <p style={{ color: 'var(--gray)', maxWidth: '480px', margin: '0 auto 32px', fontSize: '15px' }}>
          Thank you for shopping with FREE FIRE STORE. Your order has been placed successfully and will be delivered to your address soon.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-black btn-lg">RETURN TO HOME</Link>
          <Link to="/my-orders" className="btn btn-outline btn-lg">VIEW MY ORDERS</Link>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-page-root">
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          padding: '16px'
        }} id="checkout-login-modal">
          <div style={{
            background: '#ffffff',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(0,0,0,0.03)',
            borderRadius: '0',
            border: '1px solid #111111',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Top Header (E-Commerce Store Branding) */}
            <div style={{
              background: '#111111',
              color: '#ffffff',
              padding: '20px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #333333'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontFamily: 'var(--font-h)',
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  FREE FIRE STORE
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                color: '#cccccc',
                fontWeight: '600',
                letterSpacing: '1px'
              }}>
                CUSTOMER ACCOUNT
              </span>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '36px 32px 32px' }}>
              {/* Shopping Bag representation */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{
                  background: '#f4f4f5',
                  padding: '18px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingBag style={{ width: '32px', height: '32px', color: '#111111' }} />
                </div>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-h)',
                fontSize: '20px',
                fontWeight: 900,
                textAlign: 'center',
                color: '#111111',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Sign in to Complete Order
              </h2>

              <p style={{
                color: '#666666',
                fontSize: '13px',
                lineHeight: '1.6',
                textAlign: 'center',
                marginBottom: '24px',
                maxWidth: '420px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                To ensure smooth order processing and accurate parcel tracking, please identify yourself.
              </p>

              {/* Benefits Box */}
              <div style={{
                background: '#fafafa',
                border: '1px solid #eaeaea',
                padding: '16px 20px',
                marginBottom: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '14px', color: '#111111' }}>⚡</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'var(--font-h)', color: '#111111', letterSpacing: '0.5px' }}>
                      1-CLICK FAST CHECKOUT
                    </div>
                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: '1px' }}>
                      Save delivery details for seamless future orders
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '14px', color: '#111111' }}>📦</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'var(--font-h)', color: '#111111', letterSpacing: '0.5px' }}>
                      REAL-TIME ORDER TRACKING
                    </div>
                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: '1px' }}>
                      Track status updates and dynamic shipping in real-time
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '14px', color: '#111111' }}>🏷️</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'var(--font-h)', color: '#111111', letterSpacing: '0.5px' }}>
                      MEMBER PRIVILEGES & REWARDS
                    </div>
                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: '1px' }}>
                      Unlock exclusive coupons and automatic discount schemes
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn btn-black btn-full btn-lg" 
                  onClick={() => navigate('/login')}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-h)',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    padding: '16px 20px',
                    border: '1px solid #111111'
                  }}
                >
                  LOG IN TO YOUR ACCOUNT <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
                
                <button 
                  className="btn btn-outline btn-full btn-lg" 
                  onClick={() => navigate('/register')}
                  style={{
                    cursor: 'pointer',
                    fontFamily: 'var(--font-h)',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    padding: '16px 20px',
                    border: '1px solid #dddddd'
                  }}
                >
                  NEW CUSTOMER? CREATE ACCOUNT
                </button>

                <Link 
                  to="/" 
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-h)',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: '#888888',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    marginTop: '16px',
                    display: 'inline-block',
                    textAlign: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#111111')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
                >
                  ← CANCEL AND RETURN TO STORE
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-hero">
        <div className="container">
          <h1>Secure Checkout</h1>
          <p>Complete your purchase securely</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px 60px' }}>
        <div className="cart-pg-layout" id="checkoutLayout">
          {/* Form */}
          <div>
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Shipping Address Card */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', letterSpacing: '1px', fontFamily: 'var(--font-h)', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
                  1. SHIPPING DETAILS
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">EMAIL ADDRESS *</label>
                    <input 
                      required 
                      type="email" 
                      name="email" 
                      placeholder="your@email.com" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="form-label">FIRST NAME *</label>
                      <input 
                        required 
                        type="text" 
                        name="firstName" 
                        placeholder="First Name" 
                        value={formData.firstName} 
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">LAST NAME *</label>
                      <input 
                        required 
                        type="text" 
                        name="lastName" 
                        placeholder="Last Name" 
                        value={formData.lastName} 
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ADDRESS (STREET / LANDMARK) *</label>
                    <input 
                      required 
                      type="text" 
                      name="address" 
                      placeholder="House No, Street Name, Landmark" 
                      value={formData.address} 
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="form-label">CITY *</label>
                      <input 
                        required 
                        type="text" 
                        name="city" 
                        placeholder="City" 
                        value={formData.city} 
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PINCODE *</label>
                      <input 
                        required 
                        type="text" 
                        name="pincode" 
                        placeholder="6-digit ZIP code" 
                        value={formData.pincode} 
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">STATE *</label>
                    <select 
                      name="state" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                      className="form-input"
                      required
                    >
                      <option value="">Select your state</option>
                      <option value="UTTAR PRADESH">Uttar Pradesh</option>
                      <option value="DELHI">Delhi</option>
                      <option value="MAHARASHTRA">Maharashtra</option>
                      <option value="KARNATAKA">Karnataka</option>
                      <option value="TAMIL NADU">Tamil Nadu</option>
                      <option value="WEST BENGAL">West Bengal</option>
                      <option value="GUJARAT">Gujarat</option>
                      <option value="OTHER">Other State</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">PHONE NUMBER (FOR DELIVERY UPDATES) *</label>
                    <input 
                      required 
                      type="tel" 
                      name="phone" 
                      placeholder="+91 XXXXX XXXXX" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Option Card */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', letterSpacing: '1px', fontFamily: 'var(--font-h)', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
                  2. PAYMENT METHOD
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      border: paymentType === 'pod' ? '2px solid var(--dark)' : '1px solid #e2e8f0',
                      background: paymentType === 'pod' ? '#fcfcfc' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentType" 
                      value="pod" 
                      checked={paymentType === 'pod'}
                      onChange={() => setPaymentType('pod')}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--dark)' }}>
                        CASH / PAY ON DELIVERY (COD)
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--gray)' }}>
                        Pay via Cash, UPI, or Card upon delivery to your doorstep
                      </span>
                    </div>
                  </label>

                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      border: paymentType === 'card' ? '2px solid var(--dark)' : '1px solid #e2e8f0',
                      background: paymentType === 'card' ? '#fcfcfc' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentType" 
                      value="card" 
                      checked={paymentType === 'card'}
                      onChange={() => setPaymentType('card')}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', color: 'var(--dark)' }}>
                        <span>CREDIT / DEBIT CARD</span>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', background: '#2563eb', color: '#ffffff', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>VISA</span>
                          <span style={{ fontSize: '10px', background: '#dc2626', color: '#ffffff', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>MC</span>
                          <span style={{ fontSize: '10px', background: '#059669', color: '#ffffff', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>RUPAY</span>
                        </div>
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--gray)' }}>
                        Pay instantly using any Visa, Mastercard, RuPay, or Credit Card
                      </span>
                    </div>
                  </label>

                  {paymentType === 'card' && (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '10px' }}>CARD NUMBER *</label>
                        <input 
                          type="text" 
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardInputChange}
                          placeholder="4532 •••• •••• 8921"
                          maxLength={19}
                          className="form-input"
                          required={paymentType === 'card'}
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '10px' }}>CARDHOLDER NAME *</label>
                        <input 
                          type="text" 
                          name="cardName"
                          value={cardData.cardName}
                          onChange={handleCardInputChange}
                          placeholder="Name as printed on card"
                          className="form-input"
                          required={paymentType === 'card'}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '10px' }}>EXPIRY (MM/YY) *</label>
                          <input 
                            type="text" 
                            name="expiry"
                            value={cardData.expiry}
                            onChange={handleCardInputChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="form-input"
                            required={paymentType === 'card'}
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '10px' }}>CVV / CVC *</label>
                          <input 
                            type="password" 
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardInputChange}
                            placeholder="•••"
                            maxLength={4}
                            className="form-input"
                            required={paymentType === 'card'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="btn btn-black btn-full btn-lg"
              >
                {isProcessing 
                  ? 'PROCESSING ORDER...' 
                  : paymentType === 'card' 
                    ? `PAY ${fmt(grandTotal)} VIA CREDIT CARD` 
                    : `PLACE COD ORDER (${fmt(grandTotal)})`
                }
              </button>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="order-summary" style={{ height: 'fit-content' }}>
            <div className="os-title">ORDER SUMMARY</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', maxHeight: '350px', overflowY: 'auto' }}>
              {checkoutItems.map((item, idx) => (
                <div key={item.key || idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '48px', height: '48px', objectFit: 'cover', flexShrink: 0 }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`ph ph-${item.cat === 'electronics' ? 'elec' : item.cat}`} style={{ width: '48px', height: '48px', fontSize: '24px', flexShrink: 0 }}>
                      {emoji(item.cat || 'men')}
                    </div>
                  )}
                  <div style={{ flex: 1, fontSize: '13px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{item.name}</div>
                    <div style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '2px' }}>Size: {item.size} &nbsp;|&nbsp; Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--dark)' }}>{fmt(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            <div className="os-row">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>

            <div className="os-row">
              <span>Shipping</span>
              <span style={{ color: '#166534', fontWeight: 700 }}>FREE</span>
            </div>

            <div className="os-ship">✓ FREE SHIPPING TO YOUR ADDRESS</div>

            <div className="os-row total">
              <span>GRAND TOTAL</span>
              <span>{fmt(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
