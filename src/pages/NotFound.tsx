import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div id="notfound-page-root">
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontFamily: 'var(--font-h)', fontWeight: 700, margin: 0, lineHeight: 1, color: 'var(--accent)' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-h)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '16px 0 8px' }}>PAGE NOT FOUND</h2>
        <p style={{ color: 'var(--gray)', maxWidth: '400px', margin: '0 auto 28px', fontSize: '14px', lineHeight: 1.6 }}>The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.</p>
        <Link to="/" className="btn btn-black btn-lg">BACK TO HOME</Link>
      </div>
    </div>
  );
}
