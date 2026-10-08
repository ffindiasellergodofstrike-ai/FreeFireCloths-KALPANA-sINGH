import AccountIntro from '../components/AccountIntro';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      toast.error('Please enter all required details.');
      return;
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length > 10) {
      toast.error('Mobile number cannot be more than 10 digits.');
      return;
    }

    const toastId = toast.loading('Creating your account...');
    try {
      const emailLower = email.trim().toLowerCase();
      const userRef = doc(db, 'users', emailLower);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        toast.dismiss(toastId);
        toast.error('User already registered.');
        return;
      }

      // Save user profile to Firestore (pincode is default empty string as required by firestore.rules Schema constraints)
      await setDoc(userRef, {
        name: fullName.trim(),
        email: emailLower,
        mobile: mobile.trim(),
        pincode: '',
        password: password,
        createdAt: new Date().toISOString()
      });

      let welcomeEmailSent = false;
      try {
        const response = await fetch('/api/account-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailLower }),
        });
        welcomeEmailSent = response.ok && (await response.json()).sent === true;
      } catch {
        welcomeEmailSent = false;
      }

      // Log user session
      login(emailLower, fullName.trim(), mobile.trim());
      toast.dismiss(toastId);
      toast.success('Account created successfully! Welcome to Free Fire Store.');
      if (welcomeEmailSent) toast.success('A welcome email has been sent to your email address.');
      else toast.info('Your account was created, but we could not send the welcome email right now.');
      
      // Redirect to original product page if redirect_product_id is saved
      const redirectId = localStorage.getItem('redirect_product_id');
      if (redirectId) {
        localStorage.removeItem('redirect_product_id');
        navigate(`/product/${redirectId}`);
      } else {
        navigate('/my-orders');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || 'Error registering account. Please try again.');
    }
  };

  return (
    <div id="register-page-root" className="account-page">
      <div className="container account-layout"><AccountIntro register />
        <div className="account-form-panel">
          <h2 className="account-title">
            Create account
          </h2>
          <p className="account-subtitle">
            Create an account to manage orders and track deliveries
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-full-name">FULL NAME *</label>
              <input 
                type="text" id="register-full-name" autoComplete="name"
                className="form-input" 
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">EMAIL ADDRESS *</label>
              <input 
                type="email" id="register-email" autoComplete="email"
                className="form-input" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-mobile">MOBILE NUMBER *</label>
              <input 
                type="tel" id="register-mobile" autoComplete="tel"
                className="form-input" 
                placeholder="10-digit mobile number" 
                value={mobile}
                maxLength={10}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">PASSWORD *</label>
              <input 
                type="password" id="register-password" autoComplete="new-password"
                className="form-input" 
                placeholder="Min. 8 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-black btn-full btn-lg">
              Create account
            </button>
          </form>

          <p className="account-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
