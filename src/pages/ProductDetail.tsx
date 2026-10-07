import { isImportedOptionAvailable } from '../data/reference-products';
import { catalogImages } from '../data/catalog-media';
import ProductReviews from '../components/ProductReviews';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const product = products.find(p => p.id === Number(id));

  // Determine available colors
  const availableColors = product?.colors && product.colors.length > 0 
    ? product.colors 
    : Array.from(new Set(product?.variants?.map(v => v.color).filter(Boolean) as string[] || []));

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [qty, setQty] = useState<number>(1);
  const [activeThumb, setActiveThumb] = useState<number>(1);

  // Reset page state, scroll to top smoothly, and dynamically set Open Graph metadata for WhatsApp/Facebook/Instagram scraping
  useEffect(() => {
    const defaultColor = (product?.sourceId ? product.variants?.find(v => v.stock !== 0)?.color : undefined) || availableColors[0] || '';
    setSelectedColor(defaultColor);
    setSelectedSize('');
    setQty(1);
    setActiveThumb(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [id, product]);

  // Determine images to display: ONLY images for the selected color variant
  const getDisplayedImages = (): string[] => {
    if (!product) return [];
    if (selectedColor && product.variantImages && product.variantImages[selectedColor] && product.variantImages[selectedColor].length > 0) {
      return product.variantImages[selectedColor];
    }
    const colorVariant = product.variants?.find(v => v.color === selectedColor);
    if (colorVariant?.image) {
      return [colorVariant.image];
    }
    return product.images || [];
  };

  const displayedImages = catalogImages(getDisplayedImages());

  const optimizeUnsplash = (url: string, width: number, quality: number = 80) => {
    if (!url) return url;
    if (url.includes('images.unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
    }
    return url;
  };

  const nextSlide = () => {
    if (displayedImages && displayedImages.length > 0) {
      setActiveThumb(prev => (prev >= displayedImages.length ? 1 : prev + 1));
    }
  };

  const prevSlide = () => {
    if (displayedImages && displayedImages.length > 0) {
      setActiveThumb(prev => (prev <= 1 ? displayedImages.length : prev - 1));
    }
  };

  // Auto-slide effect
  useEffect(() => {
    if (!displayedImages || displayedImages.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [displayedImages, activeThumb]);

  // Touch Swipe Handlers
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleShareProduct = async () => {
    if (!product) return;
    const shareUrl = window.location.href;
    const shareText = `Check out ${product.name} at Free Fire Store – ₹${product.price}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} – Free Fire Store`,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // Fallback
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Product link copied to clipboard!');
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || !product) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // 50px threshold for swipe
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>PRODUCT NOT FOUND</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>The product you are looking for does not exist or has been removed.</p>
        <Link to="/collections/all" className="btn btn-black">BACK TO SHOP</Link>
      </div>
    );
  }

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const disc = product.orig ? Math.round(((product.orig - product.price) / product.orig) * 100) : 0;
  const emoji = product.cat === 'men' ? '👕' : product.cat === 'women' ? '👗' : '💻';

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleQtyChange = (delta: number) => {
    setQty(prev => Math.max(1, prev + delta));
  };

  const handleAddCurrentToCart = () => {
    if (!selectedSize && product.sizes[0] !== 'ONE SIZE' && product.sizes[0] !== 'FREE SIZE') {
      toast.warning('⚠ PLEASE SELECT A SIZE');
      return;
    }
    const size = selectedSize || product.sizes[0];
    if (!isImportedOptionAvailable(product, size, selectedColor)) {
      toast.warning('This size and colour is unavailable. Please choose another option.');
      return;
    }
    const customImage = displayedImages && displayedImages.length > 0 ? displayedImages[0] : undefined;
    addToCart(product, size, qty, selectedColor, customImage);
  };

  const handleBuyNow = () => {
    if (!selectedSize && product.sizes[0] !== 'ONE SIZE' && product.sizes[0] !== 'FREE SIZE') {
      toast.warning('⚠ PLEASE SELECT A SIZE');
      return;
    }
    const size = selectedSize || product.sizes[0];
    if (!isImportedOptionAvailable(product, size, selectedColor)) {
      toast.warning('This size and colour is unavailable. Please choose another option.');
      return;
    }
    const customImage = displayedImages && displayedImages.length > 0 ? displayedImages[0] : undefined;
    if (product.sourceId) {
      // A's cart checkout already preserves quantity, colour and chosen image.
      addToCart(product, size, qty, selectedColor, customImage);
      navigate('/checkout');
      return;
    }
    navigate('/checkout', { state: { product, size, qty, color: selectedColor, customImage } });
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === 'electronics' || cat === 'accessories') return 'Electronics & Accessories';
    if (cat === 'men') return "Men's Collection";
    if (cat === 'women') return "Women's Collection";
    if (cat === 'kids') return "Kids' Collection";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div id="product-detail-page-root">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to={`/collections/${product.cat}`}>{getCategoryLabel(product.cat)}</Link>
            <span className="sep">/</span>
            <span className="curr" title={product.name}>{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="pd-layout">
          {/* Gallery */}
          <div className="pd-gallery">
            <div 
              className="pd-main-img" 
              id="pdMainImg"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ position: 'relative', cursor: 'grab', userSelect: 'none', overflow: 'hidden' }}
            >
              {displayedImages && displayedImages.length > 0 ? (
                <>
                  <img 
                    src={optimizeUnsplash(displayedImages[Math.min(activeThumb - 1, displayedImages.length - 1)], 600, 85)} 
                    alt={`${product.name} ${selectedColor}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  {displayedImages.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }} 
                        className="gallery-nav-btn prev"
                        aria-label="Previous image"
                        type="button"
                      >
                        <i className="fa fa-chevron-left"></i>
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }} 
                        className="gallery-nav-btn next"
                        aria-label="Next image"
                        type="button"
                      >
                        <i className="fa fa-chevron-right"></i>
                      </button>
                      
                      {/* Dots indicators inside image */}
                      <div className="gallery-dots">
                        {displayedImages.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`gallery-dot ${activeThumb === idx + 1 ? 'active' : ''}`}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveThumb(idx + 1); }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className={`ph ph-${product.cat}`} style={{ width: '100%', height: '100%', fontSize: '100px' }}>
                  {emoji}
                  <span>{product.name.split(' ').slice(0, 2).join(' ').toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <div className="pd-thumbs" id="pdThumbs" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {displayedImages && displayedImages.length > 0 ? (
                displayedImages.map((imgUrl, i) => (
                  <div 
                    key={i}
                    className={`pd-thumb ${activeThumb === i + 1 ? 'active' : ''}`} 
                    onClick={() => setActiveThumb(i + 1)}
                  >
                    <img 
                      src={optimizeUnsplash(imgUrl, 120, 80)} 
                      alt={`${product.name} Thumb ${i + 1}`} 
                      referrerPolicy="no-referrer" 
                      loading="lazy" 
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div 
                    key={i}
                    className={`pd-thumb ${activeThumb === i ? 'active' : ''}`} 
                    onClick={() => setActiveThumb(i)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', background: 'var(--light)' }}
                  >
                    {emoji}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="badge badge-new" id="pdCategory">{product.cat.toUpperCase()}</span>
              {product.badge && <span className={`badge ${product.badge === 'SALE' ? 'badge-sale' : 'badge-new'}`} id="pdBadge">{product.badge}</span>}
            </div>

            <h1 id="pdName">{product.name}</h1>

            {product.reviews > 0 && <div className="pd-rating">
              <span className="pd-stars">{'★'.repeat(Math.max(0, Math.min(5, Math.round(product.rating))))}</span>
              <span className="pd-revcount" id="pdRating">({product.rating}) · {product.reviews} reviews</span>
            </div>}

            <div className="pd-price" id="pdPrice">
              {fmt(product.price)}
              {product.orig > product.price && <span className="was">{fmt(product.orig)}</span>}
              {disc > 0 && <span className="save">SAVE {disc}%</span>}
            </div>

            <p className="pd-desc" id="pdDesc">{product.desc}</p>

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div className="pd-section-label">
                  COLOR: <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{selectedColor || availableColors[0]}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {availableColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                      aria-pressed={selectedColor === color}
                      disabled={Boolean(product.sourceId) && !product.variants?.some(v => v.color === color && v.stock !== 0)}
                      onClick={() => {
                        setSelectedColor(color);
                        if (product.sourceId) setSelectedSize('');
                        setActiveThumb(1);
                      }}
                      style={{
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        borderRadius: '4px',
                        border: selectedColor === color ? '2px solid #000' : '1px solid #ddd',
                        background: selectedColor === color ? '#000' : '#fff',
                        color: selectedColor === color ? '#fff' : '#222',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textTransform: 'uppercase'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pd-section-label">SELECT SIZE</div>
            <div className="size-grid" id="pdSizes">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`} 
                  onClick={() => handleSizeSelect(size)}
                  aria-pressed={selectedSize === size}
                  disabled={!isImportedOptionAvailable(product, size, selectedColor)}
                >
                  {size}
                </button>
              ))}
            </div>

            {product.sizeChart && product.sizeChart.length > 0 && (
              <details className="studio-size-guide">
                <summary>Size & fit guide <span>Measurements in inches</span></summary>
                <div className="studio-size-table">
                  <table>
                    <caption>{product.name} — size measurements</caption>
                    <thead><tr><th scope="col">Size</th><th scope="col">Bust</th><th scope="col">Waist</th><th scope="col">Hips</th></tr></thead>
                    <tbody>{product.sizeChart.map(row => (
                      <tr key={row.size}><th scope="row">{row.size}</th><td>{row.bust || '—'}</td><td>{row.waist || '—'}</td><td>{row.hips || '—'}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </details>
            )}

            <div className="qty-row">
              <div className="pd-section-label" style={{ marginBottom: 0 }}>QTY</div>
              <div className="qty-ctrl">
                <button onClick={() => handleQtyChange(-1)}>−</button>
                <span id="pdQty">{qty}</span>
                <button onClick={() => handleQtyChange(1)}>+</button>
              </div>
            </div>

            <div className="pd-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-black" style={{ flex: '2', minWidth: '160px' }} onClick={handleAddCurrentToCart}>
                ADD TO BAG
              </button>
              <button className="btn btn-buy-now" style={{ flex: '2', minWidth: '160px' }} onClick={handleBuyNow}>
                BUY NOW
              </button>
              <button 
                className="btn" 
                onClick={handleShareProduct} 
                title="Share Product on WhatsApp, Instagram, or Facebook"
                style={{ 
                  flex: '1', 
                  minWidth: '50px', 
                  background: '#f1f5f9', 
                  color: '#0f172a', 
                  border: '1px solid #cbd5e1', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa fa-share-alt"></i> SHARE
              </button>
            </div>

            <div className="pd-meta">
              <div className="pd-meta-item"><i className="fa fa-shipping-fast"></i> Free delivery on all orders across India</div>
              <div className="pd-meta-item"><i className="fa fa-undo"></i> Easy 7-day return & exchange policy</div>
              <div className="pd-meta-item"><i className="fa fa-hand-holding-usd"></i> Cash on Delivery (COD) available nationwide</div>
              <div className="pd-meta-item"><i className="fa fa-check-circle"></i> {product.sourceId ? 'Availability shown for each size and colour' : 'In stock — ships in 1–2 business days'}</div>
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />

        {/* Suggested / Related Products Section */}
        {(() => {
          const suggestedProducts = [
            ...products.filter(p => p.cat === product.cat && p.id !== product.id),
            ...products.filter(p => p.cat !== product.cat && p.id !== product.id)
          ].slice(0, 4);

          return suggestedProducts.length > 0 ? (
            <div className="related-products-section" style={{ marginTop: '64px', borderTop: '1px solid var(--border)', paddingTop: '48px', marginBottom: '48px' }}>
              <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '20px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>YOU MAY ALSO LIKE</h2>
              <div style={{ width: '40px', height: '2px', background: 'var(--accent)', margin: '0 auto 32px auto' }}></div>
              <div className="grid-4" id="related-products-grid">
                {suggestedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}
