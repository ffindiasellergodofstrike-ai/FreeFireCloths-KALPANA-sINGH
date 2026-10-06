import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PRODUCTS } from '../src/data/products';
import { pageMetadata, indexablePaths, sitemapXml, privatePages, escapeMarkup } from '../src/lib/page-metadata';
import site from '../src/config/site.json';
import retiredIds from '../src/data/retired-products.json';
import media from '../docs/catalog-origin-media.json';

test('sitemap lists all active products but no checkout/account/retired pages', () => {
  const paths = indexablePaths(PRODUCTS);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(paths.filter(p => p.startsWith('/product/')).length, PRODUCTS.length);
  for (const p of PRODUCTS) assert.ok(paths.includes(`/product/${p.id}`));
  for (const id of retiredIds) assert.ok(!paths.includes(`/product/${id}`));
  for (const p of Object.keys(privatePages)) assert.ok(!paths.includes(p));
  const xml = sitemapXml(PRODUCTS);
  assert.match(xml, /^<\?xml/);
  assert.equal((xml.match(/<loc>/g) || []).length, paths.length);
  assert.ok(xml.includes(`<loc>${site.origin}/product/-1881672</loc>`));
});

test('metadata follows the page, canonical domain and index eligibility', () => {
  const product = pageMetadata('/product/-1881672', PRODUCTS);
  assert.match(product.title, /^Textured Cardigen/);
  assert.equal(product.type, 'product');
  assert.equal(product.canonical, `${site.origin}/product/-1881672`);
  assert.equal(product.robots, 'index, follow');
  assert.equal(pageMetadata('/product/99999999', PRODUCTS).robots, 'noindex, follow');
  for (const p of Object.keys(privatePages)) assert.equal(pageMetadata(p, PRODUCTS).robots, 'noindex, follow');
  assert.equal(pageMetadata('/not-real', PRODUCTS).found, false);
  assert.match(pageMetadata('/collections/women/', PRODUCTS).title, /^Women/);
  assert.equal(pageMetadata('/', PRODUCTS).image, site.image);
  assert.equal(escapeMarkup('"<&\'>'), '&quot;&lt;&amp;&#39;&gt;');
});

test('public routes exclude archived checkout and web output excludes server bundle', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  assert.doesNotMatch(app, /garena.?checkout|codashop/i);
  assert.match(readFileSync('archive/legacy-checkout-routes.tsx', 'utf8'), /GarenaCheckout/);
  assert.match(readFileSync('src/pages/GarenaCheckout.tsx', 'utf8'), /CODASHOP_URL/);
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.match(pkg.scripts.build, /--outfile=build\/server\.cjs/);
  assert.equal(pkg.scripts.start, 'node build/server.cjs');
  const deployment = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.equal(deployment.outputDirectory, 'dist');
  assert.equal(deployment.rewrites.find((r: { source: string }) => r.source.startsWith('/product/')).destination, '/product-fallback');
  assert.ok(!deployment.rewrites.some((r: { source: string }) => r.source === '/(.*)'));
  assert.ok(readFileSync('public/robots.txt', 'utf8').includes(`Sitemap: ${site.origin}/sitemap.xml`));
});

test('all previous media origins have verified same-content hosted replacements', () => {
  assert.equal(media.assets.length, 291);
  assert.equal(new Set(media.assets.map(a => a.source)).size, 291);
  for (const asset of media.assets) {
    assert.equal(asset.verified, true);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    assert.ok(asset.bytes > 0);
    assert.match(asset.url, /^https:\/\/res\.cloudinary\.com\/smi5oqr3\/image\/upload\//);
  }
  for (const file of ['src/data/products.ts', 'src/data/imported_dresses.ts', 'src/data/media-exclusions.json', 'src/components/Footer.tsx']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /ownd\.in|img201\.savana\.com|cdn\.shopify\.com/);
  }
});
