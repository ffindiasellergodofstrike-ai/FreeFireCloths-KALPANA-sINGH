import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Navbar() {
  const { cart, removeFromCart, updateQty, getTotalPrice, cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchText, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setMobileDrawerOpen(false);
    }
  };

  const activeClass = (path: string) => location.pathname === path ? 'active' : '';

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const emoji = (cat: string) => cat === 'men' ? '👕' : cat === 'women' ? '👗' : '💻';

  return (
    <>
      {/* Announcement Bar */}
      <div className="announce" id="announcement-bar-main">
        <div className="announce-track">
          <span>🔥 FREE EXPRESS SHIPPING ON ALL ORDERS</span>
          <span className="announce-sep">•</span>
          <span>🔒 100% SECURE CHECKOUT</span>
          <span className="announce-sep">•</span>
          <span>🔄 EASY 7-DAY RETURNS</span>
          <span className="announce-sep">•</span>
          <span>🔥 FREE EXPRESS SHIPPING ON ALL ORDERS</span>
          <span className="announce-sep">•</span>
          <span>🔒 100% SECURE CHECKOUT</span>
          <span className="announce-sep">•</span>
          <span>🔄 EASY 7-DAY RETURNS</span>
          <span className="announce-sep">•</span>
          <span>🔥 FREE EXPRESS SHIPPING ON ALL ORDERS</span>
          <span className="announce-sep">•</span>
          <span>🔒 100% SECURE CHECKOUT</span>
          <span className="announce-sep">•</span>
          <span>🔄 EASY 7-DAY RETURNS</span>
          <span className="announce-sep">•</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="site-header" id="siteHeader">
        <div className="container">
          <div className="header-inner">
            {/* Logo */}
            <Link to="/" className="logo-brand-block" id="header-logo-text">
              <span className="logo-main">FREE FIRE STORE</span>
            </Link>

            {/* Nav (center) */}
            <nav className="main-nav" id="desktop-main-nav">
              <div className="nav-item">
                <Link to="/" className={`nav-link ${activeClass('/')}`}>HOME</Link>
              </div>
              <div className="nav-item">
                <Link to="/collections/all" className={`nav-link ${activeClass('/collections/all')}`}>
                  SHOP ALL <i className="fa fa-chevron-down" style={{ fontSize: '9px', marginLeft: '4px' }}></i>
                </Link>
                <div className="dropdown">
                  <Link to="/collections/men">MEN</Link>
                  <Link to="/collections/women">WOMEN</Link>
                  <Link to="/collections/kids">KIDS</Link>
                </div>
              </div>
              <div className="nav-item">
                <Link to={user ? "/my-orders" : "/login"} className={`nav-link ${activeClass('/my-orders')}`}>
                  {user ? 'MY PROFILE & ORDERS' : 'ACCOUNT'}
                </Link>
              </div>
              <div className="nav-item">
                <Link to="/policies/shipping" className={`nav-link ${activeClass('/policies/shipping')}`}>SHIPPING</Link>
              </div>
              <div className="nav-item">
                <Link to="/contact" className={`nav-link ${activeClass('/contact')}`}>CONTACT</Link>
              </div>
            </nav>

            {/* Actions (right) */}
            <div className="header-actions">
              <div className="header-search">
                <i className="fa fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchText}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  id="headerSearchInput" 
                />
              </div>

              <Link to={user ? "/my-orders" : "/login"} className="icon-btn" title={user ? "My Profile & Orders" : "Sign In"} id="nav-account-btn">
                <i className="fa fa-user"></i>
              </Link>

              <button className="icon-btn" onClick={() => setIsCartOpen(true)} title="Cart" id="nav-cart-btn">
                <i className="fa fa-shopping-bag"></i>
                <span className="cart-count" id="cartCount">{cartCount}</span>
              </button>
              <button className="icon-btn hamburger" onClick={() => setMobileDrawerOpen(true)} id="nav-hamburger-btn">
                <i className="fa fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mob-overlay ${mobileDrawerOpen ? 'open' : ''}`} 
        onClick={() => setMobileDrawerOpen(false)} 
        id="mobile-drawer-overlay"
      />
      
      {/* Mobile Drawer */}
      <div className={`mob-drawer ${mobileDrawerOpen ? 'open' : ''}`} id="mobDrawer">
        <button className="drawer-close" onClick={() => setMobileDrawerOpen(false)} id="drawer-close-btn">
          <i className="fa fa-times"></i>
        </button>
        <div className="drawer-logo" style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '20px' }}>          <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--dark)' }}>FREE FIRE STORE</span>        </div>

        {user && (
          <div style={{ background: '#f8fafc', padding: '12px 16px', border: '1px solid #e2e8f0', margin: '12px 0 16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dark)' }}>👤 {user.name || 'User'}</div>
            <div style={{ fontSize: '11px', color: 'var(--gray)', wordBreak: 'break-all' }}>📧 {user.email}</div>
            {user.mobile && <div style={{ fontSize: '11px', color: 'var(--gray)' }}>📱 {user.mobile}</div>}
          </div>
        )}

        <div className="mob-search">
          <i className="fa fa-search" style={{ color: '#aaa', fontSize: '13px' }}></i>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchText}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            id="mobileSearchInput"
          />
        </div>
        <div className="drawer-nav">
          <Link to="/" onClick={() => setMobileDrawerOpen(false)}>HOME</Link>
          <Link to="/collections/all" onClick={() => setMobileDrawerOpen(false)}>SHOP ALL</Link>
          <Link to="/collections/men" onClick={() => setMobileDrawerOpen(false)}>MEN</Link>
          <Link to="/collections/women" onClick={() => setMobileDrawerOpen(false)}>WOMEN</Link>
          <Link to={user ? "/my-orders" : "/login"} onClick={() => setMobileDrawerOpen(false)}>
            {user ? 'MY PROFILE & ORDERS' : 'LOGIN / REGISTER'}
          </Link>
          <Link to="/policies/shipping" onClick={() => setMobileDrawerOpen(false)}>SHIPPING</Link>
          <Link to="/contact" onClick={() => setMobileDrawerOpen(false)}>CONTACT</Link>

          {user && (
            <button 
              onClick={() => {
                logout();
                setMobileDrawerOpen(false);
                toast.success('Logged out successfully.');
                navigate('/login');
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                fontFamily: 'var(--font-h)',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '1.5px',
                marginTop: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              id="drawer-logout-btn"
            >
              <i className="fa fa-sign-out"></i> LOG OUT
            </button>
          )}
        </div>
      </div>

      {/* Cart Drawer Overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)} 
        id="cart-drawer-overlay"
      />

      {/* Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} id="cartDrawer">
        <div className="cart-head">
          <h3>YOUR BAG ({cartCount})</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)} id="cart-drawer-close-btn">
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="cart-items" id="cartItems">
          {cart.length === 0 ? (
            <div className="cart-empty" id="cart-empty-state">
              <i className="fa fa-shopping-bag"></i>
              <p>Your bag is empty</p>
              <button 
                className="btn btn-black btn-full" 
                onClick={() => { setIsCartOpen(false); navigate('/collections/all'); }}
                id="cart-start-shopping-btn"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.key} id={`cart-item-${item.id}`}>
                <Link to={`/product/${item.id}`} onClick={() => setIsCartOpen(false)} style={{ display: 'block', flexShrink: 0 }}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="cart-item-img" 
                      style={{ objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`ph ph-${item.cat === 'electronics' ? 'elec' : item.cat} cart-item-img`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                      {emoji(item.cat)}
                    </div>
                  )}
                </Link>
                <div className="ci-info">
                  <Link to={`/product/${item.id}`} onClick={() => setIsCartOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="ci-name" style={{ cursor: 'pointer' }}>{item.name}</div>
                  </Link>
                  <div className="ci-size">Size: {item.size}</div>
                  <div className="ci-qty">
                    <button onClick={() => updateQty(item.key, -1)} id={`qty-minus-${item.key}`}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.key, 1)} id={`qty-plus-${item.key}`}>+</button>
                  </div>
                  <div className="ci-price">{fmt(item.price * item.qty)}</div>
                </div>
                <button className="ci-remove" onClick={() => removeFromCart(item.key)} id={`remove-item-${item.key}`}>
                  <i className="fa fa-times"></i>
                </button>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-foot" id="cartFoot">
            <div className="cart-total-row">
              <span className="cart-total-label">SUBTOTAL</span>
              <span className="cart-total-price" id="cartTotal">{fmt(getTotalPrice())}</span>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 14px', fontSize: '12px', color: '#166534', fontFamily: 'var(--font-h)', fontWeight: 700, marginBottom: '16px' }}>
              ✓ FREE SHIPPING ON THIS ORDER
            </div>
            <button 
              className="btn btn-black btn-full btn-lg" 
              onClick={() => { setIsCartOpen(false); navigate('/cart'); }}
              id="view-bag-checkout-btn"
            >
              VIEW BAG & CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
}
