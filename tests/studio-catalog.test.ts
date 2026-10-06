import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { PRODUCTS } from '../src/data/products';
import { KURTI_PRODUCTS } from '../src/data/kurti-products';
import { isImportedOptionAvailable } from '../src/data/reference-products';
import audit from '../docs/studio-catalog-audit.json';
import homeReviews from '../src/data/studio-reviews.json';
import media from '../src/data/studio-media.json';

const digest = (value: string) => createHash('sha256').update(value).digest('hex');

test('all 327 prior product objects are unchanged and nine new IDs cannot collide', () => {
  const old = PRODUCTS.filter(p => p.collection !== 'kurtis');
  assert.equal(old.length, 327);
  assert.equal(digest(JSON.stringify(old)), '329bc7c106e8ff330353c8d295443ee3931abeef644f988a24cb810206e4d15c');
  assert.equal(PRODUCTS.length, 336);
  assert.equal(new Set(PRODUCTS.map(p => p.id)).size, PRODUCTS.length);
  assert.equal(KURTI_PRODUCTS.length, 9);
});

test('all nine products retain source descriptions, prices, galleries, sizes, measurements and stock', () => {
  let galleryCount = 0;
  let variantCount = 0;
  const verified = new Set(Object.values(audit.media).map(m => m.url));
  for (const source of audit.products) {
    const product = KURTI_PRODUCTS.find(p => p.id === source.id)!;
    assert.ok(product);
    assert.equal(product.id, -source.sourceId);
    assert.equal(product.name, source.name);
    assert.equal(product.price, source.price);
    assert.equal(product.orig, source.orig);
    assert.equal(digest(product.desc), source.descriptionSha256);
    assert.deepEqual(product.sizeChart, source.sizeChart);
    assert.equal(product.images?.length, source.imageCount);
    assert.deepEqual(product.sizes, source.sizes.map(v => v.size));
    for (const url of product.images!) assert.ok(verified.has(url), url);
    for (const stock of source.sizes) {
      const variant = product.variants!.find(v => v.size === stock.size)!;
      assert.equal(variant.stock, stock.stock);
      assert.equal(variant.price, product.price, 'The original cart uses the product price');
      assert.equal(isImportedOptionAvailable(product, stock.size, variant.color!), stock.stock > 0);
      assert.deepEqual(product.variantImages![variant.color!], product.images, 'Selected colour retains the full gallery');
      variantCount++;
    }
    galleryCount += product.images!.length;
  }
  assert.equal(galleryCount, 43);
  assert.equal(variantCount, 36);
  assert.equal(isImportedOptionAvailable(KURTI_PRODUCTS[0], 'XS', 'Beige & brown'), false);
  assert.equal(isImportedOptionAvailable(KURTI_PRODUCTS[0], 'M', 'Beige & brown'), true);
});

test('only two published reviews are imported, with explicit provenance and correct product associations', () => {
  let count = 0;
  for (const p of KURTI_PRODUCTS) {
    const data = JSON.parse(readFileSync(`public/reviews/${p.sourceId}.json`, 'utf8'));
    assert.equal(data.productId, p.sourceId);
    assert.equal(data.reviews.length, p.reviews);
    assert.equal(p.rating, data.reviews.length ? data.reviews.reduce((n: number, r: {rating: number}) => n + r.rating, 0) / data.reviews.length : 0);
    for (const r of data.reviews) {
      assert.equal(r.verifiedStorePurchase, false);
      assert.equal(r.productId, p.sourceId);
      assert.ok(homeReviews.some(h => h.id === r.id && h.text === r.text && h.storeProductId === p.id));
      count++;
    }
  }
  assert.equal(count, 2);
  assert.equal(homeReviews.length, count);
});

test('homepage media stays on the existing Cloudinary account with no reference branding or checkout links', () => {
  const verified = new Set(Object.values(audit.media).map(m => m.url));
  for (const film of Object.values(media)) {
    assert.ok(verified.has(film.src));
    assert.ok(verified.has(film.webm));
    assert.ok(verified.has(film.poster));
    assert.match(film.src, /^https:\/\/res\.cloudinary\.com\/smi5oqr3\/video\/upload\//);
    assert.match(film.webm, /^https:\/\/res\.cloudinary\.com\/smi5oqr3\/video\/upload\/.*\.webm$/);
  }
  for (const asset of Object.values(audit.media)) {
    assert.equal(asset.verified, true);
    assert.match(asset.url, /^https:\/\/res\.cloudinary\.com\/smi5oqr3\//);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
  }
  const files = ['src/pages/Home.tsx', 'src/components/StoreFilm.tsx', 'src/data/kurti-catalog.json', 'src/data/studio-media.json', 'src/data/studio-reviews.json'];
  for (const file of files) assert.doesNotMatch(readFileSync(file, 'utf8'), /yugakrit|booyah|api\.yugakrit|yugakrit_token/i, file);
});
