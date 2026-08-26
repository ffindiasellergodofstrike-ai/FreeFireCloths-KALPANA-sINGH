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

      // Log user session
      login(emailLower, fullName.trim(), mobile.trim());
      toast.dismiss(toastId);
      toast.success('Account created successfully! Welcome to Free Fire Store.');
      
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
    <div id="register-page-root">
      <div className="container" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '32px 40px', maxWidth: '480px', width: '100%' }}>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-h)', fontWeight: 700, letterSpacing: '1px', textAlign: 'center', marginBottom: '8px' }}>
            CREATE ACCOUNT
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--gray)', textAlign: 'center', marginBottom: '24px' }}>
            Join Free Fire Store for premium fashion and exclusive drops
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">FULL NAME *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>

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
              <label className="form-label">MOBILE NUMBER *</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="+91 XXXXX XXXXX" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">PASSWORD *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Min. 8 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn btn-black btn-full btn-lg" style={{ marginTop: '12px' }}>
              CREATE ACCOUNT
            </button>
          </form>

          <p style={{ fontSize: '12px', color: 'var(--gray)', textAlign: 'center', marginTop: '24px' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--dark)', fontWeight: 700, textDecoration: 'underline' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
