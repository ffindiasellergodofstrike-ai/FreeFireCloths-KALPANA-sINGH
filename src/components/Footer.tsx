import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <footer className="footer" id="site-footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo-brand-block" onClick={() => navigate('/')} style={{ cursor: 'pointer', marginBottom: '14px' }}>
                <span className="logo-main" style={{ color: '#ffffff' }}>FREE FIRE STORE</span>
              </div>
              <p>Your trusted destination for premium fashion & lifestyle products. Delivered across India with love.</p>

            </div>
            <div className="footer-col">
              <h4>QUICK LINKS</h4>
              <Link to="/">Home</Link>
              <Link to="/collections/all">Shop All</Link>
              <Link to="/collections/men">Men</Link>
              <Link to="/collections/women">Women</Link>
              <Link to="/blog">Style Journal</Link>
              <Link to="/about">About Us</Link>
            </div>
            <div className="footer-col">
              <h4>POLICIES</h4>
              <Link to="/policies/privacy">Privacy Policy</Link>
              <Link to="/policies/refund">Refund Policy</Link>
              <Link to="/policies/shipping">Shipping Policy</Link>
              <Link to="/policies/terms">Terms of Service</Link>
              <Link to="/contact">Contact Us</Link>
              {user && <Link to="/my-orders">Track Order</Link>}
            </div>
            <div className="footer-col">
              <h4>CONTACT & BUSINESS INFO</h4>
              <div className="fc-contact"><i className="fa fa-envelope"></i><span>connectwithgarena@gmail.com</span></div>
              <div className="fc-contact"><i className="fa fa-phone"></i><span>+91-7393845435</span></div>
              <div className="fc-contact"><i className="fa fa-building"></i><span><strong>Registered:</strong> PRANNATHPUR BACHHARIYA, SULTANPUR, UTTAR PRADESH, INDIA, 228171</span></div>
              <div className="fc-contact" style={{ marginTop: '8px', fontSize: '13px' }}><i className="fa fa-info-circle"></i><span><strong>Business Name:</strong> Free Fire Store</span></div>
              <div className="fc-contact" style={{ fontSize: '13px' }}><i className="fa fa-file-alt"></i><span><strong>Udyam Reg. No:</strong> UDYAM-UP-03-0123799</span></div>
              <div className="fc-contact" style={{ marginTop: '4px', fontSize: '13px', lineHeight: '1.4' }}><i className="fa fa-shopping-bag"></i><span>We sell premium clothing & apparel at https://www.ffstreetwear.shop/. Registered in India.</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-mid" style={{ padding: 0 }}>
        <div className="secure-payment-strip">
          <span className="secure-text">100% Secure Shopping</span>
          <img src="https://res.cloudinary.com/smi5oqr3/image/upload/v1791298902/freefire_store_catalog/8ab78e33bfdd0b9268d5d7395c02dd399f8b0abca46f73eccc90e62c9732bcc6.png" alt="Mastercard" referrerPolicy="no-referrer" />
          <img src="https://res.cloudinary.com/smi5oqr3/image/upload/v1791298902/freefire_store_catalog/fedcb11297a6fc826531f1caf1096002057b22461bd3451a080e2651f09d92e1.png" alt="Visa" referrerPolicy="no-referrer" />
          <img src="https://res.cloudinary.com/smi5oqr3/image/upload/v1791298902/freefire_store_catalog/40a3f30a96403aae739b6facaa5618bc1c1c351de7f6866aeb6e6e453ab61932.png" alt="GPay" referrerPolicy="no-referrer" />
          <img src="https://res.cloudinary.com/smi5oqr3/image/upload/v1791298902/freefire_store_catalog/78a987ebf596b112edd5ed69da0ce0acec71d50cbc985d81cfd7d8de326211af.png" alt="UPI" referrerPolicy="no-referrer" />
          <img src="https://res.cloudinary.com/smi5oqr3/image/upload/v1791298902/freefire_store_catalog/93d1f33cd897e5113f28ac9367a97a1cb68c33721d72aec5d80acddbf5b7cbce.png" alt="Cash on Delivery" referrerPolicy="no-referrer" />
        </div>
      </div>
      <div className="footer-bot">
        <div className="container">
          <p>© 2026 Free Fire Store. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
