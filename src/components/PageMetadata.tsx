import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { PRODUCTS } from '../data/products';
import { pageMetadata } from '../lib/page-metadata';

// Apply the same metadata after client navigation as the generated HTML provides on first load.
export default function PageMetadata() {
  const { pathname } = useLocation();
  const { products } = useProducts();
  useEffect(() => {
    const page = pageMetadata(pathname, products.length ? products : PRODUCTS);
    document.title = page.title;
    const meta = (key: string, value: string, attribute = 'name') => {
      let node = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!node) { node = document.createElement('meta'); node.setAttribute(attribute, key); document.head.appendChild(node); }
      node.setAttribute('content', value);
    };
    meta('description', page.description); meta('robots', page.robots);
    for (const key of ['title', 'description', 'image'] as const) {
      meta(`og:${key}`, page[key], 'property'); meta(`twitter:${key}`, page[key]);
    }
    meta('og:url', page.canonical, 'property'); meta('og:type', page.type, 'property');
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', page.canonical);
  }, [pathname, products]);
  return null;
}
