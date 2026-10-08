import AccountIntro from '../components/AccountIntro';
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
        toast.error('No account found for this email. Please register first.');
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
        toast.error('Incorrect password. Please check your password or contact support.');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || 'Error logging in. Please try again.');
    }
  };

  return (
    <div id="login-page-root" className="account-page">
      <div className="container account-layout"><AccountIntro />
        <div className="account-form-panel">
          <h2 className="account-title">
            Welcome back
          </h2>
          <p className="account-subtitle">
            Sign in to your Free Fire Store account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">EMAIL ADDRESS *</label>
              <input 
                type="email" id="login-email" autoComplete="email"
                className="form-input" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label account-password-label" htmlFor="login-password">
                PASSWORD *
                <button type="button" className="account-forgot"
                  onClick={() => {
                    setShowResetNotice(true);
                    toast.info("Contact owner to reset your password.");
                  }}
                >
                  Forgot?
                </button>
              </label>
              <input 
                type="password" id="login-password" autoComplete="current-password"
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {showResetNotice && (
              <div className="account-notice">
                <strong>Reset Password:</strong> Please contact the website owner at <a href="tel:+917393845435">+91-7393845435</a> to reset your credentials.
              </div>
            )}

            <button type="submit" className="btn btn-black btn-full btn-lg">
              Sign in
            </button>
          </form>

          <p className="account-switch">
            New to Free Fire Store? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
