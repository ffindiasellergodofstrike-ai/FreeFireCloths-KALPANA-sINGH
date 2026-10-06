import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { COLLECTIONS, PRICE_EDITS } from "../data/reference-products";
import ProductCard from "../components/ProductCard";
import { toast } from "sonner";

export default function Home() {
  const { products } = useProducts();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  useEffect(() => {
    document.title = "Free Fire Store – Premium Fashion & Apparel";
  }, []);
  const hero = products.find((p) => p.sourceId === 1951272);
  const second = products.find((p) => p.collection === "co-ords");
  const featured = PRICE_EDITS.flatMap((price) => {
    const product = products.find((p) => p.sourceId && p.price === price);
    return product ? [product] : [];
  });
  const handleNewsletterSubmit = () => {
    if (newsletterEmail.trim()) {
      toast.success("✓ SUBSCRIBED! WELCOME TO Free Fire Store");
      setNewsletterEmail("");
    } else toast.error("Please enter a valid email address.");
  };
  return (
    <div className="store-edit" id="home-page-root">
      <section className="edit-hero">
        <div className="edit-copy">
          <span className="edit-eyebrow">THE FREE FIRE STORE EDIT</span>
          <h1>
            Your everyday.
            <br />
            <em>Anything but ordinary.</em>
          </h1>
          <p>
            From an easy morning to an evening out. Discover pieces that feel
            like you, at prices you can feel good about.
          </p>
          <div className="edit-actions">
            <Link className="edit-button" to="/collections/all">
              Find your next favourite <ArrowUpRight size={18} />
            </Link>
            <a className="edit-link" href="#shop-categories">
              Shop by category <ArrowRight size={16} />
            </a>
          </div>
          <span className="edit-eyebrow edit-footnote">
            YOUR STYLE. YOUR OWN WAY.
          </span>
        </div>
        <div className="edit-images">
          {hero && (
            <Link className="edit-main" to={`/product/${hero.id}`}>
              <img
                src={hero.images?.[0]}
                alt={hero.name}
                fetchPriority="high"
              />
              <span>
                The statement edit <ArrowUpRight size={18} />
              </span>
            </Link>
          )}
          {second && (
            <Link className="edit-inset" to="/collections/co-ords">
              <img
                src={second.images?.[0]}
                alt="Explore matching co-ord sets"
              />
              <span>
                Better together <ArrowUpRight size={16} />
              </span>
            </Link>
          )}
          <span className="edit-stamp" aria-hidden="true">
            Everyday<small>WITH A LITTLE EXTRA</small>
          </span>
        </div>
      </section>
      <div className="edit-promises">
        <Link to="/policies/shipping">
          <Truck size={21} />
          <span>
            <strong>Delivery, explained</strong>
            <small>Explore our shipping policy</small>
          </span>
          <ArrowUpRight size={16} />
        </Link>
        <Link to="/policies/refund">
          <RotateCcw size={21} />
          <span>
            <strong>Shop with confidence</strong>
            <small>Our returns & cancellation policy</small>
          </span>
          <ArrowUpRight size={16} />
        </Link>
        <Link to="/contact">
          <Headphones size={21} />
          <span>
            <strong>A real person to help</strong>
            <small>Get in touch with Free Fire Store</small>
          </span>
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <section className="edit-section" id="shop-categories">
        <div className="edit-heading">
          <div>
            <span className="edit-eyebrow">FIND YOUR KIND OF STYLE</span>
            <h2>Start with what you love.</h2>
          </div>
          <Link className="edit-link" to="/collections/all">
            Explore everything <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="edit-categories">
          {COLLECTIONS.map((c, index) => {
            const product = products.find((p) => p.collection === c.id);
            return (
              <Link key={c.id} to={`/collections/${c.id}`}>
                <div>
                  <img
                    src={product?.images?.[0]}
                    alt={c.label}
                    loading="lazy"
                  />
                  <b>0{index + 1}</b>
                </div>
                <h3>
                  {c.label}
                  <ArrowUpRight size={18} />
                </h3>
                <p>{c.note}</p>
              </Link>
            );
          })}
        </div>
        <div className="edit-departments">
          <span>More to explore</span>
          {["men", "women", "kids"].map((cat) => (
            <Link key={cat} to={`/collections/${cat}`}>
              {cat} <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </section>
      <section className="edit-prices edit-section">
        <div>
          <span className="edit-eyebrow">GREAT FINDS. YOUR BUDGET.</span>
          <h2>A little wardrobe joy.</h2>
          <p>Four price edits. Plenty of ways to make them yours.</p>
        </div>
        <div>
          {PRICE_EDITS.map((price) => (
            <Link key={price} to={`/collections/all?price=${price}`}>
              <small>THE</small>
              <strong>₹{price.toLocaleString("en-IN")}</strong>
              <span>
                edit <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="edit-section">
        <div className="edit-heading">
          <div>
            <span className="edit-eyebrow">A PIECE FROM EVERY PRICE EDIT</span>
            <h2>Meet your next favourites.</h2>
          </div>
          <Link className="edit-link" to="/collections/new">
            Discover new arrivals <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="grid-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="edit-section">
        <div className="edit-heading">
          <div>
            <span className="edit-eyebrow">THE FREE FIRE STORE FAVOURITES</span>
            <h2>Always in good company.</h2>
          </div>
          <Link className="edit-link" to="/collections/all">
            Shop all pieces <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="grid-4">
          {products
            .filter((p) => p.featured)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="edit-intro edit-section">
        <div>
          <span className="edit-eyebrow">GET TO KNOW FREE FIRE STORE</span>
          <h2>
            Good style starts
            <br />
            with <em>feeling at home.</em>
          </h2>
          <Link className="edit-link" to="/about">
            Our story <ArrowUpRight size={17} />
          </Link>
        </div>
        <div>
          <p>
            Your trusted destination for premium fashion & lifestyle products.
            Delivered across India with love.
          </p>
          <a href="mailto:connectwithgarena@gmail.com">
            connectwithgarena@gmail.com <ArrowUpRight size={16} />
          </a>
          <Link to="/contact">
            Meet the business & get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="newsletter" id="newsletter-section">
        <div className="container">
          <h2>JOIN THE Free Fire Store FAMILY</h2>
          <p>
            Subscribe for exclusive deals, new launches, and style inspiration —
            straight to your inbox.
          </p>
          <div className="nl-form">
            <input
              type="email"
              aria-label="Newsletter email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button onClick={handleNewsletterSubmit}>SUBSCRIBE</button>
          </div>
        </div>
      </section>
    </div>
  );
}
