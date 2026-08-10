import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Product } from '../data/products';
import { useProducts } from '../context/ProductContext';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const stars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  // Perform search
  const filteredProducts = products.filter(p => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
  });

  const renderProductCard = (p: Product) => {
    const disc = p.orig ? Math.round(((p.orig - p.price) / p.orig) * 100) : 0;
    return (
      <div 
        className="product-card" 
        key={p.id} 
        onClick={() => navigate(`/product/${p.id}`)}
        id={`product-card-${p.id}`}
      >
        <div className="pc-img">
          {p.images && p.images.length > 0 ? (
            <img 
              src={p.images[0]} 
              alt={p.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
              referrerPolicy="no-referrer"
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
    <div id="search-page-root">
      <div className="search-hero">
        <h1>SEARCH</h1>
        <form onSubmit={handleSearchSubmit} className="search-bar-lg">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id="searchMainInput" 
          />
          <button type="submit">SEARCH</button>
        </form>
      </div>

      <div className="container" style={{ padding: '40px 20px 60px' }}>
        {query.trim() === '' ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>SEARCH GARENA</h2>
            <p style={{ color: 'var(--gray)' }}>Type your keyword above to discover premium fashion and apparel.</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <div style={{ marginBottom: '20px', fontFamily: 'var(--font-h)', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gray)' }}>
              {filteredProducts.length} RESULTS FOR "{query.toUpperCase()}"
            </div>
            <div className="grid-4">
              {filteredProducts.map(renderProductCard)}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>NO RESULTS FOUND</h2>
            <p style={{ color: 'var(--gray)' }}>Try different keywords or browse our collections.</p>
            <button className="btn btn-black" style={{ marginTop: '20px' }} onClick={() => navigate('/collections/all')}>
              BROWSE ALL PRODUCTS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
