import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { ShieldCheck, ShoppingBag, ArrowRight, UserCheck, Lock, Mail, Phone, User, X } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, clearCart, getTotalPrice, cartCount } = useCart();
  const { user, login } = useAuth();
  
  const statusParam = searchParams.get('status');
  const messageParam = searchParams.get('message');
  
  const { product: directProduct, size: directSize, qty: directQty } = location.state || {};
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalMobile, setModalMobile] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  const handleModalLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!modalEmail.trim() || !modalPassword.trim()) {
      toast.error('Please enter your email and password.');
      return;
    }
    setIsAuthSubmitting(true);
    try {
      const emailLower = modalEmail.trim().toLowerCase();
      const userRef = doc(db, 'users', emailLower);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error('No account found for this email. Switching to Register...');
        setModalTab('register');
        setIsAuthSubmitting(false);
        return;
      }

      const userData = userSnap.data();
      if (userData && userData.password === modalPassword) {
        login(userData.email || emailLower, userData.name || '', userData.mobile || '');
        toast.success(`Welcome back, ${userData.name || 'Customer'}!`);
      } else {
        toast.error('Incorrect password. Please check and try again.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleModalRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!modalName.trim() || !modalEmail.trim() || !modalMobile.trim() || !modalPassword.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsAuthSubmitting(true);
    try {
      const emailLower = modalEmail.trim().toLowerCase();
      const userRef = doc(db, 'users', emailLower);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        toast.error('An account already exists with this email. Switching to Sign In...');
        setModalTab('login');
        setIsAuthSubmitting(false);
        return;
      }

      await setDoc(userRef, {
        name: modalName.trim(),
        email: emailLower,
        mobile: modalMobile.trim(),
        pincode: '',
        password: modalPassword,
        createdAt: new Date().toISOString()
      });

      login(emailLower, modalName.trim(), modalMobile.trim());
      toast.success('Account created successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

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
  const [previousPaymentIncomplete, setPreviousPaymentIncomplete] = useState(false);

  useEffect(() => {
    const checkPendingPayment = () => {
      const pendingStr = sessionStorage.getItem('pendingPayment');
      if (pendingStr) {
        sessionStorage.removeItem('pendingPayment');
        setPreviousPaymentIncomplete(true);
        setIsProcessing(false);
        toast.error('Your previous payment was not completed.');
      }
    };

    checkPendingPayment();

    const handlePageShow = (e: PageTransitionEvent) => {
      if ((e as any).persisted || document.visibilityState === 'visible') {
        setIsProcessing(false);
        checkPendingPayment();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

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

    setIsProcessing(true);
    const loadingToast = toast.loading(paymentType === 'card' ? 'Initiating Secure Payment...' : 'Securing order details...');
    
    try {
      if (paymentType === 'card') {
        const payload = {
          amount: grandTotal,
          customerData: formData,
          items: checkoutItems
        };

        const res = await fetch('/api/payglocal/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error('Payment gateway error. Please try again.');
        }

        const data = await res.json();
        
        if (data.redirectUrl) {
          toast.dismiss(loadingToast);
          
          const pendingOrderInfo = {
            userId: user?.uid || user?.email || 'guest',
            userEmail: formData.email,
            items: checkoutItems,
            total: grandTotal,
            status: 'Paid',
            paymentMethod: 'Pay Online',
            shippingAddress: formData,
            orderNumber: Math.floor(Math.random() * 900000) + 100000,
            merchantTxnId: data.merchantTxnId,
            gid: data.gid,
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('pendingPayGlocalOrder', JSON.stringify(pendingOrderInfo));

          sessionStorage.setItem('pendingPayment', JSON.stringify({
            txnId: data.merchantTxnId,
            gid: data.gid,
            startedAt: Date.now()
          }));

          window.location.href = data.redirectUrl;
          return;
        } else {
          throw new Error('Could not get payment redirect URL');
        }
      }

      const orderNumber = Math.floor(Math.random() * 900000) + 100000;
      
      if (db) {
        try {
          await addDoc(collection(db, 'orders'), {
            userId: user?.uid || user?.email || 'guest',
            userEmail: formData.email,
            items: checkoutItems,
            total: grandTotal,
            status: 'Order Placed (COD)',
            paymentMethod: 'Cash on Delivery (COD)',
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
        toast.success('Garena Official Free Fire Store Order Confirmed!');
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
          Thank you for shopping with Garena Official Free Fire Store. Your order has been placed successfully and will be delivered to your address soon.
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
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            padding: '12px'
          }} 
          id="checkout-login-modal"
        >
          <div 
            style={{
              background: '#ffffff',
              maxWidth: '440px',
              width: '100%',
              maxHeight: '92vh',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Top Bar Header */}
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #1e293b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag style={{ width: '18px', height: '18px', color: '#f8fafc' }} />
                <span style={{
                  fontFamily: 'var(--font-h)',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase'
                }}>
                  Garena Official Free Fire Store
                </span>
              </div>
              <Link 
                to="/" 
                style={{
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </Link>
            </div>

            {/* Modal Body - Scrollable */}
            <div style={{ padding: '20px 20px 24px', overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-h)',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#0f172a',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Sign in to Complete Order
                </h2>
                <p style={{
                  color: '#64748b',
                  fontSize: '12px',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Identify yourself for order tracking & instant delivery updates.
                </p>
              </div>

              {/* Modern Auth Tab Switcher */}
              <div style={{
                display: 'flex',
                background: '#f1f5f9',
                padding: '4px',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <button
                  type="button"
                  onClick={() => setModalTab('login')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: modalTab === 'login' ? '#ffffff' : 'transparent',
                    color: modalTab === 'login' ? '#0f172a' : '#64748b',
                    boxShadow: modalTab === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  LOG IN
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('register')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: modalTab === 'register' ? '#ffffff' : 'transparent',
                    color: modalTab === 'register' ? '#0f172a' : '#64748b',
                    boxShadow: modalTab === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              {/* Inline Form */}
              <form onSubmit={modalTab === 'login' ? handleModalLogin : handleModalRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {modalTab === 'register' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                        <input 
                          type="text"
                          required
                          value={modalName}
                          onChange={(e) => setModalName(e.target.value)}
                          placeholder="Rahul Sharma"
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            fontSize: '15px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px',
                            outline: 'none',
                            background: '#f8fafc'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '4px' }}>
                        Mobile Number *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                        <input 
                          type="tel"
                          required
                          value={modalMobile}
                          onChange={(e) => setModalMobile(e.target.value)}
                          placeholder="+91 9876543210"
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            fontSize: '15px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px',
                            outline: 'none',
                            background: '#f8fafc'
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                    <input 
                      type="email"
                      required
                      value={modalEmail}
                      onChange={(e) => setModalEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        fontSize: '15px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        background: '#f8fafc'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#475569', marginBottom: '4px' }}>
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                    <input 
                      type="password"
                      required
                      value={modalPassword}
                      onChange={(e) => setModalPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        fontSize: '15px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        outline: 'none',
                        background: '#f8fafc'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isAuthSubmitting ? 0.7 : 1
                  }}
                >
                  {isAuthSubmitting ? (
                    'PROCESSING...'
                  ) : (
                    modalTab === 'login' ? (
                      <>LOG IN & CONTINUE <ArrowRight style={{ width: '14px', height: '14px' }} /></>
                    ) : (
                      <>CREATE ACCOUNT & CONTINUE <ArrowRight style={{ width: '14px', height: '14px' }} /></>
                    )
                  )}
                </button>
              </form>

              {/* Alternative Navigation links */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Prefer full login page?{' '}
                  <button 
                    type="button" 
                    onClick={() => navigate('/login')} 
                    style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
                  >
                    Go to Login Page
                  </button>
                </div>
                
                <Link 
                  to="/" 
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    marginTop: '4px'
                  }}
                >
                  ← Return to Store
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
        {previousPaymentIncomplete && (
          <div 
            id="incomplete-payment-alert"
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontWeight: 'bold', fontSize: '18px' }}>
                !
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#991b1b' }}>
                  Your previous payment was not completed
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#b91c1c' }}>
                  You returned before completing the transaction. No charges were deducted.
                </p>
              </div>
            </div>
            <button
              type="button"
              id="retry-payment-banner-btn"
              onClick={() => setPreviousPaymentIncomplete(false)}
              className="btn btn-black btn-sm"
              style={{ padding: '10px 18px', fontWeight: 700, fontSize: '13px' }}
            >
              Retry Payment
            </button>
          </div>
        )}

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
                      border: paymentType === 'card' ? '2px solid var(--dark)' : '1px solid var(--border)',
                      background: paymentType === 'card' ? '#fcfcfc' : '#fff',
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
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--dark)' }}>
                        PAY ONLINE (Secured by PayGlocal)
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--gray)' }}>
                        Credit/Debit Card, UPI, Wallets, and NetBanking
                      </span>
                    </div>
                  </label>

                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      border: paymentType === 'pod' ? '2px solid var(--dark)' : '1px solid var(--border)',
                      background: paymentType === 'pod' ? '#fcfcfc' : '#fff',
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
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="btn btn-black btn-full btn-lg"
              >
                {isProcessing 
                  ? 'PROCESSING ORDER...' 
                  : (paymentType === 'card' ? `PAY ONLINE (${fmt(grandTotal)})` : `PLACE COD ORDER (${fmt(grandTotal)})`)
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
