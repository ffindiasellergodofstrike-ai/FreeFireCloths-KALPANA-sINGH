import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Truck, RotateCcw, Headphones, Star } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { COLLECTIONS, PRICE_EDITS } from "../data/reference-products";
import { KURTI_STYLES } from "../data/kurti-products";
import media from "../data/studio-media.json";
import reviews from "../data/studio-reviews.json";
import ProductCard from "../components/ProductCard";
import StoreFilm from "../components/StoreFilm";
import { toast } from "sonner";
import "../studio-home.css";

export default function Home() {
  const { products } = useProducts();
  const [style, setStyle] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  useEffect(() => {
    document.title = "Free Fire Store – A Fresh Take on Everyday Style";
    document.body.classList.add("studio-home-active");
    return () => document.body.classList.remove("studio-home-active");
  }, []);
  const kurtis = products.filter(p => p.collection === "kurtis");
  const shown = kurtis.filter(p => style === "All" || p.styleTags?.includes(style));
  const piece = (id: number) => kurtis.find(p => p.id === -(300000000 + id));
  const edits = [
    { id: 9, image: 0, title: "The halter edit", note: "A little detail. A whole new mood.", tag: "Halter Neck" },
    { id: 3, image: 1, title: "Say it with florals", note: "Romantic prints, modern silhouettes.", tag: "Floral" },
    { id: 1, image: 1, title: "A different perspective", note: "Tie-back details worth turning for.", tag: "One Shoulder" },
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
            <a className="studio-button studio-button-light" href="#new-edit">Explore the collection <ArrowUpRight size={18} /></a>
            <a className="studio-text-link" href="#in-motion">Watch the lookbook <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="studio-hero-bottom"><span>01 / THE EVERYDAY, REIMAGINED</span><span>KURTIS · PRINTS · LITTLE DETAILS</span></div>
      </section>

      <div className="studio-ribbon" aria-label="Collection highlights">
        <span>Fresh silhouettes</span><span aria-hidden="true">✳</span><span>Your kind of everyday</span><span aria-hidden="true">✳</span><span>Nine new pieces to discover</span>
      </div>

      <section className="studio-section studio-introduction">
        <span className="studio-kicker">A LITTLE FAMILIAR. A LITTLE UNEXPECTED.</span>
        <h2>For every side <em>of you.</em></h2>
        <p>The brunch plans. The long afternoons. The evenings that turn into stories.<br className="studio-desktop-break" /> Meet prints, tie-backs and easy silhouettes that make getting dressed feel like you.</p>
        <div className="studio-edits">
          {edits.map(edit => {
            const product = piece(edit.id);
            return product && <a href="#new-edit" className="studio-edit-card" key={edit.id} onClick={() => setStyle(edit.tag)}>
              <div className="studio-edit-photo"><img src={product.images?.[edit.image]} alt={product.name} loading="lazy" /><span>Explore the edit <ArrowUpRight size={18} /></span></div>
              <h3>{edit.title}</h3><p>{edit.note}</p>
            </a>;
          })}
        </div>
      </section>

      <section className="studio-section studio-arrivals" id="new-edit" aria-labelledby="new-edit-title">
        <div className="studio-section-heading">
          <div><span className="studio-kicker">THE KURTI COLLECTION</span><h2 id="new-edit-title">Small details.<br /><em>Big personality.</em></h2></div>
          <div><p>Nine pieces. Endless ways to wear them.</p><Link className="studio-text-link" to="/collections/kurtis">Shop all kurtis <ArrowUpRight size={17} /></Link></div>
        </div>
        <div className="studio-style-tabs" role="group" aria-label="Filter kurti styles">
          {KURTI_STYLES.map(tag => <button type="button" key={tag} aria-pressed={style === tag} onClick={() => setStyle(tag)}>{tag === "All" ? "All pieces" : tag}</button>)}
          <span role="status">{shown.length} pieces</span>
        </div>
        <div className="studio-product-grid">{shown.map(product => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="studio-lookbook" id="in-motion" aria-labelledby="lookbook-title">
        <div className="studio-lookbook-film"><StoreFilm {...media.indigo} label="the indigo styling film" /></div>
        <div className="studio-lookbook-copy">
          <span className="studio-kicker">THE LOOKBOOK · IN MOTION</span>
          <h2>Out of the ordinary.<br /><em>Into your everyday.</em></h2>
          <p>A splash of indigo, an open back, a day with no set plans. See how the details come together beyond the studio.</p>
          <Link className="studio-button" to="/product/-300000009">Discover the indigo kurti <ArrowUpRight size={18} /></Link>
          {piece(9) && <Link className="studio-lookbook-detail" to="/product/-300000009">
            <img src={piece(9)?.images?.[1]} alt="Tie-back detail of the indigo kurti" loading="lazy" />
            <span>It's all in the details.<small>Explore the fit, print & finish <ArrowUpRight size={14} /></small></span>
          </Link>}
        </div>
      </section>

      <section className="studio-section studio-reviews" aria-labelledby="studio-reviews-title">
        <span className="studio-kicker">NOTES ON THE COLLECTION</span><h2 id="studio-reviews-title">A few words, <em>on the details.</em></h2>
        <p className="studio-review-disclosure">Imported product reviews. These are not verified Free Fire Store purchases.</p>
        <div className="studio-review-grid">{reviews.map(review => <figure key={review.id}>
          <div className="studio-review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, i) => <Star key={i} size={13} fill="currentColor" />)}</div>
          <blockquote>“{review.text}”</blockquote>
          <figcaption>{review.author}<span>{review.date}</span></figcaption>
          <Link to={`/product/${review.storeProductId}`}>{review.productName} <ArrowUpRight size={14} /></Link>
        </figure>)}</div>
      </section>

      <section className="studio-wardrobe studio-section">
        <span className="studio-kicker">THERE'S MORE TO YOUR WARDROBE</span><h2>Find your next <em>favourite.</em></h2>
        <nav className="studio-collection-links" aria-label="Explore all collections">
          {COLLECTIONS.map(c => <Link key={c.id} to={`/collections/${c.id}`}>{c.label} <ArrowUpRight size={16} /></Link>)}
          {["men", "women", "kids"].map(cat => <Link key={cat} to={`/collections/${cat}`}>{cat} <ArrowUpRight size={16} /></Link>)}
        </nav>
        <div className="studio-price-links"><span>Shop by price</span>{PRICE_EDITS.map(price => <Link key={price} to={`/collections/all?price=${price}`}>The ₹{price.toLocaleString("en-IN")} edit</Link>)}</div>
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
