import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetNotice, setShowResetNotice] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password.');
      return;
    }

    const toastId = toast.loading('Logging you in...');
    try {
      const emailLower = email.trim().toLowerCase();
      const userRef = doc(db, 'users', emailLower);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.dismiss(toastId);
        toast.error('This is the wrong password. Kindly please contact customer care for resetting your password.');
        return;
      }

      const userData = userSnap.data();
      if (userData && userData.password === password) {
        login(userData.email || emailLower, userData.name || '', userData.mobile || '');
        toast.dismiss(toastId);
        toast.success(`Welcome back, ${userData.name || 'User'}!`);
        
        // Redirect if we came from Buy Now redirect flow
        const redirectId = localStorage.getItem('redirect_product_id');
        if (redirectId) {
          localStorage.removeItem('redirect_product_id');
          navigate(`/product/${redirectId}`);
        } else {
          navigate('/my-orders');
        }
      } else {
        toast.dismiss(toastId);
        toast.error('This is the wrong password. Kindly please contact customer care for resetting your password.');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || 'Error logging in. Please try again.');
    }
  };

  return (
    <div id="login-page-root">
      <div className="container" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '32px 40px', maxWidth: '440px', width: '100%' }}>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-h)', fontWeight: 700, letterSpacing: '1px', textAlign: 'center', marginBottom: '8px' }}>
            WELCOME BACK
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--gray)', textAlign: 'center', marginBottom: '24px' }}>
            Sign in to your FREE FIRE STORE account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS *</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                PASSWORD *
                <span 
                  style={{ fontSize: '11px', color: 'var(--accent)', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 'bold' }} 
                  onClick={() => {
                    setShowResetNotice(true);
                    toast.info("Contact owner to reset your password.");
                  }}
                >
                  Forgot?
                </span>
              </label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {showResetNotice && (
              <div style={{ 
                margin: '16px 0', 
                padding: '12px 16px', 
                background: '#fef2f2', 
                border: '1px solid #fee2e2', 
                borderRadius: '4px',
                color: '#991b1b', 
                fontSize: '12px', 
                lineHeight: '1.5' 
              }}>
                <strong>Reset Password:</strong> Please contact the website owner at <a href="tel:+919793970031" style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'inherit' }}>+91-9793970031</a> to reset your credentials.
              </div>
            )}

            <button type="submit" className="btn btn-black btn-full btn-lg" style={{ marginTop: '12px' }}>
              SIGN IN
            </button>
          </form>

          <p style={{ fontSize: '12px', color: 'var(--gray)', textAlign: 'center', marginTop: '24px' }}>
            New to FREE FIRE STORE? <Link to="/register" style={{ color: 'var(--dark)', fontWeight: 700, textDecoration: 'underline' }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
