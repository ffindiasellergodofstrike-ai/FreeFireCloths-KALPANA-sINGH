import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
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
    return p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.collection?.toLowerCase().includes(q);
  });


  return (
    <div id="search-page-root">
      <div className="search-hero">
        <h1>SEARCH</h1>
        <form onSubmit={handleSearchSubmit} className="search-bar-lg">
          <input 
            type="text" 
            aria-label="Search products" placeholder="Try a top, shirt or co-ord…"
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
            <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>SEARCH FREE FIRE STORE</h2>
            <p style={{ color: 'var(--gray)' }}>Type your keyword above to discover premium fashion and apparel.</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <div style={{ marginBottom: '20px', fontFamily: 'var(--font-h)', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gray)' }}>
              {filteredProducts.length} RESULTS FOR "{query.toUpperCase()}"
            </div>
            <div className="grid-4">
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
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
