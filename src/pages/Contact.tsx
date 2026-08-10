import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Us – FREE FIRE STORE';
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const submitContact = () => {
    if (!name || !email || !message) {
      toast.error('⚠ Please fill in all required fields.');
      return;
    }
    toast.success(`✓ Message sent! We'll reply to ${email} within 24 hours.`);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div id="contact-page-root">
      <div className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">
          <div className="contact-form-box">
            <h2>Send Us a Message</h2>
            <div className="form-group">
              <label className="form-label">FULL NAME *</label>
              <input 
                className="form-input" 
                type="text" 
                placeholder="Your full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS *</label>
              <input 
                className="form-input" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">PHONE NUMBER</label>
              <input 
                className="form-input" 
                type="tel" 
                placeholder="+91 XXXXX XXXXX" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">SUBJECT *</label>
              <select 
                className="form-input" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select a subject</option>
                <option>Order Inquiry</option>
                <option>Return / Exchange</option>
                <option>Product Question</option>
                <option>Shipping Issue</option>
                <option>Payment Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">MESSAGE *</label>
              <textarea 
                className="form-input" 
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button className="btn btn-black btn-full btn-lg" onClick={submitContact}>SEND MESSAGE</button>
          </div>

          <div className="contact-info-box">
            <div className="ci-item">
              <div className="ci-item-icon"><i className="fa fa-envelope"></i></div>
              <div>
                <h4>EMAIL US</h4>
                <p>contactkalpnaji@gmail.com</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>We reply within 24 hours</p>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-item-icon"><i className="fa fa-phone"></i></div>
              <div>
                <h4>CALL US</h4>
                <p>+91-9319969384</p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>Mon–Sat, 10AM–6PM IST</p>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-item-icon"><i className="fa fa-building"></i></div>
              <div>
                <h4>REGISTERED ADDRESS & REGISTRATION</h4>
                <p>PRANNATHPUR BACHHARIYA, SULTANPUR,<br />UTTAR PRADESH, INDIA - 228171</p>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-item-icon"><i className="fa fa-clock"></i></div>
              <div>
                <h4>BUSINESS HOURS</h4>
                <p>Monday – Saturday: 10:00 AM – 6:00 PM<br />Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
