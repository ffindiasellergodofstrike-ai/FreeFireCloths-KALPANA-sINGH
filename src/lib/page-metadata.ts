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
};
const collections = [{ id: 'all', label: 'All clothing' }, { id: 'new', label: 'New arrivals' }, ...DEPARTMENTS, ...SHOP_CATEGORIES];

export function isProductInStock(product: Product): boolean {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some(v => v.stock !== 0);
  }
  return true;
}

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
  const fullTitle = path === '/' ? homepage.pageTitle : `${title || 'Page not found'} – ${site.name}`;
  const canonical = site.origin + path;
  const robots = found && !privatePages[path] ? 'index, follow' : 'noindex, follow';

  const organizationNode = {
    '@type': 'Organization',
    '@id': `${site.origin}/#organization`,
    name: site.name,
    legalName: 'Kalpana Singh',
    url: site.origin,
    email: 'support@ffstreetwear.shop',
    telephone: '+91-7393845435',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'PRANNATHPUR BACHHARIYA',
      addressLocality: 'Sultanpur',
      addressRegion: 'Uttar Pradesh',
      postalCode: '228171',
      addressCountry: 'IN',
    },
  };
  const websiteNode = {
    '@type': 'WebSite',
    '@id': `${site.origin}/#website`,
    name: site.name,
    url: site.origin,
    publisher: { '@id': `${site.origin}/#organization` },
  };
  const pageType = product
    ? 'ItemPage'
    : collection
      ? 'CollectionPage'
      : path === '/about'
        ? 'AboutPage'
        : path === '/contact'
          ? 'ContactPage'
          : 'WebPage';
  const webPageNode = {
    '@type': pageType,
    '@id': `${canonical}#page`,
    url: canonical,
    name: fullTitle,
    description,
    isPartOf: { '@id': `${site.origin}/#website` },
  };

  const graph: Record<string, unknown>[] = [organizationNode, websiteNode, webPageNode];
  if (product) {
    const productImages = catalogImages(product.images || []);
    const inStock = isProductInStock(product);
    const productNode: Record<string, unknown> = {
      '@type': 'Product',
      '@id': `${canonical}#product`,
      name: product.name,
      description: (product.desc || product.name).replace(/\s+/g, ' ').trim(),
      image: productImages.length > 0 ? productImages : [image],
      sku: String(product.id),
      brand: { '@type': 'Brand', name: site.name },
      category: product.cat,
      offers: {
        '@type': 'Offer',
        url: canonical,
        priceCurrency: 'INR',
        price: String(product.price),
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': `${site.origin}/#organization` },
      },
    };
    if (product.reviews > 0 && product.rating > 0) {
      productNode.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: String(product.rating),
        reviewCount: String(product.reviews),
      };
    }
    graph.push(productNode);
  }

  return {
    title: fullTitle,
    description,
    image,
    type,
    found,
    canonical,
    robots,
    product: product
      ? {
          price: String(product.price),
          currency: 'INR',
          availability: isProductInStock(product) ? 'in stock' : 'out of stock',
        }
      : null,
    schema: {
      '@context': 'https://schema.org',
      '@graph': graph,
    },
  };
}
export function indexablePaths(products: Product[]): string[] {
  return [...Object.keys(publicPages), ...collections.map(c => `/collections/${c.id}`), ...products.map(p => `/product/${p.id}`), ...BLOG_POSTS.map(p => `/blog/${p.id}`)];
}
export const escapeMarkup = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export function sitemapXml(products: Product[]) {
  const productByPath = new Map(products.map(p => [`/product/${p.id}`, p]));
  const urls = indexablePaths(products).map(path => {
    const product = productByPath.get(path);
    const img = product ? catalogImages(product.images || [])[0] : '';
    const imageTag = img ? `<image:image><image:loc>${escapeMarkup(img)}</image:loc></image:image>` : '';
    return `  <url><loc>${escapeMarkup(site.origin + path)}</loc>${imageTag}</url>`;
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + urls.join('\n') + '\n</urlset>\n';
}
