import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { SHOP_CATEGORIES, DEPARTMENTS, categoryOf, collectionProducts } from '../data/catalog-navigation';
import ProductCard from '../components/ProductCard';

export default function Collection() {
  const { category = 'all' } = useParams();
  const [params, setParams] = useSearchParams();
  const { products } = useProducts();
  const [limit, setLimit] = useState(24);
  const sort = params.get('sort') || 'featured';
  const type = params.get('type') || 'all';
  const range = params.get('range') || 'all';
  const department = params.get('department') || 'all';
  const exactPrice = Number(params.get('price')) || 0; // Existing bookmarked filters still work.
  const inDepartment = DEPARTMENTS.some(d => d.id === category);
  const label = DEPARTMENTS.find(d => d.id === category)?.label || SHOP_CATEGORIES.find(c => c.id === category)?.label || (category === 'new' ? 'New arrivals' : 'All products');
  const base = collectionProducts(products, category);
  const categories = SHOP_CATEGORIES.map(c => ({ ...c, count: base.filter(p => categoryOf(p) === c.id).length })).filter(c => c.count);
  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value === 'all' || value === 'featured' ? next.delete(key) : next.set(key, value);
    if (key === 'range') next.delete('price');
    setParams(next);
  };
  useEffect(() => { document.title = `${label} – Free Fire Store`; }, [label]);
  useEffect(() => { setLimit(24); }, [category, params]);
  const items = base.filter(p =>
    (type === 'all' || categoryOf(p) === type) &&
    (inDepartment || department === 'all' || p.cat === department) &&
    (!exactPrice || p.price === exactPrice) &&
    (range !== 'under500' || p.price < 500) &&
    (range !== '500to1000' || (p.price >= 500 && p.price <= 1000)) &&
    (range !== '1000to2000' || (p.price > 1000 && p.price <= 2000)) &&
    (range !== 'over2000' || p.price > 2000)
  ).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : sort === 'new' ? Number(b.badge === 'NEW') - Number(a.badge === 'NEW') : 0);
  const filtered = type !== 'all' || range !== 'all' || (!inDepartment && department !== 'all') || exactPrice > 0;
  return (
    <section className="edit-section edit-collection" id="collection-page-root">
      <div className="edit-collection-title">
        <span className="edit-eyebrow">THE FREE FIRE STORE WARDROBE</span>
        <h1>{label}{inDepartment ? '’s collection' : ''}</h1>
        <p>{base.length} products to explore. Old favourites and fresh arrivals, together.</p>
      </div>
      <nav className="edit-collection-links department-navigation" aria-label="Shop departments">
        {[{ id: 'all', label: 'Shop all' }, ...DEPARTMENTS, { id: 'new', label: 'New arrivals' }].map(d => <Link key={d.id} to={`/collections/${d.id}`} aria-current={category === d.id ? 'page' : undefined}>{d.label}</Link>)}
      </nav>
      <div className="catalog-types" role="group" aria-label="Product categories">
        <button aria-pressed={type === 'all'} onClick={() => setFilter('type', 'all')}>All styles <span>{base.length}</span></button>
        {categories.map(c => <button key={c.id} aria-pressed={type === c.id} onClick={() => setFilter('type', c.id)}>{c.label} <span>{c.count}</span></button>)}
      </div>
      <div className="edit-toolbar catalog-toolbar">
        {!inDepartment && <label>Department<select aria-label="Department" value={department} onChange={e => setFilter('department', e.target.value)}><option value="all">All departments</option>{DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}</select></label>}
        <label>Price range<select aria-label="Price range" value={range} onChange={e => setFilter('range', e.target.value)}>
          <option value="all">All prices</option><option value="under500">Under ₹500</option><option value="500to1000">₹500 – ₹1,000</option><option value="1000to2000">Over ₹1,000 – ₹2,000</option><option value="over2000">Above ₹2,000</option>
        </select></label>
        <label>Sort by<select aria-label="Sort products" value={sort} onChange={e => setFilter('sort', e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="new">New arrivals</option></select></label>
        <span role="status" className="catalog-count">{items.length} products{exactPrice > 0 ? ` · ₹${exactPrice.toLocaleString('en-IN')}` : ''}</span>
        {filtered && <button className="catalog-clear" onClick={() => setParams({})}>Clear filters</button>}
      </div>
      {items.length ? <div className="grid-4" id="shopAllGrid">{items.slice(0, limit).map(p => <ProductCard key={p.id} product={p} />)}</div> : <div className="edit-empty"><h2>No products match these filters.</h2><p>Clear the filters to see the full {label.toLowerCase()} collection.</p><button className="edit-button" onClick={() => setParams({})}>Clear filters</button></div>}
      {items.length > 0 && <div className="edit-load catalog-pagination">
        <p role="status">Showing {Math.min(limit, items.length)} of {items.length} products</p>
        {limit < items.length && <div><button className="edit-button" onClick={() => setLimit(n => n + 24)}>Load more products</button><button className="edit-button edit-outline" onClick={() => setLimit(items.length)}>Show all {items.length} products</button></div>}
      </div>}
    </section>
  );
}
