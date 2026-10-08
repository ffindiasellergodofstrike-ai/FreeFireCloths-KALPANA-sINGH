import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Heart } from 'lucide-react';

export default function AccountIntro({ register = false }: { register?: boolean }) {
  return <aside className="account-intro">
    <Link to="/" className="account-wordmark">FREE FIRE STORE</Link>
    <span className="edit-eyebrow">CLOTHING &amp; APPAREL</span>
    <h1>{register ? <>Make room for<br /><em>something you.</em></> : <>Good to have<br /><em>you back.</em></>}</h1>
    <p>Your favourites, your next find, your own little corner of the store.</p>
    <ul><li><ShoppingBag size={20} /> Keep your purchases in one place</li><li><Truck size={20} /> Follow your order and delivery details</li><li><Heart size={20} /> Discover your everyday favourites</li></ul>
    <Link to="/collections/all" className="account-back">Explore the collection ↗</Link>
  </aside>;
}
