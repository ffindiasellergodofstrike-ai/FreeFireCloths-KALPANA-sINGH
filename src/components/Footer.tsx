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
                <span className="logo-main" style={{ color: '#ffffff' }}>GARENA OFFICIAL</span>
                <span className="logo-sub" style={{ color: '#94a3b8' }}>FREE FIRE STORE</span>
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
              <h4>CONTACT & ADDRESS</h4>
              <div className="fc-contact"><i className="fa fa-envelope"></i><span>contactkalpnaji@gmail.com</span></div>
              <div className="fc-contact"><i className="fa fa-phone"></i><span>+91-9319969384</span></div>
              <div className="fc-contact"><i className="fa fa-building"></i><span><strong>Registered:</strong> PRANNATHPUR BACHHARIYA, SULTANPUR, UTTAR PRADESH, INDIA, 228171</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-mid" style={{ padding: 0 }}>
        <div className="secure-payment-strip">
          <span className="secure-text">100% Secure Shopping</span>
          <img src="https://cdn.shopify.com/s/files/1/0936/3747/6665/files/card_1.png?v=1768831505" alt="Mastercard" referrerPolicy="no-referrer" />
          <img src="https://cdn.shopify.com/s/files/1/0936/3747/6665/files/visa.png?v=1768827408" alt="Visa" referrerPolicy="no-referrer" />
          <img src="https://cdn.shopify.com/s/files/1/0936/3747/6665/files/gpay_black.png?v=1768831823" alt="GPay" referrerPolicy="no-referrer" />
          <img src="https://cdn.shopify.com/s/files/1/0936/3747/6665/files/images_cdff9037-f7f4-492a-a09f-c285d9e905bd.png?v=1768831823" alt="UPI" referrerPolicy="no-referrer" />
          <img src="https://cdn.shopify.com/s/files/1/0936/3747/6665/files/buy.png?v=1768831823" alt="Cash on Delivery" referrerPolicy="no-referrer" />
        </div>
      </div>
      <div className="footer-bot">
        <div className="container">
          <p>© 2026 Garena Official Free Fire Store. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
