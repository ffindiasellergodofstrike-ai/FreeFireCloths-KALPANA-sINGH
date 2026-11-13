import React, { useState, useEffect, FormEvent } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Us – ffstreetwear';
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const submitContact = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      const errText = 'Please fill in your name, email, subject, and message.';
      setStatusMessage({ type: 'error', text: errText });
      toast.error(errText);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.sent) {
        const errText = data?.error || 'Unable to send your message right now. Please email support@ffstreetwear.shop directly.';
        setStatusMessage({ type: 'error', text: errText });
        toast.error(errText);
        return;
      }

      const okText = data.message || `Message sent! We'll reply to ${email.trim()} within 24 hours.`;
      setStatusMessage({ type: 'success', text: okText });
      toast.success(okText);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      const errText = 'Network error while sending your message. Please email support@ffstreetwear.shop or call +91-7393845435.';
      setStatusMessage({ type: 'error', text: errText });
      toast.error(errText);
    } finally {
      setSubmitting(false);
    }
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
          <form className="contact-form-box" onSubmit={submitContact} noValidate>
            <h2>Send Us a Message</h2>
            <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {statusMessage && (
              <div
                role={statusMessage.type === 'error' ? 'alert' : 'status'}
                id="contact-form-status"
                style={{
                  padding: '12px 14px',
                  marginBottom: '16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  background: statusMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
                  color: statusMessage.type === 'error' ? '#991b1b' : '#166534',
                  border: `1px solid ${statusMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                }}
              >
                {statusMessage.text}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">FULL NAME *</label>
              <input
                id="contact-name"
                className="form-input"
                type="text"
                required
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">EMAIL ADDRESS *</label>
              <input
                id="contact-email"
                className="form-input"
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-phone">PHONE NUMBER</label>
              <input
                id="contact-phone"
                className="form-input"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">SUBJECT *</label>
              <select
                id="contact-subject"
                className="form-input"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select a subject</option>
                <option value="Order Inquiry">Order Inquiry</option>
                <option value="Return / Exchange">Return / Exchange</option>
                <option value="Product Question">Product Question</option>
                <option value="Shipping Issue">Shipping Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">MESSAGE *</label>
              <textarea
                id="contact-message"
                className="form-input"
                required
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-black btn-full btn-lg" disabled={submitting}>
              {submitting ? 'SENDING MESSAGE...' : 'SEND MESSAGE'}
            </button>
          </form>

          <div className="contact-info-box">
            <div className="ci-item">
              <div className="ci-item-icon"><i className="fa fa-envelope"></i></div>
              <div>
                <h4>EMAIL US</h4>
                <p><a href="mailto:support@ffstreetwear.shop" style={{ color: 'inherit', textDecoration: 'none' }}>support@ffstreetwear.shop</a></p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>We reply within 24 hours</p>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-item-icon"><i className="fa fa-phone"></i></div>
              <div>
                <h4>CALL US</h4>
                <p><a href="tel:+917393845435" style={{ color: 'inherit', textDecoration: 'none' }}>+91-7393845435</a></p>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>Mon–Sat, 10AM–6PM IST</p>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-item-icon"><i className="fa fa-building"></i></div>
              <div>
                <h4>REGISTERED BUSINESS DETAILS</h4>
                <p style={{ marginBottom: '4px' }}><strong>Trade Name:</strong> ffstreetwear (Proprietor: Kalpana Singh)</p>
                <p style={{ marginBottom: '4px' }}><strong>Udyam Reg. No:</strong> UDYAM-UP-03-0123799</p>
                <p>PRANNATHPUR BACHHARIYA, SULTANPUR,<br />UTTAR PRADESH, INDIA - 228171</p>
              </div>
            </div>
            <div className="ci-item">
              <div className="ci-item-icon"><i className="fa fa-clock"></i></div>
              <div>
                <h4>BUSINESS HOURS</h4>
                <p>Monday – Saturday: 10:00 AM – 6:00 PM IST<br />Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
