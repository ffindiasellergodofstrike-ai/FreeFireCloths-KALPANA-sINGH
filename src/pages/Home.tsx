import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();

  useEffect(() => {
    document.title = 'Garena Official Free Fire Store – Premium Fashion & Apparel';
  }, []);

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const stars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleCategoryClick = (cat: string) => {
    navigate(`/collections/${cat}`);
  };

  // Filter products: featured items (ID 101-399 or featured: true)
  const featuredProducts = products.filter(p => p.featured || (p.id >= 101 && p.id < 400));
  // Newly added products with badge === 'NEW'
  const newArrivals = products.filter(p => p.badge === 'NEW');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const handleNewsletterSubmit = () => {
    if (newsletterEmail.trim()) {
      toast.success('✓ SUBSCRIBED! WELCOME TO Garena Official Free Fire Store');
      setNewsletterEmail('');
    } else {
      toast.error('Please enter a valid email address.');
    }
  };

  const optimizeUnsplash = (url: string, width: number, quality: number = 80) => {
    if (!url) return url;
    if (url.includes('images.unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
    }
    return url;
  };

  const renderProductCard = (p: Product) => {
    const disc = p.orig ? Math.round(((p.orig - p.price) / p.orig) * 100) : 0;
    return (
      <div 
        className="product-card" 
        key={p.id} 
        onClick={() => handleProductClick(p.id)}
        id={`product-card-${p.id}`}
      >
        <div className="pc-img">
          {p.images && p.images.length > 0 ? (
            <img 
              src={optimizeUnsplash(p.images[0], 400, 80)} 
              alt={p.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className={`ph ph-${p.cat}`} style={{ width: '100%', height: '100%', fontSize: '52px' }}>
              {p.cat === 'men' ? '👔' : '👗'}
              <span>{p.name.split(' ').slice(0, 2).join(' ').toUpperCase()}</span>
            </div>
          )}
          <div className="pc-badges">
            {p.badge && <span className={`badge ${p.badge === 'SALE' ? 'badge-sale' : 'badge-new'}`}>{p.badge}</span>}
            {disc > 0 && <span className="badge badge-sale">-{disc}%</span>}
          </div>
          <div className="pc-overlay">ADD TO BAG</div>
        </div>
        <div className="pc-body">
          <div className="pc-cat">{p.cat.toUpperCase()}</div>
          <div className="pc-name">{p.name}</div>
          <div className="pc-price">
            <span className="price-now">{fmt(p.price)}</span>
            {p.orig > 0 && <span className="price-was">{fmt(p.orig)}</span>}
            {disc > 0 && <span className="price-save">{disc}% OFF</span>}
          </div>
          <div className="pc-stars">
            {stars(p.rating)}
            <span>({p.reviews})</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="page-home-root">
      {/* Categories (Myntra/Amazon Bubble Style) */}
      <div className="category-bubbles-section" id="categories-section">
        <div className="container">
          <div className="bubbles-container">
            <div className="bubble-item" onClick={() => handleCategoryClick('men')} id="category-men">
              <div className="bubble-img-wrapper">
                <img 
                  src="https://cms.landmarkshops.in/MAX-Friday/MAX2.O/MAX-Dept-Nav-Men-08JUN26.png" 
                  alt="Men" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <span className="bubble-title">MEN</span>
            </div>
            
            <div className="bubble-item" onClick={() => handleCategoryClick('women')} id="category-women">
              <div className="bubble-img-wrapper">
                <img 
                  src="https://cms.landmarkshops.in/MAX-Friday/MAX2.O/MAX-Dept-Nav-Women-08JUN26.png" 
                  alt="Women" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <span className="bubble-title">WOMEN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Trust Line */}
      <div className="simple-trust-line" id="trust-strip">
        <span>Free Shipping</span>
        <span className="dot">•</span>
        <span>Secure Payment</span>
        <span className="dot">•</span>
        <span>Easy Returns</span>
      </div>

      {/* Featured Products */}
      <div className="section" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} id="featured-section">
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <h2>FEATURED PRODUCTS</h2>
              <div className="line"></div>
              <p>Handpicked bestsellers</p>
            </div>
            <button className="view-all" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--dark)', cursor: 'pointer' }} onClick={() => navigate('/collections/all')}>VIEW ALL</button>
          </div>
          <div className="grid-4" id="homeFeatured">
            {featuredProducts.map(renderProductCard)}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="section" id="new-arrivals-section">
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <h2>NEW ARRIVALS</h2>
              <div className="line"></div>
              <p>Fresh drops every week</p>
            </div>
            <button className="view-all" style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--dark)', cursor: 'pointer' }} onClick={() => navigate('/collections/all')}>VIEW ALL</button>
          </div>
          <div className="grid-4" id="homeNew">
            {newArrivals.map(renderProductCard)}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter" id="newsletter-section">
        <div className="container">
          <h2>JOIN THE Garena Official Free Fire Store FAMILY</h2>
          <p>Subscribe for exclusive deals, new launches, and style inspiration — straight to your inbox.</p>
          <div className="nl-form">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button onClick={handleNewsletterSubmit}>SUBSCRIBE</button>
          </div>
        </div>
      </div>
    </div>
  );
}
