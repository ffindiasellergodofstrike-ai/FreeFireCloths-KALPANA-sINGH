import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function About() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email.trim()) {
      toast.success('✓ SUBSCRIBED!');
      setEmail('');
    } else {
      toast.error('Please enter a valid email address.');
    }
  };

  return (
    <div id="about-page-root">
      <div className="about-hero">
        <h1>OUR STORY</h1>
        <p>Fashion that speaks — quality you can feel, style you can trust.</p>
      </div>

      <div className="container">
        <div className="about-grid">
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '16px' }}>Born in Sultanpur & Prayagraj,<br />Made for India</h2>
            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '16px' }}>
              FREE FIRE STORE started with a clear vision — to bring premium, affordable fashion and lifestyle products to every doorstep in India. Founded by Kalpana Singh, we believe that great style shouldn't cost a fortune.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '16px' }}>
              From carefully curated menswear and women's fashion to trending everyday apparel, every product in our store is handpicked for quality, value, and style. We partner with trusted manufacturers and logistics networks to ensure your order reaches you safely and on time.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '24px' }}>
              With free express shipping, a transparent return policy, and a dedicated support team, we're committed to giving you the best online shopping experience in India.
            </p>

            {/* Business & Registration Information Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>BUSINESS & REGISTRATION DETAILS</h3>
              <p style={{ fontSize: '13px', color: '#334155', marginBottom: '8px', lineHeight: '1.6' }}>
                <strong>Operating Address:</strong> Flat/Door/Block No. 12, Hanuman House, Labour chauraha, Shantipuram, Shantipuram, Prayagraj, UTTAR PRADESH, District: PRAYAGRAJ, Pin: 211013
              </p>
              <p style={{ fontSize: '13px', color: '#334155', marginBottom: '8px', lineHeight: '1.6' }}>
                <strong>Registered Address:</strong> PRANNATHPUR BACHHARIYA, KADIPUR, AKHANDNAGAR, SULTANPUR, UTTAR PRADESH, INDIA, 228171
              </p>
              <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.6' }}>
                <strong>Udyam Registration Number:</strong> UDYAM-UP-03-0123799
              </p>
            </div>

            <button className="btn btn-black" onClick={() => navigate('/collections/all')}>SHOP NOW</button>
          </div>
          <div className="about-img-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏪</div>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <div className="num">10,000+</div>
            <div className="lbl">Happy Customers</div>
          </div>
          <div className="stat-box">
            <div className="num">30+</div>
            <div className="lbl">Premium Products</div>
          </div>
          <div className="stat-box">
            <div className="num">500+</div>
            <div className="lbl">Cities Delivered</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 0 }} className="newsletter">
        <div className="container">
          <h2>STAY IN THE LOOP</h2>
          <p>New arrivals, exclusive deals, and style tips — delivered to your inbox.</p>
          <div className="nl-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubscribe}>JOIN NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
}
