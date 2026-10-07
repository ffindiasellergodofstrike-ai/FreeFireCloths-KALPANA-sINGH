import site from '../config/site.json';
import homepage from '../config/homepage.json';
import { BLOG_POSTS, type Product } from '../data/products';
import { DEPARTMENTS, SHOP_CATEGORIES } from '../data/catalog-navigation';
import { catalogImages } from '../data/catalog-media';

export const publicPages: Record<string, string> = {
  '/': site.title, '/about': 'About us', '/contact': 'Contact us', '/blog': 'Style Journal',
  '/policies/terms': 'Terms of Service', '/policies/privacy': 'Privacy Policy',
  '/policies/refund': 'Refund Policy', '/policies/shipping': 'Shipping Policy',
};
export const privatePages: Record<string, string> = {
  '/cart': 'Shopping bag', '/checkout': 'Checkout', '/login': 'Sign in',
  '/register': 'Create account', '/my-orders': 'My orders', '/search': 'Search',
  '/payment/success': 'Payment result', '/payment/failure': 'Payment result',
  '/garena-checkout': 'Verification', '/garenacheckout': 'Verification',
  '/GarenaCheckout': 'Verification', '/Garenacheckout': 'Verification',
  '/garenaCheckout': 'Verification',
};
const collections = [{ id: 'all', label: 'All clothing' }, { id: 'new', label: 'New arrivals' }, ...DEPARTMENTS, ...SHOP_CATEGORIES];
export function pageMetadata(pathname: string, products: Product[]) {
  const path = pathname.replace(/\/+$/, '') || '/';
  let title = publicPages[path] || privatePages[path];
  let description = site.description;
  let image = site.image;
  let type = 'website';
  const product = products.find(p => path === `/product/${p.id}`);
  const collection = collections.find(c => path === `/collections/${c.id}`);
  const post = BLOG_POSTS.find(p => path === `/blog/${p.id}`);
  if (product) {
    title = product.name;
    description = (product.desc || product.name).replace(/\s+/g, ' ').slice(0, 200);
    image = catalogImages(product.images || [])[0] || image;
    type = 'product';
  } else if (collection) {
    title = collection.label;
    description = `Explore ${collection.label.toLowerCase()} at ${site.name}. Find available styles, sizes and colours in our clothing collection.`;
  } else if (post) { title = post.title; description = post.excerpt; type = 'article'; }
  const found = Boolean(title);
  return {
    title: path === '/' ? homepage.pageTitle : `${title || 'Page not found'} – ${site.name}`,
    description, image, type, found,
    canonical: site.origin + path,
    robots: found && !privatePages[path] ? 'index, follow' : 'noindex, follow',
  };
}
export function indexablePaths(products: Product[]): string[] {
  return [...Object.keys(publicPages), ...collections.map(c => `/collections/${c.id}`), ...products.map(p => `/product/${p.id}`), ...BLOG_POSTS.map(p => `/blog/${p.id}`)];
}
export const escapeMarkup = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export function sitemapXml(products: Product[]) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + indexablePaths(products).map(path => `  <url><loc>${escapeMarkup(site.origin + path)}</loc></url>`).join('\n') + '\n</urlset>\n';
}
