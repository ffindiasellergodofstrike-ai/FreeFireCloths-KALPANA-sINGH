import test from 'node:test';
import assert from 'node:assert/strict';
import { SOURCE_PRODUCTS as PRODUCTS } from '../src/data/products';
import { catalogImages } from '../src/data/catalog-media';
import exclusions from '../src/data/media-exclusions.json';

test('media curation preserves a cover and every colour gallery without mutating products', () => {
  const before = JSON.stringify(PRODUCTS);
  for (const product of PRODUCTS) {
    assert.ok(catalogImages(product.images).length, `${product.id}: cover`);
    for (const [colour, gallery] of Object.entries(product.variantImages || {})) {
      if (gallery.length) assert.ok(catalogImages(gallery).length, `${product.id}: ${colour}`);
    }
  }
  const dress = PRODUCTS.find(product => product.id === 516)!;
  assert.equal(catalogImages(dress.images)[0], dress.images[1]);
  assert.deepEqual(catalogImages(exclusions.map(item => item.url)), []);
  assert.equal(JSON.stringify(PRODUCTS), before);
});
