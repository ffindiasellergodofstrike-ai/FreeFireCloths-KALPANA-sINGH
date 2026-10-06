import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Truck, RotateCcw, Headphones, Star } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { SHOP_CATEGORIES, homepageProducts, categoryOf } from "../data/catalog-navigation";
import media from "../data/studio-media.json";
import reviews from "../data/studio-reviews.json";
import ProductCard from "../components/ProductCard";
import StoreFilm from "../components/StoreFilm";
import { toast } from "sonner";
import "../studio-home.css";

export default function Home() {
  const { products } = useProducts();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  useEffect(() => {
    document.title = "Free Fire Store – A Fresh Take on Everyday Style";
    document.body.classList.add("studio-home-active");
    return () => document.body.classList.remove("studio-home-active");
  }, []);
  const kurtis = products.filter(p => p.collection === "kurtis");
  const shown = homepageProducts(products);
  const piece = (id: number) => kurtis.find(p => p.id === -(300000000 + id));
  const departments = [
    { id: 'men', title: 'Men', image: products.find(p => p.id === 304)?.images?.[0], note: 'Everyday shirts, considered layers and easy essentials.' },
    { id: 'women', title: 'Women', image: products.find(p => p.id === 302)?.images?.[0], note: 'Discover dresses, tops, kurtis and everything in between.' },
  ];
  const handleNewsletterSubmit = () => {
    if (newsletterEmail.trim()) {
      toast.success("✓ SUBSCRIBED! WELCOME TO Free Fire Store");
      setNewsletterEmail("");
    } else toast.error("Please enter a valid email address.");
  };
  return (
    <div className="store-edit studio-home" id="home-page-root">
      <section className="studio-hero" aria-labelledby="studio-hero-title">
        <StoreFilm {...media.hero} label="the new collection film" priority />
        <div className="studio-hero-shade" />
        <div className="studio-hero-copy">
          <span className="studio-kicker">THE NEW FREE FIRE STORE EDIT</span>
          <h1 id="studio-hero-title">Tradition,<br /><em>with a twist.</em></h1>
          <p>Familiar textures. Unexpected details.<br />Find a little more of yourself in what you wear.</p>
          <div className="studio-actions">
            <a className="studio-button studio-button-light" href="#shop-departments">Shop Men & Women <ArrowUpRight size={18} /></a>
            <a className="studio-text-link" href="#in-motion">Explore the lookbook <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="studio-hero-bottom"><span>01 / THE EVERYDAY, REIMAGINED</span><span>MEN · WOMEN · EVERYDAY STYLE</span></div>
      </section>

      <div className="studio-ribbon" aria-label="Collection highlights">
        <span>Fresh silhouettes</span><span aria-hidden="true">✳</span><span>Your kind of everyday</span><span aria-hidden="true">✳</span><span>Old favourites. Fresh arrivals.</span>
      </div>

      <section className="studio-section studio-introduction" id="shop-departments">
        <span className="studio-kicker">YOUR WARDROBE STARTS HERE</span>
        <h2>For every side <em>of you.</em></h2>
        <p>Explore the complete collection. Find your fit, your favourites, your everyday.</p>
        <div className="studio-edits studio-departments">
          {departments.map(department => <Link to={`/collections/${department.id}`} className="studio-edit-card" key={department.id}>
            <div className="studio-edit-photo"><img src={department.image} alt={`${department.title} collection`} loading="lazy" /><span>Shop {department.title} <ArrowUpRight size={18} /></span></div>
            <div className="studio-department-title"><h3>{department.title}</h3><span>{products.filter(p => p.cat === department.id).length} products <ArrowUpRight size={17} /></span></div>
            <p>{department.note}</p>
          </Link>)}
        </div>
      </section>

      <section className="studio-section studio-arrivals" id="new-edit" aria-labelledby="new-edit-title">
        <div className="studio-section-heading">
          <div><span className="studio-kicker">THE EVERYDAY SELECTION</span><h2 id="new-edit-title">Old favourites.<br /><em>New possibilities.</em></h2></div>
          <div><p>A little new. A little familiar. Made for your wardrobe.</p><Link className="studio-text-link" to="/collections/all">Shop all {products.length} products <ArrowUpRight size={17} /></Link></div>
        </div>
        <div className="studio-product-grid">{shown.map(product => <ProductCard key={product.id} product={product} />)}</div>
        <div className="studio-browse-actions"><Link className="studio-button" to="/collections/men">Shop all Men <ArrowUpRight size={17} /></Link><Link className="studio-button" to="/collections/women">Shop all Women <ArrowUpRight size={17} /></Link></div>
      </section>

      <section className="studio-lookbook" id="in-motion" aria-labelledby="lookbook-title">
        <div className="studio-lookbook-film"><img src={piece(2)?.images?.[0]} alt="A closer look at the floral kurti collection" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        <div className="studio-lookbook-copy">
          <span className="studio-kicker">THE LOOKBOOK · IN DETAIL</span>
          <h2>Out of the ordinary.<br /><em>Into your everyday.</em></h2>
          <p>Fresh florals, thoughtful details and easy silhouettes. Find your next favourite in the kurti collection.</p>
          <Link className="studio-button" to="/collections/kurtis">Explore the kurti collection <ArrowUpRight size={18} /></Link>
          {piece(2) && <Link className="studio-lookbook-detail" to="/collections/kurtis">
            <img src={piece(2)?.images?.[1]} alt="A closer look at the kurti collection" loading="lazy" />
            <span>It's all in the details.<small>Explore the fit, print & finish <ArrowUpRight size={14} /></small></span>
          </Link>}
        </div>
      </section>

      <section className="studio-section studio-reviews" aria-labelledby="studio-reviews-title">
        <span className="studio-kicker">NOTES ON THE COLLECTION</span><h2 id="studio-reviews-title">A few words, <em>on the details.</em></h2>
        <p className="studio-review-disclosure">Imported product reviews. These are not verified Free Fire Store purchases.</p>
        <div className="studio-review-grid">{reviews.filter(review => products.some(product => product.id === review.storeProductId)).map(review => <figure key={review.id}>
          <div className="studio-review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, i) => <Star key={i} size={13} fill="currentColor" />)}</div>
          <blockquote>“{review.text}”</blockquote>
          <figcaption>{review.author}<span>{review.date}</span></figcaption>
          <Link to={`/product/${review.storeProductId}`}>{review.productName} <ArrowUpRight size={14} /></Link>
        </figure>)}</div>
      </section>

      <section className="studio-wardrobe studio-section">
        <span className="studio-kicker">THERE'S MORE TO YOUR WARDROBE</span><h2>Find your next <em>favourite.</em></h2>
        <nav className="studio-collection-links" aria-label="Explore all collections">
          {SHOP_CATEGORIES.filter(c => products.some(p => categoryOf(p) === c.id)).map(c => <Link key={c.id} to={`/collections/${c.id}`}>{c.label} <ArrowUpRight size={16} /></Link>)}
          {["men", "women", "kids"].map(cat => <Link key={cat} to={`/collections/${cat}`}>{cat} <ArrowUpRight size={16} /></Link>)}
        </nav>

        <Link className="studio-button" to="/collections/all">Explore the complete store <ArrowRight size={18} /></Link>
      </section>

      <div className="edit-promises studio-promises">
        <Link to="/policies/shipping"><Truck size={21} /><span><strong>Delivery, explained</strong><small>Explore our shipping policy</small></span><ArrowUpRight size={16} /></Link>
        <Link to="/policies/refund"><RotateCcw size={21} /><span><strong>Shop with confidence</strong><small>Our returns & cancellation policy</small></span><ArrowUpRight size={16} /></Link>
        <Link to="/contact"><Headphones size={21} /><span><strong>A real person to help</strong><small>Get in touch with Free Fire Store</small></span><ArrowUpRight size={16} /></Link>
      </div>
      <section className="newsletter studio-newsletter" id="newsletter-section">
        <div className="container"><span className="studio-kicker">STAY A LITTLE CLOSER</span><h2>A little style in your inbox.</h2><p>New launches, wardrobe inspiration and updates from Free Fire Store.</p>
          <div className="nl-form"><input type="email" aria-label="Newsletter email" placeholder="Your email address" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} /><button onClick={handleNewsletterSubmit}>SUBSCRIBE <ArrowRight size={16} /></button></div>
        </div>
      </section>
    </div>
  );
}
