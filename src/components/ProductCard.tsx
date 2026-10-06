import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const savings = product.orig 
    ? Math.round(((product.orig - product.price) / product.orig) * 100) 
    : 0;

  const fullStars = Math.max(0, Math.min(5, Math.floor(product.rating)));
  const emoji = product.cat === 'men' ? '👕' : product.cat === 'women' ? '👗' : '💻';

  const optimizeUnsplash = (url: string, width: number, quality: number = 80) => {
    if (!url) return url;
    if (url.includes('images.unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
    }
    return url;
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card" id={`product-card-${product.id}`}>
      <div className="pc-img">
        <span className="pc-image-fallback" aria-hidden="true">{product.name}</span>
        {product.images && product.images.length > 0 ? (
          <img 
            src={optimizeUnsplash(product.images[0], 400, 80)} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.hidden = true;
            }}
          />
        ) : (
          <div className={`ph ph-${product.cat}`} style={{ width: '100%', height: '100%', fontSize: '52px' }}>
            {emoji}
            <span>{product.name.split(' ').slice(0, 2).join(' ').toUpperCase()}</span>
          </div>
        )}
        <div className="pc-badges">
          {product.badge && <span className={`badge ${product.badge === 'SALE' ? 'badge-sale' : 'badge-new'}`}>{product.badge}</span>}
          {savings > 0 && <span className="badge badge-sale">-{savings}%</span>}
        </div>
        <span className="pc-view">Discover this piece ↗</span>
      </div>
      
      <div className="pc-body">
        <div className="pc-cat">{(product.collection || product.cat).toUpperCase()}</div>
        <div className="pc-name">{product.name}</div>
        <div className="pc-price">
          <span className="price-now">₹{product.price.toLocaleString('en-IN')}</span>
          {product.orig > product.price && <span className="price-was">₹{product.orig.toLocaleString('en-IN')}</span>}
          {savings > 0 && <span className="price-save">{savings}% OFF</span>}
        </div>
        {product.reviews > 0 && <div className="pc-stars">
          {'★'.repeat(fullStars) + '☆'.repeat(5 - fullStars)}
          <span>({product.reviews}){product.sourceId ? ' · Imported reviews' : ''}</span>
        </div>}
      </div>
    </Link>
  );
}
