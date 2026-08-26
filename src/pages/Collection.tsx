import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product } from '../data/products';
import { useProducts } from '../context/ProductContext';

export default function Collection() {
  const { category = 'all' } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();

  const [selectedCats, setSelectedCats] = useState<Record<string, boolean>>({
    men: category === 'men' || category === 'all',
    women: category === 'women' || category === 'all',
    kids: category === 'kids' || category === 'all',
  });

  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('FEATURED');

  useEffect(() => {
    const catName = category.toUpperCase();
    document.title = `${catName} Collection – Free Fire Store`;

    setSelectedCats({
      men: category === 'men' || category === 'all',
      women: category === 'women' || category === 'all',
      kids: category === 'kids' || category === 'all',
    });
  }, [category]);

  const handleCatCheckboxChange = (cat: string) => {
    setSelectedCats(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const stars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  // Get current products with filters and sorting
  const filteredProducts = products.filter(p => {
    // Category filter: check if product's category is selected
    const isCatSelected = selectedCats[p.cat];
    if (!isCatSelected) return false;

    // Price filter
    if (priceRange === '1' && p.price >= 500) return false;
    if (priceRange === '2' && (p.price < 500 || p.price > 1000)) return false;
    if (priceRange === '3' && (p.price < 1000 || p.price > 2000)) return false;
    if (priceRange === '4' && p.price <= 2000) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'PRICE: LOW TO HIGH') return a.price - b.price;
    if (sortBy === 'PRICE: HIGH TO LOW') return b.price - a.price;
    if (sortBy === 'NEW ARRIVALS') {
      if (a.badge === 'NEW' && b.badge !== 'NEW') return -1;
      if (a.badge !== 'NEW' && b.badge === 'NEW') return 1;
    }
    return 0; // Default Featured (by ID order or unchanged)
  });

  const pageTitle = category === 'all' 
    ? 'All Products' 
    : category === 'men' 
      ? "Men's Collection" 
      : category === 'women' 
        ? "Women's Collection" 
        : category === 'kids'
          ? "Kids' Collection"
          : 'Apparel Collection';

  const productCountText = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} available`;

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
    <div id="collection-page-root">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="curr">{pageTitle}</span>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="page-hero">
        <div className="container">
          <h1>{pageTitle}</h1>
          <p>{productCountText}</p>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          {/* Filters Panel */}
          <aside className="filters-panel">
            <h3>FILTERS</h3>
            <div className="filter-group">
              <h4>CATEGORY</h4>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="f-men" 
                  checked={selectedCats.men} 
                  onChange={() => handleCatCheckboxChange('men')}
                />
                <label htmlFor="f-men">Men ({products.filter(p => p.cat === 'men').length})</label>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="f-women" 
                  checked={selectedCats.women} 
                  onChange={() => handleCatCheckboxChange('women')}
                />
                <label htmlFor="f-women">Women ({products.filter(p => p.cat === 'women').length})</label>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="f-kids" 
                  checked={selectedCats.kids} 
                  onChange={() => handleCatCheckboxChange('kids')}
                />
                <label htmlFor="f-kids">Kids ({products.filter(p => p.cat === 'kids').length})</label>
              </div>
            </div>

            <div className="filter-group">
              <h4>PRICE RANGE</h4>
              <div className="filter-option">
                <input 
                  type="radio" 
                  name="price" 
                  id="pr-all" 
                  checked={priceRange === 'all'} 
                  onChange={() => setPriceRange('all')}
                />
                <label htmlFor="pr-all">All Prices</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  name="price" 
                  id="pr-1" 
                  checked={priceRange === '1'} 
                  onChange={() => setPriceRange('1')}
                />
                <label htmlFor="pr-1">Under ₹500</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  name="price" 
                  id="pr-2" 
                  checked={priceRange === '2'} 
                  onChange={() => setPriceRange('2')}
                />
                <label htmlFor="pr-2">₹500 – ₹1,000</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  name="price" 
                  id="pr-3" 
                  checked={priceRange === '3'} 
                  onChange={() => setPriceRange('3')}
                />
                <label htmlFor="pr-3">₹1,000 – ₹2,000</label>
              </div>
              <div className="filter-option">
                <input 
                  type="radio" 
                  name="price" 
                  id="pr-4" 
                  checked={priceRange === '4'} 
                  onChange={() => setPriceRange('4')}
                />
                <label htmlFor="pr-4">Above ₹2,000</label>
              </div>
            </div>
          </aside>

          {/* Product Grid and Toolbar */}
          <div>
            <div className="shop-toolbar">
              <span className="shop-count">{productCountText}</span>
              <select 
                className="sort-select" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="FEATURED">FEATURED</option>
                <option value="PRICE: LOW TO HIGH">PRICE: LOW TO HIGH</option>
                <option value="PRICE: HIGH TO LOW">PRICE: HIGH TO LOW</option>
                <option value="NEW ARRIVALS">NEW ARRIVALS</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>NO PRODUCTS FOUND</h2>
                <p style={{ color: 'var(--gray)' }}>Try adjusting your filters or browse another category.</p>
              </div>
            ) : (
              <div className="grid-4" id="shopAllGrid">
                {filteredProducts.map(renderProductCard)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
