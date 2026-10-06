// Read-only catalog lookup/checks for editing tools, including AI Studio.
import { PRODUCTS, SOURCE_PRODUCTS } from '../src/data/products';
import { IMPORTED_DRESSES } from '../src/data/imported_dresses';
import homepage from '../src/config/homepage.json';

const activeIds = new Set(PRODUCTS.map(product => product.id));
const dressIds = new Set(IMPORTED_DRESSES.map(product => product.id));
const [command, ...args] = process.argv.slice(2);
if (command === '--check-homepage') {
  const errors: string[] = [];
  const ids = homepage.featured.productIds;
  if (!ids.length || new Set(ids).size !== ids.length) errors.push('Featured IDs must be nonempty and unique.');
  for (const id of ids) if (!activeIds.has(id)) errors.push(`Featured product ${id} is missing or retired.`);
  for (const department of homepage.departments) {
    const product = PRODUCTS.find(product => product.id === department.productId);
    if (!product || product.cat !== department.id) errors.push(`Invalid ${department.id} department cover product.`);
    if (!product?.images?.[department.imageIndex]) errors.push(`Missing ${department.id} department image.`);
  }
  const lookbook = PRODUCTS.find(product => product.id === homepage.lookbook.productId);
  for (const key of ['imageIndex', 'detailImageIndex'] as const) {
    if (!lookbook?.images?.[homepage.lookbook[key]]) errors.push(`Missing lookbook ${key}.`);
  }
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log(`Homepage configuration valid: ${ids.length} active products, ${homepage.departments.length} department covers and lookbook images.`);
} else {
  const query = [command || '', ...args].join(' ').trim().toLowerCase();
  const matches = SOURCE_PRODUCTS.filter(product => product.name.toLowerCase().includes(query) || String(product.id) === query);
  console.log(JSON.stringify(matches.map(product => ({
    storeId: product.id,
    name: product.name,
    active: activeIds.has(product.id),
    price: product.price,
    colors: product.colors || [],
    sizes: product.sizes,
    sourceFile: product.collection === 'kurtis' ? 'src/data/kurti-catalog.json' : product.sourceId ? 'src/data/reference-catalog.json' : dressIds.has(product.id) ? 'src/data/imported_dresses.ts' : 'src/data/products.ts',
    sourceRecordId: product.sourceId || product.id,
    productPage: `/product/${product.id}`,
    featuredOnHome: homepage.featured.productIds.includes(product.id),
  })), null, 2));
  if (!matches.length) process.exitCode = 1;
}
