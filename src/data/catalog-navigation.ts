import type { Product } from './products';

// Presentation taxonomy only: IDs, prices, variants and persisted records stay intact.
export const SHOP_CATEGORIES = [
  { id: 'kurtis', label: 'Kurtis & ethnic wear' },
  { id: 'tops', label: 'Tops & T-shirts' },
  { id: 'shirts', label: 'Shirts' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'trousers', label: 'Trousers & skirts' },
  { id: 'denim', label: 'Denim' },
  { id: 'co-ords', label: 'Co-ords & sets' },
  { id: 'lounge', label: 'Loungewear' },
  { id: 'intimates', label: 'Innerwear' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'other', label: 'More styles' },
];
export const DEPARTMENTS = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kids', label: 'Kids' },
];
export function categoryOf(product: Product): string {
  if (product.collection && SHOP_CATEGORIES.some(c => c.id === product.collection)) return product.collection;
  const name = product.name.toLowerCase();
  if (/kurti|kurta|saree|dupatta/.test(name)) return 'kurtis';
  if (/dress|gown/.test(name)) return 'dresses';
  if (/bra\b|trunks?|underwear|briefs?|boxers?|shapewear/.test(name)) return 'intimates';
  if (/jeans?|denim/.test(name)) return 'denim';
  if (/\bset\b|co-ord/.test(name)) return 'co-ords';
  if (/trouser|pant|chino|skirt|plazzo|palazzo/.test(name)) return 'trousers';
  if (/t-shirt|tee|top|sweatshirt/.test(name)) return 'tops';
  if (/shirt/.test(name)) return 'shirts';
  return 'other';
}
export function collectionProducts(products: Product[], category: string): Product[] {
  if (category === 'all') return products;
  if (category === 'new') return products.filter(p => p.badge === 'NEW');
  if (DEPARTMENTS.some(d => d.id === category)) return products.filter(p => p.cat === category);
  return products.filter(p => categoryOf(p) === category);
}
// Twelve deliberately mixed pieces: five menswear, five older womenswear, two new kurtis.
export function homepageProducts(products: Product[]): Product[] {
  const ids = [304, 301, 305, 302, -300000001, 316, 502, 306, 320, -300000002, 315, 328];
  const picks = ids.map(id => products.find(p => p.id === id)).filter((p): p is Product => Boolean(p));
  for (const product of products) {
    if (picks.length >= 12) break;
    if (!picks.some(p => p.id === product.id)) picks.push(product);
  }
  return picks;
}
